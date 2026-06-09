// ═══════════════════════════════════════════════════════════════════════════
// Drag-free reschedule math — pure, dependency-free, unit-testable.
//
// HubSpot UI Extensions have no drag-and-drop, so the Calendar reschedules via
// explicit affordances ("+1 hour", "+1 day", "Next week", a date picker) in the
// event-detail overlay. This module owns the shift math; the component only
// wires the buttons. The Calendar stays presentational: it computes the new
// { start, end } and EMITS it via onEventReschedule — the consumer persists and
// feeds updated events back in. Calendar never mutates its own events.
//
// DST contract (the reason this file exists instead of `date + ms`):
// - day/week shifts are CALENDAR shifts: they preserve the wall-clock
//   time-of-day on BOTH endpoints (a 9 AM meeting moved +1 day across the
//   spring-forward weekend is still 9 AM, and a midnight-to-midnight all-day
//   span stays midnight-to-midnight) — implemented via setDate, which lets the
//   engine absorb the missing/extra hour.
// - hour/minute shifts are EXACT clock durations (ms arithmetic): "+1 hour"
//   always moves the instant 60 real minutes, even when the wall-clock label
//   jumps (1:30 AM + 1 hr = 3:30 AM across spring-forward).
// ═══════════════════════════════════════════════════════════════════════════

import { MS_PER_DAY, addDays, isDateValueObject, startOfDay, toDate } from "./dateUtils.js";

/**
 * Shift a date by a `{ days?, weeks?, hours?, minutes? }` spec. Days/weeks are
 * calendar shifts (wall-clock time-of-day preserved across DST); hours/minutes
 * are exact clock durations. Accepts any `toDate`-coercible input; returns a
 * new Date, or null when the input is unparseable.
 */
export const shiftDate = (date, shift) => {
  const d = toDate(date);
  if (!d) return null;
  if (!shift || typeof shift !== "object") return new Date(d);
  const days = (shift.days || 0) + (shift.weeks || 0) * 7;
  let next = days ? addDays(d, days) : new Date(d);
  const ms = (shift.hours || 0) * 3600000 + (shift.minutes || 0) * 60000;
  if (ms) next = new Date(next.getTime() + ms);
  return next;
};

/**
 * Shift BOTH endpoints of an event range by the same spec, so the event keeps
 * its wall-clock shape: a 9–10 AM meeting moved +1 week is still 9–10 AM, and a
 * midnight-to-midnight all-day span stays anchored to midnight even when the
 * span crosses a DST transition (shifting only the start and re-adding the raw
 * ms duration would land the end at 11 PM / 1 AM). A missing end mirrors the
 * shifted start. Returns `{ start, end }`, or null when start is unparseable.
 */
export const shiftEvent = (range, shift) => {
  const start = toDate(range && range.start);
  if (!start) return null;
  const end = toDate(range && range.end) || start;
  return { start: shiftDate(start, shift), end: shiftDate(end, shift) };
};

/** Signed whole-day difference between the calendar days of `a` and `b`.
 * Rounded so the ±1 h a DST transition steals/adds never skews the count. */
export const calendarDayDelta = (a, b) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY);

/** Wall-clock time-of-day of `d` in ms, from the CLOCK FIELDS — not elapsed
 * time since midnight, which is ±1 h off on a DST transition day (9:00 AM on
 * a spring-forward day is only 8 elapsed hours after midnight). */
export const msIntoDay = (d) =>
  ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000 +
  d.getMilliseconds();

/**
 * Move an event to an arbitrary new start, carrying the end with it. The end is
 * NOT recomputed from the raw ms duration; instead it moves by the same
 * (calendar-day delta, time-of-day delta) decomposition the start moved by, so:
 * - a 9:00–10:30 meeting picked onto any date is 9:00–10:30 there (even when
 *   the move crosses a DST transition);
 * - a midnight-to-midnight multi-day span stays midnight-to-midnight;
 * - an overnight 11 PM–1 AM event moved to a 10 AM start ends at noon the SAME
 *   day (the day-delta decomposition keeps relative shape, not absolute fields).
 * `newStart` accepts any `toDate`-coercible shape. Returns `{ start, end }`, or
 * null when either date is unparseable.
 */
export const rescheduleToStart = (range, newStart) => {
  const start = toDate(range && range.start);
  const target = toDate(newStart);
  if (!start || !target) return null;
  const end = toDate(range && range.end) || start;
  const dayDelta = calendarDayDelta(start, target);
  const timeDelta = msIntoDay(target) - msIntoDay(start);
  const endOnDay = addDays(end, dayDelta);
  if (!timeDelta) return { start: target, end: endOnDay };
  // Apply the wall-clock delta via field construction (not raw ms addition),
  // so the end keeps its clock shape even when endOnDay itself is a DST
  // transition day; field normalization rolls overnight spills correctly.
  return {
    start: target,
    end: new Date(
      endOnDay.getFullYear(),
      endOnDay.getMonth(),
      endOnDay.getDate(),
      0,
      0,
      0,
      msIntoDay(endOnDay) + timeDelta
    ),
  };
};

/**
 * Combine a DateInput pick (`{ year, month, date }`, 0-indexed month) with the
 * original start's time-of-day: "Pick date…" moves the event to that day but
 * keeps its clock time. With no original start the pick lands on midnight.
 * Returns a Date, or null when `value` is not a DateInput value object.
 */
export const applyDatePick = (start, value) => {
  if (!isDateValueObject(value)) return null;
  const s = toDate(start);
  return new Date(
    value.year,
    value.month,
    value.date,
    s ? s.getHours() : 0,
    s ? s.getMinutes() : 0,
    s ? s.getSeconds() : 0,
    s ? s.getMilliseconds() : 0
  );
};

/** The presets used for `rescheduleOptions={true}`. */
export const DEFAULT_RESCHEDULE_PRESETS = [
  { label: "+1 hour", shift: { hours: 1 } },
  { label: "+1 day", shift: { days: 1 } },
  { label: "Next week", shift: { weeks: 1 } },
];

/**
 * Normalize the `rescheduleOptions` prop into `[{ label, shift }]` /
 * `[{ label, getStart }]` entries:
 * - `true` → DEFAULT_RESCHEDULE_PRESETS;
 * - `{ label, shift: { days?, weeks?, hours?, minutes? } }` → kept as-is;
 * - `{ label, shift: (event) => newStart }` / `{ label, getStart }` → a labeled
 *   accessor returning the new start (any `toDate`-coercible shape);
 * - a bare `(event) => newStart` function → labeled from `fn.label` / `fn.name`,
 *   falling back to "Reschedule".
 * Entries that fit none of these are dropped (never rendered as dead buttons).
 */
export const normalizeRescheduleOptions = (options) => {
  if (!options) return [];
  if (options === true) return DEFAULT_RESCHEDULE_PRESETS;
  if (!Array.isArray(options)) return [];
  const out = [];
  for (const opt of options) {
    if (typeof opt === "function") {
      out.push({ label: opt.label || opt.name || "Reschedule", getStart: opt });
    } else if (opt && typeof opt === "object" && opt.label != null) {
      if (typeof opt.shift === "function") {
        out.push({ label: opt.label, getStart: opt.shift });
      } else if (typeof opt.getStart === "function") {
        out.push({ label: opt.label, getStart: opt.getStart });
      } else if (opt.shift && typeof opt.shift === "object") {
        out.push({ label: opt.label, shift: opt.shift });
      }
    }
  }
  return out;
};

/**
 * Resolve a normalized option against an event range. `range` is
 * `{ start, end }`; `fnArg` is what a `getStart` accessor receives (the
 * Calendar passes the full normalized event so accessors can read `raw`).
 * Returns `{ start, end }` with the event's shape preserved, or null when the
 * option can't produce a valid target.
 */
export const resolveRescheduleTarget = (range, option, fnArg) => {
  if (!range || !toDate(range.start) || !option) return null;
  if (typeof option.getStart === "function") {
    const next = toDate(option.getStart(fnArg !== undefined ? fnArg : range));
    return next ? rescheduleToStart(range, next) : null;
  }
  if (option.shift && typeof option.shift === "object") {
    return shiftEvent(range, option.shift);
  }
  return null;
};
