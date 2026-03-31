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
 *     data={currentPageRows}
 *     totalCount={247}
 *     columns={COLUMNS}
 *     renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
 *     searchFields={["name", "email"]}
 *     filters={FILTER_CONFIG}
 *     pageSize={10}
 *     page={currentPage}
 *     onSearchChange={(term) => refetch({ search: term, page: 1 })}
 *     onFilterChange={(filterValues) => refetch({ filters: filterValues, page: 1 })}
 *     onSortChange={(field, direction) => refetch({ sort: field, dir: direction, page: 1 })}
 *     onPageChange={(page) => refetch({ page })}
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
 *     columns={[
 *       { field: "name", label: "Name", renderCell: (val) => val },
 *       ...
 *     ]}
 *   />
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
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  CurrencyInput,
  DateInput,
  EmptyState,
  Flex,
  Icon,
  Input,
  Link,
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

  // Filters
  filters = [],

  // Pagination
  pageSize = 10,

  // Sorting
  defaultSort = {},

  // Grouping
  groupBy,

  // Footer
  footer,

  // Empty state
  emptyTitle = "No results found",
  emptyMessage = "No records match your search or filter criteria.",

  // -----------------------------------------------------------------------
  // Server-side mode
  // -----------------------------------------------------------------------
  serverSide = false,
  totalCount,           // server total (server-side only)
  page: externalPage,   // controlled page (server-side only)
  onSearchChange,       // (searchTerm) => void
  onFilterChange,       // (filterValues) => void
  onSortChange,         // (field, direction) => void
  onPageChange,         // (page) => void

  // -----------------------------------------------------------------------
  // Row selection
  // -----------------------------------------------------------------------
  selectable = false,
  rowIdField = "id",     // field name used as unique row identifier
  onSelectionChange,     // (selectedIds[]) => void

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState(() => {
    const init = {};
    filters.forEach((f) => { init[f.name] = getEmptyFilterValue(f); });
    return init;
  });
  const [sortState, setSortState] = useState(initialSortState);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // In server-side mode, use external page if provided
  const activePage = serverSide && externalPage != null ? externalPage : currentPage;

  // Reset page on client-side filter/sort/search change
  useEffect(() => {
    if (!serverSide) setCurrentPage(1);
  }, [searchTerm, filterValues, sortState, serverSide]);

  // ---------------------------------------------------------------------------
  // Handlers — notify parent in server-side mode
  // ---------------------------------------------------------------------------
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    if (serverSide && onSearchChange) onSearchChange(term);
  }, [serverSide, onSearchChange]);

  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prev) => {
      const next = { ...prev, [name]: value };
      if (serverSide && onFilterChange) onFilterChange(next);
      return next;
    });
  }, [serverSide, onFilterChange]);

  const handleSortChange = useCallback((field) => {
    const current = sortState[field] || "none";
    const nextDirection =
      current === "none" ? "ascending" :
      current === "ascending" ? "descending" : "none";

    const reset = {};
    Object.keys(sortState).forEach((k) => { reset[k] = "none"; });
    const next = { ...reset, [field]: nextDirection };
    setSortState(next);
    if (serverSide && onSortChange) onSortChange(field, nextDirection);
  }, [sortState, serverSide, onSortChange]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    if (serverSide && onPageChange) onPageChange(page);
  }, [serverSide, onPageChange]);

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
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        searchFields.some((field) => {
          const val = row[field];
          return val && String(val).toLowerCase().includes(term);
        })
      );
    }

    return result;
  }, [data, filterValues, searchTerm, filters, searchFields, serverSide]);

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
      setFilterValues(cleared);
      if (serverSide && onFilterChange) onFilterChange(cleared);
    } else {
      const filter = filters.find((f) => f.name === key);
      const emptyVal = filter ? getEmptyFilterValue(filter) : "";
      setFilterValues((prev) => {
        const next = { ...prev, [key]: emptyVal };
        if (serverSide && onFilterChange) onFilterChange(next);
        return next;
      });
    }
  }, [filters, serverSide, onFilterChange]);

  // Record count
  const displayCount = serverSide ? (totalCount || data.length) : filteredData.length;
  const totalDataCount = serverSide ? (totalCount || data.length) : data.length;
  const recordCountText =
    displayCount === totalDataCount
      ? `${totalDataCount} records`
      : `${displayCount} of ${totalDataCount} records`;

  // ---------------------------------------------------------------------------
  // Row selection
  // ---------------------------------------------------------------------------
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (selectable) setSelectedIds(new Set());
  }, [searchTerm, filterValues, selectable]);

  const handleSelectRow = useCallback((rowId, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  }, [onSelectionChange]);

  const handleSelectAll = useCallback((checked) => {
    const visibleIds = displayRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField]);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      if (onSelectionChange) onSelectionChange([...next]);
      return next;
    });
  }, [displayRows, rowIdField, onSelectionChange]);

  const allVisibleSelected = useMemo(() => {
    const visibleIds = displayRows
      .filter((r) => r.type === "data")
      .map((r) => r.row[rowIdField]);
    return visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  }, [displayRows, selectedIds, rowIdField]);

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
        return <Select variant="transparent" {...extra} name={fieldName} label="" value={editValue} onChange={commit} options={col.editOptions || []} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={editValue || []} onChange={commit} options={col.editOptions || []} />;
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
        return <Select variant="transparent" {...extra} name={fieldName} label="" value={value} onChange={fire} options={col.editOptions || []} />;
      case "multiselect":
        return <MultiSelect {...extra} name={fieldName} label="" value={value || []} onChange={fire} options={col.editOptions || []} />;
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
        <Flex key={filter.name} direction="row" align="end" gap="xs">
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
          <Text variant="microcopy">to</Text>
          <DateInput
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
      <Flex direction="column" gap="sm">
        {/* Row 1: Search + first 2 filters + Filters toggle */}
        <Flex direction="row" align="end" gap="sm" wrap="wrap">
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
              <Icon name="filter" /> Filters
            </Button>
          )}
          {/* Record count — always on row 1 when no chips */}
          {activeChips.length === 0 && displayCount > 0 && (
            <Box flex={1}>
              <Flex direction="row" justify="end">
                <Text variant="microcopy">{recordCountText}</Text>
              </Flex>
            </Box>
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
            {displayCount > 0 && (
              <Box flex={1}>
                <Flex direction="row" justify="end">
                  <Text variant="microcopy">{recordCountText}</Text>
                </Flex>
              </Box>
            )}
          </Flex>
        )}
      </Flex>

      {/* Table or empty state */}
      {displayRows.length === 0 ? (
        <EmptyState title={emptyTitle}>
          <Text>{emptyMessage}</Text>
        </EmptyState>
      ) : (
        <Table
          bordered={true}
          flush={true}
          paginated={pageCount > 1}
          page={activePage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          showFirstLastButtons={pageCount > 5}
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
