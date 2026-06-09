import type { ReactElement, ReactNode } from "react";
import type { DataTableProps } from "../datatable/index";
import type {
  ActiveFilterChipsProps,
  AutoStatusTagProps,
  AutoTagProps,
  AvatarStackProps,
  CollectionCountProps,
  CollectionFilterControlProps,
  CollectionSortSelectProps,
  CollectionToolbarProps,
  CrmLookupSelectProps,
  CrmRecordPickerCreateOptionRules,
  CrmRecordPickerId,
  CrmRecordPickerOption,
  CrmRecordPickerOptionConfig,
  CrmRecordPickerProps,
  CrmRecordPickerRecord,
  CrmRecordPickerSelection,
  CrmRecordPickerValue,
  FormatCollectionCountParams,
  KeyValueListProps,
  SectionHeaderProps,
  StyledTextFormat,
  StyledTextProps,
} from "../../common-components";

export * from "../wizard/index";

export interface ExperimentalDataTableRowExpansionProps<
  Row = Record<string, unknown>,
  Id = string | number
> {
  /** Enables expandable detail rows. Content renders in a full-span row directly under the data row. */
  renderExpandedRow?: (row: Row) => ReactNode;
  /** Controlled expansion state — array of expanded row IDs. */
  expandedRowIds?: Id[];
  /** Uncontrolled initial expansion state. */
  defaultExpandedRowIds?: Id[];
  /** Called with the next expanded id array on every toggle. */
  onExpandedRowsChange?: (expandedRowIds: Id[]) => void;
  /** "icon" adds a chevron column; "row" toggles through cell content links. */
  expandOn?: "icon" | "row";
  /** Accordion mode — expanding a row collapses the others. */
  expandSingle?: boolean;
}

export type ExperimentalDataTableProps<
  Row = Record<string, unknown>,
  Id = string | number
> = DataTableProps<Row, Id> & ExperimentalDataTableRowExpansionProps<Row, Id>;

export declare function DataTable<
  Row = Record<string, unknown>,
  Id = string | number
>(props: ExperimentalDataTableProps<Row, Id>): ReactElement | null;

export { DataTable as ExperimentalDataTable };

// ---------------------------------------------------------------------------
// Skeleton loading placeholders (experimental)
// ---------------------------------------------------------------------------

export type SkeletonShape =
  | "table"
  | "board"
  | "list"
  | "form"
  | "keyvalue"
  | "stats"
  | "input"
  | "chip"
  | "block";

export type SkeletonVariant = "text" | "box" | "circle" | SkeletonShape;

/** Pixel number or a width token: sm = 120, md = 240, lg = 360. */
export type SkeletonWidth = number | "sm" | "md" | "lg";

export interface SkeletonDataUriOptions {
  variant?: "text" | "box" | "circle";
  width?: SkeletonWidth;
  /** Per-line height for "text" (default 12), block height for "box" (default 96), diameter for "circle" (default 40). */
  height?: number;
  /** "text" only: number of stacked lines. Default 1. */
  lines?: number;
  /** "text" only: final-line width when lines > 1. (0, 1] = fraction of width; > 1 = px; tokens allowed. Default 0.6. */
  lastLineWidth?: SkeletonWidth;
  /** "text" only: px between lines. Default 8. */
  gap?: number;
  /** Corner radius px (ignored for "circle"). Default 3. */
  radius?: number;
  /** "box" only: split the block into N equal cells. Default 1. */
  columns?: number;
  /** "box" only: px between cells. Default 16. */
  columnGap?: number;
  /** Placeholder color. Default SKELETON_FILL. */
  fill?: string;
}

export interface SkeletonDataUriResult {
  src: string;
  width: number;
  height: number;
}

export interface SkeletonProps extends Omit<SkeletonDataUriOptions, "variant"> {
  /** Static shape, or the override for the inferred shape in wrapper mode. */
  variant?: SkeletonVariant;
  /** Wrapper mode: while true, children are replaced by shape-matched placeholders. Default false. */
  loading?: boolean;
  /** Wrapper mode: your own placeholder node(s); skips auto-inference. */
  skeleton?: ReactNode;
  /** Wrapper mode: content gated by `loading`. */
  children?: ReactNode;
  /** Composite shapes: row count. */
  rows?: number;
  /** Accessible label on the underlying <Image>. Default "Loading". */
  alt?: string;
  [imageProp: string]: unknown;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, "variant"> {
  /** Default 3. */
  lines?: number;
  /** Default "md" (240). */
  width?: SkeletonWidth;
}

export interface SkeletonBoxProps extends Omit<SkeletonProps, "variant"> {
  /** Default "md" (240). */
  width?: SkeletonWidth;
  /** Default 96. */
  height?: number;
}

export interface SkeletonCircleProps
  extends Omit<SkeletonProps, "variant" | "width" | "height"> {
  /** Diameter px. Default 40. */
  size?: number;
}

export interface SkeletonTableProps {
  /** Default 4. */
  rows?: number;
  /** Cells per row. Default 3. */
  columns?: number;
  /** Total row width: px or token. Default "lg" (360). */
  width?: SkeletonWidth;
  /** Px height of each row's cells. Default 16. */
  rowHeight?: number;
  /** Px between cells within a row. Default 16. */
  columnGap?: number;
  /** Flex gap token between rows. Default "sm". */
  gap?: string;
  /** Cell corner radius px. Default 3. */
  radius?: number;
  fill?: string;
  /** Accessible label applied to each row image. Default "Loading table". */
  alt?: string;
  [flexProp: string]: unknown;
}

export type SpinnerName =
  | "braille"
  | "braillewave"
  | "dna"
  | "scan"
  | "rain"
  | "scanline"
  | "pulse"
  | "snake"
  | "sparkle"
  | "cascade"
  | "columns"
  | "orbit"
  | "breathe"
  | "waverows"
  | "checkerboard"
  | "helix"
  | "fillsweep"
  | "diagswipe";

export interface SpinnerPreset {
  frames: readonly string[];
  interval: number;
}

export interface SpinnerProps {
  name?: SpinnerName | string;
  frames?: readonly string[];
  interval?: number;
  label?: ReactNode;
  children?: ReactNode;
  paused?: boolean;
  gap?: string;
  variant?: "bodytext" | "microcopy";
  format?: StyledTextFormat;
  inline?: boolean;
  truncate?: boolean | { tooltipText?: string };
}

export type IconSize =
  | number
  | "xs"
  | "extra-small"
  | "sm"
  | "small"
  | "md"
  | "med"
  | "medium"
  | "lg"
  | "large"
  | "xl"
  | "extra-large";

export interface IconPathObject {
  d: string;
  fill?: string;
  fillRule?: "nonzero" | "evenodd";
}

export type IconPath = string | IconPathObject;

export interface IconEntry {
  /** Defaults to "0 0 24 24" when omitted. */
  viewBox?: string;
  paths: IconPath[];
  /** Optional transform applied to all paths (e.g. a mirror/rotation). */
  transform?: string;
}

export interface IconProps {
  /** A registered glyph name (native or custom). Unknown names render nothing. */
  name: string;
  /** A semantic token ("inherit" | "alert" | "warning" | "success") or any CSS color. */
  color?: string;
  size?: IconSize;
  /** Accessible label for screen readers. */
  screenReaderText?: string;
  /** Passed through to native HubSpot Icon when possible; fallback Image also receives it. */
  onClick?: (...args: unknown[]) => void;
  /** Passed through to native HubSpot Icon when possible; fallback Image also receives it. */
  href?: string | { url: string; external?: boolean };
}

export interface IconDataUriResult {
  src: string;
  width: number;
  height: number;
}

export interface IconDataUriOptions {
  size?: IconSize;
  color?: string;
}

export declare function Icon(props: IconProps): ReactNode;
/** Custom glyph names registered in this library (excludes native names). */
export declare const ICON_NAMES: string[];
/** The custom glyph registry, keyed by icon name. */
export declare const ICONS: Record<string, IconEntry>;
/** The native `@hubspot/ui-extensions` `<Icon>` name whitelist, sorted. */
export declare const NATIVE_ICON_NAME_LIST: string[];
/** Build an SVG data URI from a registered name or an inline entry. Null for unknown names. */
export declare function makeIconDataUri(
  nameOrEntry: string | IconEntry,
  options?: IconDataUriOptions
): IconDataUriResult | null;
/** Parse a raw `<svg>` string into a registry entry (drops mask/defs, keeps per-path fills). */
export declare function svgToIconEntry(raw: string): IconEntry;

export declare function AutoTag(props: AutoTagProps): ReactNode;
export declare function AutoStatusTag(props: AutoStatusTagProps): ReactNode;
export declare function ActiveFilterChips(props: ActiveFilterChipsProps): ReactNode;
export declare function CollectionCount(props: CollectionCountProps): ReactNode;
export declare function formatCollectionCount(params: FormatCollectionCountParams): ReactNode;
export declare function CollectionFilterControl(props: CollectionFilterControlProps): ReactNode;
export declare function CollectionSortSelect(props: CollectionSortSelectProps): ReactNode;
export declare function CollectionToolbar(props: CollectionToolbarProps): ReactNode;
export declare function SectionHeader(props: SectionHeaderProps): ReactNode;
export declare function KeyValueList(props: KeyValueListProps): ReactNode;
export declare function AvatarStack(props: AvatarStackProps): ReactNode;
export declare function CrmLookupSelect(props: CrmLookupSelectProps): ReactNode;
export declare function CrmRecordPicker(props: CrmRecordPickerProps): ReactNode;

/** Sentinel option value for CrmRecordPicker's inline "Create" option. */
export declare const CREATE_OPTION_VALUE: "__create__";
/** True when the value looks like a record object (vs a scalar id). */
export declare function isRecordLike(value: unknown): boolean;
/** Extract a record's id (objectId | id | hs_object_id | properties.hs_object_id). */
export declare function getRecordId(record: unknown): CrmRecordPickerId | undefined;
/** Normalize a picker value (ids and/or records, scalar or array) to { ids, records }. */
export declare function normalizeRecordSelection(
  value: CrmRecordPickerValue | null | undefined
): CrmRecordPickerSelection;
/** Map a record to a { label, value, description? } option. */
export declare function recordToPickerOption(
  record: CrmRecordPickerRecord,
  config?: CrmRecordPickerOptionConfig
): CrmRecordPickerOption;
/** Merge search-page options with selected options so selections stay visible. */
export declare function mergePickerOptions(
  options: CrmRecordPickerOption[],
  selectedOptions?: CrmRecordPickerOption | CrmRecordPickerOption[] | null
): CrmRecordPickerOption[];
/** Trim a selection to its first `max` ids (rejects picks beyond the cap). */
export declare function enforceSelectionMax(
  ids: CrmRecordPickerId[] | CrmRecordPickerId | null | undefined,
  max?: number
): CrmRecordPickerId[];
/** Injection rules for the inline create option. */
export declare function shouldShowCreateOption(
  rules?: CrmRecordPickerCreateOptionRules
): boolean;
/** Build the `Create "<term>"` option for a search term. */
export declare function makeCreateOption(
  term: string,
  label?: string | ((term: string) => string)
): CrmRecordPickerOption;
/** Split an onChange payload into real ids + whether the create sentinel was chosen. */
export declare function splitCreateSelection(
  next: CrmRecordPickerId[] | CrmRecordPickerId | null | undefined
): { ids: CrmRecordPickerId[]; create: boolean };
/** Map ids back to records via a Map/object registry; unknown ids become { objectId } stubs. */
export declare function mapIdsToRecords(
  ids: CrmRecordPickerId[] | CrmRecordPickerId | null | undefined,
  recordsById?: Map<CrmRecordPickerId, CrmRecordPickerRecord> | Record<string, CrmRecordPickerRecord>
): CrmRecordPickerRecord[];
/** Upsert records into a list deduped by record id (later wins). */
export declare function upsertRecords(
  records: CrmRecordPickerRecord[] | null | undefined,
  additions: CrmRecordPickerRecord | CrmRecordPickerRecord[] | null | undefined
): CrmRecordPickerRecord[];
export declare function StyledText(props: StyledTextProps): ReactNode;
export declare function Skeleton(props: SkeletonProps): ReactNode;
export declare function SkeletonText(props: SkeletonTextProps): ReactNode;
export declare function SkeletonBox(props: SkeletonBoxProps): ReactNode;
export declare function SkeletonCircle(props: SkeletonCircleProps): ReactNode;
export declare function SkeletonTable(props: SkeletonTableProps): ReactNode;
/** Build the SVG data URI + intrinsic dimensions for a skeleton placeholder. */
export declare function makeSkeletonDataUri(
  options?: SkeletonDataUriOptions
): SkeletonDataUriResult;
/** Width tokens accepted anywhere a skeleton takes a `width` (sm/md/lg → px). */
export declare const SKELETON_WIDTH_TOKENS: { sm: number; md: number; lg: number };
