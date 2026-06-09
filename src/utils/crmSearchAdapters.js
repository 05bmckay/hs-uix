import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCrmSearch, Flex, Text } from "@hubspot/ui-extensions";
import { DataTable } from "../datatable/DataTable.jsx";
import { Kanban } from "../kanban/Kanban.jsx";
import { getByPath } from "./objectPath.js";

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};
const EMPTY_CRM_PARAMS = { search: "", filters: {}, sort: null };

const isPlainObject = (value) =>
  value != null && Object.prototype.toString.call(value) === "[object Object]";

const coerceError = (error) => {
  if (!error) return false;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return true;
};

const pickArray = (response) => {
  if (Array.isArray(response)) return response;
  if (!response) return EMPTY_ARRAY;
  return (
    response.results ||
    response.data ||
    response.items ||
    response.records ||
    response.objects ||
    EMPTY_ARRAY
  );
};

const pickTotal = (response, fallbackLength) => {
  if (!response || Array.isArray(response)) return fallbackLength;
  return (
    response.total ??
    response.totalCount ??
    response.totalResults ??
    response.paging?.total ??
    fallbackLength
  );
};

export const normalizeCrmSearchRecord = (record, options = EMPTY_OBJECT) => {
  const {
    idField = "id",
    objectIdField = "objectId",
    propertiesKey = "properties",
    flattenProperties = true,
    propertyValueKey,
    mapRecord,
  } = options;

  if (mapRecord) return mapRecord(record);

  const objectId =
    record?.objectId ??
    record?.id ??
    record?.hs_object_id ??
    getByPath(record, `${propertiesKey}.hs_object_id`);
  const properties = record?.[propertiesKey] || EMPTY_OBJECT;
  const flattened = {};

  if (flattenProperties && isPlainObject(properties)) {
    for (const [key, value] of Object.entries(properties)) {
      flattened[key] = propertyValueKey && isPlainObject(value) ? value[propertyValueKey] : value;
    }
  }

  return {
    ...(flattenProperties ? flattened : EMPTY_OBJECT),
    ...record,
    [idField]: objectId,
    [objectIdField]: objectId,
    [propertiesKey]: properties,
  };
};

export const normalizeCrmSearchRows = (response, options = EMPTY_OBJECT) => {
  const records = pickArray(response);
  return records.map((record) => normalizeCrmSearchRecord(record, options));
};

// CRM search uses cursor (`after`) pagination, which is only deterministic over
// a TOTALLY-ordered result set. Without a unique tiebreaker, ties (or no sort at
// all) let the order drift between page requests — cursors then overlap, pages
// come back short, and hasMore lies (the "blank page 2" bug). Appending the
// unique `hs_object_id` key guarantees a stable order for any sort.
const STABLE_SORT_TIEBREAKER = { propertyName: "hs_object_id", direction: "ASCENDING" };

const withStableSort = (sorts) => {
  const base = Array.isArray(sorts) ? sorts : [];
  if (base.some((s) => s && s.propertyName === STABLE_SORT_TIEBREAKER.propertyName)) return base;
  return [...base, STABLE_SORT_TIEBREAKER];
};

export const buildCrmSearchConfig = (params = EMPTY_OBJECT, options = EMPTY_OBJECT) => {
  const {
    objectType,
    properties = EMPTY_ARRAY,
    query,
    filterGroups,
    sorts,
    pageLength,
    propertyMap = EMPTY_OBJECT,
    filterMap,
    sortMap,
    baseConfig = EMPTY_OBJECT,
  } = options;

  const mappedFilters = filterMap
    ? filterMap(params.filters || EMPTY_OBJECT, params)
    : filterGroups;
  const mappedSorts = sortMap
    ? sortMap(params.sort || EMPTY_OBJECT, params)
    : sorts;

  const config = {
    ...baseConfig,
    objectType: objectType || baseConfig.objectType,
    properties: properties.length ? properties : baseConfig.properties,
    query: query ?? params.search ?? baseConfig.query,
    filterGroups: mappedFilters ?? baseConfig.filterGroups,
    sorts: withStableSort(mappedSorts ?? baseConfig.sorts),
    pageLength: pageLength ?? params.pageLength ?? baseConfig.pageLength,
  };

  if (!filterMap && propertyMap && Object.keys(propertyMap).length && params.filters) {
    // Lightweight default filter mapping for simple DataTable/Kanban select filters.
    // Anything complex should use filterMap for full HubSpot CRM search syntax.
    const filters = Object.entries(params.filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0))
      .map(([name, value]) => {
        const propertyName = propertyMap[name] || name;
        if (Array.isArray(value)) return { propertyName, operator: "IN", values: value };
        if (isPlainObject(value) && (value.from || value.to)) {
          const rangeFilters = [];
          if (value.from) rangeFilters.push({ propertyName, operator: "GTE", value: value.from });
          if (value.to) rangeFilters.push({ propertyName, operator: "LTE", value: value.to });
          return rangeFilters;
        }
        return { propertyName, operator: "EQ", value };
      })
      .flat();
    if (filters.length) config.filterGroups = [{ filters }];
  }

  Object.keys(config).forEach((key) => config[key] === undefined && delete config[key]);
  return config;
};

export const useCrmSearchDataSource = (params = EMPTY_OBJECT, options = EMPTY_OBJECT) => {
  const {
    format,
    row,
    rowIdField = "id",
    totalCount,
    loading,
    error,
    mapResponse,
  } = options;

  const config = useMemo(() => buildCrmSearchConfig(params, options), [params, options]);
  const response = useCrmSearch(config, format);

  return useMemo(() => {
    const rows = mapResponse
      ? mapResponse(response)
      : normalizeCrmSearchRows(response, { idField: rowIdField, ...(row || EMPTY_OBJECT) });
    const resolvedTotal =
      typeof totalCount === "function" ? totalCount(response) : totalCount ?? pickTotal(response, rows.length);

    return {
      data: rows,
      rows,
      response,
      pagination: response?.pagination,
      hasMore: response?.pagination?.hasNextPage ?? response?.hasMore ?? false,
      loading: typeof loading === "function" ? loading(response) : loading ?? !!response?.isLoading,
      isLoading: typeof loading === "function" ? loading(response) : loading ?? !!response?.isLoading,
      error: typeof error === "function" ? error(response) : error ?? coerceError(response?.error),
      totalCount: resolvedTotal,
      rowIdField,
    };
  }, [response, mapResponse, row, rowIdField, totalCount, loading, error]);
};

export const crmSearchResultToOption = (row, options = EMPTY_OBJECT) => {
  const {
    label = "name",
    value = "objectId",
    description,
    fallbackLabel = "Untitled record",
    mapOption,
  } = options;
  if (mapOption) return mapOption(row);
  const option = {
    label: getByPath(row, label) ?? getByPath(row, "properties.name") ?? fallbackLabel,
    value: getByPath(row, value) ?? getByPath(row, "id") ?? getByPath(row, "objectId"),
  };
  const desc = getByPath(row, description);
  if (desc != null && desc !== "") option.description = desc;
  return option;
};

export const useCrmSearchOptions = (params = EMPTY_OBJECT, options = EMPTY_OBJECT) => {
  const dataSource = useCrmSearchDataSource(params, options);
  const optionConfig = options.option || options;

  return useMemo(() => ({
    ...dataSource,
    options: dataSource.rows.map((row) => crmSearchResultToOption(row, optionConfig)),
  }), [dataSource, optionConfig]);
};

export const makeCrmSearchSelectField = (field, searchOptions) => ({
  type: "select",
  ...field,
  options: searchOptions.options || EMPTY_ARRAY,
  loading: searchOptions.loading || searchOptions.isLoading || field?.loading,
});

export const makeCrmSearchMultiSelectField = (field, searchOptions) => ({
  type: "multiselect",
  ...field,
  options: searchOptions.options || EMPTY_ARRAY,
  loading: searchOptions.loading || searchOptions.isLoading || field?.loading,
});

const CRM_OBJECT_TYPES = {
  contact: "0-1",
  contacts: "0-1",
  company: "0-2",
  companies: "0-2",
  deal: "0-3",
  deals: "0-3",
};

const prettifyPropertyName = (name) =>
  String(name || "")
    .replace(/^hs_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const inferCrmColumns = (properties = EMPTY_ARRAY) =>
  properties.map((property) => ({
    field: property,
    label: prettifyPropertyName(property),
    sortable: true,
  }));

const normalizeAutoFilterFields = (autoFilters, properties = EMPTY_ARRAY) => {
  if (!autoFilters) return EMPTY_ARRAY;
  if (Array.isArray(autoFilters)) return autoFilters;
  if (typeof autoFilters === "object" && Array.isArray(autoFilters.fields)) return autoFilters.fields;
  return properties.filter((property) => !["id", "objectId", "hs_object_id", "email", "firstname", "lastname", "name", "domain"].includes(property));
};

const buildAutoFiltersFromRows = ({ rows, fields, labelsRef, maxOptions = 25 }) => {
  if (!fields.length) return EMPTY_ARRAY;
  for (const row of rows || EMPTY_ARRAY) {
    for (const field of fields) {
      const value = getByPath(row, field);
      if (value == null || value === "" || Array.isArray(value) || isPlainObject(value)) continue;
      if (!labelsRef.current[field]) labelsRef.current[field] = new Map();
      const map = labelsRef.current[field];
      if (map.size < maxOptions || map.has(value)) map.set(value, String(value));
    }
  }

  return fields
    .map((field) => {
      const map = labelsRef.current[field];
      if (!map || map.size === 0 || map.size > maxOptions) return null;
      return {
        name: field,
        label: prettifyPropertyName(field),
        placeholder: `Any ${prettifyPropertyName(field).toLowerCase()}`,
        options: Array.from(map.entries()).map(([value, label]) => ({ value, label })),
      };
    })
    .filter(Boolean);
};

export const resolveCrmObjectType = (objectType) =>
  CRM_OBJECT_TYPES[objectType] || objectType;

/**
 * Beautiful DataTable backed by HubSpot's useCrmSearch in a few lines.
 *
 * Example:
 * <CrmDataTable
 *   objectType="contacts"
 *   properties={["firstname", "lastname", "email"]}
 * />
 */
const DEFAULT_CRM_FORMAT = { propertiesToFormat: "all" };
const defaultCrmMapRecord = (record) => ({ objectId: record.objectId, ...record.properties });

const stableStringify = (value) => {
  const normalize = (item) => {
    if (Array.isArray(item)) return item.map(normalize);
    if (isPlainObject(item)) {
      return Object.keys(item).sort().reduce((acc, key) => {
        acc[key] = normalize(item[key]);
        return acc;
      }, {});
    }
    if (typeof item === "function") return item.name || "[function]";
    return item;
  };
  try {
    return JSON.stringify(normalize(value));
  } catch {
    return String(value);
  }
};

const appendUniqueRows = (previousRows, nextRows, rowIdField) => {
  if (!previousRows.length) return nextRows || EMPTY_ARRAY;
  if (!nextRows?.length) return previousRows;
  const seen = new Set(previousRows.map((row) => getByPath(row, rowIdField) ?? row?.objectId ?? row?.id));
  const additions = nextRows.filter((row) => {
    const id = getByPath(row, rowIdField) ?? row?.objectId ?? row?.id;
    if (id == null) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return additions.length ? [...previousRows, ...additions] : previousRows;
};

// Default sort translator: maps the active table sort ({ field, direction }) to
// CRM `sorts`, honoring propertyMap for renamed columns. Users only need a
// custom sortMap for non-trivial cases.
const crmSortsFromState = (sort, propertyMap) => {
  if (!sort || !sort.field || !sort.direction) return undefined;
  const propertyName = (propertyMap && propertyMap[sort.field]) || sort.field;
  return [{ propertyName, direction: sort.direction === "descending" ? "DESCENDING" : "ASCENDING" }];
};

export const CrmDataTable = ({
  objectType,
  properties = EMPTY_ARRAY,
  columns,
  title,
  pageLength = 100, // CRM batch fetched per request (CRM search max)
  pageSize = 10,    // client-side page size
  // Hybrid model: fetch ONE batch and do everything client-side while the whole
  // result set fits in the batch (no refetch). Once a fetch comes back capped
  // (more matches than the batch), search / filter / sort start refetching a
  // fresh batch server-side so they reach the whole dataset. Pagination stays
  // client-side over the fetched batch; `serverSide` forces server-side querying
  // from the first render.
  serverSide = false,
  filters,
  autoFilters = false,
  autoFilterMaxOptions = 25,
  filterMap,
  propertyMap,
  sortMap,
  searchFields,
  searchPlaceholder,
  format = DEFAULT_CRM_FORMAT,
  mapRecord,
  rowIdField = "objectId",
  dataTableProps = EMPTY_OBJECT,
  ...props
}) => {
  const [params, setParams] = useState({ search: "", filters: {}, sort: null });
  const resolvedProperties = useMemo(() => properties, [properties]);
  const resolvedColumns = useMemo(
    () => columns || inferCrmColumns(resolvedProperties),
    [columns, resolvedProperties]
  );
  const resolvedSearchFields = searchFields || resolvedProperties;
  const autoFilterFields = useMemo(
    () => normalizeAutoFilterFields(autoFilters, resolvedProperties),
    [autoFilters, resolvedProperties]
  );
  const autoFilterLabelsRef = useRef({});
  const defaultPropertyMap = useMemo(
    () => Object.fromEntries(resolvedProperties.map((property) => [property, property])),
    [resolvedProperties]
  );
  const effectivePropertyMap = propertyMap || defaultPropertyMap;
  const resolvedSortMap = useMemo(
    () => sortMap || ((sort) => crmSortsFromState(sort, effectivePropertyMap)),
    [sortMap, effectivePropertyMap]
  );
  const resolvedMapRecord = mapRecord || defaultCrmMapRecord;

  // Stable options object so the underlying useCrmSearch config doesn't churn
  // every render (which would otherwise reset the CRM search request state).
  const dataSourceOptions = useMemo(
    () => ({
      objectType: resolveCrmObjectType(objectType),
      properties: resolvedProperties,
      pageLength,
      format,
      filterMap,
      propertyMap: effectivePropertyMap,
      sortMap: resolvedSortMap,
      rowIdField,
      row: { idField: rowIdField, mapRecord: resolvedMapRecord },
    }),
    [objectType, resolvedProperties, pageLength, format, filterMap, effectivePropertyMap, resolvedSortMap, rowIdField, resolvedMapRecord]
  );

  // Sticky: once we know the dataset exceeds one batch (or serverSide is forced)
  // we feed live search / filter / sort to the CRM query so they reach the whole
  // dataset. Below that threshold the batch already holds everything and the
  // table works in-memory with zero refetch.
  const [serverQuerying, setServerQuerying] = useState(!!serverSide);
  const effectiveParams = serverQuerying ? params : EMPTY_CRM_PARAMS;

  const dataSource = useCrmSearchDataSource(effectiveParams, dataSourceOptions);
  const queryKey = useMemo(
    () => stableStringify({ effectiveParams, objectType, properties: resolvedProperties, pageLength }),
    [effectiveParams, objectType, resolvedProperties, pageLength]
  );
  const [accumulatedRows, setAccumulatedRows] = useState(EMPTY_ARRAY);
  const [requestedPage, setRequestedPage] = useState(1);
  const lastQueryKeyRef = useRef(queryKey);
  const loadedRows = accumulatedRows.length ? accumulatedRows : dataSource.data;

  useEffect(() => {
    if (lastQueryKeyRef.current !== queryKey) {
      lastQueryKeyRef.current = queryKey;
      setAccumulatedRows(dataSource.data);
      return;
    }
    const currentPage = dataSource.pagination?.currentPage || 1;
    setAccumulatedRows((prev) => (
      currentPage <= 1 ? dataSource.data : appendUniqueRows(prev, dataSource.data, rowIdField)
    ));
  }, [queryKey, dataSource.data, dataSource.pagination?.currentPage, rowIdField]);

  useEffect(() => {
    if (!serverQuerying && typeof dataSource.totalCount === "number" && dataSource.totalCount > loadedRows.length) {
      setServerQuerying(true);
    }
  }, [serverQuerying, dataSource.totalCount, loadedRows.length]);

  const ensurePageLoaded = useCallback((page) => {
    const pageNumber = Number(page) || 1;
    const requiredRows = pageNumber * pageSize;
    if (requiredRows <= loadedRows.length) return;
    if (!dataSource.hasMore || dataSource.loading || dataSource.response?.isRefetching) return;
    dataSource.pagination?.nextPage?.();
  }, [pageSize, loadedRows.length, dataSource.hasMore, dataSource.loading, dataSource.response, dataSource.pagination]);

  useEffect(() => {
    ensurePageLoaded(requestedPage);
  }, [requestedPage, ensurePageLoaded]);

  const generatedFilters = useMemo(
    () => buildAutoFiltersFromRows({
      rows: loadedRows,
      fields: autoFilterFields,
      labelsRef: autoFilterLabelsRef,
      maxOptions: autoFilterMaxOptions,
    }),
    [loadedRows, autoFilterFields, autoFilterMaxOptions]
  );
  const resolvedFilters = filters || generatedFilters;

  // Always a client-side table (pagination in-memory over the fetched batch).
  // We only LISTEN for search / filter / sort via onParamsChange; when
  // server-querying, storing them refetches a fresh batch, otherwise it's a
  // harmless no-op the in-memory table already handled.
  const table = React.createElement(DataTable, {
    title: title || `${prettifyPropertyName(objectType)} records`,
    data: loadedRows,
    loading: dataSource.loading || dataSource.response?.isRefetching,
    error: dataSource.error,
    columns: resolvedColumns,
    rowIdField,
    pageSize,
    clientTotalCount: dataSource.totalCount,
    filters: resolvedFilters,
    searchFields: resolvedSearchFields,
    searchPlaceholder: searchPlaceholder || `Search ${prettifyPropertyName(objectType).toLowerCase()}...`,
    searchDebounce: 300,
    onParamsChange: (next) => {
      setParams((prev) => ({ ...prev, search: next.search, filters: next.filters, sort: next.sort }));
      setRequestedPage(next.page || 1);
      ensurePageLoaded(next.page);
    },
    ...dataTableProps,
    ...props,
  });

  // When the current query matches more than the batch, say so rather than
  // silently showing a partial view. (Server-querying narrows via search/filter.)
  const total = dataSource.totalCount;
  const capped = typeof total === "number" && total > loadedRows.length;
  if (!capped) return table;

  return React.createElement(
    Flex,
    { direction: "column", gap: "xs" },
    React.createElement(
      Text,
      { variant: "microcopy" },
      dataSource.hasMore
        ? `Loaded ${loadedRows.length} of ${total} matching. Use the table pagination to load more CRM results.`
        : `Showing ${loadedRows.length} of ${total} matching. Refine your search or filters to narrow the results.`
    ),
    table
  );
};

/**
 * CrmKanban — the Kanban analog of CrmDataTable.
 *
 * Like CrmDataTable it fetches one batch (pageLength, default 100) and lets
 * Kanban do search / filter / sort client-side by default (no refetch per
 * interaction). Stages are optional: pass `stages` when you know the pipeline
 * (recommended — real labels), otherwise they're auto-derived from the batch's
 * groupBy values, labelled via `stageLabels` (object or fn) or prettified.
 *
 *   <CrmKanban objectType="deals" properties={DEAL_PROPS} groupBy="dealstage"
 *     cardFields={CARD_FIELDS} />
 */
export const CrmKanban = ({
  objectType,
  properties = EMPTY_ARRAY,
  groupBy,
  stages,
  stageLabels, // object { value: label } or (value) => label
  title,
  pageLength = 100,
  serverSide = false,
  filters,
  autoFilters = false,
  autoFilterMaxOptions = 25,
  filterMap,
  propertyMap,
  sortMap,
  searchFields,
  searchPlaceholder,
  format = DEFAULT_CRM_FORMAT,
  mapRecord,
  rowIdField = "objectId",
  stageMeta,
  onLoadMore,
  kanbanProps = EMPTY_OBJECT,
  ...props
}) => {
  const [params, setParams] = useState(EMPTY_CRM_PARAMS);
  const resolvedProperties = useMemo(() => properties, [properties]);
  const resolvedSearchFields = searchFields || resolvedProperties;
  const autoFilterFields = useMemo(
    () => normalizeAutoFilterFields(autoFilters, resolvedProperties),
    [autoFilters, resolvedProperties]
  );
  const autoFilterLabelsRef = useRef({});
  const defaultPropertyMap = useMemo(
    () => Object.fromEntries(resolvedProperties.map((property) => [property, property])),
    [resolvedProperties]
  );
  const effectivePropertyMap = propertyMap || defaultPropertyMap;
  const resolvedSortMap = useMemo(
    () => sortMap || ((sort) => crmSortsFromState(sort, effectivePropertyMap)),
    [sortMap, effectivePropertyMap]
  );
  const resolvedMapRecord = mapRecord || defaultCrmMapRecord;

  const dataSourceOptions = useMemo(
    () => ({
      objectType: resolveCrmObjectType(objectType),
      properties: resolvedProperties,
      pageLength,
      format,
      filterMap,
      propertyMap: effectivePropertyMap,
      sortMap: resolvedSortMap,
      rowIdField,
      row: { idField: rowIdField, mapRecord: resolvedMapRecord },
    }),
    [objectType, resolvedProperties, pageLength, format, filterMap, effectivePropertyMap, resolvedSortMap, rowIdField, resolvedMapRecord]
  );

  // Sticky auto-switch (same as CrmDataTable): once the dataset exceeds one
  // batch, feed live search / filter to the CRM query so they reach the whole
  // dataset. Sort + per-column pagination stay client-side over the fetched batch.
  const [serverQuerying, setServerQuerying] = useState(!!serverSide);
  const effectiveParams = serverQuerying ? params : EMPTY_CRM_PARAMS;

  const dataSource = useCrmSearchDataSource(effectiveParams, dataSourceOptions);
  const queryKey = useMemo(
    () => stableStringify({ effectiveParams, objectType, properties: resolvedProperties, pageLength }),
    [effectiveParams, objectType, resolvedProperties, pageLength]
  );
  const [accumulatedRows, setAccumulatedRows] = useState(EMPTY_ARRAY);
  const lastQueryKeyRef = useRef(queryKey);
  const loadedRows = accumulatedRows.length ? accumulatedRows : dataSource.data;

  useEffect(() => {
    if (lastQueryKeyRef.current !== queryKey) {
      lastQueryKeyRef.current = queryKey;
      setAccumulatedRows(dataSource.data);
      return;
    }
    const currentPage = dataSource.pagination?.currentPage || 1;
    setAccumulatedRows((prev) => (
      currentPage <= 1 ? dataSource.data : appendUniqueRows(prev, dataSource.data, rowIdField)
    ));
  }, [queryKey, dataSource.data, dataSource.pagination?.currentPage, rowIdField]);

  useEffect(() => {
    if (!serverQuerying && typeof dataSource.totalCount === "number" && dataSource.totalCount > loadedRows.length) {
      setServerQuerying(true);
    }
  }, [serverQuerying, dataSource.totalCount, loadedRows.length]);

  const handleLoadMore = useCallback((stage) => {
    if (onLoadMore) {
      onLoadMore(stage);
      return;
    }
    if (!dataSource.hasMore || dataSource.loading || dataSource.response?.isRefetching) return;
    dataSource.pagination?.nextPage?.();
  }, [onLoadMore, dataSource.hasMore, dataSource.loading, dataSource.response, dataSource.pagination]);

  const generatedFilters = useMemo(
    () => buildAutoFiltersFromRows({
      rows: loadedRows,
      fields: autoFilterFields,
      labelsRef: autoFilterLabelsRef,
      maxOptions: autoFilterMaxOptions,
    }),
    [loadedRows, autoFilterFields, autoFilterMaxOptions]
  );
  const resolvedFilters = filters || generatedFilters;

  // Stages: explicit pass-through, else auto-derive from the batch's groupBy
  // values (first-seen order) with stageLabels / prettified labels.
  const resolvedStages = useMemo(() => {
    if (stages) return stages;
    const seen = [];
    for (const row of loadedRows) {
      const value = typeof groupBy === "function" ? groupBy(row) : row[groupBy];
      if (value != null && value !== "" && !seen.includes(value)) seen.push(value);
    }
    return seen.map((value) => ({
      value,
      label:
        typeof stageLabels === "function"
          ? stageLabels(value)
          : (stageLabels && stageLabels[value]) || prettifyPropertyName(String(value)),
    }));
  }, [stages, stageLabels, loadedRows, groupBy]);

  // Always a client-side board (per-column pagination and comparator sort over
  // the fetched batch). We listen for search / filter via onParamsChange; when
  // server-querying, storing them refetches a fresh batch.
  const resolvedStageMeta = useMemo(() => {
    if (stageMeta || !dataSource.hasMore) return stageMeta;
    return Object.fromEntries(resolvedStages.map((stage) => [
      stage.value,
      {
        hasMore: true,
        loading: dataSource.loading || dataSource.response?.isRefetching,
        totalCount: dataSource.totalCount,
      },
    ]));
  }, [stageMeta, dataSource.hasMore, dataSource.loading, dataSource.response, dataSource.totalCount, resolvedStages]);

  const board = React.createElement(Kanban, {
    title: title || `${prettifyPropertyName(objectType)} board`,
    data: loadedRows,
    loading: dataSource.loading || dataSource.response?.isRefetching,
    error: dataSource.error,
    rowIdField,
    groupBy,
    stages: resolvedStages,
    stageMeta: resolvedStageMeta,
    onLoadMore: dataSource.hasMore || onLoadMore ? handleLoadMore : undefined,
    filters: resolvedFilters,
    searchFields: resolvedSearchFields,
    searchPlaceholder: searchPlaceholder || `Search ${prettifyPropertyName(objectType).toLowerCase()}...`,
    searchDebounce: 300,
    onParamsChange: (next) => {
      setParams((prev) => ({ ...prev, search: next.search, filters: next.filters }));
    },
    ...kanbanProps,
    ...props,
  });

  const total = dataSource.totalCount;
  const capped = typeof total === "number" && total > loadedRows.length;
  if (!capped) return board;

  return React.createElement(
    Flex,
    { direction: "column", gap: "xs" },
    React.createElement(
      Text,
      { variant: "microcopy" },
      dataSource.hasMore
        ? `Loaded ${loadedRows.length} of ${total} matching. Use Load more to fetch more CRM results.`
        : `Showing ${loadedRows.length} of ${total} matching. Refine your search or filters to narrow the results.`
    ),
    board
  );
};

CrmDataTable.displayName = "CrmDataTable";
CrmKanban.displayName = "CrmKanban";
