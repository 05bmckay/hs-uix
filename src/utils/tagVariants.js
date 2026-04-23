const DEFAULT_VARIANT = "default";
const DANGER_VARIANT = "danger";
const ERROR_VARIANT = "error";

const SUCCESS_MATCHERS = [
  "active",
  "success",
  "succeeded",
  "complete",
  "completed",
  "approved",
  "accepted",
  "won",
  "healthy",
  "enabled",
  "connected",
  "paid",
  "live",
  "published",
  "available",
  "synced",
  "resolved",
  "replied",
  "responded",
  "confirmed",
  "verified",
  "validated",
  "deployed",
  "running",
  "restored",
  "recovered",
  "cleared",
];

const WARNING_MATCHERS = [
  "warning",
  "at risk",
  "risky",
  "pending",
  "waiting",
  "paused",
  "pause",
  "on hold",
  "hold",
  "review",
  "attention",
  "expiring",
  "trial",
  "in progress",
  "awaiting",
  "scheduled",
  "negotiation",
  "stalled",
  "stuck",
  "recovering",
  "urgent",
  "escalated",
  "reopened",
  "degraded",
  "retrying",
  "limited",
  "partial",
];

const DANGER_MATCHERS = [
  "danger",
  "error",
  "failed",
  "failure",
  "inactive",
  "disabled",
  "blocked",
  "cancelled",
  "canceled",
  "deactivated",
  "suspended",
  "terminated",
  "rejected",
  "denied",
  "churned",
  "lost",
  "overdue",
  "expired",
  "offline",
  "disconnected",
  "invalid",
  "unhealthy",
  "unsynced",
  "deleted",
  "archived",
  "unpaid",
];

const INFO_MATCHERS = [
  "info",
  "new",
  "not started",
  "todo",
  "to do",
  "backlog",
  "qualified",
  "proposal",
  "contacted",
  "attempted",
  "queued",
  "processing",
  "progress",
  "upcoming",
  "draft",
  "open",
  "ready",
  "deferred",
  "postponed",
];

const normalizeTagValue = (value) => {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

const matchesAny = (value, matchers) =>
  matchers.some((matcher) => {
    if (value === matcher) return true;
    return ` ${value} `.includes(` ${matcher} `);
  });

const getSemanticVariant = (value, options = {}) => {
  const normalized = normalizeTagValue(value);
  const fallback = options.fallback || DEFAULT_VARIANT;

  if (!normalized) return fallback;

  if (options.overrides) {
    const overrideKey = Object.keys(options.overrides).find(
      (key) => normalizeTagValue(key) === normalized
    );
    if (overrideKey) return options.overrides[overrideKey];
  }

  if (normalized === "true") return "success";
  if (normalized === "false") return fallback;

  if (matchesAny(normalized, SUCCESS_MATCHERS)) return "success";
  if (matchesAny(normalized, DANGER_MATCHERS)) return DANGER_VARIANT;
  if (matchesAny(normalized, WARNING_MATCHERS)) return "warning";
  if (matchesAny(normalized, INFO_MATCHERS)) return "info";

  return fallback;
};

export const getAutoTagVariant = (value, options = {}) => {
  const semanticVariant = getSemanticVariant(value, options);
  return semanticVariant === DANGER_VARIANT ? ERROR_VARIANT : semanticVariant;
};

export const getAutoStatusTagVariant = (value, options = {}) =>
  getSemanticVariant(value, options);

export const getAutoTagDisplayValue = (value) => {
  if (typeof value === "boolean") return value ? "True" : "False";
  return value;
};

// Default color grouping used when sorting by statusTag variant.
// Ordered by visual severity/positivity so "good" states cluster together.
// Includes both "danger" (StatusTag) and "error" (Tag) so the comparator
// works regardless of which variant-resolver the caller uses.
const DEFAULT_STATUS_TAG_COLOR_ORDER = [
  "success",
  "warning",
  "danger",
  "error",
  "info",
  "default",
];

// Build a comparator that sorts values by resolved StatusTag variant (color)
// first, then alphabetically by label within each color group. Intended for
// DataTable columns that render `AutoStatusTag` (or similar) cells.
//
// Usage:
//   { field: "status", sortable: true, sortComparator: createStatusTagSortComparator() }
//
// Options:
//   - variantOrder: array of variant names defining the color ordering
//   - overrides/fallback: forwarded to getAutoStatusTagVariant
//   - getLabel: (value) => string — override label extraction for tie-breaking
export const createStatusTagSortComparator = (options = {}) => {
  const {
    variantOrder = DEFAULT_STATUS_TAG_COLOR_ORDER,
    overrides,
    fallback,
    getLabel,
  } = options;
  const variantIndex = (variant) => {
    const idx = variantOrder.indexOf(variant);
    return idx === -1 ? variantOrder.length : idx;
  };
  const labelOf = (value) => {
    if (getLabel) return String(getLabel(value) ?? "");
    if (value == null) return "";
    return String(getAutoTagDisplayValue(value) ?? "");
  };
  return (aVal, bVal) => {
    const aVariant = getSemanticVariant(aVal, { overrides, fallback });
    const bVariant = getSemanticVariant(bVal, { overrides, fallback });
    const diff = variantIndex(aVariant) - variantIndex(bVariant);
    if (diff !== 0) return diff;
    return labelOf(aVal).localeCompare(labelOf(bVal));
  };
};
