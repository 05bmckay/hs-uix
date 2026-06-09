// ═══════════════════════════════════════════════════════════════════════════
// catalogs — authoritative allowlists + alias tables for enum-like props the
// platform silently drops (Icon `name`, StatisticsTrend `direction`) or
// throws on (EmptyState `imageName`).
//
// Harvested from hs-uix-studio's renderer safety net, where the tables were
// generated from @hubspot/ui-extensions' shared types
// (dist/shared/types/shared.js) and battle-tested against real
// model-generated UIs. They only need bumping when the SDK adds members.
// ═══════════════════════════════════════════════════════════════════════════

import { NATIVE_ICON_NAMES } from "../common-components/nativeIconNames.js";

/** The native <Icon> `name` whitelist (shared with the Icon superset). */
export { NATIVE_ICON_NAMES };

// Common mistakes (mostly from LLM generators) → the nearest valid icon name.
// Applied silently with a one-time console.warn so the caller's intent still
// renders.
export const ICON_NAME_ALIASES = {
  alert: "warning",          // "alert" is a color, not an icon
  check: "success",
  checkmark: "success",
  danger: "xCircle",         // "danger" is a StatusTag variant
  duplicate: "copy",
  error: "xCircle",          // "error" is a Tag variant, not an icon
  trash: "delete",
  pencil: "edit",
  arrowLeft: "left",
  arrowRight: "right",
  arrowUp: "upCarat",
  arrowDown: "downCarat",
  cog: "settings",
  gear: "settings",
  close: "xCircle",
  plus: "add",
  minus: "remove",
  ok: "success",
};

// EmptyState `imageName` catalog. Unlike Icon, an invalid value here THROWS
// ("<name> is not a valid option for imageName") and aborts the render.
export const EMPTY_STATE_IMAGES = new Set([
  "addOnReporting","announcement","api","automatedTesting","beta","building",
  "callingSetUp","companies","components","cone","contacts","contentStrategy",
  "customObjects","customerExperience","customerSupport","deals",
  "developerSecurityUpdate","electronicSignature","electronicSignatureEmptyState",
  "emailConfirmation","emptyStateCharts","idea","integrations","leads","lock",
  "missedGoal","multipleObjects","object","productsShoppingCart","registration",
  "sandboxAddOn","social","store","storeDisabled","successfullyConnectedEmail",
  "target","task","voteAndSearch","meetings","tickets",
]);

export const EMPTY_STATE_IMAGE_ALIASES = {
  "new-project": "components",
  newProject: "components",
  empty: "components",
  default: "components",
};

// StatisticsTrend `direction` accepts only "increase" | "decrease".
// Generators keep reaching for present-participle forms.
export const TREND_DIRECTIONS = new Set(["increase", "decrease"]);
export const TREND_DIRECTION_ALIASES = {
  increasing: "increase",
  decreasing: "decrease",
  up: "increase",
  down: "decrease",
  positive: "increase",
  negative: "decrease",
};

// Required collection props per component — the props that, when a data path
// resolves undefined or to the wrong shape, make the component throw inside
// HubSpot's reconciler and blank the whole extension. Used by the pre-wrapped
// Safe* exports; exported so callers can wrap their own compositions with
// withSafeArrayProps.
export const SAFE_ARRAY_PROPS = {
  // native @hubspot/ui-extensions
  Select: ["options"],
  MultiSelect: ["options"],
  ToggleGroup: ["options"],
  StepIndicator: ["stepNames"],
  // hs-uix
  DataTable: ["data", "columns", "searchFields", "filters", "selectionActions"],
  Kanban: ["data", "stages"],
  FormBuilder: ["fields"],
  AvatarStack: ["items"],
  KeyValueList: ["items"],
  Feed: ["items", "fields"],
  Calendar: ["events"],
  CrmKanban: ["cardFields"],
};

// Auto-derived-when-omitted collection props. These must NOT coerce to [] —
// CrmDataTable resolves `columns || inferCrmColumns(...)` and CrmKanban does
// `if (stages) return stages;`, and [] is truthy, so coercion would silently
// disable the documented auto-derivation. Invalid non-array values are
// dropped instead (the derive path takes over), with a one-time warn.
export const SAFE_DERIVE_PROPS = {
  CrmDataTable: ["columns"],
  CrmKanban: ["stages"],
};
