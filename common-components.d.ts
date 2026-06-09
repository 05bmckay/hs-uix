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

/** The explicit `is between` date range shape. */
export interface DateRangePickerRangeValue {
  from?: DateRangePickerDateValue | null;
  to?: DateRangePickerDateValue | null;
}

export type DateRangePickerOperator =
  | "InRollingDateRange"
  | "Equal"
  | "BeforeDateStaticOrDynamic"
  | "AfterDateStaticOrDynamic"
  | "InRange"
  | "GreaterRolling"
  | "LessRolling"
  | "Known"
  | "NotKnown";

export type DateRangePickerRollingUnit = "day" | "week" | "month" | "year";
export type DateRangePickerRollingDirection = "backward" | "forward";

export interface DateRangePickerPresetValue {
  operator: "InRollingDateRange";
  preset?: string;
}

export interface DateRangePickerRollingValue {
  operator: "GreaterRolling" | "LessRolling";
  amount?: number;
  unit?: DateRangePickerRollingUnit;
  direction?: DateRangePickerRollingDirection;
}

export interface DateRangePickerSingleDateValue {
  operator: "Equal" | "BeforeDateStaticOrDynamic" | "AfterDateStaticOrDynamic";
  date?: DateRangePickerDateValue | null;
}

export interface DateRangePickerExplicitRangeValue extends DateRangePickerRangeValue {
  operator: "InRange";
}

export interface DateRangePickerPresenceValue {
  operator: "Known" | "NotKnown";
}

export type DateRangePickerValue =
  | DateRangePickerRangeValue
  | DateRangePickerPresetValue
  | DateRangePickerSingleDateValue
  | DateRangePickerRollingValue
  | DateRangePickerExplicitRangeValue
  | DateRangePickerPresenceValue;

export interface DateRangePickerPresetOption {
  label: string;
  /** A preset key understood by presetToRange, or any key when getRange is given. */
  value: string;
  /** Fully custom preset: compute the range yourself from `now`. */
  getRange?: (now: Date) => DateRangePickerRangeValue;
}

export interface DateRangePickerChangeMeta {
  operator: DateRangePickerOperator;
  /** Selected controlling CRM property, when field selection is enabled. */
  field?: string | null;
  /** The preset key that produced the range, or null for manual edits / clear. */
  preset: string | null;
  range?: DateRangePickerRangeValue | null;
  previousOperator?: DateRangePickerOperator;
}

export interface DateRangePickerProps {
  /** Controlled date filter value. Range sides may be null for an open-ended range. */
  value?: DateRangePickerValue;
  /** Initial date filter value for uncontrolled usage. */
  defaultValue?: DateRangePickerValue;
  /** Fires with normalized values. Explicit ranges only emit when valid (from <= to, or a side null). */
  onChange?: (range: DateRangePickerValue, meta: DateRangePickerChangeMeta) => void;
  /** Optional group label rendered above the control. */
  label?: ReactNode;
  /** Base for inner input names (`${name}-from`, `${name}-to`, `${name}-preset`). */
  name?: string;
  /** Controlled CRM date/datetime property value for the field dropdown. */
  field?: string;
  /** Initial CRM date/datetime property value for uncontrolled field selection. */
  defaultField?: string;
  onFieldChange?: (field: string) => void;
  /** Render a controlling field dropdown above the operator. */
  showFieldSelect?: boolean;
  fieldOptions?: Array<{ label: ReactNode; value: string }>;
  operator?: DateRangePickerOperator;
  defaultOperator?: DateRangePickerOperator;
  onOperatorChange?: (operator: DateRangePickerOperator) => void;
  showOperatorSelect?: boolean;
  operatorOptions?: Array<{ label: ReactNode; value: DateRangePickerOperator }>;
  /** true = HS_DATE_PRESETS Select, false = none, or a custom preset array. */
  presets?: boolean | DateRangePickerPresetOption[];
  rollingUnitOptions?: Array<{ label: ReactNode; value: string }>;
  direction?: "row" | "column";
  /** Show a Clear link when the range is non-empty. */
  clearable?: boolean;
  min?: DateRangePickerDateValue;
  max?: DateRangePickerDateValue;
  fromLabel?: string;
  toLabel?: string;
  dateLabel?: string;
  /** Keep DateInput labels visible. Defaults to false for compact filter rows. */
  showDateLabels?: boolean;
  /** DateInput display format. Default "medium". */
  format?: "short" | "long" | "medium" | "standard" | "YYYY-MM-DD" | "L" | "LL" | "ll";
  presetPlaceholder?: string;
  customPresetLabel?: string;
  clearLabel?: ReactNode;
  invalidRangeMessage?: string;
  readOnly?: boolean;
  gap?: string;
  /** Minimum column width for the field-enabled flexible AutoGrid layout. */
  gridColumnWidth?: number;
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

/** Dotted property path ("properties.domain") or accessor function. */
export type CrmRecordPickerFieldAccessor =
  | string
  | ((record: Record<string, unknown>) => unknown);

export type CrmRecordPickerId = string | number;

export type CrmRecordPickerRecord = Record<string, unknown>;

/** A scalar or array of record ids and/or record objects. */
export type CrmRecordPickerValue =
  | CrmRecordPickerId
  | CrmRecordPickerRecord
  | Array<CrmRecordPickerId | CrmRecordPickerRecord>;

export interface CrmRecordPickerOption {
  label: ReactNode;
  value: CrmRecordPickerId;
  description?: string;
}

export interface CrmRecordPickerCreateConfig {
  /** Static label or `(term) => label` formatter. Default `Create "<term>"`. */
  label?: string | ((term: string) => string);
  /** Create the record for the search term; return the new record or its id. */
  onCreate: (
    searchTerm: string
  ) =>
    | Promise<CrmRecordPickerRecord | CrmRecordPickerId>
    | CrmRecordPickerRecord
    | CrmRecordPickerId;
}

export interface CrmRecordPickerProps {
  objectType: "contact" | "contacts" | "company" | "companies" | "deal" | "deals" | string;
  properties?: string[];
  labelField?: CrmRecordPickerFieldAccessor;
  descriptionField?: CrmRecordPickerFieldAccessor;
  value?: CrmRecordPickerValue;
  defaultValue?: CrmRecordPickerValue;
  /**
   * Multi mode passes (ids, records) arrays; single mode passes a scalar id
   * (or null) and the matching record (or null). Records never seen by the
   * picker come back as `{ objectId: id }` stubs.
   */
  onChange?: (
    ids: CrmRecordPickerId[] | CrmRecordPickerId | null,
    records: CrmRecordPickerRecord[] | CrmRecordPickerRecord | null
  ) => void;
  multi?: boolean;
  max?: number;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  validationMessage?: string;
  description?: string;
  tooltip?: string;
  variant?: "transparent" | "input";
  pageLength?: number;
  debounce?: number;
  minSearchLength?: number;
  filterMap?: (
    filters: Record<string, unknown>,
    params: Record<string, unknown>
  ) => unknown;
  allowCreate?: false | CrmRecordPickerCreateConfig;
  fallbackLabel?: string;
  format?: Record<string, unknown>;
  baseConfig?: Record<string, unknown>;
  onSearchChange?: (query: string) => void;
  [key: string]: unknown;
}

export interface CrmRecordPickerCreateOptionRules {
  allowCreate?: false | true | CrmRecordPickerCreateConfig;
  searchTerm?: string;
  options?: CrmRecordPickerOption[];
  searching?: boolean;
  createPending?: boolean;
  atMax?: boolean;
}

export interface CrmRecordPickerOptionConfig {
  labelField?: CrmRecordPickerFieldAccessor;
  descriptionField?: CrmRecordPickerFieldAccessor;
  fallbackLabel?: string;
}

export interface CrmRecordPickerSelection {
  ids: CrmRecordPickerId[];
  records: CrmRecordPickerRecord[];
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
export declare function StyledText(props: StyledTextProps): ReactNode;
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
): DateRangePickerRangeValue | null;
/** Convert a JS Date to a HubSpot date value object. Null for invalid input. */
export declare function toHsDateValue(date: Date): DateRangePickerDateValue | null;
/** Sort-style comparator for HubSpot date value objects; null sides compare as 0. */
export declare function compareHsDateValues(
  a: DateRangePickerDateValue | null | undefined,
  b: DateRangePickerDateValue | null | undefined
): number;
/** True when the range is open-ended or from <= to. */
export declare function isValidDateRange(range: DateRangePickerRangeValue | null | undefined): boolean;
/** Sentinel preset value meaning "the user picked dates by hand". */
export declare const DATE_RANGE_CUSTOM_VALUE: "custom";
export declare const DATE_FILTER_OPERATORS: Array<{
  label: string;
  value: DateRangePickerOperator;
}>;
export declare const DATE_ROLLING_UNIT_OPTIONS: Array<{
  label: string;
  value: string;
}>;

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
