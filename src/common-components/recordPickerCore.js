// ═══════════════════════════════════════════════════════════════════════════
// recordPickerCore — the pure logic behind CrmRecordPicker.
//
// CrmRecordPicker juggles three concerns that are easy to get subtly wrong
// inside a component: (1) selected records must stay visible as options even
// when the live search page no longer contains them, (2) the value prop
// accepts ids OR whole records and onChange must hand back BOTH, and (3) the
// inline-create option has injection rules (no exact match, query settled, not
// already creating, not at max). Concentrating that logic here keeps the
// component a thin wiring layer and makes every rule unit-testable in node —
// the repo has no component render tests by design.
// ═══════════════════════════════════════════════════════════════════════════

import { getByPath } from "../utils/objectPath.js";

const EMPTY_ARRAY = [];

/** Sentinel option value for the inline "Create <term>" option. */
export const CREATE_OPTION_VALUE = "__create__";

/**
 * True when the value looks like a record object (vs a scalar id).
 */
export const isRecordLike = (value) =>
  value != null && typeof value === "object" && !Array.isArray(value);

/**
 * Extract a record's id, trying the shapes CRM search and consumers produce:
 * `objectId`, `id`, `hs_object_id`, then `properties.hs_object_id`.
 */
export const getRecordId = (record) => {
  if (!isRecordLike(record)) return undefined;
  return (
    record.objectId ??
    record.id ??
    record.hs_object_id ??
    getByPath(record, "properties.hs_object_id")
  );
};

const toList = (value) =>
  Array.isArray(value) ? value : value == null || value === "" ? EMPTY_ARRAY : [value];

/**
 * Normalize the picker's `value` / `defaultValue` prop — a scalar or array of
 * ids and/or record objects — into `{ ids, records }`. Ids are deduped (first
 * occurrence wins); `records` holds only the entries that were record objects
 * so they can seed the id -> record registry. Records without a resolvable id
 * are dropped (they could never round-trip through option values).
 */
export const normalizeRecordSelection = (value) => {
  const ids = [];
  const records = [];
  const seen = new Set();
  for (const entry of toList(value)) {
    const id = isRecordLike(entry) ? getRecordId(entry) : entry;
    if (id == null || id === "" || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (isRecordLike(entry)) records.push(entry);
  }
  return { ids, records };
};

/**
 * Map a record to a `{ label, value, description? }` option. `labelField` /
 * `descriptionField` may be a dotted property path or `(record) => value`
 * accessor; label falls back to `name`, `properties.name`, then
 * `fallbackLabel` so an option never renders blank.
 */
export const recordToPickerOption = (record, config = {}) => {
  const { labelField, descriptionField, fallbackLabel = "Untitled record" } = config;
  const label =
    (labelField ? getByPath(record, labelField) : undefined) ??
    record?.name ??
    getByPath(record, "properties.name") ??
    fallbackLabel;
  const option = { label, value: getRecordId(record) };
  const description = descriptionField ? getByPath(record, descriptionField) : undefined;
  if (description != null && description !== "") option.description = description;
  return option;
};

/**
 * Merge the current search page's options with the selected records' options
 * so a selection never disappears from the dropdown when the live results
 * change underneath it. Missing selected options are prepended; options
 * already present in the search page are not duplicated.
 */
export const mergePickerOptions = (options, selectedOptions) => {
  const base = Array.isArray(options) ? options : EMPTY_ARRAY;
  const selected = toList(selectedOptions);
  if (!selected.length) return base;
  const existing = new Set(base.map((option) => option?.value));
  const missing = selected.filter((option) => option && !existing.has(option.value));
  return missing.length ? [...missing, ...base] : base;
};

/**
 * Enforce the picker's `max` by keeping the FIRST `max` ids — native
 * MultiSelect appends new picks at the end, so trimming the tail rejects the
 * pick that exceeded the limit while leaving the existing selection intact.
 * No-op when `max` is missing/non-positive or the list already fits.
 */
export const enforceSelectionMax = (ids, max) => {
  const list = toList(ids);
  if (!Number.isFinite(max) || max <= 0 || list.length <= max) return list;
  return list.slice(0, max);
};

/**
 * Injection rules for the inline create option. Shown only when ALL hold:
 * - `allowCreate` is a config object with an `onCreate` function;
 * - no create call is currently pending (guards double-fires);
 * - the search has settled (not loading / not inside the debounce window);
 * - the selection is not already at `max`;
 * - the trimmed term is non-empty;
 * - no visible option's label matches the term exactly (case-insensitive).
 */
export const shouldShowCreateOption = ({
  allowCreate,
  searchTerm,
  options,
  searching = false,
  createPending = false,
  atMax = false,
} = {}) => {
  if (!allowCreate || typeof allowCreate.onCreate !== "function") return false;
  if (createPending || searching || atMax) return false;
  const term = String(searchTerm ?? "").trim();
  if (!term) return false;
  const lower = term.toLowerCase();
  return !(options || EMPTY_ARRAY).some(
    (option) => String(option?.label ?? "").trim().toLowerCase() === lower
  );
};

/**
 * Build the create option for a term. `label` may be a static string or a
 * `(term) => string` formatter; defaults to `Create "<term>"`.
 */
export const makeCreateOption = (term, label) => ({
  label: typeof label === "function" ? label(term) : label || `Create "${term}"`,
  value: CREATE_OPTION_VALUE,
});

/**
 * Split a select's onChange payload (scalar or array) into the real selected
 * ids and whether the create sentinel was among them.
 */
export const splitCreateSelection = (next) => {
  const list = toList(next);
  const ids = list.filter((value) => value !== CREATE_OPTION_VALUE);
  return { ids, create: ids.length !== list.length };
};

/**
 * Map selected ids back to their record objects via an id -> record registry
 * (a Map or plain object). Unknown ids yield a `{ objectId: id }` stub so the
 * records array always aligns 1:1 with the ids array.
 */
export const mapIdsToRecords = (ids, recordsById) => {
  const lookup =
    recordsById instanceof Map
      ? (id) => recordsById.get(id)
      : (id) => (recordsById ? recordsById[id] : undefined);
  return toList(ids).map((id) => lookup(id) ?? { objectId: id });
};

/**
 * Upsert records into a list deduped by record id (later wins). Used for the
 * picker's "records I've seen" cache so selected records survive search-page
 * churn and created records become resolvable.
 */
export const upsertRecords = (records, additions) => {
  const incoming = toList(additions).filter((record) => getRecordId(record) != null);
  if (!incoming.length) return Array.isArray(records) ? records : EMPTY_ARRAY;
  const byId = new Map(toList(records).map((record) => [getRecordId(record), record]));
  for (const record of incoming) byId.set(getRecordId(record), record);
  return [...byId.values()];
};
