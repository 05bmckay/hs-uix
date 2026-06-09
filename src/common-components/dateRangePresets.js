// ═══════════════════════════════════════════════════════════════════════════
// Date-range preset math — pure, dependency-free, unit-testable.
//
// `datePresets.js` ships the LABELS for HubSpot's quick-date dropdown
// (HS_DATE_PRESETS) but deliberately leaves "what does 'last_quarter' actually
// mean" to the consumer. Every consumer then re-implements the same calendar
// arithmetic, usually with off-by-one bugs at month/quarter/year boundaries.
// This module is the single canonical translation: preset key → a
// { from, to } pair of HubSpot DateInput value objects ({ year, month, date },
// month ZERO-indexed) that plugs directly into the `dateRange` filter shape
// used by DataTable / Kanban / Feed / Calendar (see src/utils/query.js).
//
// All math is local-time Gregorian via the `new Date(y, m, d)` overflow rules,
// so month/quarter/year boundaries and leap years are handled by the engine,
// not by hand-rolled day counting. Pass an explicit `now` for determinism.
// ═══════════════════════════════════════════════════════════════════════════

/** Sentinel preset value meaning "the user picked dates by hand". */
export const DATE_RANGE_CUSTOM_VALUE = "custom";

export const DATE_FILTER_OPERATORS = [
  { label: "is", value: "InRollingDateRange" },
  { label: "is equal to", value: "Equal" },
  { label: "is before", value: "BeforeDateStaticOrDynamic" },
  { label: "is after", value: "AfterDateStaticOrDynamic" },
  { label: "is between", value: "InRange" },
  { label: "is more than", value: "GreaterRolling" },
  { label: "is less than", value: "LessRolling" },
  { label: "is known", value: "Known" },
  { label: "is unknown", value: "NotKnown" },
];

export const DATE_ROLLING_UNIT_OPTIONS = [
  { label: "day ago", value: "day:backward" },
  { label: "days from now", value: "day:forward" },
  { label: "week ago", value: "week:backward" },
  { label: "weeks from now", value: "week:forward" },
  { label: "month ago", value: "month:backward" },
  { label: "months from now", value: "month:forward" },
  { label: "year ago", value: "year:backward" },
  { label: "years from now", value: "year:forward" },
];

/**
 * Convert a JS Date to a HubSpot DateInput value object
 * ({ year, month, date }, month 0-indexed). Returns null for invalid input.
 */
export const toHsDateValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() };
};

/**
 * Compare two HubSpot date value objects. Returns a negative number when
 * a < b, 0 when equal, positive when a > b (same contract as a sort
 * comparator). Either side being null/undefined compares as 0 — null means
 * "no constraint", so it never invalidates a range.
 */
export const compareHsDateValues = (a, b) => {
  if (!a || !b) return 0;
  return (
    (a.year - b.year) ||
    (a.month - b.month) ||
    (a.date - b.date)
  );
};

/**
 * Is a { from, to } range valid? Open-ended ranges (either side null) are
 * valid; a closed range is valid when from <= to.
 */
export const isValidDateRange = (range) => {
  if (!range) return true;
  return compareHsDateValues(range.from, range.to) <= 0;
};

// Day at `offset` days from `now`, as a value object. The Date constructor
// normalizes out-of-range day numbers, so offsets cross month/year boundaries
// (and leap days) correctly.
const dayAt = (now, offset = 0) =>
  toHsDateValue(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset));

// First / last calendar day of the month at `monthOffset` from `now`.
// `new Date(y, m + 1, 0)` is the canonical "last day of month m" trick.
const monthStart = (now, monthOffset = 0) =>
  toHsDateValue(new Date(now.getFullYear(), now.getMonth() + monthOffset, 1));
const monthEnd = (now, monthOffset = 0) =>
  toHsDateValue(new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0));

// Quarter helpers: quarterOffset is in quarters (0 = current, -1 = previous).
const quarterStartMonth = (now, quarterOffset = 0) =>
  Math.floor(now.getMonth() / 3) * 3 + quarterOffset * 3;

/**
 * Translate a preset key from HS_DATE_PRESETS into a { from, to } range of
 * HubSpot DateInput value objects. Returns null for unknown keys, "" and
 * "custom" (callers keep the existing range in those cases).
 *
 * Semantics (all inclusive, all local time):
 * - today / yesterday / tomorrow — single-day ranges.
 * - this_week / last_week — Sunday through Saturday (HubSpot's default week).
 * - 7d / 30d / 90d — rolling windows ENDING today and INCLUDING today
 *   (so "7d" = today and the 6 days before it).
 * - this_month / last_month — first through last calendar day.
 * - this_quarter / last_quarter — calendar quarters (Jan–Mar, Apr–Jun, ...).
 * - this_year / last_year — Jan 1 through Dec 31.
 *
 * @param {string} presetKey  a value from HS_DATE_PRESETS
 * @param {Date} [now]        reference date; defaults to new Date(). Pass a
 *                            fixed Date in tests for determinism.
 */
export const presetToRange = (presetKey, now = new Date()) => {
  if (!presetKey || presetKey === DATE_RANGE_CUSTOM_VALUE) return null;
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) return null;

  const dow = now.getDay(); // 0 = Sunday
  const year = now.getFullYear();
  const qm = quarterStartMonth(now);

  switch (presetKey) {
    case "today":
      return { from: dayAt(now, 0), to: dayAt(now, 0) };
    case "yesterday":
      return { from: dayAt(now, -1), to: dayAt(now, -1) };
    case "tomorrow":
      return { from: dayAt(now, 1), to: dayAt(now, 1) };
    case "this_week":
      return { from: dayAt(now, -dow), to: dayAt(now, 6 - dow) };
    case "last_week":
      return { from: dayAt(now, -dow - 7), to: dayAt(now, -dow - 1) };
    case "7d":
      return { from: dayAt(now, -6), to: dayAt(now, 0) };
    case "30d":
      return { from: dayAt(now, -29), to: dayAt(now, 0) };
    case "90d":
      return { from: dayAt(now, -89), to: dayAt(now, 0) };
    case "this_month":
      return { from: monthStart(now, 0), to: monthEnd(now, 0) };
    case "last_month":
      return { from: monthStart(now, -1), to: monthEnd(now, -1) };
    case "this_quarter":
      return {
        from: toHsDateValue(new Date(year, qm, 1)),
        to: toHsDateValue(new Date(year, qm + 3, 0)),
      };
    case "last_quarter":
      return {
        from: toHsDateValue(new Date(year, qm - 3, 1)),
        to: toHsDateValue(new Date(year, qm, 0)),
      };
    case "this_year":
      return { from: { year, month: 0, date: 1 }, to: { year, month: 11, date: 31 } };
    case "last_year":
      return {
        from: { year: year - 1, month: 0, date: 1 },
        to: { year: year - 1, month: 11, date: 31 },
      };
    default:
      return null;
  }
};
