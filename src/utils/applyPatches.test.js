import { describe, it, expect, vi, afterEach } from "vitest";
import { applyPatches } from "./applyPatches.js";

describe("applyPatches", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the input untouched for empty or missing patches", () => {
    const doc = { a: 1 };
    expect(applyPatches(doc, [])).toBe(doc);
    expect(applyPatches(doc, null)).toBe(doc);
    expect(applyPatches(doc, undefined)).toBe(doc);
    expect(applyPatches(null, [])).toBe(null);
  });

  it("adds and replaces values at nested paths", () => {
    const doc = { meta: { title: "old" } };
    const out = applyPatches(doc, [
      { op: "replace", path: "/meta/title", value: "new" },
      { op: "add", path: "/meta/subtitle", value: "sub" },
    ]);
    expect(out).toEqual({ meta: { title: "new", subtitle: "sub" } });
  });

  it("starts from {} when the document is null and patches exist", () => {
    expect(applyPatches(null, [{ op: "add", path: "/a", value: 1 }])).toEqual({ a: 1 });
    expect(applyPatches(undefined, [{ op: "add", path: "/a", value: 1 }])).toEqual({ a: 1 });
  });

  it("replaces the whole document for the root pointer", () => {
    expect(applyPatches({ a: 1 }, [{ op: "replace", path: "", value: { b: 2 } }])).toEqual({ b: 2 });
    expect(applyPatches({ a: 1 }, [{ op: "add", path: "/", value: 42 }])).toBe(42);
  });

  it("creates missing path prefixes permissively (objects by default, arrays for numeric segments)", () => {
    const out = applyPatches({}, [{ op: "add", path: "/elements/hero/props/title", value: "Hi" }]);
    expect(out).toEqual({ elements: { hero: { props: { title: "Hi" } } } });

    const withArray = applyPatches({}, [{ op: "add", path: "/rows/0/name", value: "first" }]);
    expect(withArray).toEqual({ rows: [{ name: "first" }] });

    const dashArray = applyPatches({}, [{ op: "add", path: "/rows/-", value: "x" }]);
    expect(dashArray).toEqual({ rows: ["x"] });
  });

  it("removes object keys and array items", () => {
    const out = applyPatches(
      { a: 1, b: 2, list: ["x", "y", "z"] },
      [
        { op: "remove", path: "/a" },
        { op: "remove", path: "/list/1" },
      ]
    );
    expect(out).toEqual({ b: 2, list: ["x", "z"] });
  });

  it("appends with the '-' array pointer and replaces by index", () => {
    const out = applyPatches({ list: ["a"] }, [
      { op: "add", path: "/list/-", value: "b" },
      { op: "replace", path: "/list/0", value: "A" },
    ]);
    expect(out).toEqual({ list: ["A", "b"] });
  });

  it("moves values between paths", () => {
    const out = applyPatches(
      { draft: { title: "T" }, published: {} },
      [{ op: "move", from: "/draft/title", path: "/published/title" }]
    );
    expect(out).toEqual({ draft: {}, published: { title: "T" } });
  });

  it("copies values without sharing references", () => {
    const out = applyPatches(
      { source: { nested: { n: 1 } } },
      [{ op: "copy", from: "/source/nested", path: "/dest" }]
    );
    expect(out.dest).toEqual({ n: 1 });
    expect(out.dest).not.toBe(out.source.nested);
  });

  it("unescapes ~1 (/) and ~0 (~) in pointer segments", () => {
    const out = applyPatches({}, [
      { op: "add", path: "/a~1b", value: "slash" },
      { op: "add", path: "/c~0d", value: "tilde" },
    ]);
    expect(out).toEqual({ "a/b": "slash", "c~d": "tilde" });
  });

  it("never mutates the input and shares untouched branches", () => {
    const doc = { keep: { deep: [1, 2] }, change: { v: "old" } };
    const out = applyPatches(doc, [{ op: "replace", path: "/change/v", value: "new" }]);
    expect(doc).toEqual({ keep: { deep: [1, 2] }, change: { v: "old" } });
    expect(out).not.toBe(doc);
    expect(out.change).not.toBe(doc.change);
    expect(out.keep).toBe(doc.keep); // structural sharing
  });

  it("applies patches in order", () => {
    const out = applyPatches({}, [
      { op: "add", path: "/v", value: 1 },
      { op: "replace", path: "/v", value: 2 },
      { op: "add", path: "/list", value: [] },
      { op: "add", path: "/list/-", value: "a" },
      { op: "add", path: "/list/-", value: "b" },
    ]);
    expect(out).toEqual({ v: 2, list: ["a", "b"] });
  });

  it("skips unsupported ops (including test) with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const doc = { a: 1 };
    const out = applyPatches(doc, [{ op: "test", path: "/a", value: 1 }]);
    expect(out).toBe(doc);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("throws on a pointer that does not start with /", () => {
    expect(() => applyPatches({}, [{ op: "add", path: "a/b", value: 1 }])).toThrow(/JSON Pointer/);
  });

  it("removing a missing path is a safe no-op on objects", () => {
    const doc = { a: { b: 1 } };
    const out = applyPatches(doc, [{ op: "remove", path: "/a/missing/deep" }]);
    expect(out).toEqual({ a: { b: 1 } });
  });
});
