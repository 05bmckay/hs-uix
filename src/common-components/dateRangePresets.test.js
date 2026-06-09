import { describe, it, expect } from "vitest";
import {
  DATE_FILTER_OPERATORS,
  DATE_RANGE_CUSTOM_VALUE,
  compareHsDateValues,
  isValidDateRange,
  presetToRange,
  toHsDateValue,
} from "./dateRangePresets.js";
import { HS_DATE_PRESETS } from "./datePresets.js";

// Shorthand: HubSpot date value object (month 0-indexed, like JS Date).
const d = (year, month, date) => ({ year, month, date });

// Fixed reference dates (constructed locally — month is 0-indexed):
const TUE_JUN_9_2026 = new Date(2026, 5, 9); // Tuesday
const THU_JAN_1_2026 = new Date(2026, 0, 1); // year boundary, Thursday
const FRI_MAR_15_2024 = new Date(2024, 2, 15); // leap year, Friday
const SUN_MAR_15_2026 = new Date(2026, 2, 15); // non-leap, Sunday
const THU_FEB_29_2024 = new Date(2024, 1, 29); // leap day itself
const SAT_JAN_2_2027 = new Date(2027, 0, 2); // week spans year boundary

describe("DATE_FILTER_OPERATORS", () => {
  it("covers HubSpot's CRM date filter operator values", () => {
    expect(DATE_FILTER_OPERATORS.map((operator) => operator.value)).toEqual([
      "InRollingDateRange",
      "Equal",
      "BeforeDateStaticOrDynamic",
      "AfterDateStaticOrDynamic",
      "InRange",
      "GreaterRolling",
      "LessRolling",
      "Known",
      "NotKnown",
    ]);
  });
});

describe("toHsDateValue", () => {
  it("converts a Date to a { year, month, date } value object", () => {
    expect(toHsDateValue(new Date(2026, 5, 9))).toEqual(d(2026, 5, 9));
    expect(toHsDateValue(new Date(2024, 1, 29))).toEqual(d(2024, 1, 29));
  });

  it("returns null for invalid input", () => {
    expect(toHsDateValue(null)).toBeNull();
    expect(toHsDateValue("2026-06-09")).toBeNull();
    expect(toHsDateValue(new Date("nope"))).toBeNull();
  });
});

describe("compareHsDateValues", () => {
  it("orders across day, month, and year fields", () => {
    expect(compareHsDateValues(d(2026, 5, 9), d(2026, 5, 10))).toBeLessThan(0);
    expect(compareHsDateValues(d(2026, 4, 30), d(2026, 5, 1))).toBeLessThan(0);
    expect(compareHsDateValues(d(2026, 11, 31), d(2027, 0, 1))).toBeLessThan(0);
    expect(compareHsDateValues(d(2026, 5, 9), d(2026, 5, 9))).toBe(0);
    expect(compareHsDateValues(d(2026, 5, 10), d(2026, 5, 9))).toBeGreaterThan(0);
  });

  it("treats a null side as 0 (no constraint)", () => {
    expect(compareHsDateValues(null, d(2026, 5, 9))).toBe(0);
    expect(compareHsDateValues(d(2026, 5, 9), null)).toBe(0);
    expect(compareHsDateValues(null, null)).toBe(0);
  });
});

describe("isValidDateRange", () => {
  it("accepts open-ended and empty ranges", () => {
    expect(isValidDateRange(null)).toBe(true);
    expect(isValidDateRange({ from: null, to: null })).toBe(true);
    expect(isValidDateRange({ from: d(2026, 5, 9), to: null })).toBe(true);
    expect(isValidDateRange({ from: null, to: d(2026, 5, 9) })).toBe(true);
  });

  it("accepts from <= to (including same day)", () => {
    expect(isValidDateRange({ from: d(2026, 5, 9), to: d(2026, 5, 9) })).toBe(true);
    expect(isValidDateRange({ from: d(2026, 4, 30), to: d(2026, 5, 1) })).toBe(true);
  });

  it("rejects from > to", () => {
    expect(isValidDateRange({ from: d(2026, 5, 10), to: d(2026, 5, 9) })).toBe(false);
    expect(isValidDateRange({ from: d(2027, 0, 1), to: d(2026, 11, 31) })).toBe(false);
  });
});

describe("presetToRange — single days", () => {
  it("today / yesterday / tomorrow", () => {
    expect(presetToRange("today", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 9), to: d(2026, 5, 9),
    });
    expect(presetToRange("yesterday", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 8), to: d(2026, 5, 8),
    });
    expect(presetToRange("tomorrow", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 10), to: d(2026, 5, 10),
    });
  });

  it("crosses month and year boundaries", () => {
    expect(presetToRange("yesterday", THU_JAN_1_2026)).toEqual({
      from: d(2025, 11, 31), to: d(2025, 11, 31),
    });
    expect(presetToRange("tomorrow", THU_FEB_29_2024)).toEqual({
      from: d(2024, 2, 1), to: d(2024, 2, 1),
    });
  });
});

describe("presetToRange — weeks (Sunday through Saturday)", () => {
  it("this_week / last_week from a mid-week day", () => {
    // Tue Jun 9 2026 → week of Sun Jun 7 .. Sat Jun 13
    expect(presetToRange("this_week", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 7), to: d(2026, 5, 13),
    });
    // Previous week spans the May/June boundary: Sun May 31 .. Sat Jun 6
    expect(presetToRange("last_week", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 4, 31), to: d(2026, 5, 6),
    });
  });

  it("a Sunday is the START of its own week", () => {
    expect(presetToRange("this_week", SUN_MAR_15_2026)).toEqual({
      from: d(2026, 2, 15), to: d(2026, 2, 21),
    });
    expect(presetToRange("last_week", SUN_MAR_15_2026)).toEqual({
      from: d(2026, 2, 8), to: d(2026, 2, 14),
    });
  });

  it("weeks spanning a year boundary", () => {
    // Sat Jan 2 2027 → week of Sun Dec 27 2026 .. Sat Jan 2 2027
    expect(presetToRange("this_week", SAT_JAN_2_2027)).toEqual({
      from: d(2026, 11, 27), to: d(2027, 0, 2),
    });
    expect(presetToRange("last_week", SAT_JAN_2_2027)).toEqual({
      from: d(2026, 11, 20), to: d(2026, 11, 26),
    });
  });
});

describe("presetToRange — rolling windows (include today)", () => {
  it("7d / 30d / 90d end today", () => {
    expect(presetToRange("7d", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 3), to: d(2026, 5, 9),
    });
    expect(presetToRange("30d", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 4, 11), to: d(2026, 5, 9),
    });
    expect(presetToRange("90d", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 2, 12), to: d(2026, 5, 9),
    });
  });

  it("windows cross year boundaries", () => {
    expect(presetToRange("7d", THU_JAN_1_2026)).toEqual({
      from: d(2025, 11, 26), to: d(2026, 0, 1),
    });
    expect(presetToRange("90d", THU_JAN_1_2026)).toEqual({
      from: d(2025, 9, 4), to: d(2026, 0, 1),
    });
  });

  it("windows respect leap years (30d over Feb 2024 vs Feb 2026)", () => {
    // Leap year: Mar 15 2024 − 29 days = Feb 15 2024
    expect(presetToRange("30d", FRI_MAR_15_2024)).toEqual({
      from: d(2024, 1, 15), to: d(2024, 2, 15),
    });
    // Non-leap: Mar 15 2026 − 29 days = Feb 14 2026
    expect(presetToRange("30d", SUN_MAR_15_2026)).toEqual({
      from: d(2026, 1, 14), to: d(2026, 2, 15),
    });
  });
});

describe("presetToRange — months", () => {
  it("this_month / last_month", () => {
    expect(presetToRange("this_month", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 5, 1), to: d(2026, 5, 30),
    });
    expect(presetToRange("last_month", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 4, 1), to: d(2026, 4, 31),
    });
  });

  it("last_month from January reaches back to December of the prior year", () => {
    expect(presetToRange("last_month", THU_JAN_1_2026)).toEqual({
      from: d(2025, 11, 1), to: d(2025, 11, 31),
    });
  });

  it("February length follows the leap cycle", () => {
    // 2024 is a leap year → Feb has 29 days
    expect(presetToRange("last_month", FRI_MAR_15_2024)).toEqual({
      from: d(2024, 1, 1), to: d(2024, 1, 29),
    });
    expect(presetToRange("this_month", THU_FEB_29_2024)).toEqual({
      from: d(2024, 1, 1), to: d(2024, 1, 29),
    });
    // 2026 is not → Feb has 28 days
    expect(presetToRange("last_month", SUN_MAR_15_2026)).toEqual({
      from: d(2026, 1, 1), to: d(2026, 1, 28),
    });
  });
});

describe("presetToRange — quarters", () => {
  it("this_quarter / last_quarter mid-year", () => {
    // Jun 9 2026 is in Q2 (Apr–Jun)
    expect(presetToRange("this_quarter", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 3, 1), to: d(2026, 5, 30),
    });
    expect(presetToRange("last_quarter", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 0, 1), to: d(2026, 2, 31),
    });
  });

  it("last_quarter from Q1 reaches back to Q4 of the prior year", () => {
    expect(presetToRange("this_quarter", THU_JAN_1_2026)).toEqual({
      from: d(2026, 0, 1), to: d(2026, 2, 31),
    });
    expect(presetToRange("last_quarter", THU_JAN_1_2026)).toEqual({
      from: d(2025, 9, 1), to: d(2025, 11, 31),
    });
  });

  it("each month maps to the correct quarter start", () => {
    const starts = [0, 0, 0, 3, 3, 3, 6, 6, 6, 9, 9, 9];
    starts.forEach((startMonth, month) => {
      const range = presetToRange("this_quarter", new Date(2026, month, 15));
      expect(range.from).toEqual(d(2026, startMonth, 1));
      expect(range.to.month).toBe(startMonth + 2);
    });
  });
});

describe("presetToRange — years", () => {
  it("this_year / last_year", () => {
    expect(presetToRange("this_year", TUE_JUN_9_2026)).toEqual({
      from: d(2026, 0, 1), to: d(2026, 11, 31),
    });
    expect(presetToRange("last_year", TUE_JUN_9_2026)).toEqual({
      from: d(2025, 0, 1), to: d(2025, 11, 31),
    });
  });
});

describe("presetToRange — contract", () => {
  it("returns null for unknown / empty / custom keys", () => {
    expect(presetToRange("nope", TUE_JUN_9_2026)).toBeNull();
    expect(presetToRange("", TUE_JUN_9_2026)).toBeNull();
    expect(presetToRange(null, TUE_JUN_9_2026)).toBeNull();
    expect(presetToRange(DATE_RANGE_CUSTOM_VALUE, TUE_JUN_9_2026)).toBeNull();
    expect(presetToRange("today", new Date("nope"))).toBeNull();
  });

  it("covers EVERY key in HS_DATE_PRESETS with a valid range", () => {
    for (const preset of HS_DATE_PRESETS) {
      const range = presetToRange(preset.value, TUE_JUN_9_2026);
      expect(range, `preset "${preset.value}" should resolve`).not.toBeNull();
      expect(isValidDateRange(range)).toBe(true);
      expect(compareHsDateValues(range.from, range.to)).toBeLessThanOrEqual(0);
    }
  });

  it("defaults `now` to the current date", () => {
    const expected = toHsDateValue(new Date());
    expect(presetToRange("today")).toEqual({ from: expected, to: expected });
  });
});
