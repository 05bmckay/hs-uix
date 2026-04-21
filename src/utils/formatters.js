const DEFAULT_LOCALE = "en-US";

export const formatCurrency = (
  value,
  { locale = DEFAULT_LOCALE, currency = "USD", maximumFractionDigits = 0, ...options } = {}
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
    ...options,
  }).format(Number(value || 0));

export const formatDate = (
  value,
  { locale = DEFAULT_LOCALE, month = "short", day = "numeric", year = "numeric", ...options } = {}
) => {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale, {
    month,
    day,
    year,
    ...options,
  });
};

export const formatDateTime = (
  value,
  {
    locale = DEFAULT_LOCALE,
    month = "short",
    day = "numeric",
    year = "numeric",
    hour = "numeric",
    minute = "2-digit",
    ...options
  } = {}
) => {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(locale, {
    month,
    day,
    year,
    hour,
    minute,
    ...options,
  });
};

export const formatPercentage = (
  value,
  { locale = DEFAULT_LOCALE, minimumFractionDigits = 0, maximumFractionDigits = 0, ...options } = {}
) =>
  new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
    ...options,
  }).format(Number(value || 0));
