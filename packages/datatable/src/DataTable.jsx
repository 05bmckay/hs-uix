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
 * DATE HANDLING:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Date values in your data should be stored as ISO strings ("2026-01-15")
 *   or unix millisecond timestamps (1737000000000). These are the formats
 *   that work with the built-in dateRange filter comparison, which uses
 *   `new Date(value).getTime()` internally.
 *
 *   Custom date formats (e.g. "MM/dd/YYYY", "Jan 15, 2026") are NOT
 *   auto-parsed. If your data uses a non-standard format, provide a
 *   custom `filterFn` on your dateRange filter to handle comparison.
 *
 *   Display formatting is handled entirely by `renderCell`:
 *     { field: "date", renderCell: (val) => new Date(val).toLocaleDateString() }
 *
 *   Date editing (editType: "date") uses HubSpot's DateInput, which
 *   returns `{ year, month, date }` objects (month is 0-indexed). Your
 *   `onRowEdit` handler is responsible for converting this back to your
 *   data's format:
 *
 *     onRowEdit={(row, field, value) => {
 *       const formatted = `${value.year}-${String(value.month+1).padStart(2,"0")}-${String(value.date).padStart(2,"0")}`;
 *       updateRow(row.id, field, formatted);
 *     }}
 *
 *   Time editing (editType: "time") uses HubSpot's TimeInput.
 *   Returns `{ hours, minutes }`. Use editProps for interval, min, max.
 *
 *   Datetime editing (editType: "datetime") renders DateInput + TimeInput
 *   side by side. Returns `{ date: { year, month, date }, time: { hours, minutes } }`.
 *   Pass time-specific props via `editProps.timeProps`.
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
 *     onSelectAllRequest={({ selectedIds, pageIds }) => handleSelectAllAcrossDataset(selectedIds, pageIds)}
 *     selectionResetKey={queryFingerprint} // optional, clears selection when this key changes
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
 * ROW ACTIONS:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   // Static actions — same buttons on every row
 *   rowActions={[
 *     { label: "Edit", icon: "edit", onClick: (row) => edit(row) },
 *     { label: "Delete", icon: "delete", onClick: (row) => remove(row) },
 *   ]}
 *
 *   // Dynamic actions — different buttons per row
 *   rowActions={(row) => [
 *     { label: "Edit", icon: "edit", onClick: (row) => edit(row) },
 *     row.status !== "active" && { label: "Activate", onClick: (row) => activate(row) },
 *   ].filter(Boolean)}
 *   hideRowActionsWhenSelectionActive={true}
 *
 *   Actions appear in a right-aligned "min" width column appended after
 *   all data columns. Each action receives the full row object on click.
 *   Set hideRowActionsWhenSelectionActive to hide this column while
 *   selected-row action bar is visible.
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
 *   onRowEditInput={(row, field, draftValue) => validateDraft(row, field, draftValue)}
 *
 *   Supported editType values:
 *     "text" | "textarea" | "number" | "currency" | "stepper"
 *     "select" | "multiselect" | "date" | "time" | "datetime"
 *     "toggle" | "checkbox"
 *
 *   "time" uses HubSpot's TimeInput. Value format: { hours, minutes }
 *   "datetime" renders DateInput + TimeInput side by side.
 *     Value format: { date: { year, month, date }, time: { hours, minutes } }
 *     Pass time-specific props via editProps.timeProps (e.g. { interval: 15 })
 *
 *   NOTE: selectable or editable columns require renderCell(value, row)
 *   on each column. renderRow is used only when neither feature is active.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TEXT TRUNCATION:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   // Single-line truncation with tooltip on hover
 *   { field: "notes", label: "Notes", truncate: true }
 *
 *   // Character-limited with "See more"/"See less" toggle + tooltip
 *   { field: "notes", label: "Notes", truncate: { maxLength: 100 } }
 *
 *   Truncation is skipped when a cell is in edit mode.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * COLUMN WIDTH:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Each column accepts `width` (header + cells) and `cellWidth` (cells only):
 *     "min"  — shrink to fit content (may overflow with scrollbar)
 *     "max"  — expand to fill available space
 *     "auto" — adjust based on available space (default)
 *
 *   `width` also accepts number for fixed pixels (e.g. 200).
 *   `cellWidth` does not support numeric values.
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
 *   rowCountText={(shownOnPage, totalMatching) =>   // custom row count text
 *     `Showing ${shownOnPage} of ${totalMatching} items`
 *   }
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Fuse from "fuse.js";
import {
  Box,
  Button,
  Checkbox,
  CurrencyInput,
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
  TimeInput,
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
const SORT_DIRECTIONS = new Set(["ascending", "descending", "none"]);

const normalizeSortState = (columns, sort) => {
  const normalized = {};
  columns.forEach((col) => {
    if (col.sortable) normalized[col.field] = "none";
  });

  if (!sort) return normalized;

  // Accept object shape: { field, direction }
  if (sort.field && SORT_DIRECTIONS.has(sort.direction) && sort.field in normalized) {
    normalized[sort.field] = sort.direction;
    return normalized;
  }

  // Accept map shape: { fieldName: "ascending" | "descending" | "none" }
  Object.keys(normalized).forEach((field) => {
    const direction = sort[field];
    if (SORT_DIRECTIONS.has(direction)) normalized[field] = direction;
  });

  return normalized;
};

const serializeSortState = (sortState) => {
  const activeField = Object.keys(sortState).find((field) => sortState[field] !== "none");
  if (!activeField) return null;
  return { field: activeField, direction: sortState[activeField] };
};

const toStableKey = (value) => {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return String(value);
  }
};

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
  showFilterBadges = true,       // show active filter chips/badges
  showClearFiltersButton = true, // show "Clear all" filters reset button

  // Pagination
  pageSize = 10,
  maxVisiblePageButtons,        // max page number buttons to show
  showButtonLabels = true,      // show First/Prev/Next/Last text labels
  showFirstLastButtons,         // show First/Last page buttons (default: auto when pageCount > 5)

  // Row count
  showRowCount = true,          // show "X records" / "X of Y records" text
  rowCountBold = false,         // bold the row count text
  rowCountText,                 // custom formatter: (shownOnPage, totalMatching) => string

  // Table appearance
  bordered = true,              // show table borders
  flush = true,                 // remove bottom margin
  scrollable = false,           // allow horizontal overflow with scrollbar

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
  onSelectAllRequest,    // server-side: ({ selectedIds, pageIds, totalCount }) => void
  selectionActions = [], // [{ label, onClick(selectedIds[]), icon?, variant? }]
  selectionResetKey,     // optional key to force clear uncontrolled selection memory
  resetSelectionOnQueryChange = true, // clear uncontrolled selection on search/filter/sort changes
  recordLabel,           // { singular: "Contact", plural: "Contacts" } — defaults to Record/Records

  // -----------------------------------------------------------------------
  // Row actions
  // -----------------------------------------------------------------------
  rowActions,             // [{ label, onClick(row), icon?, variant? }] or (row) => actions[]
  hideRowActionsWhenSelectionActive = false, // hide row action column while selected-row action bar is visible

  // -----------------------------------------------------------------------
  // Inline editing
  // -----------------------------------------------------------------------
  editMode,              // "discrete" (click-to-edit) | "inline" (always show inputs)
  editingRowId,          // controlled — row ID currently in full-row edit mode
  onRowEdit,             // (row, field, newValue) => void
  onRowEditInput,        // optional live-input callback: (row, field, inputValue) => void

  // -----------------------------------------------------------------------
  // Auto-width
  // -----------------------------------------------------------------------
  autoWidth = true,      // auto-compute column widths from content analysis
}) => {
  // Build initial sort state
  const initialSortState = useMemo(() => {
    return normalizeSortState(columns, defaultSort);
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
  const externalSortState = useMemo(
    () => normalizeSortState(columns, externalSort),
    [columns, externalSort]
  );
  const sortState = serverSide && externalSort != null ? externalSortState : internalSortState;

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
    const nextSortState = overrides.sort != null
      ? normalizeSortState(columns, overrides.sort)
      : sortState;
    onParamsChange({
      search: overrides.search != null ? overrides.search : searchTerm,
      filters: overrides.filters != null ? overrides.filters : filterValues,
      sort: serializeSortState(nextSortState),
      page: overrides.page != null ? overrides.page : activePage,
    });
  }, [onParamsChange, columns, searchTerm, filterValues, sortState, activePage]);

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
    const next = { ...filterValues, [name]: value };
    setInternalFilterValues(next);
    if (serverSide && onFilterChange) onFilterChange(next);
    resetPage();
    fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : undefined });
  }, [filterValues, serverSide, onFilterChange, fireParamsChange, resetPage, resetPageOnChange]);

  const handleSortChange = useCallback((field) => {
    const current = sortState[field] || "none";
    const nextDirection =
      current === "none" ? "ascending" :
        current === "ascending" ? "descending" : "none";

    const reset = {};
    columns.forEach((col) => {
      if (col.sortable) reset[col.field] = "none";
    });
    const next = nextDirection === "none"
      ? reset
      : { ...reset, [field]: nextDirection };
    setInternalSortState(next);
    if (serverSide && onSortChange) onSortChange(field, nextDirection);
    resetPage();
    fireParamsChange({ sort: next, page: resetPageOnChange ? 1 : undefined });
  }, [sortState, columns, serverSide, onSortChange, fireParamsChange, resetPage, resetPageOnChange]);

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
          if (Number.isNaN(rowTs)) return false;
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
      const next = { ...filterValues, [key]: emptyVal };
      setInternalFilterValues(next);
      if (serverSide && onFilterChange) onFilterChange(next);
      resetPage();
      fireParamsChange({ filters: next, page: resetPageOnChange ? 1 : undefined });
    }
  }, [filters, filterValues, serverSide, onFilterChange, resetPage, fireParamsChange, resetPageOnChange]);

  // Record count
  const displayCount = serverSide ? (totalCount || data.length) : filteredData.length;
  const totalDataCount = serverSide ? (totalCount || data.length) : data.length;
  const shownOnPageCount = displayRows.filter((item) => item.type === "data").length;
  const pluralLabel = (recordLabel?.plural || "records").toLowerCase();
  const singularLabel = (recordLabel?.singular || "record").toLowerCase();
  const countLabel = (n) => n === 1 ? singularLabel : pluralLabel;
  const resolvedEmptyTitle = emptyTitle || "No results found";
  const resolvedEmptyMessage = emptyMessage || `No ${pluralLabel} match your search or filter criteria.`;
  const resolvedLoadingLabel = `Loading ${pluralLabel}...`;
  const recordCountLabel = rowCountText
    ? rowCountText(shownOnPageCount, displayCount)
    : displayCount === totalDataCount
      ? `${totalDataCount} ${countLabel(totalDataCount)}`
      : `${displayCount} of ${totalDataCount} ${countLabel(totalDataCount)}`;

  // ---------------------------------------------------------------------------
  // Row selection
  // ---------------------------------------------------------------------------
  const [internalSelectedIds, setInternalSelectedIds] = useState(new Set());
  const selectionResetRef = useRef("");

  // Sync internal state when external selectedIds changes
  useEffect(() => {
    if (externalSelectedIds != null) {
      setInternalSelectedIds(new Set(externalSelectedIds));
    }
  }, [externalSelectedIds]);

  const selectionQueryKey = useMemo(() => {
    if (!resetSelectionOnQueryChange) return "";
    return toStableKey({
      search: searchTerm,
      filters: filterValues,
      sort: serializeSortState(sortState),
    });
  }, [searchTerm, filterValues, sortState, resetSelectionOnQueryChange]);

  const combinedSelectionResetKey = useMemo(
    () => `${selectionQueryKey}::${selectionResetKey == null ? "" : toStableKey(selectionResetKey)}`,
    [selectionQueryKey, selectionResetKey]
  );

  // Reset selection memory on query changes or explicit reset-key changes (uncontrolled mode only)
  useEffect(() => {
    if (!selectable || externalSelectedIds != null) {
      selectionResetRef.current = combinedSelectionResetKey;
      return;
    }
    if (selectionResetRef.current && selectionResetRef.current !== combinedSelectionResetKey) {
      setInternalSelectedIds(new Set());
    }
    selectionResetRef.current = combinedSelectionResetKey;
  }, [combinedSelectionResetKey, selectable, externalSelectedIds]);

  const selectedIds = externalSelectedIds != null
    ? new Set(externalSelectedIds)
    : internalSelectedIds;
  const showRowActionsColumn = !!rowActions && !(
    hideRowActionsWhenSelectionActive && selectable && selectedIds.size > 0
  );

  const applySelection = useCallback((nextSet) => {
    if (externalSelectedIds == null) {
      setInternalSelectedIds(nextSet);
    }
    if (onSelectionChange) onSelectionChange([...nextSet]);
  }, [externalSelectedIds, onSelectionChange]);

  // Header checkbox applies to current-page rows
  const pageRowIds = useMemo(() => {
    if (serverSide) {
      return data
        .map((row) => row[rowIdField])
        .filter((id) => id != null);
    }
    return displayRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField])
      .filter((id) => id != null);
  }, [serverSide, data, displayRows, rowIdField]);

  // "Select all rows" in client mode means all rows in filtered/grouped data
  const allRowIds = useMemo(
    () => flatRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField])
      .filter((id) => id != null),
    [flatRows, rowIdField]
  );

  const handleSelectRow = useCallback((rowId, checked) => {
    const next = new Set(selectedIds);
    if (checked) next.add(rowId);
    else next.delete(rowId);
    applySelection(next);
  }, [selectedIds, applySelection]);

  // Header checkbox — toggles current page rows only
  const handleSelectAll = useCallback((checked) => {
    const next = new Set(selectedIds);
    pageRowIds.forEach((id) => {
      if (checked) next.add(id);
      else next.delete(id);
    });
    applySelection(next);
  }, [selectedIds, pageRowIds, applySelection]);

  // Header checkbox reflects current page selection state
  const allVisibleSelected = useMemo(() => {
    return pageRowIds.length > 0 && pageRowIds.every((id) => selectedIds.has(id));
  }, [pageRowIds, selectedIds]);

  // Action bar "Select all" — client: select all rows in memory; server: select current page + notify parent
  const handleSelectAllRows = useCallback(() => {
    const idsToAdd = serverSide ? pageRowIds : allRowIds;
    const next = new Set(selectedIds);
    idsToAdd.forEach((id) => next.add(id));
    applySelection(next);

    if (serverSide && onSelectAllRequest) {
      onSelectAllRequest({
        selectedIds: [...next],
        pageIds: pageRowIds,
        totalCount: totalCount || data.length,
      });
    }
  }, [serverSide, pageRowIds, allRowIds, selectedIds, applySelection, onSelectAllRequest, totalCount, data.length]);

  const handleDeselectAll = useCallback(() => {
    applySelection(new Set());
  }, [applySelection]);

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
    const handleInput = (val) => {
      setEditValue(val);
      if (onInputValidate) onInputValidate(val);
      if (onRowEditInput) onRowEditInput(row, col.field, val);
    };
    const maybeExitDatetimeEdit = () => {
      if (typeof document === "undefined") return;
      setTimeout(() => {
        const activeName = document.activeElement?.getAttribute?.("name");
        if (activeName !== `${fieldName}-date` && activeName !== `${fieldName}-time`) {
          exitEdit();
        }
      }, 0);
    };

    switch (type) {
      case "textarea":
        return <TextArea {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={commit} onBlur={exitEdit} {...validationProps} onInput={handleInput} />;
      case "number":
        return <NumberInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} onBlur={exitEdit} {...validationProps} onInput={handleInput} />;
      case "currency":
        return <CurrencyInput currencyCode="USD" {...extra} name={fieldName} label="" value={editValue} onChange={commit} onBlur={exitEdit} {...validationProps} onInput={handleInput} />;
      case "stepper":
        return <StepperInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} onBlur={exitEdit} {...validationProps} onInput={handleInput} />;
      case "select":
        return <Select variant="transparent" {...extra} name={fieldName} label="" value={editValue} onChange={commit} options={resolveEditOptions(col, data)} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={editValue || []} onChange={commit} options={resolveEditOptions(col, data)} />;
      case "date":
        return <DateInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} />;
      case "time":
        return <TimeInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} />;
      case "datetime":
        return (
          <Flex direction="row" align="center" gap="xs" wrap="nowrap">
            <DateInput {...extra} name={`${fieldName}-date`} label="" value={editValue?.date} onChange={(val) => {
              const next = { ...editValue, date: val };
              setEditValue(next);
              if (onRowEdit) onRowEdit(row, col.field, next);
            }} onBlur={maybeExitDatetimeEdit} />
            <TimeInput {...(extra.timeProps || {})} name={`${fieldName}-time`} label="" value={editValue?.time} onChange={(val) => {
              const next = { ...editValue, time: val };
              setEditValue(next);
              if (onRowEdit) onRowEdit(row, col.field, next);
            }} onBlur={maybeExitDatetimeEdit} />
          </Flex>
        );
      case "toggle":
        return <Toggle {...extra} name={fieldName} label="" checked={!!editValue} onChange={commit} />;
      case "checkbox":
        return <Checkbox {...extra} name={fieldName} checked={!!editValue} onChange={commit} />;
      default:
        return <Input {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={commit} onBlur={exitEdit} {...validationProps} onInput={handleInput} />;
    }
  };

  const resolvedEditMode = editMode || (columns.some((col) => col.editable) ? "discrete" : null);
  const useColumnRendering = selectable || !!resolvedEditMode || editingRowId != null || showRowActionsColumn || !renderRow;

  // ---------------------------------------------------------------------------
  // Auto-width computation
  // ---------------------------------------------------------------------------
  const autoWidths = useMemo(
    () => autoWidth ? computeAutoWidths(columns, data) : {},
    [columns, data, autoWidth]
  );

  const defaultWidth = scrollable ? "min" : "auto";
  const getHeaderWidth = (col) => col.width || autoWidths[col.field]?.width || defaultWidth;
  const getCellWidth = (col) => col.cellWidth || col.width || autoWidths[col.field]?.cellWidth || defaultWidth;

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
    const emitInput = (val) => {
      if (onInputValidate) onInputValidate(val);
      if (onRowEditInput) onRowEditInput(row, col.field, val);
    };

    switch (type) {
      case "textarea":
        return <TextArea {...extra} name={fieldName} label="" value={value ?? ""} onChange={fire} {...validationProps} onInput={emitInput} />;
      case "number":
        return <NumberInput {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={emitInput} />;
      case "currency":
        return <CurrencyInput currencyCode="USD" {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={emitInput} />;
      case "stepper":
        return <StepperInput {...extra} name={fieldName} label="" value={value} onChange={fire} {...validationProps} onInput={emitInput} />;
      case "select":
        return <Select {...extra} name={fieldName} label="" value={value} onChange={fire} options={resolveEditOptions(col, data)} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={value || []} onChange={fire} options={resolveEditOptions(col, data)} />;
      case "date":
        return <DateInput {...extra} name={fieldName} label="" value={value} onChange={fire} />;
      case "time":
        return <TimeInput {...extra} name={fieldName} label="" value={value} onChange={fire} />;
      case "datetime":
        return (
          <Flex direction="row" align="center" gap="xs" wrap="nowrap">
            <DateInput {...extra} name={`${fieldName}-date`} label="" value={value?.date} onChange={(val) => {
              fire({ ...value, date: val });
            }} />
            <TimeInput {...(extra.timeProps || {})} name={`${fieldName}-time`} label="" value={value?.time} onChange={(val) => {
              fire({ ...value, time: val });
            }} />
          </Flex>
        );
      case "toggle":
        return <Toggle {...extra} name={fieldName} label="" checked={!!value} onChange={fire} />;
      case "checkbox":
        return <Checkbox {...extra} name={fieldName} checked={!!value} onChange={fire} />;
      default:
        return <Input {...extra} name={fieldName} label="" value={value ?? ""} onChange={fire} {...validationProps} onInput={emitInput} />;
    }
  };

  const renderCellContent = (row, col) => {
    const rowId = row[rowIdField];

    // Inline mode: editable cells always show their input
    if (resolvedEditMode === "inline" && col.editable) {
      return renderInlineControl(col, row);
    }

    // Full-row edit: controlled via editingRowId prop
    if (editingRowId != null && rowId === editingRowId && col.editable) {
      return renderInlineControl(col, row);
    }

    // Discrete mode: click-to-edit
    const isEditing =
      editingCell?.rowId === rowId && editingCell?.field === col.field;

    if (isEditing && col.editable) return renderEditControl(col, row);

    // -----------------------------------------------------------------------
    // Truncation logic — applied before rendering content
    // -----------------------------------------------------------------------
    const rawValue = row[col.field];
    const rawStr = String(rawValue ?? "");

    if (col.truncate && rawStr.length > 0) {
      // Simple truncation: single line with tooltip on hover
      if (col.truncate === true) {
        const content = col.renderCell ? col.renderCell(rawValue, row) : rawStr;
        if (col.editable) {
          return (
            <Text truncate={{ tooltipText: rawStr }}>
              <Link variant="dark" onClick={() => startEditing(rowId, col.field, rawValue)}>
                {content || "--"}
              </Link>
            </Text>
          );
        }
        return <Text truncate={{ tooltipText: rawStr }}>{content}</Text>;
      }

      // Object truncation with maxLength: character-limited with tooltip
      const maxLen = col.truncate.maxLength || 100;
      if (rawStr.length > maxLen) {
        const truncatedStr = rawStr.slice(0, maxLen) + "…";
        const truncatedContent = col.renderCell ? col.renderCell(truncatedStr, row) : truncatedStr;
        if (col.editable) {
          return (
            <Link variant="dark" onClick={() => startEditing(rowId, col.field, rawValue)}>
              {truncatedContent || "--"}
            </Link>
          );
        }
        return <Text truncate={{ tooltipText: rawStr }}>{truncatedContent || "--"}</Text>;
      }
    }

    // -----------------------------------------------------------------------
    // Default rendering (no truncation or text is short enough)
    // -----------------------------------------------------------------------
    const content = col.renderCell
      ? col.renderCell(rawValue, row)
      : rawValue;
    const isEmpty = content == null || content === "";

    if (col.editable) {
      return (
        <Link
          variant="dark"
          onClick={() => startEditing(rowId, col.field, rawValue)}
        >
          {isEmpty ? "--" : content}
        </Link>
      );
    }

    return isEmpty ? "--" : content;
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

            {/* Active filter chips / clear filters */}
            {activeChips.length > 0 && (showFilterBadges || showClearFiltersButton) && (
              <Flex direction="row" align="center" gap="sm" wrap="wrap">
                {showFilterBadges && activeChips.map((chip) => (
                  <Tag key={chip.key} variant="default" onDelete={() => handleFilterRemove(chip.key)}>
                    {chip.label}
                  </Tag>
                ))}
                {showClearFiltersButton && (
                  <Button
                    variant="transparent"
                    size="extra-small"
                    onClick={() => handleFilterRemove("all")}
                  >
                    Clear all
                  </Button>
                )}
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
              {showRowActionsColumn && <TableHeader width="min" />}
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
                  {showRowActionsColumn && <TableCell width="min" />}
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
                    const isRowEditing = editingRowId != null && rowId === editingRowId && col.editable;
                    const isShowingInput = isDiscreteEditing || isRowEditing || (resolvedEditMode === "inline" && col.editable);
                    // Input components don't respect cell text-align — skip align when showing inputs
                    const cellAlign = isShowingInput ? undefined : col.align;
                    return (
                      <TableCell key={col.field} width={(isDiscreteEditing || isRowEditing) ? "auto" : getCellWidth(col)} align={cellAlign}>
                        {renderCellContent(item.row, col)}
                      </TableCell>
                    );
                  })}
                  {showRowActionsColumn && (
                    <TableCell width="min">
                      <Flex direction="row" align="center" gap="xs" wrap="nowrap">
                        {(() => {
                          const resolvedRowActions = typeof rowActions === "function" ? rowActions(item.row) : rowActions;
                          const actions = Array.isArray(resolvedRowActions) ? resolvedRowActions : [];
                          return actions.map((action, i) => (
                          <Button
                            key={i}
                            variant={action.variant || "transparent"}
                            size="extra-small"
                            onClick={() => action.onClick(item.row)}
                          >
                            {action.icon && <Icon name={action.icon} size="sm" />}
                            {action.label && ` ${action.label}`}
                          </Button>
                          ));
                        })()}
                      </Flex>
                    </TableCell>
                  )}
                </TableRow>
              ) : (
                renderRow(item.row)
              )
            )}
          </TableBody>
          {(footer || columns.some((col) => col.footer)) && (
            <TableFooter>
              {typeof footer === "function"
                ? footer(footerData)
                : (
                  <TableRow>
                    {selectable && <TableHeader width="min" />}
                    {columns.map((col) => {
                      const footerDef = col.footer;
                      const content = typeof footerDef === "function"
                        ? footerDef(footerData)
                        : footerDef || "";
                      return (
                        <TableHeader key={col.field} align={col.align}>
                          {content}
                        </TableHeader>
                      );
                    })}
                    {showRowActionsColumn && <TableHeader width="min" />}
                  </TableRow>
                )}
            </TableFooter>
          )}
        </Table>
      )}
    </Flex>
  );
};
