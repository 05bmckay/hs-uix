import type { ReactElement, ReactNode } from "react";

export type DataTableSortDirection = "none" | "ascending" | "descending";
export type DataTableWidth = "min" | "max" | "auto";
export type DataTableColumnWidth = DataTableWidth | number;
export type DataTableEditMode = "discrete" | "inline";
export type DataTableFilterType = "select" | "multiselect" | "dateRange";

export interface DataTableDateValue {
  year: number;
  month: number;
  date: number;
}

export interface DataTableTimeValue {
  hours: number;
  minutes: number;
}

export interface DataTableDateRangeValue {
  from: DataTableDateValue | null;
  to: DataTableDateValue | null;
}

export interface DataTableOption<T = unknown> {
  label: string;
  value: T;
}

export interface DataTableFilterConfig<Row = Record<string, unknown>> {
  name: string;
  type?: DataTableFilterType;
  placeholder?: string;
  options?: DataTableOption[];
  chipLabel?: string;
  filterFn?: (row: Row, value: unknown) => boolean;
}

export type DataTableEditType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "stepper"
  | "select"
  | "multiselect"
  | "date"
  | "time"
  | "datetime"
  | "toggle"
  | "checkbox";

export interface DataTableColumn<Row = Record<string, unknown>> {
  field: string;
  label: ReactNode;
  sortable?: boolean;
  width?: DataTableColumnWidth;
  cellWidth?: DataTableWidth;
  align?: "left" | "center" | "right";
  truncate?: true | number | { maxLength?: number };
  editable?: boolean;
  editType?: DataTableEditType;
  editOptions?: DataTableOption[];
  editValidate?: (value: unknown, row: Row) => true | string | undefined | null;
  editProps?: Record<string, unknown>;
  renderCell?: (value: unknown, row: Row) => ReactNode;
  footer?: ReactNode | ((rows: Row[]) => ReactNode);
}

export interface DataTableSelectionAction<Id = string | number> {
  label: string;
  icon?: string;
  variant?: string;
  onClick: (selectedIds: Id[]) => void;
}

export interface DataTableRowAction<Row = Record<string, unknown>> {
  label?: string;
  icon?: string;
  variant?: string;
  onClick: (row: Row) => void;
}

export interface DataTableGroupBy<Row = Record<string, unknown>> {
  field: string;
  label?: (value: unknown, rows: Row[]) => ReactNode;
  sort?: "asc" | "desc" | ((a: string, b: string) => number);
  defaultExpanded?: boolean;
  aggregations?: Record<string, (rows: Row[], groupKey: string) => ReactNode>;
  groupValues?: Record<string, Record<string, ReactNode>>;
}

export interface DataTableSortObject {
  field: string;
  direction: DataTableSortDirection;
}

export interface DataTableParams {
  search: string;
  filters: Record<string, unknown>;
  sort: { field: string; direction: Exclude<DataTableSortDirection, "none"> } | null;
  page: number;
}

export interface DataTableSelectAllRequestPayload<Id = string | number> {
  selectedIds: Id[];
  pageIds: Id[];
  totalCount: number;
}

export interface DataTableLabels {
  selected?: string | ((count: number, countLabel: string) => string); // Selection bar: "{count} {label} selected"
  selectAll?: string | ((totalCount: number, countLabel: string) => string); // Selection bar: "Select all {count} {label}"
  deselectAll?: string; // Selection bar: "Deselect all"
  filtersButton?: string; // Overflow filters toggle button: "Filters"
  clearAll?: string; // Active filter chips reset: "Clear all"
  dateFrom?: string; // Date range filter start placeholder: "From"
  dateTo?: string; // Date range filter end placeholder: "To"
  loading?: string; // Loading spinner label: "Loading {pluralLabel}..."
  errorTitle?: string; // Error state heading: "Something went wrong."
  errorMessage?: string; // Error state body (non-string error): "An error occurred while loading data."
  retryMessage?: string; // Error state body (string error): "Please try again."
}

export interface DataTableSelectionBarRenderContext<Id = string | number> {
  selectedIds: Set<Id>;
  selectedCount: number;
  displayCount: number;
  countLabel: (n: number) => string;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectionActions: DataTableSelectionAction<Id>[];
}

export interface DataTableEmptyStateRenderContext {
  title: string;
  message: string;
}

export interface DataTableLoadingStateRenderContext {
  label: string;
}

export interface DataTableErrorStateRenderContext {
  error: string | boolean;
  title: string;
  message: string;
}

export interface DataTableProps<Row = Record<string, unknown>, Id = string | number> {
  data: Row[];
  columns: DataTableColumn<Row>[];
  renderRow?: (row: Row) => ReactNode;

  searchFields?: string[];
  searchPlaceholder?: string;
  fuzzySearch?: boolean;
  fuzzyOptions?: Record<string, unknown>;

  filters?: DataTableFilterConfig<Row>[];
  showFilterBadges?: boolean;
  showClearFiltersButton?: boolean;

  pageSize?: number;
  maxVisiblePageButtons?: number;
  showButtonLabels?: boolean;
  showFirstLastButtons?: boolean;

  showRowCount?: boolean;
  rowCountBold?: boolean;
  rowCountText?: (shownOnPage: number, totalMatching: number) => string;

  bordered?: boolean;
  flush?: boolean;
  scrollable?: boolean;

  defaultSort?: Record<string, DataTableSortDirection>;
  groupBy?: DataTableGroupBy<Row>;
  footer?: (rows: Row[]) => ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;

  serverSide?: boolean;
  loading?: boolean;
  error?: string | boolean;
  totalCount?: number;
  page?: number;
  searchValue?: string;
  filterValues?: Record<string, unknown>;
  sort?: Record<string, DataTableSortDirection> | DataTableSortObject;
  searchDebounce?: number;
  resetPageOnChange?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  onFilterChange?: (filterValues: Record<string, unknown>) => void;
  onSortChange?: (field: string, direction: DataTableSortDirection) => void;
  onPageChange?: (page: number) => void;
  onParamsChange?: (params: DataTableParams) => void;

  selectable?: boolean;
  rowIdField?: string;
  selectedIds?: Id[];
  onSelectionChange?: (selectedIds: Id[]) => void;
  onSelectAllRequest?: (payload: DataTableSelectAllRequestPayload<Id>) => void;
  selectionActions?: DataTableSelectionAction<Id>[];
  selectionResetKey?: unknown;
  resetSelectionOnQueryChange?: boolean;
  recordLabel?: { singular: string; plural: string };

  rowActions?: DataTableRowAction<Row>[] | ((row: Row) => DataTableRowAction<Row>[]);
  hideRowActionsWhenSelectionActive?: boolean;

  editMode?: DataTableEditMode;
  editingRowId?: Id;
  onRowEdit?: (row: Row, field: string, newValue: unknown) => void;
  onRowEditInput?: (row: Row, field: string, inputValue: unknown) => void;
  onEditStart?: (row: Row, field: string, currentValue: unknown) => void; // Fires when editing begins on a cell
  onEditCancel?: (row: Row, field: string) => void; // Fires when editing is cancelled without commit

  autoWidth?: boolean;

  showSearch?: boolean; // Show/hide the search input (default true)
  showSelectionBar?: boolean; // Show/hide the selection action bar when rows are selected (default true)
  filterInlineLimit?: number; // Max filters shown inline before overflow into "Filters" button (default 2)

  labels?: DataTableLabels; // Override hardcoded UI strings for i18n

  renderSelectionBar?: (context: DataTableSelectionBarRenderContext<Id>) => ReactNode; // Replace the default selection action bar
  renderEmptyState?: (context: DataTableEmptyStateRenderContext) => ReactNode; // Replace the default empty state
  renderLoadingState?: (context: DataTableLoadingStateRenderContext) => ReactNode; // Replace the default loading spinner
  renderErrorState?: (context: DataTableErrorStateRenderContext) => ReactNode; // Replace the default error state
}

export declare function DataTable<Row = Record<string, unknown>, Id = string | number>(
  props: DataTableProps<Row, Id>
): ReactElement | null;
