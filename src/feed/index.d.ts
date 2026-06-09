import type { ReactNode } from "react";

export type FeedPlacement = "title" | "subtitle" | "meta" | "body" | "footer";
export type FeedFieldType = "text" | "tag" | "status";
export type FeedContainer = "none" | "tile" | "card";
export type FeedFilterType = "select" | "multiselect" | "dateRange";
export type FeedSortDirection = "asc" | "desc" | "ascending" | "descending";
export type FeedStatusVariant = "default" | "info" | "success" | "warning" | "danger";
export type FeedTagVariant = "default" | "info" | "success" | "warning" | "error";
export type FeedNewItemsBehavior = "immediate" | "pill";

export interface FeedOption<T = string | number | boolean> {
  label: string;
  value: T;
}

export interface FeedDateValue {
  year: number;
  month: number;
  date: number;
  formattedDate?: string;
}

export interface FeedDateRangeValue {
  from?: FeedDateValue | Date | string | null;
  to?: FeedDateValue | Date | string | null;
}

export interface FeedAction {
  key?: string;
  label: string;
  icon?: string;
  size?: "sm" | "small" | "md" | "medium";
  variant?: "primary" | "secondary" | "destructive" | "transparent";
  disabled?: boolean;
  href?: string | { url: string; external?: boolean };
  onClick?: (...args: unknown[]) => void;
}

export interface FeedActor {
  name?: ReactNode;
  label?: ReactNode;
  email?: ReactNode;
  avatar?: string;
  avatarUrl?: string;
  src?: string;
  initials?: string;
  href?: string | { url: string; external?: boolean };
}

export interface FeedItem {
  id?: string | number;
  key?: string | number;
  type?: string;
  typeLabel?: ReactNode;
  typeVariant?: FeedStatusVariant;
  title?: ReactNode;
  subject?: ReactNode;
  subtitle?: ReactNode;
  body?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  preview?: ReactNode;
  notePreview?: ReactNode;
  timestamp?: ReactNode;
  time?: ReactNode;
  date?: ReactNode;
  dateLabel?: ReactNode;
  createdAt?: ReactNode;
  actor?: ReactNode | FeedActor;
  actorName?: ReactNode;
  author?: ReactNode | FeedActor;
  avatar?: string;
  avatarAlt?: string;
  avatarSize?: string | number;
  icon?: ReactNode | string;
  iconName?: string;
  /** Icon color: native enum (`alert`/`warning`/`success`/`inherit`) or any CSS color (renders via the SVG fallback). */
  iconColor?: string;
  href?: string | { url: string; external?: boolean };
  meta?: ReactNode | ReactNode[];
  metadata?: ReactNode | ReactNode[];
  actions?: ReactNode | FeedAction[];
  footer?: ReactNode;
  [key: string]: unknown;
}

export interface FeedField<Row = FeedItem> {
  key?: string;
  field?: string | ((item: Row) => unknown);
  label?: string;
  placement?: FeedPlacement;
  type?: FeedFieldType;
  variant?: FeedTagVariant | FeedStatusVariant | ((value: unknown, item: Row) => string);
  href?: string | { url: string; external?: boolean } | ((item: Row) => string | { url: string; external?: boolean });
  visible?: (item: Row) => boolean;
  render?: (value: unknown, item: Row, index: number) => ReactNode;
}

export interface FeedFilterConfig<Row = FeedItem> {
  name: string;
  field?: string | ((item: Row) => unknown);
  type?: FeedFilterType;
  label?: string;
  placeholder?: string;
  variant?: "transparent" | "input";
  options?: FeedOption[];
  defaultValue?: unknown;
  includeAll?: boolean;
  allValue?: unknown;
  emptyValue?: unknown;
  allLabel?: string;
  chipLabel?: string;
  fromLabel?: string;
  toLabel?: string;
  filterFn?: (item: Row, value: unknown) => boolean;
}

export interface FeedSortOption<Row = FeedItem> {
  value: string;
  label: string;
  field?: string | ((item: Row) => unknown);
  direction?: FeedSortDirection;
  comparator?: (a: Row, b: Row) => number;
}

export interface FeedLabels {
  search?: string;
  sort?: string;
  sortButton?: string;
  filtersButton?: string;
  all?: string;
  clearAll?: string;
  dateFrom?: string;
  dateTo?: string;
  loading?: string;
  loadingMessage?: string;
  loadingMore?: string;
  loadMore?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  collapseAll?: string;
  expandAll?: string;
  errorTitle?: string;
  errorMessage?: string;
  itemCount?: (shown: number, total: number, label: string) => string;
  /** "Show N new items" pill label (string or count-aware function). */
  newItems?: string | ((count: number) => string);
  /** Text inside the info Tag marking recently arrived items. */
  newItemTag?: string;
}

export interface FeedTabOption<T = string | number | boolean> {
  label: string;
  value: T;
  disabled?: boolean;
  tooltip?: string;
}

export interface FeedParams {
  tab?: string | number | boolean | null;
  search: string;
  filters: Record<string, unknown>;
  sort: string | null;
}

export interface FeedToolbarRenderContext {
  tab?: string | number | boolean | null;
  tabs?: FeedTabOption[];
  search: string;
  filters: Record<string, unknown>;
  sort: string | null;
  activeChips?: Array<{ key: string; label: ReactNode }>;
  totalCount: number;
  visibleCount: number;
  onTabChange: (value: string | number | boolean | null) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (name: string, value: unknown) => void;
  onFilterRemove: (key: string) => void;
  onSortChange: (value: string | null) => void;
}

export interface FeedEmptyStateRenderContext {
  title: string;
  message: string;
}

export interface FeedLoadingStateRenderContext {
  label: string;
}

export interface FeedErrorStateRenderContext {
  error: string | boolean;
  title: string;
  message: string;
}

export interface FeedRecordLabel {
  singular?: string;
  plural?: string;
}

export interface FeedTypePreset {
  /** Native HubSpot icon name (verified against the native whitelist for the built-in presets). */
  icon?: string;
  /** Icon color: native enum (`alert`/`warning`/`success`/`inherit`) or any CSS color. */
  color?: string;
  /** Display label used as `typeLabel` when the item has none. */
  label?: ReactNode;
  /** StatusTag variant applied when the item has no status variant of its own. */
  statusVariant?: FeedStatusVariant;
}

export type FeedTypePresets = Record<string, FeedTypePreset>;

/**
 * Built-in presets for HubSpot's standard activity types (`call`, `email`,
 * `incoming_email`, `forwarded_email`, `meeting`, `note`, `task`, `sms`,
 * `whatsapp`, `linkedin_message`, `postal_mail`, `conversation`).
 */
export declare const DEFAULT_FEED_TYPE_PRESETS: FeedTypePresets;

/** Resolve the preset for a type value (exact, lowercase, then snake_case lookup). */
export declare function lookupTypePreset(
  type: unknown,
  presets?: FeedTypePresets | null
): FeedTypePreset | null;

/** Merge a type preset UNDER an item (item-level values win). Returns the same reference when nothing changes. */
export declare function applyTypePreset<Row = FeedItem>(
  item: Row,
  typePresets?: FeedTypePresets | null
): Row;

export interface FeedPartitionOptions<Row = FeedItem> {
  /** Ids already rendered — updates to these never buffer. */
  knownIds?: Set<string | number> | null;
  /** Id accessor; defaults to `item.id ?? item.key ?? index`. */
  getId?: (item: Row, index: number) => string | number | undefined;
}

export interface FeedPartitionResult<Row = FeedItem> {
  visible: Row[];
  buffered: Row[];
  visibleIds: Array<string | number | undefined>;
  bufferedIds: Array<string | number | undefined>;
  /** New monotonic watermark over VISIBLE items only (epoch ms), or null. */
  newestTs: number | null;
}

/** Pure live-buffer kernel: split items into visible vs newer-than-watermark buffered. */
export declare function partitionNewItems<Row = FeedItem>(
  prevNewestTs: number | null | undefined,
  items: Row[] | null | undefined,
  getTs: (item: Row) => unknown,
  options?: FeedPartitionOptions<Row>
): FeedPartitionResult<Row>;

export interface FeedFlushResult<Row = FeedItem> {
  /** Buffered items first, then the previously visible items. */
  items: Row[];
  flushed: Row[];
  /** New watermark across ALL merged items (epoch ms), or null. */
  newestTs: number | null;
}

/** Pure flush: merge the buffer into the visible list and compute the new watermark. */
export declare function flushBuffer<Row = FeedItem>(
  visible: Row[] | null | undefined,
  buffered: Row[] | null | undefined,
  getTs: (item: Row) => unknown
): FeedFlushResult<Row>;

/** Coerce Date | epoch number | parseable string | { year, month, date } to epoch ms (or null). */
export declare function toTimestampMs(value: unknown): number | null;

export interface FeedProps<Row = FeedItem> {
  items?: Row[];
  fields?: FeedField<Row>[];
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  error?: string | boolean | null;
  labels?: FeedLabels;
  renderItem?: (item: Row, index: number) => ReactNode;
  renderActor?: (item: Row, index: number) => ReactNode;
  renderTimestamp?: (item: Row, index: number) => ReactNode;
  renderMeta?: (item: Row, index: number) => ReactNode;
  renderActions?: (item: Row, index: number) => ReactNode;
  renderFooter?: (item: Row, index: number) => ReactNode;
  renderToolbar?: (ctx: FeedToolbarRenderContext) => ReactNode;
  renderEmptyState?: (ctx: FeedEmptyStateRenderContext) => ReactNode;
  renderLoadingState?: (ctx: FeedLoadingStateRenderContext) => ReactNode;
  renderErrorState?: (ctx: FeedErrorStateRenderContext) => ReactNode;
  getKey?: (item: Row, index: number) => string | number;
  groupBy?: string | ((item: Row) => unknown);
  groupByDate?: boolean;
  getGroupLabel?: (groupValue: unknown, firstItem: Row) => ReactNode;
  bordered?: boolean;
  container?: FeedContainer;
  showDividers?: boolean;
  itemContainer?: FeedContainer;
  compact?: boolean;
  gap?: string;
  avatarSize?: string | number;
  iconSize?: "sm" | "small" | "md" | "medium" | "lg" | "large";
  tabs?: FeedTabOption[];
  showTabs?: boolean;
  tabField?: string | ((item: Row) => unknown);
  tabVariant?: "default" | "enclosed";
  tabValue?: string | number | boolean | null;
  defaultTab?: string | number | boolean | null;
  onTabChange?: (value: string | number | boolean | null) => void;
  searchFields?: Array<string | ((item: Row) => unknown)>;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FeedFilterConfig<Row>[];
  filterValues?: Record<string, unknown>;
  defaultFilterValues?: Record<string, unknown>;
  onFilterChange?: (values: Record<string, unknown>) => void;
  sortOptions?: FeedSortOption<Row>[];
  sort?: string | null;
  defaultSort?: string | null;
  onSortChange?: (value: string | null) => void;
  onParamsChange?: (params: FeedParams) => void;
  serverSide?: boolean;
  showToolbar?: boolean;
  /**
   * When the toolbar has no left-side controls (search / filters), float its
   * right-side controls (sort + item count) onto the first date-group header
   * row instead of a standalone row above it. "auto" (default) applies this
   * only when grouping is active; `true` forces it, `false` disables it.
   */
  alignToolbarWithGroups?: boolean | "auto";
  filterInlineLimit?: number;
  toolbarLeftFlex?: number;
  toolbarRightFlex?: number;
  showFilterBadges?: boolean;
  showClearFiltersButton?: boolean;
  showItemCount?: boolean;
  itemCountText?: (shown: number, total: number) => string;
  recordLabel?: FeedRecordLabel;
  pageSize?: number;
  initialItemCount?: number;
  maxItems?: number;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: (...args: unknown[]) => void;
  collapsible?: boolean | "auto";
  defaultCollapsed?: "all" | "none" | (string | number)[];
  collapsedIds?: (string | number)[];
  onCollapsedIdsChange?: (next: (string | number)[]) => void;
  showCollapseToggle?: boolean;
  /**
   * Real-time append behavior for items that arrive NEWER than the
   * previously-newest visible timestamp. "immediate" (default) renders them
   * right away; "pill" holds them in a buffer behind a centered
   * "Show N new items" Button until clicked. Updates to already-visible items
   * (matched by key) are never buffered.
   */
  newItemsBehavior?: FeedNewItemsBehavior;
  /** Called with the released items when the "Show N new items" pill is clicked. */
  onNewItemsFlush?: (items: Row[]) => void;
  /**
   * Window in ms during which flushed/freshly-prepended items carry an info
   * Tag "New" marker. `false` (default) disables the marker. The initial load
   * is never marked.
   */
  highlightNew?: number | false;
  /**
   * Per-type display defaults merged UNDER item values (item wins):
   * `{ [type]: { icon, color, label, statusVariant } }`. Pass `true` to use
   * DEFAULT_FEED_TYPE_PRESETS. Lookup by `item.type` is case-insensitive.
   */
  typePresets?: FeedTypePresets | boolean | null;
}

export declare function Feed<Row = FeedItem>(props: FeedProps<Row>): ReactNode;
