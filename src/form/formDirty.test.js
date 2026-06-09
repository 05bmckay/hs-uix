import { describe, it, expect } from "vitest";
import { isFormDirty, getDirtyFields } from "./formDirty.js";

describe("isFormDirty", () => {
  it("clean when values deep-equal the baseline", () => {
    const baseline = { name: "Ada", tags: ["vip"], meta: { tier: 1 } };
    const values = { name: "Ada", tags: ["vip"], meta: { tier: 1 } };
    expect(isFormDirty(values, baseline)).toBe(false);
  });

  it("dirty on a changed scalar", () => {
    expect(isFormDirty({ name: "Ada" }, { name: "Grace" })).toBe(true);
  });

  it("dirty on nested object changes", () => {
    expect(
      isFormDirty({ meta: { tier: 2 } }, { meta: { tier: 1 } })
    ).toBe(true);
  });

  it("dirty on array order changes", () => {
    expect(isFormDirty({ tags: ["a", "b"] }, { tags: ["b", "a"] })).toBe(true);
  });

  it("handles HubSpot date value objects", () => {
    const baseline = { closedate: { year: 2026, month: 5, date: 9 } };
    expect(isFormDirty({ closedate: { year: 2026, month: 5, date: 9 } }, baseline)).toBe(false);
    expect(isFormDirty({ closedate: { year: 2026, month: 5, date: 10 } }, baseline)).toBe(true);
  });

  it("treats null/undefined inputs as empty objects", () => {
    expect(isFormDirty(undefined, undefined)).toBe(false);
    expect(isFormDirty({}, null)).toBe(false);
    expect(isFormDirty({ a: 1 }, undefined)).toBe(true);
  });

  it("dirty when a key is added or removed", () => {
    expect(isFormDirty({ a: 1, b: 2 }, { a: 1 })).toBe(true);
    expect(isFormDirty({ a: 1 }, { a: 1, b: 2 })).toBe(true);
  });
});

describe("getDirtyFields", () => {
  it("returns only the changed field names", () => {
    const baseline = { name: "Ada", email: "ada@example.com", amount: 100 };
    const values = { name: "Ada", email: "ada@new.com", amount: 250 };
    expect(getDirtyFields(values, baseline)).toEqual(["email", "amount"]);
  });

  it("returns [] for a clean form", () => {
    const baseline = { a: 1, list: [1, 2] };
    expect(getDirtyFields({ a: 1, list: [1, 2] }, baseline)).toEqual([]);
  });

  it("counts keys missing from one side", () => {
    expect(getDirtyFields({ a: 1 }, { a: 1, removed: "x" })).toEqual(["removed"]);
    expect(getDirtyFields({ a: 1, added: "y" }, { a: 1 })).toEqual(["added"]);
  });

  it("treats explicit undefined and a missing key as equal", () => {
    expect(getDirtyFields({ a: 1, b: undefined }, { a: 1 })).toEqual([]);
    expect(getDirtyFields({ a: 1 }, { a: 1, b: undefined })).toEqual([]);
  });

  it("deep-compares nested values", () => {
    const baseline = { rows: [{ qty: 1 }], meta: { tier: 1 } };
    const values = { rows: [{ qty: 2 }], meta: { tier: 1 } };
    expect(getDirtyFields(values, baseline)).toEqual(["rows"]);
  });

  it("handles null/undefined inputs", () => {
    expect(getDirtyFields(undefined, undefined)).toEqual([]);
    expect(getDirtyFields({ a: 1 }, null)).toEqual(["a"]);
  });
});
