export type AutoStatusTagVariant = "default" | "success" | "warning" | "danger" | "info";
export type AutoTagVariant = "default" | "success" | "warning" | "error" | "info";

export interface AutoTagSharedOptions<TVariant extends string> {
  overrides?: Record<string, TVariant>;
  fallback?: TVariant;
}

export interface AutoStatusTagOptions extends AutoTagSharedOptions<AutoStatusTagVariant> {}

export interface AutoTagOptions extends AutoTagSharedOptions<AutoTagVariant> {}

export interface FormatCurrencyOptions extends Intl.NumberFormatOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

export interface BuildOptionsConfig<Item> {
  labelKey?: keyof Item | string;
  valueKey?: keyof Item | string;
  descriptionKey?: keyof Item | string;
  mapLabel?: (item: Item) => unknown;
  mapValue?: (item: Item) => unknown;
  mapDescription?: (item: Item) => unknown;
}

export interface BuiltOption {
  label: unknown;
  value: unknown;
  description?: unknown;
}

export declare function getAutoTagVariant(value: unknown, options?: AutoTagOptions): AutoTagVariant;
export declare function getAutoStatusTagVariant(value: unknown, options?: AutoStatusTagOptions): AutoStatusTagVariant;
export declare function getAutoTagDisplayValue(value: unknown): unknown;

export interface StatusTagSortComparatorOptions extends AutoStatusTagOptions {
  variantOrder?: readonly string[];
  getLabel?: (value: unknown) => unknown;
}

export declare function createStatusTagSortComparator(
  options?: StatusTagSortComparatorOptions
): (aValue: unknown, bValue: unknown) => number;
export declare function formatCurrency(value: unknown, options?: FormatCurrencyOptions): string;
export declare function formatDate(value: unknown, options?: FormatDateOptions): string;
export declare function formatDateTime(value: unknown, options?: FormatDateOptions): string;
export declare function formatPercentage(value: unknown, options?: Intl.NumberFormatOptions & { locale?: string }): string;
export declare function buildOptions<Item = Record<string, unknown>>(items: Item[] | null | undefined, config?: BuildOptionsConfig<Item>): BuiltOption[];
export declare function findOptionLabel(options: Array<{ label?: unknown; value?: unknown }> | null | undefined, value: unknown, fallback?: string): unknown;
export declare function isDateValueObject(value: unknown): boolean;
export declare function isTimeValueObject(value: unknown): boolean;
export declare function isDateTimeValueObject(value: unknown): boolean;
export declare function sumBy<Item = Record<string, unknown>>(items: Item[] | null | undefined, keyOrFn: keyof Item | ((item: Item) => unknown)): number;
