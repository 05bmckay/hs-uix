import { describe, it, expect } from "vitest";
import {
  extractRowId,
  normalizeExpandedIds,
  expandRowId,
  collapseRowId,
  toggleExpandedId,
  withDetailRows,
} from "./rowExpansion.js";

describe("extractRowId", () => {
  it("reads the default id field", () => {
    expect(extractRowId({ id: 7 })).toBe(7);
  });

  it("reads a custom rowIdField", () => {
    expect(extractRowId({ dealId: "abc" }, "dealId")).toBe("abc");
  });

  it("treats 0 and empty string as valid ids", () => {
    expect(extractRowId({ id: 0 })).toBe(0);
    expect(extractRowId({ id: "" })).toBe("");
  });

  it("falls back when the id is missing, null, or the row is absent", () => {
    expect(extractRowId({ name: "x" })).toBeUndefined();
    expect(extractRowId({ id: null }, "id", "fallback")).toBe("fallback");
    expect(extractRowId(null, "id", 3)).toBe(3);
  });
});

describe("normalizeExpandedIds", () => {
  it("returns an empty set for nullish input", () => {
    expect(normalizeExpandedIds(null).size).toBe(0);
    expect(normalizeExpandedIds(undefined).size).toBe(0);
  });

  it("accepts arrays, dedupes, and drops nullish entries", () => {
    const set = normalizeExpandedIds([1, 2, 2, null, undefined, 3]);
    expect([...set]).toEqual([1, 2, 3]);
  });

  it("copies a Set input (never aliases it)", () => {
    const input = new Set(["a"]);
    const out = normalizeExpandedIds(input);
    expect(out).not.toBe(input);
    expect(out.has("a")).toBe(true);
  });

  it("wraps a single id", () => {
    expect([...normalizeExpandedIds("only")]).toEqual(["only"]);
  });
});

describe("expandRowId", () => {
  it("adds an id without mutating the input", () => {
    const current = new Set([1]);
    const next = expandRowId(current, 2);
    expect([...next].sort()).toEqual([1, 2]);
    expect([...current]).toEqual([1]);
  });

  it("collapses all others in expandSingle mode", () => {
    const next = expandRowId(new Set([1, 2]), 3, true);
    expect([...next]).toEqual([3]);
  });

  it("ignores nullish ids (returns same reference)", () => {
    const current = new Set([1]);
    expect(expandRowId(current, null)).toBe(current);
    expect(expandRowId(current, undefined, true)).toBe(current);
  });
});

describe("collapseRowId", () => {
  it("removes an expanded id without mutating the input", () => {
    const current = new Set([1, 2]);
    const next = collapseRowId(current, 1);
    expect([...next]).toEqual([2]);
    expect(current.has(1)).toBe(true);
  });

  it("is a no-op (same reference) for unknown or nullish ids", () => {
    const current = new Set([1]);
    expect(collapseRowId(current, 9)).toBe(current);
    expect(collapseRowId(current, null)).toBe(current);
  });
});

describe("toggleExpandedId", () => {
  it("expands a collapsed id and collapses an expanded id", () => {
    const expanded = toggleExpandedId(new Set(), "a");
    expect(expanded.has("a")).toBe(true);
    const collapsed = toggleExpandedId(expanded, "a");
    expect(collapsed.has("a")).toBe(false);
  });

  it("acts as an accordion in expandSingle mode", () => {
    const next = toggleExpandedId(new Set(["a", "b"]), "c", true);
    expect([...next]).toEqual(["c"]);
  });

  it("still collapses normally in expandSingle mode", () => {
    const next = toggleExpandedId(new Set(["a"]), "a", true);
    expect(next.size).toBe(0);
  });

  it("ignores nullish ids", () => {
    const current = new Set(["a"]);
    expect(toggleExpandedId(current, null)).toBe(current);
  });
});

describe("withDetailRows", () => {
  const row = (id) => ({ id, name: `Row ${id}` });

  it("inserts a detail item directly after each expanded data row", () => {
    const items = [
      { type: "data", row: row(1) },
      { type: "data", row: row(2) },
    ];
    const out = withDetailRows(items, new Set([2]));
    expect(out.map((i) => i.type)).toEqual(["data", "data", "detail"]);
    expect(out[2].row.id).toBe(2);
  });

  it("keeps detail rows under their data row inside groups", () => {
    const items = [
      { type: "group-header", group: { key: "g1" } },
      { type: "data", row: row(1) },
      { type: "group-header", group: { key: "g2" } },
      { type: "data", row: row(2) },
    ];
    const out = withDetailRows(items, new Set([1, 2]));
    expect(out.map((i) => i.type)).toEqual([
      "group-header", "data", "detail",
      "group-header", "data", "detail",
    ]);
  });

  it("returns the input untouched (same reference) when nothing is expanded", () => {
    const items = [{ type: "data", row: row(1) }];
    expect(withDetailRows(items, new Set())).toBe(items);
    expect(withDetailRows(items, null)).toBe(items);
  });

  it("respects a custom rowIdField and skips rows without ids", () => {
    const items = [
      { type: "data", row: { dealId: "d1" } },
      { type: "data", row: { name: "no id" } },
    ];
    const out = withDetailRows(items, new Set(["d1"]), "dealId");
    expect(out.map((i) => i.type)).toEqual(["data", "detail", "data"]);
  });
});
