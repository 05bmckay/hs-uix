import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withSafeArrayProps } from "./withSafeArrayProps.js";
import { resetSafeWarnings } from "./warnings.js";

const Probe = (props) => props; // never rendered — we only inspect the element

// The wrapper is a forwardRef component; invoke its render directly to get
// the element it would produce (pure-logic testing, no renderer).
const renderSafe = (Safe, props, ref = null) => Safe.render(props ?? {}, ref);

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
    const el = renderSafe(Safe, { items, title: "t" });
    expect(el.type).toBe(Probe);
    expect(el.props.items).toBe(items);
    expect(el.props.title).toBe("t");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("coerces null/undefined to [] silently", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items", "fields"]);
    const el = renderSafe(Safe, { items: null });
    expect(el.props.items).toEqual([]);
    expect(el.props.fields).toEqual([]);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("coerces non-arrays to [] with a one-time warning", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    expect(renderSafe(Safe, { items: "oops" }).props.items).toEqual([]);
    expect(renderSafe(Safe, { items: 42 }).props.items).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(1); // deduped by component+prop
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Probe.items must be an array")
    );
  });

  it("derive props: null/undefined pass through, non-arrays are dropped with a warning", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", [], ["columns"]);
    const untouched = renderSafe(Safe, { title: "t" });
    expect("columns" in untouched.props).toBe(false);

    const nullThrough = renderSafe(Safe, { columns: null });
    expect(nullThrough.props.columns).toBe(null);

    const cols = [{ field: "a" }];
    expect(renderSafe(Safe, { columns: cols }).props.columns).toBe(cols);

    const dropped = renderSafe(Safe, { columns: "garbage" });
    expect("columns" in dropped.props).toBe(false);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("derives it automatically")
    );
  });

  it("forwards refs to the wrapped component", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    const ref = { current: null };
    const el = renderSafe(Safe, { items: [] }, ref);
    expect(el.ref).toBe(ref);
  });

  it("tolerates a missing props object and sets displayName", () => {
    const Safe = withSafeArrayProps(Probe, "Probe", ["items"]);
    expect(Safe.displayName).toBe("SafeProbe");
    expect(renderSafe(Safe, undefined).props.items).toEqual([]);
  });
});
