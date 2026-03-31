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
  Input,
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
  onRowEdit,             // (row, field, newValue) => void
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

  // Flatten for pagination
  const flatRows = useMemo(() => {
    if (!groupedData) return (serverSide ? data : sortedData).map((row) => ({ type: "data", row }));

    const flat = [];
    groupedData.forEach((group) => {
      flat.push({ type: "group-header", group });
      group.rows.forEach((row) => flat.push({ type: "data", row }));
    });
    return flat;
  }, [groupedData, sortedData, data, serverSide]);

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

  const startEditing = useCallback((rowId, field, currentValue) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue(null);
  }, []);

  const commitEdit = useCallback((row, field, value) => {
    if (onRowEdit) onRowEdit(row, field, value);
    setEditingCell(null);
    setEditValue(null);
  }, [onRowEdit]);

  const INSTANT_COMMIT = useMemo(
    () => new Set(["select", "multiselect", "date", "toggle", "checkbox"]),
    []
  );

  const renderEditControl = (col, row) => {
    const type = col.editType || "text";
    const rowId = row[rowIdField];
    const fieldName = `edit-${rowId}-${col.field}`;
    const commit = (val) => commitEdit(row, col.field, val);
    const extra = col.editProps || {};

    let control;
    switch (type) {
      case "textarea":
        control = <TextArea {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={setEditValue} />;
        break;
      case "number":
        control = <NumberInput {...extra} name={fieldName} label="" value={editValue} onChange={setEditValue} />;
        break;
      case "currency":
        control = <CurrencyInput currencyCode="USD" {...extra} name={fieldName} label="" value={editValue} onChange={setEditValue} />;
        break;
      case "stepper":
        control = <StepperInput {...extra} name={fieldName} label="" value={editValue} onChange={setEditValue} />;
        break;
      case "select":
        control = <Select variant="transparent" {...extra} name={fieldName} label="" value={editValue} onChange={commit} options={col.editOptions || []} />;
        break;
      case "multiselect":
        control = <MultiSelect {...extra} name={fieldName} label="" value={editValue || []} onChange={commit} options={col.editOptions || []} />;
        break;
      case "date":
        control = <DateInput {...extra} name={fieldName} label="" value={editValue} onChange={commit} />;
        break;
      case "toggle":
        control = <Toggle {...extra} name={fieldName} label="" checked={!!editValue} onChange={commit} />;
        break;
      case "checkbox":
        control = <Checkbox {...extra} name={fieldName} checked={!!editValue} onChange={commit} />;
        break;
      default:
        control = <Input {...extra} name={fieldName} label="" value={editValue ?? ""} onChange={setEditValue} />;
    }

    if (INSTANT_COMMIT.has(type)) {
      return (
        <Flex direction="row" align="center" gap="xs">
          <Box flex={1}>{control}</Box>
          <Button variant="transparent" size="extra-small" onClick={cancelEdit}>Cancel</Button>
        </Flex>
      );
    }

    return (
      <Flex direction="row" align="center" gap="xs">
        <Box flex={1}>{control}</Box>
        <Button variant="primary" size="extra-small" onClick={() => commit(editValue)}>Save</Button>
        <Button variant="transparent" size="extra-small" onClick={cancelEdit}>Cancel</Button>
      </Flex>
    );
  };

  const useColumnRendering = selectable || columns.some((col) => col.editable);

  const renderCellContent = (row, col) => {
    const rowId = row[rowIdField];
    const isEditing =
      editingCell?.rowId === rowId && editingCell?.field === col.field;

    if (isEditing && col.editable) return renderEditControl(col, row);

    const content = col.renderCell
      ? col.renderCell(row[col.field], row)
      : row[col.field] ?? "";

    if (col.editable) {
      return (
        <Button
          variant="transparent"
          size="extra-small"
          onClick={() => startEditing(rowId, col.field, row[col.field])}
        >
          {content || "\u2014"}
        </Button>
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
    <Flex direction="column" gap="sm">
      {/* Filter bar */}
      <Flex direction="column" gap="sm">
        <Flex direction="row" align="end" gap="sm" wrap="wrap">
          {searchFields.length > 0 && (
            <SearchInput
              name="datatable-search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}
          {filters.map(renderFilterControl)}

          {/* Record count — right-aligned when no chips */}
          {activeChips.length === 0 && displayCount > 0 && (
            <Box flex={1}>
              <Flex direction="row" justify="end">
                <Text variant="microcopy">{recordCountText}</Text>
              </Flex>
            </Box>
          )}
        </Flex>

        {/* Filter chips + record count */}
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
                    variant="small"
                    aria-label="Select all rows"
                    checked={allVisibleSelected}
                    onChange={handleSelectAll}
                  />
                </TableHeader>
              )}
              {columns.map((col) => (
                <TableHeader
                  key={col.field}
                  width={col.width || "min"}
                  align={col.align}
                  sortDirection={col.sortable ? (sortState[col.field] || "none") : "never"}
                  onSortChange={col.sortable ? () => handleSortChange(col.field) : undefined}
                >
                  {col.label}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((item, idx) =>
              item.type === "group-header" ? (
                <TableRow key={`group-${item.group.key}`}>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0)} width="auto">
                    <Text format={{ fontWeight: "demibold" }}>
                      {item.group.label}
                    </Text>
                  </TableCell>
                </TableRow>
              ) : useColumnRendering ? (
                <TableRow key={item.row[rowIdField] ?? idx}>
                  {selectable && (
                    <TableCell width="min">
                      <Checkbox
                        name={`select-${item.row[rowIdField]}`}
                        variant="small"
                        aria-label="Select row"
                        checked={selectedIds.has(item.row[rowIdField])}
                        onChange={(checked) => handleSelectRow(item.row[rowIdField], checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.field} width={col.width || "min"} align={col.align}>
                      {renderCellContent(item.row, col)}
                    </TableCell>
                  ))}
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
