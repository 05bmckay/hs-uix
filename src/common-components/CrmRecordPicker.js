// ═══════════════════════════════════════════════════════════════════════════
// CrmRecordPicker — multi-association CRM record picker with inline create.
//
// CrmLookupSelect answers "pick ONE record"; association management needs
// "pick MANY, get the records back, and optionally create one on the fly".
// This component wraps the same debounced useCrmSearchOptions pipeline in a
// native MultiSelect (or Select when multi={false}), accepts ids OR whole
// records as its value, reports BOTH ids and records through onChange, caps
// the selection at `max`, and appends a guarded `Create "<term>"` option when
// the search has no exact match. All decision logic lives in
// recordPickerCore.js so it stays unit-testable without a renderer.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo, useRef, useState } from "react";
import { MultiSelect, Select, useDebounce } from "@hubspot/ui-extensions";
import { resolveCrmObjectType, useCrmSearchOptions } from "../utils/crmSearchAdapters.js";
import {
  enforceSelectionMax,
  getRecordId,
  isRecordLike,
  makeCreateOption,
  mapIdsToRecords,
  mergePickerOptions,
  normalizeRecordSelection,
  recordToPickerOption,
  shouldShowCreateOption,
  splitCreateSelection,
  upsertRecords,
} from "./recordPickerCore.js";

const EMPTY_ARRAY = [];
const defaultMapRecord = (record) => ({ objectId: record.objectId, ...record.properties });

/**
 * CRM-backed record picker for associations: live debounced search, MULTI
 * selection by default, id<->record round-tripping, and optional inline create.
 *
 * Props:
 * - objectType: CRM object to search ("contact" | "company" | "deal" | any object type id).
 * - properties: string[] — CRM properties to fetch (drive labels/descriptions).
 * - labelField / descriptionField: dotted property path or (record) => value
 *   used to build each option's label / description.
 * - value / defaultValue: controlled / uncontrolled selection — an array (or
 *   scalar when multi={false}) of record ids and/or record objects.
 * - onChange: (ids, records) => void — multi mode passes arrays; single mode
 *   passes a scalar id (or null) and the matching record (or null). Records
 *   for ids the picker has never seen come back as { objectId: id } stubs.
 * - multi: boolean (default true) — MultiSelect vs Select.
 * - max: number — cap the selection size; picks beyond the cap are rejected.
 * - allowCreate: false (default) or { label?, onCreate: async (term) =>
 *   createdRecordOrId } — appends a Create "<term>" option when the settled
 *   search has no exact label match; choosing it awaits onCreate, selects the
 *   result, and merges it into the options. Double-fires are guarded while
 *   the create call is pending.
 * - filterMap: (filters, params) => filterGroups — scope the CRM search (e.g.
 *   restrict to a pipeline) using full HubSpot search syntax.
 * - pageLength / debounce / minSearchLength: search tuning.
 * - fallbackLabel: label for records whose labelField resolves empty.
 * - label, name, placeholder, description, tooltip, required, readOnly,
 *   error, validationMessage, variant: standard field props forwarded to the
 *   native select; remaining ...rest props are spread through as well.
 * - format / baseConfig: advanced passthroughs to the CRM search config.
 * - onSearchChange: (query) => void — observe the live search input.
 */
export const CrmRecordPicker = ({
  objectType,
  properties = EMPTY_ARRAY,
  labelField,
  descriptionField,
  value,
  defaultValue,
  onChange,
  multi = true,
  max,
  placeholder,
  label,
  name,
  required,
  readOnly,
  error,
  validationMessage,
  description,
  tooltip,
  variant,
  pageLength = 20,
  debounce = 300,
  minSearchLength = 0,
  filterMap,
  allowCreate = false,
  fallbackLabel = "Untitled record",
  format,
  baseConfig,
  onSearchChange,
  ...rest
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const effectiveValue = isControlled ? value : internalValue;
  const selection = useMemo(() => normalizeRecordSelection(effectiveValue), [effectiveValue]);

  const [inputValue, setInputValue] = useState("");
  // Records the picker has "seen" (picked, seeded via value, or created) so a
  // selected record stays resolvable after the live search page moves on.
  const [seenRecords, setSeenRecords] = useState(EMPTY_ARRAY);
  const [createPending, setCreatePending] = useState(false);
  const [createError, setCreateError] = useState(null);
  const createPendingRef = useRef(false);

  const debouncedInput = useDebounce(inputValue, debounce > 0 ? debounce : 1);
  const search = debounce > 0 ? debouncedInput : inputValue;
  const effectiveSearch = search && search.length >= minSearchLength ? search : "";

  const optionConfig = useMemo(
    () => ({ labelField, descriptionField, fallbackLabel }),
    [labelField, descriptionField, fallbackLabel]
  );

  // Stable params/options so the underlying useCrmSearch config doesn't churn
  // every render (same precaution as CrmDataTable).
  const searchParams = useMemo(() => ({ search: effectiveSearch }), [effectiveSearch]);
  const dataSourceOptions = useMemo(
    () => ({
      objectType: resolveCrmObjectType(objectType),
      properties,
      pageLength,
      format,
      filterMap,
      baseConfig,
      row: { mapRecord: defaultMapRecord },
      option: { mapOption: (row) => recordToPickerOption(row, optionConfig) },
    }),
    [objectType, properties, pageLength, format, filterMap, baseConfig, optionConfig]
  );
  const dataSource = useCrmSearchOptions(searchParams, dataSourceOptions);

  // id -> record registry: seeded records first, then the seen cache, with the
  // freshest search rows winning for ids present in multiple sources.
  const recordsById = useMemo(() => {
    const map = new Map();
    for (const record of selection.records) map.set(getRecordId(record), record);
    for (const record of seenRecords) map.set(getRecordId(record), record);
    for (const row of dataSource.rows || EMPTY_ARRAY) {
      const id = getRecordId(row);
      if (id != null) map.set(id, row);
    }
    return map;
  }, [selection.records, seenRecords, dataSource.rows]);

  const selectedOptions = useMemo(
    () =>
      selection.ids.map((id) => {
        const record = recordsById.get(id);
        return record ? recordToPickerOption(record, optionConfig) : { label: String(id), value: id };
      }),
    [selection.ids, recordsById, optionConfig]
  );

  // "Searching" covers both the in-flight request AND the debounce window so
  // the create option never flashes against stale "no match" results mid-type.
  const isSearching = dataSource.loading || inputValue.trim() !== (search || "").trim();
  const atMax =
    multi && Number.isFinite(max) && max > 0 && selection.ids.length >= max;

  const options = useMemo(() => {
    const merged = mergePickerOptions(dataSource.options || EMPTY_ARRAY, selectedOptions);
    const showCreate = shouldShowCreateOption({
      allowCreate,
      searchTerm: effectiveSearch,
      options: merged,
      searching: isSearching,
      createPending,
      atMax,
    });
    if (!showCreate) return merged;
    return [...merged, makeCreateOption(effectiveSearch.trim(), allowCreate?.label)];
  }, [dataSource.options, selectedOptions, allowCreate, effectiveSearch, isSearching, createPending, atMax]);

  const commitChange = (ids, extraRecords) => {
    let map = recordsById;
    if (extraRecords && extraRecords.length) {
      map = new Map(recordsById);
      for (const record of extraRecords) {
        const id = getRecordId(record);
        if (id != null) map.set(id, record);
      }
    }
    const trimmed = multi ? enforceSelectionMax(ids, max) : ids.slice(0, 1);
    const records = mapIdsToRecords(trimmed, map);
    if (!isControlled) setInternalValue(multi ? trimmed : trimmed[0] ?? null);
    if (onChange) {
      if (multi) onChange(trimmed, records);
      else onChange(trimmed[0] ?? null, records[0] ?? null);
    }
  };

  const startCreate = (term, baseIds) => {
    const onCreate =
      allowCreate && typeof allowCreate.onCreate === "function" ? allowCreate.onCreate : null;
    if (!onCreate || createPendingRef.current) return;
    createPendingRef.current = true;
    setCreatePending(true);
    setCreateError(null);
    Promise.resolve(onCreate(term))
      .then((created) => {
        const record = isRecordLike(created)
          ? created
          : created != null && created !== ""
            ? { objectId: created, name: term }
            : null;
        const id = getRecordId(record);
        if (id == null) return;
        setSeenRecords((prev) => upsertRecords(prev, [record]));
        const nextIds = multi ? [...baseIds.filter((v) => v !== id), id] : [id];
        commitChange(nextIds, [record]);
      })
      .catch((err) => {
        setCreateError(err?.message || "Could not create the record.");
      })
      .finally(() => {
        createPendingRef.current = false;
        setCreatePending(false);
      });
  };

  const handleChange = (next) => {
    const { ids, create } = splitCreateSelection(next);
    const picked = ids.map((id) => recordsById.get(id)).filter(Boolean);
    if (picked.length) setSeenRecords((prev) => upsertRecords(prev, picked));
    if (create) {
      startCreate(effectiveSearch.trim(), ids);
      // Strip the sentinel from the visible selection immediately; the created
      // record is appended once onCreate resolves. Single mode keeps its
      // previous value until then.
      if (multi) commitChange(ids);
      return;
    }
    commitChange(ids);
  };

  const commonProps = {
    name,
    label,
    value: multi ? selection.ids : selection.ids[0],
    options,
    placeholder:
      placeholder ||
      (createPending
        ? "Creating record..."
        : dataSource.loading
          ? "Searching CRM..."
          : "Search CRM records..."),
    description,
    tooltip,
    required,
    readOnly: readOnly || createPending,
    error: error || !!createError || !!dataSource.error,
    validationMessage:
      validationMessage ||
      createError ||
      (typeof dataSource.error === "string" ? dataSource.error : undefined),
    variant,
    onChange: handleChange,
    onInput: (next) => {
      setInputValue(next || "");
      if (onSearchChange) onSearchChange(next || "");
    },
    ...rest,
  };

  return React.createElement(multi ? MultiSelect : Select, commonProps);
};
