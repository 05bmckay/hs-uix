/**
 * DataTable — Reusable filterable, sortable, paginated table composition.
 *
 * Supports client-side and server-side modes, three filter types
 * (select, multiselect, dateRange), row grouping, and footer rows.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CLIENT-SIDE (default) — all filtering, sorting, pagination in-memory:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   <DataTable
 *     data={records}
 *     columns={COLUMNS}
 *     renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
 *     searchFields={["name", "email"]}
 *     filters={FILTER_CONFIG}
 *     pageSize={10}
 *     defaultSort={{ date: "descending" }}
 *     footer={(filteredData) => <TableRow>...</TableRow>}
 *   />
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVER-SIDE — parent owns state, component renders UI + calls back:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   <DataTable
 *     serverSide={true}
 *     loading={isLoading}
 *     error={fetchError}
 *     data={currentPageRows}
 *     totalCount={247}
 *     columns={COLUMNS}
 *     renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
 *     searchFields={["name", "email"]}
 *     filters={FILTER_CONFIG}
 *     pageSize={10}
 *     page={currentPage}
 *     searchValue={params.search}
 *     filterValues={params.filters}
 *     sort={params.sort}
 *     searchDebounce={300}
 *     onSearchChange={(term) => refetch({ search: term, page: 1 })}
 *     onFilterChange={(filterValues) => refetch({ filters: filterValues, page: 1 })}
 *     onSortChange={(field, direction) => refetch({ sort: field, dir: direction, page: 1 })}
 *     onPageChange={(page) => refetch({ page })}
 *     onParamsChange={(params) => refetch(params)}
 *   />
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FILTER TYPES:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   // Single select (default) — exact match
 *   { name: "status", type: "select", placeholder: "All statuses", options: [...] }
 *
 *   // Multi select — "any of" matching
 *   { name: "category", type: "multiselect", placeholder: "All categories", options: [...] }
 *
 *   // Date range — from/to
 *   { name: "date", type: "dateRange", placeholder: "Date range" }
 *
 *   // Custom filter function (works with any type)
 *   { name: "score", type: "select", options: [...], filterFn: (row, value) => row.score >= value }
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ROW GROUPING:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   groupBy={{
 *     field: "supplier",
 *     label: (value, rows) => `${value} (${rows.length})`,
 *     sort: "asc",
 *     defaultExpanded: true,           // groups start expanded (default)
 *     aggregations: {                  // per-column aggregation functions
 *       amount: (rows) => `$${rows.reduce((s, r) => s + r.amount, 0).toLocaleString()}`,
 *     },
 *     groupValues: {                   // OR static values per group per column
 *       enterprise: { amount: "$1.3M" },
 *     },
 *   }}
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ROW SELECTION:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   <DataTable
 *     selectable={true}
 *     rowIdField="id"
 *     onSelectionChange={(selectedIds) => handleSelection(selectedIds)}
 *     selectionActions={[
 *       { label: "Delete", icon: "delete", onClick: (ids) => handleDelete(ids) },
 *       { label: "Export", onClick: (ids) => handleExport(ids) },
 *     ]}
 *     columns={[
 *       { field: "name", label: "Name", renderCell: (val) => val },
 *       ...
 *     ]}
 *   />
 *
 *   When rows are selected, a single-row tip Alert bar appears above the table:
 *     - Number of selected rows (demibold)
 *     - "Select all" button (selects all rows across all pages)
 *     - "Deselect all" button
 *     - Custom action buttons from selectionActions[]
 *
 *   The header checkbox selects/deselects rows on the current page only.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * INLINE EDITING:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   columns={[
 *     { field: "name",   label: "Name",   editable: true, editType: "text" },
 *     { field: "status", label: "Status", editable: true, editType: "select",
 *       editOptions: [{ label: "Active", value: "active" }, ...] },
 *     { field: "amount", label: "Amount", editable: true, editType: "currency",
 *       editProps: { currencyCode: "USD" } },
 *   ]}
 *   onRowEdit={(row, field, newValue) => save(row.id, field, newValue)}
 *
 *   Supported editType values:
 *     "text" | "textarea" | "number" | "currency" | "stepper"
 *     "select" | "multiselect" | "date" | "toggle" | "checkbox"
 *
 *   NOTE: selectable or editable columns require renderCell(value, row)
 *   on each column. renderRow is used only when neither feature is active.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * COLUMN WIDTH:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Each column accepts `width` (header + cells) and `cellWidth` (cells only):
 *     "min"  — shrink to fit content (may overflow with scrollbar)
 *     "max"  — expand to fill available space
 *     "auto" — adjust based on available space (default)
 *     number — fixed width in pixels (e.g. 200)
 *
 *   Example: { field: "name", label: "Name", width: "min", cellWidth: "max" }
 *   Header stays tight around "Name", cells expand to show full values.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTO-WIDTH:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   By default, columns without explicit width/cellWidth get auto-computed
 *   widths based on content analysis (data types, string lengths, edit types).
 *   Disable with `autoWidth={false}`.
 *
 *   Heuristics:
 *     - Booleans, numbers → "min"
 *     - Dates → header "min", cells "auto" (rendered dates are longer than raw)
 *     - Small enums (≤5 unique, short strings) → header "min", cells "auto"
 *     - Text → "auto" (browser distributes space evenly)
 *     - Edit type hints: checkbox/toggle → "min", number/currency/select → "auto"
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGINATION OPTIONS:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   pageSize={10}                           // rows per page (default 10)
 *   maxVisiblePageButtons={5}               // max page number buttons shown
 *   showButtonLabels={false}                // hide First/Prev/Next/Last labels
 *   showFirstLastButtons={true}             // show First/Last buttons (auto if > 5 pages)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ROW COUNT:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   showRowCount={true}                     // show row count (default true)
 *   rowCountBold={false}                    // bold row count text (default false)
 *   rowCountText={(shown, total) =>         // custom row count text
 *     `Showing ${shown} of ${total} items`
 *   }
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Fuse from "fuse.js";
import {
  Box,
  Button,
  Tile,
  Checkbox,
  CurrencyInput,
  Divider,
  DateInput,
  EmptyState,
  ErrorState,
  Flex,
  Icon,
  Input,
  Link,
  LoadingSpinner,
  MultiSelect,
  NumberInput,
  SearchInput,
  Select,
  StepperInput,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Text,
  TextArea,
  Toggle,
} from "@hubspot/ui-extensions";

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

const formatDateChip = (dateObj) => {
  if (!dateObj) return "";
  const { year, month, date } = dateObj;
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(year, month, date));
};

const dateToTimestamp = (dateObj) => {
  if (!dateObj) return null;
  return new Date(dateObj.year, dateObj.month, dateObj.date).getTime();
};

// ═══════════════════════════════════════════════════════════════════════════
// Intelligent auto-width
// ═══════════════════════════════════════════════════════════════════════════

const NARROW_EDIT_TYPES = new Set(["checkbox", "toggle"]);

const DATE_PATTERN = /^\d{4}[-/]\d{2}[-/]\d{2}/;
const BOOL_VALUES = new Set(["true", "false", "yes", "no", "0", "1"]);

const computeAutoWidths = (columns, data) => {
  if (!data || data.length === 0) return {};

  const sample = data.slice(0, 50); // analyze up to 50 rows
  const results = {};

  columns.forEach((col) => {
    // Skip columns with both explicit widths set
    if (col.width && col.cellWidth) return;

    const values = sample.map((row) => row[col.field]).filter((v) => v != null);
    const strings = values.map((v) => String(v));

    let widthHint = null; // "min" | "auto"
    let cellWidthHint = null;

    // 1. Edit type hints
    if (col.editable && col.editType && NARROW_EDIT_TYPES.has(col.editType)) {
      cellWidthHint = "min";
    }

    // 2. Content analysis
    if (strings.length > 0) {
      const lengths = strings.map((s) => s.length);
      const maxLen = Math.max(...lengths);
      const uniqueCount = new Set(strings).size;

      // Boolean-like values → min
      if (values.every((v) => typeof v === "boolean") ||
        strings.every((s) => BOOL_VALUES.has(s.toLowerCase()))) {
        widthHint = widthHint || "min";
        cellWidthHint = cellWidthHint || "min";
      }
      // Date-like values → auto (rendered dates are often longer than raw ISO)
      else if (strings.every((s) => DATE_PATTERN.test(s))) {
        widthHint = widthHint || "min";
        cellWidthHint = cellWidthHint || "auto";
      }
      // Pure numbers → auto (header "min" constrains the whole column too much for inputs)
      else if (values.every((v) => typeof v === "number")) {
        widthHint = widthHint || "auto";
        cellWidthHint = cellWidthHint || "auto";
      }
      // Small enum-like (few unique values, short strings) → min
      else if (uniqueCount <= 5 && maxLen <= 15) {
        widthHint = widthHint || "min";
        cellWidthHint = cellWidthHint || "auto";
      }
      // Everything else (text) → auto, let the browser distribute evenly
      else {
        widthHint = widthHint || "auto";
        cellWidthHint = cellWidthHint || "auto";
      }
    }

    // Editable columns (except checkbox/toggle) need room for input components —
    // never constrain the header to "min" or the input will get squeezed
    if (col.editable && !NARROW_EDIT_TYPES.has(col.editType) && widthHint === "min") {
      widthHint = "auto";
    }

    results[col.field] = {
      width: widthHint || "auto",
      cellWidth: cellWidthHint || "auto",
    };
  });

  return results;
};

const getEmptyFilterValue = (filter) => {
  const type = filter.type || "select";
  if (type === "multiselect") return [];
  if (type === "dateRange") return { from: null, to: null };
  return "";
};

const BOOLEAN_SELECT_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const resolveEditOptions = (col, data) => {
  if (col.editOptions && col.editOptions.length > 0) return col.editOptions;
  // Auto-detect boolean fields and generate Yes/No options
  const sample = data.find((row) => row[col.field] != null);
  if (sample && typeof sample[col.field] === "boolean") return BOOLEAN_SELECT_OPTIONS;
  return [];
};

const isFilterActive = (filter, value) => {
  const type = filter.type || "select";
  if (type === "multiselect") return Array.isArray(value) && value.length > 0;
  if (type === "dateRange") return value && (value.from || value.to);
  return !!value;
};

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export const DataTable = ({
  // Data
  data,
  columns,
  renderRow,

  // Search
  searchFields = [],
  searchPlaceholder = "Search...",
  fuzzySearch = false,            // enable fuzzy matching via Fuse.js
  fuzzyOptions,                   // custom Fuse.js options (threshold, distance, etc.)

  // Filters
  filters = [],

  // Pagination
  pageSize = 10,
  maxVisiblePageButtons,        // max page number buttons to show
  showButtonLabels = true,      // show First/Prev/Next/Last text labels
  showFirstLastButtons,         // show First/Last page buttons (default: auto when pageCount > 5)

  // Row count
  showRowCount = true,          // show "X records" / "X of Y records" text
  rowCountBold = false,         // bold the row count text
  rowCountText,                 // custom formatter: (displayCount, totalCount) => string

  // Table appearance
  bordered = true,              // show table borders
  flush = true,                 // remove bottom margin

  // Sorting
  defaultSort = {},

  // Grouping
  groupBy,

  // Footer
  footer,

  // Empty state
  emptyTitle,
  emptyMessage,

  // -----------------------------------------------------------------------
  // Server-side mode
  // -----------------------------------------------------------------------
  serverSide = false,
  loading = false,        // show loading spinner over the table
  error,                  // error message string or boolean — shows ErrorState
  totalCount,             // server total (server-side only)
  page: externalPage,     // controlled page (server-side only)
  searchValue,            // controlled search term (server-side only)
  filterValues: externalFilterValues, // controlled filter values (server-side only)
  sort: externalSort,     // controlled sort state, e.g. { field: "ascending" }
  searchDebounce = 0,     // ms to debounce onSearchChange callback
  resetPageOnChange = true, // auto-reset to page 1 on search/filter/sort change
  onSearchChange,         // (searchTerm) => void
  onFilterChange,         // (filterValues) => void
  onSortChange,           // (field, direction) => void
  onPageChange,           // (page) => void
  onParamsChange,         // ({ search, filters, sort, page }) => void

  // -----------------------------------------------------------------------
  // Row selection
  // -----------------------------------------------------------------------
  selectable = false,
  rowIdField = "id",     // field name used as unique row identifier
  selectedIds: externalSelectedIds, // controlled selection — array of row IDs
  onSelectionChange,     // (selectedIds[]) => void
  selectionActions = [], // [{ label, onClick(selectedIds[]), icon?, variant? }]
  recordLabel,           // { singular: "Contact", plural: "Contacts" } — defaults to Record/Records

  // -----------------------------------------------------------------------
  // Inline editing
  // -----------------------------------------------------------------------
  editMode,              // "discrete" (click-to-edit) | "inline" (always show inputs)
  onRowEdit,             // (row, field, newValue) => void

  // -----------------------------------------------------------------------
  // Auto-width
  // -----------------------------------------------------------------------
  autoWidth = true,      // auto-compute column widths from content analysis
}) => {
  // Build initial sort state
  const initialSortState = useMemo(() => {
    const state = {};
    columns.forEach((col) => {
      if (col.sortable) {
        state[col.field] = defaultSort[col.field] || "none";
      }
    });
    return state;
  }, [columns, defaultSort]);

  // ---------------------------------------------------------------------------
  // Internal state (used in client-side mode; also drives UI in server-side)
  // ---------------------------------------------------------------------------
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [internalFilterValues, setInternalFilterValues] = useState(() => {
    const init = {};
    filters.forEach((f) => { init[f.name] = getEmptyFilterValue(f); });
    return init;
  });
  const [internalSortState, setInternalSortState] = useState(initialSortState);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Resolve controlled vs internal state
  const searchTerm = serverSide && searchValue != null ? searchValue : internalSearchTerm;
  const filterValues = serverSide && externalFilterValues != null ? externalFilterValues : internalFilterValues;
  const sortState = serverSide && externalSort != null
    ? (() => {
      const s = {};
      columns.forEach((col) => { if (col.sortable) s[col.field] = externalSort[col.field] || "none"; });
      return s;
    })()
    : internalSortState;

  // In server-side mode, use external page if provided
  const activePage = serverSide && externalPage != null ? externalPage : currentPage;

  // Reset page on client-side filter/sort/search change
  useEffect(() => {
    if (!serverSide) setCurrentPage(1);
  }, [internalSearchTerm, internalFilterValues, internalSortState, serverSide]);

  // ---------------------------------------------------------------------------
  // Search debounce
  // ---------------------------------------------------------------------------
  const debounceRef = useRef(null);

  const fireSearchCallback = useCallback((term) => {
    if (serverSide && onSearchChange) onSearchChange(term);
  }, [serverSide, onSearchChange]);

  // ---------------------------------------------------------------------------
  // Unified params helper
  // ---------------------------------------------------------------------------
  const fireParamsChange = useCallback((overrides) => {
    if (!onParamsChange) return;
    const activeSortField = Object.keys(overrides.sort || sortState).find(
      (k) => (overrides.sort || sortState)[k] !== "none"
    );
    onParamsChange({
      search: overrides.search != null ? overrides.search : searchTerm,
      filters: overrides.filters != null ? overrides.filters : filterValues,
      sort: activeSortField
        ? { field: activeSortField, direction: (overrides.sort || sortState)[activeSortField] }
        : null,
      page: overrides.page != null ? overrides.page : activePage,
    });
  }, [onParamsChange, searchTerm, filterValues, sortState, activePage]);

  // ---------------------------------------------------------------------------
  // Handlers — notify parent in server-side mode
  // ---------------------------------------------------------------------------
  // Helper: reset page to 1 on search/filter/sort changes
  const resetPage = useCallback(() => {
    if (resetPageOnChange) {
      setCurrentPage(1);
      if (serverSide && onPageChange) onPageChange(1);
    }
  }, [resetPageOnChange, serverSide, onPageChange]);

  const handleSearchChange = useCallback((term) => {
    setInternalSearchTerm(term);
    resetPage();
    if (searchDebounce > 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fireSearchCallback(term);
        fireParamsChange({ search: term, page: resetPageOnChange ? 1 : undefined });
      }, searchDebounce);
    } else {
      fireSearchCallback(term);
      fireParamsChange({ search: term, page: resetPageOnChange ? 1 : undefined });
    }
  }, [searchDebounce, fireSearchCallback, fireParamsChange, resetPage, resetPageOnChange]);

  // Clean up debounce timer on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleFilterChange = useCallback((name, value) => {
    setInternalFilterValues((prev) => {
      const next = { ...prev, [name]: value };
      if (serverSide && onFilterChange) onFilterChange(next);
      resetPage();
      fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : undefined });
      return next;
    });
  }, [serverSide, onFilterChange, fireParamsChange, resetPage, resetPageOnChange]);

  const handleSortChange = useCallback((field) => {
    const current = (serverSide && externalSort ? externalSort[field] : internalSortState[field]) || "none";
    const nextDirection =
      current === "none" ? "ascending" :
        current === "ascending" ? "descending" : "none";

    const reset = {};
    Object.keys(internalSortState).forEach((k) => { reset[k] = "none"; });
    const next = { ...reset, [field]: nextDirection };
    setInternalSortState(next);
    if (serverSide && onSortChange) onSortChange(field, nextDirection);
    resetPage();
    fireParamsChange({ sort: next, page: resetPageOnChange ? 1 : undefined });
  }, [internalSortState, serverSide, externalSort, onSortChange, fireParamsChange, resetPage, resetPageOnChange]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    if (serverSide && onPageChange) onPageChange(page);
    fireParamsChange({ page });
  }, [serverSide, onPageChange, fireParamsChange]);

  // ---------------------------------------------------------------------------
  // Client-side: Filter
  // ---------------------------------------------------------------------------
  const filteredData = useMemo(() => {
    if (serverSide) return data; // server already filtered

    let result = data;

    // Apply each filter
    filters.forEach((filter) => {
      const value = filterValues[filter.name];
      if (!isFilterActive(filter, value)) return;

      const type = filter.type || "select";

      if (filter.filterFn) {
        result = result.filter((row) => filter.filterFn(row, value));
      } else if (type === "multiselect") {
        // "Any of" matching
        result = result.filter((row) => value.includes(row[filter.name]));
      } else if (type === "dateRange") {
        const fromTs = dateToTimestamp(value.from);
        const toTs = value.to ? dateToTimestamp(value.to) + 86400000 - 1 : null; // end of day
        result = result.filter((row) => {
          const rowTs = new Date(row[filter.name]).getTime();
          if (fromTs && rowTs < fromTs) return false;
          if (toTs && rowTs > toTs) return false;
          return true;
        });
      } else {
        // Default: exact match
        result = result.filter((row) => row[filter.name] === value);
      }
    });

    // Search across searchFields
    if (searchTerm && searchFields.length > 0) {
      if (fuzzySearch) {
        const fuse = new Fuse(result, {
          keys: searchFields,
          threshold: 0.4,
          distance: 100,
          ignoreLocation: true,
          ...fuzzyOptions,
        });
        result = fuse.search(searchTerm).map((r) => r.item);
      } else {
        const term = searchTerm.toLowerCase();
        result = result.filter((row) =>
          searchFields.some((field) => {
            const val = row[field];
            return val && String(val).toLowerCase().includes(term);
          })
        );
      }
    }

    return result;
  }, [data, filterValues, searchTerm, filters, searchFields, serverSide, fuzzySearch, fuzzyOptions]);

  // ---------------------------------------------------------------------------
  // Client-side: Sort
  // ---------------------------------------------------------------------------
  const sortedData = useMemo(() => {
    if (serverSide) return filteredData; // server already sorted

    const activeField = Object.keys(sortState).find((k) => sortState[k] !== "none");
    if (!activeField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const dir = sortState[activeField] === "ascending" ? 1 : -1;
      const aVal = a[activeField];
      const bVal = b[activeField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return -dir;
      if (aVal > bVal) return dir;
      return 0;
    });
  }, [filteredData, sortState, serverSide]);

  // ---------------------------------------------------------------------------
  // Client-side: Group (optional)
  // ---------------------------------------------------------------------------
  const groupedData = useMemo(() => {
    if (!groupBy) return null;

    const source = serverSide ? data : sortedData;
    const groups = {};
    source.forEach((row) => {
      const key = row[groupBy.field] ?? "--";
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    let groupKeys = Object.keys(groups);
    if (groupBy.sort) {
      if (typeof groupBy.sort === "function") {
        groupKeys.sort(groupBy.sort);
      } else {
        const dir = groupBy.sort === "desc" ? -1 : 1;
        groupKeys.sort((a, b) => (a < b ? -dir : a > b ? dir : 0));
      }
    }

    return groupKeys.map((key) => ({
      key,
      label: groupBy.label ? groupBy.label(key, groups[key]) : key,
      rows: groups[key],
    }));
  }, [sortedData, data, groupBy, serverSide]);

  // Group expand/collapse state
  const [expandedGroups, setExpandedGroups] = useState(() => {
    if (!groupBy) return new Set();
    const defaultExpanded = groupBy.defaultExpanded !== false; // default true
    if (defaultExpanded && groupedData) {
      return new Set(groupedData.map((g) => g.key));
    }
    return new Set();
  });

  // Sync expanded groups when grouped data changes (new groups appear)
  useEffect(() => {
    if (!groupedData) return;
    const defaultExpanded = groupBy?.defaultExpanded !== false;
    if (defaultExpanded) {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        groupedData.forEach((g) => next.add(g.key));
        return next;
      });
    }
  }, [groupedData, groupBy]);

  const toggleGroup = useCallback((key) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Flatten for pagination
  const flatRows = useMemo(() => {
    if (!groupedData) return (serverSide ? data : sortedData).map((row) => ({ type: "data", row }));

    const flat = [];
    groupedData.forEach((group) => {
      flat.push({ type: "group-header", group });
      if (expandedGroups.has(group.key)) {
        group.rows.forEach((row) => flat.push({ type: "data", row }));
      }
    });
    return flat;
  }, [groupedData, sortedData, data, serverSide, expandedGroups]);

  // ---------------------------------------------------------------------------
  // Paginate
  // ---------------------------------------------------------------------------
  const totalItems = serverSide ? (totalCount || data.length) : flatRows.length;
  const pageCount = Math.ceil(totalItems / pageSize);

  let displayRows;
  if (serverSide) {
    // Server already paginated — render data as-is (with optional grouping)
    displayRows = groupBy
      ? flatRows
      : data.map((row) => ({ type: "data", row }));
  } else {
    displayRows = flatRows.slice(
      (activePage - 1) * pageSize,
      activePage * pageSize
    );
  }

  // For footer callback — pass full filtered data (client) or current page (server)
  const footerData = serverSide ? data : filteredData;

  // ---------------------------------------------------------------------------
  // Filter chips
  // ---------------------------------------------------------------------------
  const activeChips = useMemo(() => {
    const chips = [];
    filters.forEach((filter) => {
      const value = filterValues[filter.name];
      if (!isFilterActive(filter, value)) return;

      const type = filter.type || "select";
      const prefix = filter.chipLabel || filter.placeholder || filter.name;

      if (type === "multiselect") {
        const labels = value
          .map((v) => filter.options.find((o) => o.value === v)?.label || v)
          .join(", ");
        chips.push({ key: filter.name, label: `${prefix}: ${labels}` });
      } else if (type === "dateRange") {
        const parts = [];
        if (value.from) parts.push(`from ${formatDateChip(value.from)}`);
        if (value.to) parts.push(`to ${formatDateChip(value.to)}`);
        chips.push({ key: filter.name, label: `${prefix}: ${parts.join(" ")}` });
      } else {
        const option = filter.options.find((o) => o.value === value);
        chips.push({ key: filter.name, label: `${prefix}: ${option?.label || value}` });
      }
    });
    return chips;
  }, [filterValues, filters]);

  const handleFilterRemove = useCallback((key) => {
    if (key === "all") {
      const cleared = {};
      filters.forEach((f) => { cleared[f.name] = getEmptyFilterValue(f); });
      setInternalFilterValues(cleared);
      if (serverSide && onFilterChange) onFilterChange(cleared);
      resetPage();
      fireParamsChange({ filters: cleared, page: resetPageOnChange ? 1 : undefined });
    } else {
      const filter = filters.find((f) => f.name === key);
      const emptyVal = filter ? getEmptyFilterValue(filter) : "";
      setInternalFilterValues((prev) => {
        const next = { ...prev, [key]: emptyVal };
        if (serverSide && onFilterChange) onFilterChange(next);
        resetPage();
        fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : undefined });
        return next;
      });
    }
  }, [filters, serverSide, onFilterChange, resetPage, fireParamsChange, resetPageOnChange]);

  // Record count
  const displayCount = serverSide ? (totalCount || data.length) : filteredData.length;
  const totalDataCount = serverSide ? (totalCount || data.length) : data.length;
  const pluralLabel = (recordLabel?.plural || "records").toLowerCase();
  const singularLabel = (recordLabel?.singular || "record").toLowerCase();
  const countLabel = (n) => n === 1 ? singularLabel : pluralLabel;
  const resolvedEmptyTitle = emptyTitle || "No results found";
  const resolvedEmptyMessage = emptyMessage || `No ${pluralLabel} match your search or filter criteria.`;
  const resolvedLoadingLabel = `Loading ${pluralLabel}...`;
  const recordCountLabel = rowCountText
    ? rowCountText(displayCount, totalDataCount)
    : displayCount === totalDataCount
      ? `${totalDataCount} ${countLabel(totalDataCount)}`
      : `${displayCount} of ${totalDataCount} ${countLabel(totalDataCount)}`;

  // ---------------------------------------------------------------------------
  // Row selection
  // ---------------------------------------------------------------------------
  const [internalSelectedIds, setInternalSelectedIds] = useState(new Set());

  // Sync internal state when external selectedIds changes
  useEffect(() => {
    if (externalSelectedIds != null) {
      setInternalSelectedIds(new Set(externalSelectedIds));
    }
  }, [externalSelectedIds]);

  // Reset selection on search/filter changes (only when uncontrolled)
  useEffect(() => {
    if (selectable && externalSelectedIds == null) setInternalSelectedIds(new Set());
  }, [searchTerm, filterValues, selectable, externalSelectedIds]);

  const selectedIds = externalSelectedIds != null
    ? new Set(externalSelectedIds)
    : internalSelectedIds;
  const setSelectedIds = setInternalSelectedIds;

  const handleSelectRow = useCallback((rowId, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  }, [onSelectionChange]);

  // Header checkbox — toggles current page rows only
  const handleSelectAll = useCallback((checked) => {
    const pageIds = displayRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField]);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  }, [displayRows, rowIdField, onSelectionChange]);

  // Header checkbox reflects current page selection state
  const allVisibleSelected = useMemo(() => {
    const pageIds = displayRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField]);
    return pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  }, [displayRows, selectedIds, rowIdField]);

  // Action bar "Select all" — selects ALL rows across all pages
  const handleSelectAllRows = useCallback(() => {
    const allIds = flatRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField]);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => next.add(id));
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  }, [flatRows, rowIdField, onSelectionChange]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
    if (onSelectionChange) onSelectionChange([]);
  }, [onSelectionChange]);

  // ---------------------------------------------------------------------------
  // Inline editing
  // ---------------------------------------------------------------------------
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [editError, setEditError] = useState(null);

  const startEditing = useCallback((rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue);
    setEditError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue(null);
    setEditError(null);
  }, []);

  const commitEdit = useCallback((row, field, value) => {
    const col = columns.find((c) => c.field === field);
    if (col?.editValidate) {
      const result = col.editValidate(value, row);
      if (result !== true && result !== undefined && result !== null) {
        setEditError(typeof result === "string" ? result : "Invalid value");
        return;
      }
    }
    if (onRowEdit) onRowEdit(row, field, value);
    setEditingCell(null);
    setEditValue(null);
    setEditError(null);
  }, [onRowEdit, columns]);

  const renderEditControl = (col, row) => {
    const type = col.editType || "text";
    const rowId = row[rowIdField];
    const fieldName = `edit-${rowId}-${col.field}`;
    const commit = (val) => commitEdit(row, col.field, val);
    const update = (val) => {
      setEditValue(val);
      if (onRowEdit) onRowEdit(row, col.field, val);
    };
    const exitEdit = () => {
      if (editError) return;
      setEditingCell(null);
      setEditValue(null);
    };
    const extra = col.editProps || {};

    // Validation props for text-type inputs (discrete mode)
    const validate = col.editValidate;
    const validationProps = validate && editError ? { error: true, validationMessage: editError } : {};
    const onInputValidate = validate
      ? (val) => {
        const result = validate(val, row);
        if (result !== true && result !== undefined && result !== null) {
          setEditError(typeof result === "string" ? result : "Invalid value");
        } else {
          setEditError(null);
        }
      }
      : undefined;

    switch (type) {
      case "textarea":
        return <TextArea {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={update} onBlur={exitEdit} {...validationProps} onInput={onInputValidate} />;
      case "number":
        return <NumberInput {...extra} name={fieldName} label="" value={editValue} onChange={update} onBlur={exitEdit} {...validationProps} onInput={onInputValidate} />;
      case "currency":
        return <CurrencyInput currencyCode="USD" {...extra} name={fieldName} label="" value={editValue} onChange={update} onBlur={exitEdit} {...validationProps} onInput={onInputValidate} />;
      case "stepper":
        return <StepperInput {...extra} name={fieldName} label="" value={editValue} onChange={update} onBlur={exitEdit} {...validationProps} onInput={onInputValidate} />;
      case "select":
        return <Select variant="transparent" {...extra} name={fieldName} label="" value={editValue} onChange={commit} options={resolveEditOptions(col, data)} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={editValue || []} onChange={commit} options={resolveEditOptions(col, data)} />;
      case "date":
        return <DateInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} />;
      case "toggle":
        return <Toggle {...extra} name={fieldName} label="" checked={!!editValue} onChange={commit} />;
      case "checkbox":
        return <Checkbox {...extra} name={fieldName} checked={!!editValue} onChange={commit} />;
      default:
        return <Input {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={update} onBlur={exitEdit} {...validationProps} onInput={onInputValidate} />;
    }
  };

  const resolvedEditMode = editMode || (columns.some((col) => col.editable) ? "discrete" : null);
  const useColumnRendering = selectable || !!resolvedEditMode || !renderRow;

  // ---------------------------------------------------------------------------
  // Auto-width computation
  // ---------------------------------------------------------------------------
  const autoWidths = useMemo(
    () => autoWidth ? computeAutoWidths(columns, data) : {},
    [columns, data, autoWidth]
  );

  const getHeaderWidth = (col) => col.width || autoWidths[col.field]?.width || "auto";
  const getCellWidth = (col) => col.cellWidth || col.width || autoWidths[col.field]?.cellWidth || "auto";

  // Per-cell error tracking for inline mode (multiple cells editable at once)
  const [inlineErrors, setInlineErrors] = useState({});

  const renderInlineControl = (col, row) => {
    const type = col.editType || "text";
    const rowId = row[rowIdField];
    const fieldName = `inline-${rowId}-${col.field}`;
    const cellKey = `${rowId}-${col.field}`;
    const value = row[col.field];
    const validate = col.editValidate;

    const fire = (val) => {
      if (validate) {
        const result = validate(val, row);
        if (result !== true && result !== undefined && result !== null) {
          setInlineErrors((prev) => ({ ...prev, [cellKey]: typeof result === "string" ? result : "Invalid value" }));
          return; // Block the edit
        }
        setInlineErrors((prev) => { const next = { ...prev }; delete next[cellKey]; return next; });
      }
      if (onRowEdit) onRowEdit(row, col.field, val);
    };
    const extra = col.editProps || {};
    const cellError = inlineErrors[cellKey];
    const validationProps = cellError ? { error: true, validationMessage: cellError } : {};
    const onInputValidate = validate
      ? (val) => {
        const result = validate(val, row);
        if (result !== true && result !== undefined && result !== null) {
          setInlineErrors((prev) => ({ ...prev, [cellKey]: typeof result === "string" ? result : "Invalid value" }));
        } else {
          setInlineErrors((prev) => { const next = { ...prev }; delete next[cellKey]; return next; });
        }
      }
      : undefined;

    switch (type) {
      case "textarea":
        return <TextArea {...extra} name={fieldName} label="" value={value ?? ""} onChange={fire} {...validationProps} onInput={onInputValidate} />;
      case "number":
        return <NumberInput {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={onInputValidate} />;
      case "currency":
        return <CurrencyInput currencyCode="USD" {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={onInputValidate} />;
      case "stepper":
        return <StepperInput {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={onInputValidate} />;
      case "select":
        return <Select variant="transparent" {...extra} name={fieldName} label="" value={value} onChange={fire} options={resolveEditOptions(col, data)} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={value || []} onChange={fire} options={resolveEditOptions(col, data)} />;
      case "date":
        return <DateInput {...extra} name={fieldName} label="" value={value} onChange={fire} />;
      case "toggle":
        return <Toggle {...extra} name={fieldName} label="" checked={!!value} onChange={fire} />;
      case "checkbox":
        return <Checkbox {...extra} name={fieldName} checked={!!value} onChange={fire} />;
      default:
        return <Input {...extra} name={fieldName} label="" value={value ?? ""} onChange={fire} {...validationProps} onInput={onInputValidate} />;
    }
  };

  const renderCellContent = (row, col) => {
    const rowId = row[rowIdField];

    // Inline mode: editable cells always show their input
    if (resolvedEditMode === "inline" && col.editable) {
      return renderInlineControl(col, row);
    }

    // Discrete mode: click-to-edit
    const isEditing =
      editingCell?.rowId === rowId && editingCell?.field === col.field;

    if (isEditing && col.editable) return renderEditControl(col, row);

    const content = col.renderCell
      ? col.renderCell(row[col.field], row)
      : row[col.field] ?? "";

    if (col.editable) {
      return (
        <Link
          variant="dark"
          onClick={() => startEditing(rowId, col.field, row[col.field])}
        >
          {content || "\u2014"}
        </Link>
      );
    }

    return content;
  };

  // ---------------------------------------------------------------------------
  // Render filter controls
  // ---------------------------------------------------------------------------
  const renderFilterControl = (filter) => {
    const type = filter.type || "select";

    if (type === "multiselect") {
      return (
        <MultiSelect
          key={filter.name}
          name={`filter-${filter.name}`}
          label=""
          placeholder={filter.placeholder || "All"}
          value={filterValues[filter.name] || []}
          onChange={(val) => handleFilterChange(filter.name, val)}
          options={filter.options}
        />
      );
    }

    if (type === "dateRange") {
      const rangeVal = filterValues[filter.name] || { from: null, to: null };
      return (
        <Flex key={filter.name} direction="row" align="center" gap="xs">
          <DateInput
            name={`filter-${filter.name}-from`}
            label=""
            placeholder="From"
            format="medium"
            value={rangeVal.from}
            onChange={(val) =>
              handleFilterChange(filter.name, { ...rangeVal, from: val })
            }
          />
          <Icon name="dataSync" size="sm"></Icon>
          <DateInput
            size="sm"
            name={`filter-${filter.name}-to`}
            label=""
            placeholder="To"
            format="medium"
            value={rangeVal.to}
            onChange={(val) =>
              handleFilterChange(filter.name, { ...rangeVal, to: val })
            }
          />
        </Flex>
      );
    }

    // Default: single select
    return (
      <Select
        key={filter.name}
        name={`filter-${filter.name}`}
        variant="transparent"
        placeholder={filter.placeholder || "All"}
        value={filterValues[filter.name]}
        onChange={(val) => handleFilterChange(filter.name, val)}
        options={[
          { label: filter.placeholder || "All", value: "" },
          ...filter.options,
        ]}
      />
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Flex direction="column" gap="xs">
      {/* Toolbar */}
      <Flex direction="row" gap="sm">
        {/* Left: Search, filters, chips (up to 75%) */}
        <Box flex={3}>
          <Flex direction="column" gap="sm">
            {/* Row 1: Search + first 2 filters + Filters toggle */}
            <Flex direction="row" align="center" gap="sm" wrap="wrap">
              {searchFields.length > 0 && (
                <SearchInput
                  name="datatable-search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              )}
              {filters.slice(0, 2).map(renderFilterControl)}
              {filters.length > 2 && (
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => setShowMoreFilters((prev) => !prev)}
                >
                  <Icon name="filter" size="sm" /> Filters
                </Button>
              )}
            </Flex>

            {/* Row 2: Additional filters (toggled) */}
            {showMoreFilters && filters.length > 2 && (
              <Flex direction="row" align="end" gap="sm" wrap="wrap">
                {filters.slice(2).map(renderFilterControl)}
              </Flex>
            )}

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <Flex direction="row" align="center" gap="sm" wrap="wrap">
                {activeChips.map((chip) => (
                  <Tag key={chip.key} variant="default" onDelete={() => handleFilterRemove(chip.key)}>
                    {chip.label}
                  </Tag>
                ))}
                <Button
                  variant="transparent"
                  size="extra-small"
                  onClick={() => handleFilterRemove("all")}
                >
                  Clear all
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>

        {/* Right: Record count (up to 25%) */}
        {showRowCount && displayCount > 0 && !(selectable && selectedIds.size > 0) && (
          <Box flex={1} alignSelf="end">
            <Flex direction="row" justify="end">
              <Text variant="microcopy" format={rowCountBold ? { fontWeight: "bold" } : undefined}>{recordCountLabel}</Text>
            </Flex>
          </Box>
        )}
      </Flex>

      {/* Selection action bar */}
      {selectable && selectedIds.size > 0 && (

        <Flex direction="row" gap="sm">
          <Box flex={3}>
            <Flex direction="row" align="center" gap="sm" wrap="nowrap">
              <Text inline={true} format={{ fontWeight: "demibold" }}>{selectedIds.size}&nbsp;{countLabel(selectedIds.size)}&nbsp;selected</Text>
              <Button variant="transparent" size="extra-small" onClick={handleSelectAllRows}>
                Select all {displayCount} {countLabel(displayCount)}
              </Button>
              <Button variant="transparent" size="extra-small" onClick={handleDeselectAll}>
                Deselect all
              </Button>
              {selectionActions.map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant || "transparent"}
                  size="extra-small"
                  onClick={() => action.onClick([...selectedIds])}
                >
                  {action.icon && <Icon name={action.icon} size="sm" />} {action.label}
                </Button>
              ))}
            </Flex>
          </Box>
          {showRowCount && displayCount > 0 && (
            <Box flex={1} alignSelf="center">
              <Flex direction="row" justify="end">
                <Text variant="microcopy" format={rowCountBold ? { fontWeight: "bold" } : undefined}>{recordCountLabel}</Text>
              </Flex>
            </Box>
          )}
        </Flex>

      )}

      {/* Loading / error / table / empty state */}
      {loading ? (
        <LoadingSpinner label={resolvedLoadingLabel} layout="centered" />
      ) : error ? (
        <ErrorState title={typeof error === "string" ? error : "Something went wrong."}>
          <Text>{typeof error === "string" ? "Please try again." : "An error occurred while loading data."}</Text>
        </ErrorState>
      ) : displayRows.length === 0 ? (
        <Flex direction="column" align="center" justify="center">
          <EmptyState title={resolvedEmptyTitle} layout="vertical">
            <Text>{resolvedEmptyMessage}</Text>
          </EmptyState>
        </Flex>
      ) : (
        <Table
          bordered={bordered}
          flush={flush}
          paginated={pageCount > 1}
          page={activePage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          showFirstLastButtons={showFirstLastButtons != null ? showFirstLastButtons : pageCount > 5}
          showButtonLabels={showButtonLabels}
          {...(maxVisiblePageButtons != null ? { maxVisiblePageButtons } : {})}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableHeader width="min">
                  <Checkbox
                    name="datatable-select-all"
                    aria-label="Select all rows"
                    checked={allVisibleSelected}
                    onChange={handleSelectAll}
                  />
                </TableHeader>
              )}
              {columns.map((col) => {
                const headerAlign = (resolvedEditMode === "inline" && col.editable) ? undefined : col.align;
                return (
                  <TableHeader
                    key={col.field}
                    width={getHeaderWidth(col)}
                    align={headerAlign}
                    sortDirection={col.sortable ? (sortState[col.field] || "none") : "never"}
                    onSortChange={col.sortable ? () => handleSortChange(col.field) : undefined}
                  >
                    {col.label}
                  </TableHeader>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((item, idx) =>
              item.type === "group-header" ? (
                <TableRow key={`group-${item.group.key}`}>
                  {selectable && <TableCell width="min" />}
                  {columns.map((col, colIdx) => (
                    <TableCell key={col.field} width={getCellWidth(col)} align={colIdx === 0 ? undefined : col.align}>
                      {colIdx === 0 ? (
                        <Link
                          variant="dark"
                          onClick={() => toggleGroup(item.group.key)}
                        >
                          <Flex direction="row" align="center" gap="xs" wrap="nowrap">
                            <Icon name={expandedGroups.has(item.group.key) ? "downCarat" : "right"} />
                            <Text format={{ fontWeight: "demibold" }}>
                              {item.group.label}
                            </Text>
                          </Flex>
                        </Link>
                      ) : (
                        groupBy.aggregations?.[col.field]
                          ? groupBy.aggregations[col.field](item.group.rows, item.group.key)
                          : groupBy.groupValues?.[item.group.key]?.[col.field] ?? ""
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ) : useColumnRendering ? (
                <TableRow key={item.row[rowIdField] ?? idx}>
                  {selectable && (
                    <TableCell width="min">
                      <Checkbox
                        name={`select-${item.row[rowIdField]}`}
                        aria-label="Select row"
                        checked={selectedIds.has(item.row[rowIdField])}
                        onChange={(checked) => handleSelectRow(item.row[rowIdField], checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const rowId = item.row[rowIdField];
                    const isDiscreteEditing = resolvedEditMode === "discrete" && editingCell?.rowId === rowId && editingCell?.field === col.field;
                    const isShowingInput = isDiscreteEditing || (resolvedEditMode === "inline" && col.editable);
                    // Input components don't respect cell text-align — skip align when showing inputs
                    const cellAlign = isShowingInput ? undefined : col.align;
                    return (
                      <TableCell key={col.field} width={isDiscreteEditing ? "auto" : getCellWidth(col)} align={cellAlign}>
                        {renderCellContent(item.row, col)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ) : (
                renderRow(item.row)
              )
            )}
          </TableBody>
          {footer && (
            <TableFooter>
              {footer(footerData)}
            </TableFooter>
          )}
        </Table>
      )}
    </Flex>
  );
};
