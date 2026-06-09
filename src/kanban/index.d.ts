import type { ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type KanbanStageVariant = "success" | "info" | "warning" | "default";
export type KanbanCardDensity = "compact" | "comfortable";
export type KanbanStageControlMode = "select" | "menu" | "none";
export type KanbanCardBodyMode = "descriptionList" | "stack";
export type KanbanFilterType = "select" | "multiselect" | "dateRange";

export interface KanbanOption<T = string> {
  label: string;
  value: T;
}

export interface KanbanFilterConfig<Row = Record<string, unknown>> {
  name: string;
  type?: KanbanFilterType;
  label?: string;
  placeholder?: string;
  /** Prefix used in the active-filter chip. Defaults to `placeholder` or `name`. */
  chipLabel?: string;
  options?: KanbanOption[];
  includeAll?: boolean;
  allValue?: unknown;
  emptyValue?: unknown;
  allLabel?: string;
  fromLabel?: string;
  toLabel?: string;
  filterFn?: (row: Row, value: unknown) => boolean;
}

// ---------------------------------------------------------------------------
// Card fields
// ---------------------------------------------------------------------------

export type KanbanCardFieldPlacement = "title" | "subtitle" | "meta" | "body" | "footer";

export interface KanbanCardField<Row = Record<string, unknown>> {
  key?: string;
  field?: string;
  label?: string;
  render?: (value: unknown, row: Row) => ReactNode;
  placement?: KanbanCardFieldPlacement;
  href?:
    | string
    | { url: string; external?: boolean }
    | ((row: Row) => string | { url: string; external?: boolean });
  truncate?: true | number;
  visible?: (row: Row) => boolean;
  colSpan?: number;
}

export interface KanbanCardDividers {
  afterTitle?: boolean;
  afterSubtitle?: boolean;
  afterBody?: boolean;
  afterFooter?: boolean;
}

// ---------------------------------------------------------------------------
// Stage definition
// ---------------------------------------------------------------------------

export interface KanbanStageChangeResult {
  extraProperties?: Record<string, unknown>;
}

export interface KanbanTransitionPromptContext<Row> {
  row: Row;
  fromStage: string;
  toStage: string;
  onConfirm: (result?: KanbanStageChangeResult) => void;
  onCancel: () => void;
}

export interface KanbanStage<Row = Record<string, unknown>> {
  value: string;
  label: string;
  shortLabel?: string;
  description?: string;
  variant?: KanbanStageVariant;
  color?: string;
  icon?: string;
  terminal?: boolean;
  order?: number;
  /**
   * WIP limit for this stage. The header shows "count / limit" and an
   * "Over WIP" StatusTag when exceeded. 0 is valid ("stay empty"). The
   * top-level `wipLimits` prop overrides this per stage. Advisory only —
   * transitions that exceed the limit still complete.
   */
  wipLimit?: number;
  footer?: (rows: Row[]) => ReactNode;
  canEnter?: (row: Row) => boolean;
  onEnterRequired?: {
    render: (ctx: KanbanTransitionPromptContext<Row>) => ReactNode;
  };
}

// ---------------------------------------------------------------------------
// WIP limits
// ---------------------------------------------------------------------------

export interface KanbanWipStatus {
  /** Cards counted against the limit (stageMeta.totalCount when present, else the loaded bucket size). */
  count: number;
  /** Effective limit (top-level override beats stage.wipLimit), or null when the stage has none. */
  limit: number | null;
  /** True only when count is STRICTLY greater than limit. */
  exceeded: boolean;
}

export type KanbanWipEvaluation = Record<string, KanbanWipStatus>;

export interface KanbanWipExceededEvent {
  stageId: string;
  count: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Swimlanes
// ---------------------------------------------------------------------------

export type KanbanSwimlaneBy<Row = Record<string, unknown>> =
  | string
  | ((row: Row) => string | number | boolean | null | undefined);

export type KanbanSwimlaneLabels<Row = Record<string, unknown>> =
  | Record<string, string>
  | ((laneKey: string, rows: Row[]) => ReactNode);

export interface KanbanLanePartition<Row = Record<string, unknown>> {
  /** Lane keys in render order (swimlaneOrder first — including empty explicit lanes — then first-seen). */
  laneKeys: string[];
  /** Rows per lane in original data order. Every key in laneKeys is present. */
  rowsByLane: Record<string, Row[]>;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface KanbanStageMeta {
  hasMore?: boolean;
  totalCount?: number;
  loading?: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export interface KanbanSortOption<Row = Record<string, unknown>> {
  value: string;
  label: string;
  /** Optional field metadata for consumers that derive shared table/board sort configs. */
  field?: string;
  /** Optional direction metadata for consumers that derive shared table/board sort configs. */
  direction?: "asc" | "desc";
  /** Optional display label for `field` metadata. */
  fieldLabel?: string;
  comparator: (a: Row, b: Row) => number;
}

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

export interface KanbanSelectionAction<Id = string | number> {
  label: string;
  icon?: string;
  variant?: "primary" | "secondary" | "transparent";
  onClick: (selectedIds: Id[]) => void;
}

// ---------------------------------------------------------------------------
// Render contexts
// ---------------------------------------------------------------------------

export interface KanbanCardRenderContext<Row = Record<string, unknown>> {
  stage: KanbanStage<Row>;
  isChanging: boolean;
  density: KanbanCardDensity;
  onStageChange: (newStage: string) => void;
}

export interface KanbanParams {
  search: string;
  filters: Record<string, unknown>;
  sort: string | null;
  collapsedStages: string[];
  collapsedLanes: string[];
}

export interface KanbanEmptyStateRenderContext {
  title: string;
  message: string;
}

export interface KanbanLoadingStateRenderContext {
  label: string;
}

export interface KanbanErrorStateRenderContext {
  error: string | boolean;
  title: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export interface KanbanLabels {
  search?: string;
  showMore?: (shown: number, total: number) => string;
  showLess?: string;
  loadMore?: (loaded: number, total?: number) => string;
  loadingMore?: string;
  retryLoadMore?: string;
  emptyColumn?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  loading?: string;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  cardCount?: (n: number) => string;
  /** Stage-header count when a WIP limit is set. Default "{count} / {limit}". */
  wipCount?: (count: number, limit: number) => string;
  /** Warning StatusTag text on over-limit stage headers. Default "Over WIP". */
  overWip?: string;
  laneCount?: (n: number) => string;
  /** Lane header label for rows whose swimlane value is null/undefined/"". Default "Unassigned". */
  unassignedLane?: string;
  moveTo?: string;
  clearAll?: string;
  selectAll?: string | ((count: number, label: string) => string);
  deselectAll?: string;
  selected?: (count: number, label: string) => string;
  /** Primary label for the overflow-filter toggle button. */
  filtersButton?: string;
  dateFrom?: string;
  dateTo?: string;
  sortButton?: string;
  sortAscending?: string;
  sortDescending?: string;
  metricsButton?: string;
}

export interface KanbanMetricItem {
  id?: string;
  label: string;
  number: string | number;
  trend?: {
    direction?: "increase" | "decrease";
    value: string;
    color?: "red" | "green";
  };
}

export interface KanbanSelectionBarRenderContext<Id = string | number> {
  selectedIds: Id[];
  selectedCount: number;
  displayCount: number;
  countLabel: (n: number) => string;
  allSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectionActions: KanbanSelectionAction<Id>[];
  labels: KanbanLabels;
}

// ---------------------------------------------------------------------------
// KanbanCardActions — shipped helper
// ---------------------------------------------------------------------------

export interface KanbanCardAction {
  key?: string;
  label: string;
  icon?: string;
  tooltip?: string;
  variant?: "primary" | "secondary" | "transparent";
  disabled?: boolean;
  visible?: boolean;
  onClick?: () => void;
  href?: string | { url: string; external?: boolean };
}

export interface KanbanCardActionsProps {
  actions: KanbanCardAction[];
  display?: "icon" | "label" | "iconAndLabel";
  size?: "xs" | "sm";
  align?: "start" | "end" | "between";
  gap?: string;
  separator?: "none" | "pipe";
  overflowAfter?: number;
  overflowLabel?: string;
}

export declare function KanbanCardActions(props: KanbanCardActionsProps): ReactElement | null;

// ---------------------------------------------------------------------------
// Kanban props
// ---------------------------------------------------------------------------

export interface KanbanProps<Row = Record<string, unknown>, Id = string | number> {
  // Data
  data: Row[];
  stages: KanbanStage<Row>[];
  groupBy?: string | ((row: Row) => string);
  rowIdField?: string;

  // Card rendering
  renderCard?: (row: Row, context: KanbanCardRenderContext<Row>) => ReactNode;
  cardFields?: KanbanCardField<Row>[];
  cardDensity?: KanbanCardDensity;
  cardDividers?: boolean | KanbanCardDividers;
  cardBodyAs?: KanbanCardBodyMode;
  countDisplay?: "tag" | "text" | "none";
  maxBodyLines?: number;
  maxCardsPerColumn?: number;
  maxCardsExpanded?: number;
  expandedStages?: string[];
  onExpandedStagesChange?: (stages: string[]) => void;

  // Per-stage pagination
  stageMeta?: Record<string, KanbanStageMeta>;
  onLoadMore?: (stage: string) => void;

  // WIP limits
  /** Top-level per-stage limit overrides: `{ [stageId]: n }`. Beats `stage.wipLimit`. */
  wipLimits?: Record<string, number>;
  /**
   * Fires when a stage TRANSITIONS into the exceeded state (count > limit) —
   * once per crossing, including a board that mounts already over a limit;
   * never on every render. Over-limit transitions still complete: the server
   * is the source of truth, so WIP limits are a signal, not a gate.
   */
  onWipExceeded?: (stageId: string, count: number, limit: number) => void;

  // Swimlanes
  /** Field name or accessor that groups the board vertically into lanes. */
  swimlaneBy?: KanbanSwimlaneBy<Row>;
  /** `{ key: label }` map or `(laneKey, rows) => label` function for lane headers. */
  swimlaneLabels?: KanbanSwimlaneLabels<Row>;
  /** Explicit lane order. Listed keys render first (even when empty); unlisted lanes append first-seen. */
  swimlaneOrder?: string[];
  /** Show the collapse chevron on lane headers. Default true. */
  collapseLanes?: boolean;
  /** Controlled list of collapsed lane keys. */
  collapsedLanes?: string[];
  /** Initial collapsed lane keys (uncontrolled). */
  defaultCollapsedLanes?: string[];
  onCollapsedLanesChange?: (laneKeys: string[]) => void;
  /**
   * Render the metrics panel inside each lane instead of globally. Requires
   * `metrics` to be a function — it's called per lane with `(laneRows, laneKey)`.
   */
  metricsPerLane?: boolean;

  // Selection
  selectable?: boolean;
  selectedIds?: Id[];
  onSelectionChange?: (selectedIds: Id[]) => void;
  selectionActions?: KanbanSelectionAction<Id>[];
  recordLabel?: { singular: string; plural: string };
  /** Optional key that forces uncontrolled selection memory to reset when it changes. */
  selectionResetKey?: unknown;
  /** Clears uncontrolled selection when search/filter/sort changes. Default true. */
  resetSelectionOnQueryChange?: boolean;
  /** Hide the default selection bar while keeping selection state active. */
  showSelectionBar?: boolean;
  /** Full render override for the selection bar — receives all state + handlers. */
  renderSelectionBar?: (ctx: KanbanSelectionBarRenderContext<Id>) => ReactNode;

  // Stage transitions
  stageControl?: KanbanStageControlMode;
  stageControlPlacement?: "inline" | "separateRow";
  onStageChange?: (
    row: Row,
    newStage: string,
    oldStage: string,
    result?: KanbanStageChangeResult
  ) => void | Promise<unknown>;
  isStageChanging?: (row: Row) => boolean;
  canMove?: (row: Row, toStage: string) => boolean;

  // Toolbar
  showSearch?: boolean;
  /** Search is only active, and the search input only renders, when this list is non-empty. */
  searchFields?: string[];
  searchPlaceholder?: string;
  /** ms to debounce onSearchChange callback. Default 250; 0 = no debounce. */
  searchDebounce?: number;
  /** Enable fuzzy matching via Fuse.js */
  fuzzySearch?: boolean;
  /** Custom Fuse.js options (threshold, distance, keys, etc.) */
  fuzzyOptions?: Record<string, unknown>;
  filters?: KanbanFilterConfig<Row>[];
  /** Number of filters shown inline before the "Filters" overflow button. Default 4. */
  filterInlineLimit?: number;
  /** Left toolbar column flex weight. Default 3. */
  toolbarLeftFlex?: number;
  /** Right toolbar column flex weight. Default 1. */
  toolbarRightFlex?: number;
  /** Show active filter chips with individual clear affordances. Default true. */
  showFilterBadges?: boolean;
  /** Show the "Clear all" reset button when filters are active. Defaults to `showFilterBadges` when omitted, so hiding the chips hides the clear-all button too. */
  showClearFiltersButton?: boolean;
  /** Board-wide sort options shown in the toolbar Select. */
  sortOptions?: KanbanSortOption<Row>[];
  defaultSort?: string;
  sort?: string;
  onSortChange?: (value: string) => void;

  // Column level
  columnFooter?: (rows: Row[], stage: KanbanStage<Row>) => ReactNode;
  /**
   * Pixel width for each column, passed to AutoGrid's columnWidth. Columns
   * share available horizontal space equally with this value as the minimum.
   * Clamped to 350px minimum regardless of the value passed. Default 350px.
   */
  columnWidth?: number;
  collapsedStages?: string[];
  onCollapsedStagesChange?: (stages: string[]) => void;

  // Metrics panel (toggled via the toolbar's Metrics button)
  /**
   * Array of stat items for the <Statistics> panel, a custom ReactNode, or a
   * function of the (filtered) rows. The function form receives
   * `(rows, laneKey)` — laneKey is null for the global panel and the lane key
   * when `metricsPerLane` is active.
   */
  metrics?:
    | KanbanMetricItem[]
    | ReactNode
    | ((rows: Row[], laneKey: string | null) => KanbanMetricItem[] | ReactNode);
  /** Controlled visibility of the metrics panel. */
  showMetrics?: boolean;
  /** Fires when the Metrics button is clicked. Receives the new visible state. */
  onMetricsToggle?: (visible: boolean) => void;

  // Controlled state
  searchValue?: string;
  onSearchChange?: (term: string) => void;
  filterValues?: Record<string, unknown>;
  onFilterChange?: (values: Record<string, unknown>) => void;
  /** Unified callback fired when search/filter/sort/collapsed-stage state changes. */
  onParamsChange?: (params: KanbanParams) => void;
  loading?: boolean;
  error?: string | boolean;

  // Labels
  labels?: KanbanLabels;

  /** Replace the default empty-state UI. */
  renderEmptyState?: (ctx: KanbanEmptyStateRenderContext) => ReactNode;
  /** Replace the default loading spinner UI. */
  renderLoadingState?: (ctx: KanbanLoadingStateRenderContext) => ReactNode;
  /** Replace the default top-level error UI. */
  renderErrorState?: (ctx: KanbanErrorStateRenderContext) => ReactNode;
}

export declare function Kanban<Row = Record<string, unknown>, Id = string | number>(
  props: KanbanProps<Row, Id>
): ReactElement | null;

// ---------------------------------------------------------------------------
// Pure lane / WIP helpers (from kanbanLanes.js) — usable outside the component,
// e.g. to evaluate WIP server-side or render custom lane summaries.
// ---------------------------------------------------------------------------

/** Lane key used for rows whose swimlane value is null/undefined/"". */
export declare const UNASSIGNED_LANE_KEY: "__unassigned";

/** Resolve the swimlane key for a row (String-coerced; empty values map to UNASSIGNED_LANE_KEY). */
export declare function getLaneKey<Row = Record<string, unknown>>(
  row: Row,
  swimlaneBy: KanbanSwimlaneBy<Row>
): string;

/** Order lane keys: explicit swimlaneOrder first (deduped, kept even when empty), then first-seen. */
export declare function orderLaneKeys(seenKeys: string[], swimlaneOrder?: string[]): string[];

/** Partition rows into swimlanes — render order plus rows per lane. */
export declare function partitionLanes<Row = Record<string, unknown>>(
  rows: Row[],
  options?: { swimlaneBy?: KanbanSwimlaneBy<Row>; swimlaneOrder?: string[] }
): KanbanLanePartition<Row>;

/** Resolve a lane's display label from a map or function, with unassigned/key fallbacks. */
export declare function resolveLaneLabel<Row = Record<string, unknown>>(
  laneKey: string,
  swimlaneLabels?: KanbanSwimlaneLabels<Row>,
  rows?: Row[],
  unassignedLabel?: string
): ReactNode;

/** Effective WIP limit for a stage (wipLimits override beats stage.wipLimit; invalid → null). */
export declare function resolveWipLimit<Row = Record<string, unknown>>(
  stage: KanbanStage<Row>,
  wipLimits?: Record<string, number>
): number | null;

/** Per-stage counts for WIP evaluation (stageMeta.totalCount when present, else bucket length). */
export declare function computeStageCounts<Row = Record<string, unknown>>(
  stages: KanbanStage<Row>[],
  buckets: Record<string, Row[]>,
  stageMeta?: Record<string, KanbanStageMeta>
): Record<string, number>;

/** Evaluate `{ count, limit, exceeded }` for every stage. */
export declare function evaluateWip<Row = Record<string, unknown>>(
  stages: KanbanStage<Row>[],
  counts: Record<string, number>,
  wipLimits?: Record<string, number>
): KanbanWipEvaluation;

/** Diff two evaluations; returns stages that newly crossed into exceeded (the onWipExceeded contract). */
export declare function findNewlyExceededWip(
  prev: KanbanWipEvaluation | null | undefined,
  next: KanbanWipEvaluation
): KanbanWipExceededEvent[];
