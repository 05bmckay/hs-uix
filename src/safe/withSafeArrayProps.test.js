import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withSafeArrayProps } from "./withSafeArrayProps.js";
import { resetSafeWarnings } from "./warnings.js";

const Probe = (props) => props; // never rendered — we only inspect the element

describe("withSafeArrayProps", () => {
  beforeEach(() => {
    resetSafeWarnings();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns undefined for a missing component", () => {
    expect(withSafeArrayProps(undefined, "Nope", ["items"])).toBeUndefined();
  });

  it("passes real arrays through by reference and keeps other props", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    const items = [1, 2];
    const el = Safe({ items, title: "t" });
    expect(el.type).toBe(Probe);
    expect(el.props.items).toBe(items);
    expect(el.props.title).toBe("t");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("coerces null/undefined to [] silently", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items", "fields"]);
    const el = Safe({ items: null });
    expect(el.props.items).toEqual([]);
    expect(el.props.fields).toEqual([]);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("coerces non-arrays to [] with a one-time warning", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    expect(Safe({ items: "oops" }).props.items).toEqual([]);
    expect(Safe({ items: 42 }).props.items).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(1); // deduped by component+prop
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Probe.items must be an array")
    );
  });

  it("tolerates a missing props object and sets displayName", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    expect(Safe.displayName).toBe("SafeProbe");
    expect(Safe(undefined).props.items).toEqual([]);
  });
});
