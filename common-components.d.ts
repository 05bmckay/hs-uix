import type { ReactNode } from "react";
import type { BuiltOption } from "./utils";
import type {
  AutoTagOptions,
  AutoTagVariant,
  AutoStatusTagOptions,
  AutoStatusTagVariant,
} from "./utils";

export interface AutoTagProps extends AutoTagOptions {
  value?: unknown;
  tag?: unknown;
  children?: ReactNode;
  variant?: AutoTagVariant;
  onClick?: () => void;
  onDelete?: () => void;
  overlay?: unknown;
  inline?: boolean;
}

export interface AutoStatusTagProps extends AutoStatusTagOptions {
  value?: unknown;
  status?: unknown;
  children?: ReactNode;
  variant?: AutoStatusTagVariant;
  hollow?: boolean;
  onClick?: () => void;
  showRemoveIcon?: boolean;
  onRemoveClick?: () => void;
}

export interface SectionHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  gap?: string;
  titleAs?: string;
}

export interface KeyValueListItem {
  key?: string | number;
  label: ReactNode;
  value: ReactNode;
}

export interface KeyValueListProps {
  items?: KeyValueListItem[];
  direction?: "row" | "column";
  gap?: string;
}

export interface DatePresetOption {
  label: string;
  value: string;
}

export interface DateDirectionLabels {
  asc: string;
  desc: string;
}

/** HubSpot DateInput value object — `month` is 0-indexed (0 = January). */
export interface DateRangePickerDateValue {
  year: number;
  month: number;
  date: number;
}

/** The `dateRange` filter value shape shared with DataTable/Kanban/Feed/Calendar. */
export interface DateRangePickerValue {
  from?: DateRangePickerDateValue | null;
  to?: DateRangePickerDateValue | null;
}

export interface DateRangePickerPresetOption {
  label: string;
  /** A preset key understood by presetToRange, or any key when getRange is given. */
  value: string;
  /** Fully custom preset: compute the range yourself from `now`. */
  getRange?: (now: Date) => DateRangePickerValue;
}

export interface DateRangePickerChangeMeta {
  /** The preset key that produced the range, or null for manual edits / clear. */
  preset: string | null;
}

export interface DateRangePickerProps {
  /** Controlled range. Either side may be null for an open-ended range. */
  value?: DateRangePickerValue;
  /** Initial range for uncontrolled usage. */
  defaultValue?: DateRangePickerValue;
  /** Fires ONLY with valid ranges (from <= to, or a side null). */
  onChange?: (range: DateRangePickerValue, meta: DateRangePickerChangeMeta) => void;
  /** Optional group label rendered above the control. */
  label?: ReactNode;
  /** Base for inner input names (`${name}-from`, `${name}-to`, `${name}-preset`). */
  name?: string;
  /** true = HS_DATE_PRESETS Select, false = none, or a custom preset array. */
  presets?: boolean | DateRangePickerPresetOption[];
  direction?: "row" | "column";
  /** Show a Clear link when the range is non-empty. */
  clearable?: boolean;
  min?: DateRangePickerDateValue;
  max?: DateRangePickerDateValue;
  fromLabel?: string;
  toLabel?: string;
  /** DateInput display format. Default "medium". */
  format?: "short" | "long" | "medium" | "standard" | "YYYY-MM-DD" | "L" | "LL" | "ll";
  presetPlaceholder?: string;
  customPresetLabel?: string;
  clearLabel?: ReactNode;
  invalidRangeMessage?: string;
  readOnly?: boolean;
  gap?: string;
}

export interface AvatarStackItemObject {
  letter?: string;
  color?: string;
  src?: string;
}

export type AvatarStackItem = string | AvatarStackItemObject;

export interface AvatarStackDataUriResult {
  src: string;
  width: number;
  height: number;
  count: number;
}

export interface AvatarStackProps {
  items?: AvatarStackItem[] | null;
  size?:
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
  overlap?: number;
  step?: number;
  maxVisible?: number;
  colors?: string[];
  overflowBg?: string;
  overflowColor?: string;
  fontFamily?: string;
  alt?: string;
}

export interface CollectionFilterConfig {
  name: string;
  type?: "select" | "multiselect" | "dateRange" | string;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: ReactNode; value: unknown }>;
  includeAll?: boolean;
  allValue?: unknown;
  emptyValue?: unknown;
  allLabel?: string;
  chipLabel?: string;
  fromLabel?: string;
  toLabel?: string;
}

export interface CollectionFilterLabels {
  all?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CollectionFilterControlProps {
  filter?: CollectionFilterConfig;
  value?: unknown;
  onChange?: (name: string, value: unknown) => void;
  namePrefix?: string;
  labels?: CollectionFilterLabels;
  selectVariant?: "transparent" | "input" | string;
  includeAll?: boolean;
  allValue?: unknown;
}

export interface ActiveFilterChip {
  key: string;
  label: ReactNode;
}

export interface ActiveFilterChipsProps {
  chips?: ActiveFilterChip[];
  showBadges?: boolean;
  showClearAll?: boolean;
  clearAllLabel?: ReactNode;
  onRemove?: (key: string) => void;
  gap?: string;
}

export interface CollectionToolbarSearchConfig {
  visible?: boolean;
  show?: boolean;
  name?: string;
  placeholder?: string;
  value?: string;
  clearable?: boolean;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
}

export interface CollectionToolbarFiltersConfig {
  items?: CollectionFilterConfig[];
  values?: Record<string, unknown>;
  inlineLimit?: number;
  namePrefix?: string;
  onChange?: (name: string, value: unknown) => void;
  labels?: CollectionFilterLabels & Record<string, unknown>;
  includeAll?: boolean;
  allValue?: unknown;
  selectVariant?: "transparent" | "input" | string;
  overflowButtonSize?: string;
  filtersButtonLabel?: ReactNode;
}

export interface CollectionToolbarChipsConfig {
  items?: ActiveFilterChip[];
  showBadges?: boolean;
  showClearAll?: boolean;
  clearAllLabel?: ReactNode;
  onRemove?: (key: string) => void;
  gap?: string;
}

export interface CollectionCountLabelObject {
  singular: string;
  plural: string;
}

export interface CollectionCountProps {
  shown?: number;
  total?: number;
  label?: string | CollectionCountLabelObject | ((count: number) => string);
  text?: ReactNode;
  formatter?: (shown: number, total: number) => ReactNode;
  bold?: boolean;
  variant?: string;
  format?: Record<string, unknown>;
}

export interface FormatCollectionCountParams {
  shown?: number;
  total?: number;
  label?: string | CollectionCountLabelObject | ((count: number) => string);
  formatter?: (shown: number, total: number) => ReactNode;
}

export interface CollectionSortSelectProps {
  name?: string;
  value?: string | null;
  options?: Array<{ label: ReactNode; value: string }>;
  placeholder?: string;
  onChange?: (value: string) => void;
  includeEmpty?: boolean;
  emptyValue?: string;
  variant?: "transparent" | "input" | string;
  idPrefix?: string;
  uniqueName?: boolean;
}

export interface CollectionToolbarProps {
  search?: CollectionToolbarSearchConfig;
  filters?: CollectionToolbarFiltersConfig;
  chips?: CollectionToolbarChipsConfig;
  right?: ReactNode;
  footer?: ReactNode;
  labels?: Record<string, unknown>;
  leftFlex?: number;
  rightFlex?: number;
  rightAlignSelf?: string;
  gap?: string;
  /** Optional stable prefix used to generate unique child input/select names. */
  idPrefix?: string;
  /** Append a per-toolbar suffix to child input/select names. Default true. */
  uniqueNames?: boolean;
}

export interface CrmLookupSelectProps {
  objectType: "contact" | "contacts" | "company" | "companies" | "deal" | "deals" | string;
  properties?: string[];
  name?: string;
  label?: string;
  value?: string | number | boolean | Array<string | number | boolean>;
  onChange?: (value: string | number | boolean | Array<string | number | boolean>) => void;
  multiple?: boolean;
  placeholder?: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  validationMessage?: string;
  variant?: "transparent" | "input";
  debounce?: number;
  minSearchLength?: number;
  pageLength?: number;
  option?: {
    label?: string | ((row: Record<string, unknown>) => unknown);
    value?: string | ((row: Record<string, unknown>) => unknown);
    description?: string | ((row: Record<string, unknown>) => unknown);
    fallbackLabel?: string;
    mapOption?: (row: Record<string, unknown>) => BuiltOption;
  };
  labelProperty?: string | ((row: Record<string, unknown>) => unknown);
  valueProperty?: string | ((row: Record<string, unknown>) => unknown);
  descriptionProperty?: string | ((row: Record<string, unknown>) => unknown);
  selectedOptions?: BuiltOption | BuiltOption[];
  format?: Record<string, unknown>;
  row?: Record<string, unknown>;
  baseConfig?: Record<string, unknown>;
  query?: string;
  onSearchChange?: (query: string) => void;
  noResultsOption?: BuiltOption;
  loadingOption?: BuiltOption;
  selectProps?: Record<string, unknown>;
}

export interface StyledTextFormat {
  fontWeight?: "bold" | "demibold" | "regular" | number;
  italic?: boolean;
  lineDecoration?: "underline" | "strikethrough";
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "sentenceCase" | "none";
}

export interface StyledTextBackground {
  preset?: "tag";
  variant?: "default" | "success" | "warning" | "error" | "danger" | "info";
  color?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  paddingX?: number;
  paddingY?: number;
  height?: number;
  fontSize?: number;
  canvasPaddingX?: number;
  canvasPaddingY?: number;
}

export interface StyledTextDataUriResult {
  src: string;
  width: number;
  height: number;
}

export interface StyledTextSharedProps {
  text?: string;
  children?: ReactNode;
  alt?: string;
  variant?: "bodytext" | "microcopy";
  format?: StyledTextFormat;
  orientation?: "horizontal" | "vertical-up" | "vertical-down" | number;
  color?: string;
  background?: StyledTextBackground | null;
  fontFamily?: string;
  fontSize?: number;
  paddingX?: number;
  paddingY?: number;
  width?: number;
  height?: number;
}

export interface StyledTextDataUriOptions extends Omit<StyledTextSharedProps, "children" | "text" | "alt"> {}

export interface StyledTextProps extends StyledTextSharedProps {}

export type SkeletonVariant = "text" | "box" | "circle";

/** Pixel number or a width token: sm = 120, md = 240, lg = 360. */
export type SkeletonWidth = number | "sm" | "md" | "lg";

export interface SkeletonDataUriOptions {
  variant?: SkeletonVariant;
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

export interface SkeletonProps extends SkeletonDataUriOptions {
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
export declare function Spinner(props: SpinnerProps): ReactNode;
export declare const SPINNERS: Record<SpinnerName, SpinnerPreset>;
export declare const SPINNER_NAMES: SpinnerName[];
export declare function gridToBraille(grid: boolean[][]): string;
export declare function makeGrid(rows: number, cols: number): boolean[][];
export declare function makeAvatarStackDataUri(
  items?: AvatarStackItem[] | null,
  options?: Omit<AvatarStackProps, "items" | "alt">
): AvatarStackDataUriResult | null;
export declare function makeStyledTextDataUri(
  text: string,
  options?: StyledTextDataUriOptions
): StyledTextDataUriResult;

export declare function DateRangePicker(props: DateRangePickerProps): ReactNode;
/** Translate an HS_DATE_PRESETS key into a { from, to } range. Null for unknown/custom/empty keys. */
export declare function presetToRange(
  presetKey: string | null | undefined,
  now?: Date
): DateRangePickerValue | null;
/** Convert a JS Date to a HubSpot date value object. Null for invalid input. */
export declare function toHsDateValue(date: Date): DateRangePickerDateValue | null;
/** Sort-style comparator for HubSpot date value objects; null sides compare as 0. */
export declare function compareHsDateValues(
  a: DateRangePickerDateValue | null | undefined,
  b: DateRangePickerDateValue | null | undefined
): number;
/** True when the range is open-ended or from <= to. */
export declare function isValidDateRange(range: DateRangePickerValue | null | undefined): boolean;
/** Sentinel preset value meaning "the user picked dates by hand". */
export declare const DATE_RANGE_CUSTOM_VALUE: "custom";

export declare const HS_DATE_PRESETS: DatePresetOption[];
export declare const HS_DATE_DIRECTION_LABELS: DateDirectionLabels;
export declare const HS_FONT_FAMILY: string;
export declare const HS_TEXT_COLOR: string;
export declare const HS_SUBTLE_BG: string;
export declare const HS_MUTED_TEXT: string;
export declare const HS_NEUTRAL_CHIP: string;
/** Skeleton placeholder gray. */
export declare const SKELETON_FILL: string;
export declare const HS_TAG_SUBTLE_BORDER: string;
export declare const HS_TAG_TEXT_COLOR: string;
export declare const HS_TAG_FONT_SIZE: number;
export declare const HS_TAG_LINE_HEIGHT: number;
export declare const HS_TAG_PADDING_X: number;
export declare const HS_TAG_PADDING_Y: number;
export declare const HS_TAG_BORDER_RADIUS: number;
export declare const HS_TAG_BORDER_WIDTH: number;
export declare const DEFAULT_SVG_FONT_WEIGHT: number;
