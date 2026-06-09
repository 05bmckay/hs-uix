import type { ComponentType, ReactNode } from "react";
import type { DataTableProps } from "../datatable/index";
import type { KanbanProps } from "../kanban/index";
import type { FormBuilderProps } from "../form/index";
import type { FeedItem, FeedProps } from "../feed/index";
import type { CalendarProps } from "../calendar/index";
import type { AvatarStackProps, KeyValueListProps } from "../../common-components";
import type { CrmDataTableProps, CrmKanbanProps } from "../../utils";

// ---------------------------------------------------------------------------
// Catalogs
// ---------------------------------------------------------------------------

/** The native <Icon> `name` whitelist. */
export declare const NATIVE_ICON_NAMES: ReadonlySet<string>;
/** Common icon-name mistakes → the nearest valid native name. */
export declare const ICON_NAME_ALIASES: Readonly<Record<string, string>>;
/** Valid EmptyState `imageName` values. */
export declare const EMPTY_STATE_IMAGES: ReadonlySet<string>;
/** Common imageName mistakes → a valid value. */
export declare const EMPTY_STATE_IMAGE_ALIASES: Readonly<Record<string, string>>;
/** Valid StatisticsTrend `direction` values ("increase" | "decrease"). */
export declare const TREND_DIRECTIONS: ReadonlySet<string>;
/** Common direction mistakes ("increasing", "up", …) → a valid value. */
export declare const TREND_DIRECTION_ALIASES: Readonly<Record<string, string>>;
/** Required collection props per component name, as used by the Safe* exports. */
export declare const SAFE_ARRAY_PROPS: Readonly<Record<string, readonly string[]>>;

// ---------------------------------------------------------------------------
// Warning dedup
// ---------------------------------------------------------------------------

/** console.warn `message` the first time `key` is seen; no-op after that. */
export declare function warnOnce(key: string, message: string): void;
/** Clear the warn-once memory — for tests or long-lived sessions. */
export declare function resetSafeWarnings(): void;

// ---------------------------------------------------------------------------
// Generic hardening wrapper
// ---------------------------------------------------------------------------

/**
 * Wrap any component so the listed props are always arrays: null/undefined
 * coerce to [] silently, any other non-array coerces to [] with a one-time
 * console.warn. Returns a drop-in with displayName `Safe<componentName>`.
 */
export declare function withSafeArrayProps<Props extends object>(
  Component: ComponentType<Props>,
  componentName: string,
  propNames: ReadonlyArray<string>
): ComponentType<Props>;

// ---------------------------------------------------------------------------
// Hardened native components (drop-ins for @hubspot/ui-extensions)
// ---------------------------------------------------------------------------

export interface SafeIconProps {
  /** Native icon name. Known aliases auto-repair; anything else renders an alert-colored xCircle placeholder. */
  name: string;
  color?: "alert" | "warning" | "success" | "inherit";
  size?: "sm" | "small" | "md" | "medium" | "lg" | "large";
  screenReaderText?: string;
  [prop: string]: unknown;
}

export interface SafeEmptyStateProps {
  /** Invalid values fall back to a known alias or "components" instead of throwing. */
  imageName?: string;
  children?: ReactNode;
  [prop: string]: unknown;
}

export interface SafeStatisticsTrendProps {
  /** "increase" | "decrease"; aliases like "increasing"/"up" auto-repair, anything else defaults to "increase". */
  direction?: "increase" | "decrease" | (string & {});
  value?: string;
  [prop: string]: unknown;
}

export interface SafePopoverProps {
  /** Wrapped in a compact <Tile> so content gets default padding. */
  children?: ReactNode;
  [prop: string]: unknown;
}

export interface SafeOptionsProps {
  /** Coerced to [] when missing or non-array. */
  options?: Array<Record<string, unknown>> | null;
  [prop: string]: unknown;
}

export interface SafeStepIndicatorProps {
  /** Coerced to [] when missing or non-array. */
  stepNames?: string[] | null;
  [prop: string]: unknown;
}

export declare const SafeIcon: ComponentType<SafeIconProps>;
export declare const SafeEmptyState: ComponentType<SafeEmptyStateProps>;
export declare const SafeStatisticsTrend: ComponentType<SafeStatisticsTrendProps>;
export declare const SafePopover: ComponentType<SafePopoverProps>;
export declare const SafeSelect: ComponentType<SafeOptionsProps>;
export declare const SafeMultiSelect: ComponentType<SafeOptionsProps>;
export declare const SafeToggleGroup: ComponentType<SafeOptionsProps>;
export declare const SafeStepIndicator: ComponentType<SafeStepIndicatorProps>;

// ---------------------------------------------------------------------------
// Hardened hs-uix components (same props as the originals; their required
// array props additionally accept null/undefined and degrade to empty)
// ---------------------------------------------------------------------------

export declare function SafeDataTable<Row = Record<string, unknown>>(
  props: DataTableProps<Row>
): ReactNode;
export declare function SafeKanban<Row = Record<string, unknown>, Id = string | number>(
  props: KanbanProps<Row, Id>
): ReactNode;
export declare const SafeFormBuilder: ComponentType<FormBuilderProps>;
export declare function SafeFeed<Row = FeedItem>(props: FeedProps<Row>): ReactNode;
export declare function SafeCalendar<Event = Record<string, unknown>>(
  props: CalendarProps<Event>
): ReactNode;
export declare const SafeAvatarStack: ComponentType<AvatarStackProps>;
export declare const SafeKeyValueList: ComponentType<KeyValueListProps>;
export declare function SafeCrmDataTable<Row = Record<string, unknown>>(
  props: CrmDataTableProps<Row>
): ReactNode;
export declare function SafeCrmKanban<Row = Record<string, unknown>>(
  props: CrmKanbanProps<Row>
): ReactNode;
