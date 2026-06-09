import { describe, it, expect } from "vitest";
import {
  shiftDate,
  shiftEvent,
  calendarDayDelta,
  msIntoDay,
  rescheduleToStart,
  applyDatePick,
  DEFAULT_RESCHEDULE_PRESETS,
  normalizeRescheduleOptions,
  resolveRescheduleTarget,
} from "./rescheduleUtils.js";

// The DST suite needs real America/Chicago local-time semantics (the shift math
// is local-Date math, unlike dateUtils' Intl-based zone tests). Node ≥ 13
// re-reads TZ on assignment; if this platform doesn't, the DST block skips
// rather than false-failing — the zone-independent math still runs everywhere.
process.env.TZ = "America/Chicago";
const inChicago =
  new Date(2026, 2, 8, 12).getTimezoneOffset() === 300 && // CDT after spring-forward
  new Date(2026, 0, 15, 12).getTimezoneOffset() === 360; // CST in January

// ── shiftDate: calendar day/week shifts + exact hour/minute durations ────────
describe("shiftDate", () => {
  const base = new Date(2026, 5, 9, 9, 0, 0); // Tue Jun 9 2026, 9:00 AM (no DST nearby)

  it("shifts by days preserving the time-of-day", () => {
    const d = shiftDate(base, { days: 2 });
    expect(d.getDate()).toBe(11);
    expect(d.getHours()).toBe(9);
  });

  it("combines weeks + days into one calendar shift", () => {
    const d = shiftDate(base, { weeks: 1, days: 1 });
    expect(d.getDate()).toBe(17); // 9 + 8
    expect(d.getHours()).toBe(9);
  });

  it("shifts hours/minutes as exact clock durations", () => {
    const d = shiftDate(base, { hours: 2, minutes: 30 });
    expect(d.getTime() - base.getTime()).toBe(2.5 * 3600000);
    expect(d.getHours()).toBe(11);
    expect(d.getMinutes()).toBe(30);
  });

  it("coerces any toDate-able input (date-only string → local midnight)", () => {
    const d = shiftDate("2026-06-09", { days: 1 });
    expect(d.getDate()).toBe(10);
    expect(d.getHours()).toBe(0);
  });

  it("returns an equal NEW Date for an empty/missing shift", () => {
    const same = shiftDate(base, {});
    expect(same.getTime()).toBe(base.getTime());
    expect(same).not.toBe(base);
    expect(shiftDate(base, null).getTime()).toBe(base.getTime());
  });

  it("returns null for unparseable input", () => {
    expect(shiftDate(null, { days: 1 })).toBeNull();
    expect(shiftDate("not a date", { days: 1 })).toBeNull();
  });
});

// ── shiftEvent: both endpoints move together ─────────────────────────────────
describe("shiftEvent", () => {
  it("shifts start AND end, preserving the event's shape", () => {
    const range = {
      start: new Date(2026, 5, 9, 9, 0),
      end: new Date(2026, 5, 9, 10, 30),
    };
    const next = shiftEvent(range, { days: 1 });
    expect(next.start.getDate()).toBe(10);
    expect(next.start.getHours()).toBe(9);
    expect(next.end.getDate()).toBe(10);
    expect(next.end.getHours()).toBe(10);
    expect(next.end.getMinutes()).toBe(30);
  });

  it("mirrors the shifted start when end is missing", () => {
    const next = shiftEvent({ start: new Date(2026, 5, 9, 9, 0) }, { hours: 1 });
    expect(next.end.getTime()).toBe(next.start.getTime());
  });

  it("returns null when start is unparseable", () => {
    expect(shiftEvent({ start: null }, { days: 1 })).toBeNull();
  });
});

// ── calendarDayDelta / msIntoDay ─────────────────────────────────────────────
describe("calendarDayDelta / msIntoDay", () => {
  it("counts whole calendar days, ignoring time-of-day", () => {
    expect(calendarDayDelta(new Date(2026, 5, 9, 23, 0), new Date(2026, 5, 10, 1, 0))).toBe(1);
    expect(calendarDayDelta(new Date(2026, 5, 9), new Date(2026, 5, 9, 18))).toBe(0);
    expect(calendarDayDelta(new Date(2026, 5, 10), new Date(2026, 5, 8))).toBe(-2);
  });

  it("msIntoDay reads the wall-clock time-of-day", () => {
    expect(msIntoDay(new Date(2026, 5, 9, 9, 30))).toBe((9 * 60 + 30) * 60000);
    expect(msIntoDay(new Date(2026, 5, 9))).toBe(0);
  });
});

// ── rescheduleToStart: arbitrary new start, end carried with the shape ───────
describe("rescheduleToStart", () => {
  it("moves a timed meeting keeping its duration", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 5, 9, 9, 0), end: new Date(2026, 5, 9, 10, 30) },
      new Date(2026, 5, 20, 14, 0)
    );
    expect(next.start.getDate()).toBe(20);
    expect(next.start.getHours()).toBe(14);
    expect(next.end.getDate()).toBe(20);
    expect(next.end.getHours()).toBe(15);
    expect(next.end.getMinutes()).toBe(30);
  });

  it("keeps an overnight event's relative shape (11 PM–1 AM → 10 AM–noon)", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 5, 9, 23, 0), end: new Date(2026, 5, 10, 1, 0) },
      new Date(2026, 5, 20, 10, 0)
    );
    expect(next.end.getDate()).toBe(20); // same day as the new start
    expect(next.end.getHours()).toBe(12);
  });

  it("keeps a midnight-to-midnight multi-day span anchored to midnight", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 5, 8), end: new Date(2026, 5, 10) },
      new Date(2026, 5, 15)
    );
    expect(next.end.getDate()).toBe(17);
    expect(next.end.getHours()).toBe(0);
  });

  it("coerces the new start (date-only string → local midnight)", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 5, 9, 9, 0), end: new Date(2026, 5, 9, 10, 30) },
      "2026-06-20"
    );
    expect(next.start.getHours()).toBe(0);
    // duration preserved: 90 minutes after the (midnight) start
    expect(next.end.getHours()).toBe(1);
    expect(next.end.getMinutes()).toBe(30);
  });

  it("returns null when either date is unparseable", () => {
    expect(rescheduleToStart({ start: null }, new Date())).toBeNull();
    expect(rescheduleToStart({ start: new Date() }, "nope")).toBeNull();
  });
});

// ── applyDatePick: DateInput value + original time-of-day ────────────────────
describe("applyDatePick", () => {
  it("moves to the picked day keeping the original clock time", () => {
    const d = applyDatePick(new Date(2026, 5, 9, 9, 15), { year: 2026, month: 6, date: 4 });
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(4);
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(15);
  });

  it("lands on midnight when there is no original start", () => {
    const d = applyDatePick(null, { year: 2026, month: 6, date: 4 });
    expect(d.getHours()).toBe(0);
  });

  it("returns null for a non-DateInput value (e.g. a cleared picker)", () => {
    expect(applyDatePick(new Date(), null)).toBeNull();
    expect(applyDatePick(new Date(), { year: 2026 })).toBeNull();
  });
});

// ── normalizeRescheduleOptions: every prop shape → labeled entries ───────────
describe("normalizeRescheduleOptions", () => {
  it("true → the default presets (+1 hour / +1 day / Next week)", () => {
    expect(normalizeRescheduleOptions(true)).toBe(DEFAULT_RESCHEDULE_PRESETS);
    expect(DEFAULT_RESCHEDULE_PRESETS.map((p) => p.label)).toEqual([
      "+1 hour",
      "+1 day",
      "Next week",
    ]);
  });

  it("falsy / non-array → []", () => {
    expect(normalizeRescheduleOptions(false)).toEqual([]);
    expect(normalizeRescheduleOptions(undefined)).toEqual([]);
    expect(normalizeRescheduleOptions("tomorrow")).toEqual([]);
  });

  it("keeps { label, shift } objects and converts fn shifts to getStart", () => {
    const fn = () => new Date();
    const out = normalizeRescheduleOptions([
      { label: "+2 days", shift: { days: 2 } },
      { label: "Custom", shift: fn },
      { label: "Also custom", getStart: fn },
    ]);
    expect(out[0]).toEqual({ label: "+2 days", shift: { days: 2 } });
    expect(out[1]).toEqual({ label: "Custom", getStart: fn });
    expect(out[2]).toEqual({ label: "Also custom", getStart: fn });
  });

  it("labels a bare function from its name, falling back to 'Reschedule'", () => {
    function nextMonday() {}
    const out = normalizeRescheduleOptions([nextMonday, () => null]);
    expect(out[0].label).toBe("nextMonday");
    expect(out[0].getStart).toBe(nextMonday);
    // an inline arrow in an array literal has no name
    expect(out[1].label).toBe("Reschedule");
  });

  it("drops entries that can't produce a target", () => {
    const out = normalizeRescheduleOptions([
      {},
      { label: "no shift" },
      { shift: { days: 1 } }, // no label
      null,
      "tomorrow",
    ]);
    expect(out).toEqual([]);
  });
});

// ── resolveRescheduleTarget: option → { start, end } ─────────────────────────
describe("resolveRescheduleTarget", () => {
  const range = {
    start: new Date(2026, 5, 9, 9, 0),
    end: new Date(2026, 5, 9, 10, 0),
  };

  it("applies a shift option to both endpoints", () => {
    const next = resolveRescheduleTarget(range, { label: "+1 day", shift: { days: 1 } });
    expect(next.start.getDate()).toBe(10);
    expect(next.end.getDate()).toBe(10);
    expect(next.end.getHours()).toBe(10);
  });

  it("passes fnArg (the normalized event) to a getStart accessor", () => {
    const seen = [];
    const event = { raw: { id: 7 }, start: range.start, end: range.end };
    const next = resolveRescheduleTarget(
      range,
      {
        label: "Custom",
        getStart: (e) => {
          seen.push(e);
          return new Date(2026, 5, 12, 9, 0);
        },
      },
      event
    );
    expect(seen[0]).toBe(event);
    expect(next.start.getDate()).toBe(12);
    expect(next.end.getDate()).toBe(12);
  });

  it("accepts toDate-coercible accessor returns (ISO string)", () => {
    const next = resolveRescheduleTarget(range, { label: "x", getStart: () => "2026-06-12" });
    expect(next.start.getDate()).toBe(12);
  });

  it("returns null for a null accessor result, a missing start, or no option", () => {
    expect(resolveRescheduleTarget(range, { label: "x", getStart: () => null })).toBeNull();
    expect(resolveRescheduleTarget({ start: null }, { label: "x", shift: { days: 1 } })).toBeNull();
    expect(resolveRescheduleTarget(range, null)).toBeNull();
  });
});

// ── DST: America/Chicago (spring-forward 2026-03-08 2 AM, fall-back 2026-11-01) ──
describe.runIf(inChicago)("DST behavior (America/Chicago)", () => {
  it("+1 day across spring-forward keeps the 9 AM wall-clock (23 real hours)", () => {
    const start = new Date(2026, 2, 7, 9, 0); // Sat Mar 7, 9:00 CST
    const next = shiftDate(start, { days: 1 });
    expect(next.getDate()).toBe(8);
    expect(next.getHours()).toBe(9); // still 9 AM, now CDT
    expect(next.getTime() - start.getTime()).toBe(23 * 3600000);
  });

  it("+1 day across fall-back keeps the 9 AM wall-clock (25 real hours)", () => {
    const start = new Date(2026, 9, 31, 9, 0); // Sat Oct 31, 9:00 CDT
    const next = shiftDate(start, { days: 1 });
    expect(next.getDate()).toBe(1);
    expect(next.getMonth()).toBe(10);
    expect(next.getHours()).toBe(9);
    expect(next.getTime() - start.getTime()).toBe(25 * 3600000);
  });

  it("+1 week across spring-forward keeps the wall-clock time", () => {
    const next = shiftDate(new Date(2026, 2, 4, 14, 0), { weeks: 1 });
    expect(next.getDate()).toBe(11);
    expect(next.getHours()).toBe(14);
  });

  it("+1 hour is an EXACT clock hour even when the label jumps (1:30 → 3:30)", () => {
    const start = new Date(2026, 2, 8, 1, 30); // 1:30 AM CST, transition at 2:00
    const next = shiftDate(start, { hours: 1 });
    expect(next.getTime() - start.getTime()).toBe(3600000);
    expect(next.getHours()).toBe(3); // 2:30 doesn't exist; the instant is 3:30 CDT
    expect(next.getMinutes()).toBe(30);
  });

  it("shiftEvent keeps an all-day span midnight-to-midnight across the transition", () => {
    // Sun Mar 8 00:00 → Mon Mar 9 00:00 is only 23 real hours. Re-adding the raw
    // ms duration after shifting the start would end at Mar 15 23:00; shifting
    // BOTH endpoints keeps midnight.
    const next = shiftEvent(
      { start: new Date(2026, 2, 8), end: new Date(2026, 2, 9) },
      { weeks: 1 }
    );
    expect(next.start.getDate()).toBe(15);
    expect(next.start.getHours()).toBe(0);
    expect(next.end.getDate()).toBe(16);
    expect(next.end.getHours()).toBe(0);
  });

  it("rescheduleToStart preserves the wall-clock duration across the transition", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 2, 7, 9, 0), end: new Date(2026, 2, 7, 10, 30) },
      new Date(2026, 2, 9, 9, 0) // crosses the Mar 8 spring-forward
    );
    expect(next.end.getDate()).toBe(9);
    expect(next.end.getHours()).toBe(10);
    expect(next.end.getMinutes()).toBe(30);
  });

  it("rescheduleToStart keeps a DST-straddling all-day span anchored to midnight", () => {
    const next = rescheduleToStart(
      { start: new Date(2026, 2, 8), end: new Date(2026, 2, 9) }, // 23-hour "day"
      new Date(2026, 2, 15)
    );
    expect(next.end.getDate()).toBe(16);
    expect(next.end.getHours()).toBe(0);
  });
});
