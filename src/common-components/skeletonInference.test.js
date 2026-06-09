import { describe, it, expect } from "vitest";
import React from "react";
import {
  applySpecOverrides,
  inferSkeletonSpec,
  resolveElementTypeName,
} from "./skeletonInference.js";
import { Skeleton, SkeletonTable } from "./Skeleton.js";

describe("resolveElementTypeName", () => {
  it("handles native string types, displayName, function name, and null", () => {
    expect(resolveElementTypeName("Table")).toBe("Table");
    const Fn = () => null;
    expect(resolveElementTypeName(Fn)).toBe("Fn");
    Fn.displayName = "Custom";
    expect(resolveElementTypeName(Fn)).toBe("Custom");
    expect(resolveElementTypeName(null)).toBe(null);
    expect(resolveElementTypeName({ displayName: "FormBuilder" })).toBe("FormBuilder");
  });
});

describe("inferSkeletonSpec", () => {
  it("sizes hs-uix tables from columns and pageSize, clamped", () => {
    expect(inferSkeletonSpec("DataTable", { columns: [1, 2, 3], pageSize: 7 }))
      .toEqual({ kind: "table", rows: 7, columns: 3 });
    expect(inferSkeletonSpec("DataTable", {})).toEqual({ kind: "table", rows: 5, columns: 4 });
    expect(inferSkeletonSpec("DataTable", { pageSize: 50, columns: Array(20) }).rows).toBe(10);
    expect(inferSkeletonSpec("CrmDataTable", { properties: ["a", "b"] }).columns).toBe(2);
  });

  it("maps boards, lists, forms, key-value, calendar", () => {
    expect(inferSkeletonSpec("Kanban", { stages: [1, 2, 3, 4] }))
      .toEqual({ kind: "board", columns: 4, cardsPerColumn: 3 });
    expect(inferSkeletonSpec("Feed", { pageSize: 6 })).toEqual({ kind: "list", rows: 6 });
    expect(inferSkeletonSpec("FormBuilder", { fields: Array(5) })).toEqual({ kind: "form", rows: 5 });
    expect(inferSkeletonSpec("KeyValueList", { items: Array(2) })).toEqual({ kind: "keyvalue", rows: 2 });
    expect(inferSkeletonSpec("Calendar", {})).toEqual({ kind: "block", height: 320 });
  });

  it("maps native string components", () => {
    expect(inferSkeletonSpec("Table", {})).toEqual({ kind: "table", rows: 4, columns: 3 });
    expect(inferSkeletonSpec("Form", {})).toEqual({ kind: "form", rows: 4 });
    expect(inferSkeletonSpec("DescriptionList", { children: [1, 2, 3, 4] }).rows).toBe(4);
    expect(inferSkeletonSpec("Statistics", { children: [1, 2] }))
      .toEqual({ kind: "stats", columns: 2 });
    expect(inferSkeletonSpec("Select", {})).toEqual({ kind: "input" });
    expect(inferSkeletonSpec("DateInput", {})).toEqual({ kind: "input" });
    expect(inferSkeletonSpec("Button", {})).toEqual({ kind: "chip" });
    expect(inferSkeletonSpec("BarChart", {})).toEqual({ kind: "block", height: 240 });
    expect(inferSkeletonSpec("Image", { height: 64 })).toEqual({ kind: "block", height: 64 });
    expect(inferSkeletonSpec("Text", {})).toEqual({ kind: "text", lines: 1 });
  });

  it("falls back to a text block for unknown components", () => {
    expect(inferSkeletonSpec("SomethingElse", {})).toEqual({ kind: "text", lines: 3 });
    expect(inferSkeletonSpec(null, {})).toEqual({ kind: "text", lines: 3 });
  });
});

describe("applySpecOverrides", () => {
  it("variant replaces the kind; sizing props refine", () => {
    const spec = inferSkeletonSpec("DataTable", {});
    expect(applySpecOverrides(spec, { rows: 2 })).toEqual({ kind: "table", rows: 2, columns: 4 });
    expect(applySpecOverrides(spec, { variant: "text", lines: 5 }).kind).toBe("text");
    expect(applySpecOverrides(spec, {})).toEqual(spec);
  });
});

describe("Skeleton wrapper mode", () => {
  it("renders children untouched when not loading", () => {
    expect(Skeleton({ loading: false, children: "content" })).toBe("content");
    expect(Skeleton({ children: "content" })).toBe("content"); // loading defaults false
  });

  it("infers a shape from the child while loading", () => {
    const el = Skeleton({
      loading: true,
      children: React.createElement("Table", {}),
    });
    expect(el.type).toBe(SkeletonTable);
    expect(el.props.rows).toBe(4);
    expect(el.props.columns).toBe(3);
  });

  it("uses a user-supplied skeleton node instead of inference", () => {
    const custom = React.createElement("Tile", {});
    const el = Skeleton({ loading: true, skeleton: custom, children: "x" });
    expect(el).toBe(custom);
  });

  it("applies variant/sizing overrides to the inference", () => {
    const el = Skeleton({
      loading: true,
      rows: 9,
      children: React.createElement("Table", {}),
    });
    expect(el.props.rows).toBe(9);
  });

  it("stacks multiple children in a column", () => {
    const el = Skeleton({
      loading: true,
      children: [
        React.createElement("Table", { key: "a" }),
        React.createElement("Form", { key: "b" }),
      ],
    });
    expect(el.props.direction).toBe("column");
    expect(el.props.children).toHaveLength(2);
  });
});

describe("Skeleton static composite variants", () => {
  it("renders composite shapes without children", () => {
    const el = Skeleton({ variant: "table", rows: 2, columns: 5 });
    expect(el.type).toBe(SkeletonTable);
    expect(el.props.rows).toBe(2);
    expect(el.props.columns).toBe(5);
  });

  it("still renders primitive variants as a single image", () => {
    const el = Skeleton({ variant: "text", lines: 2 });
    expect(typeof el.props.src).toBe("string");
    expect(el.props.src.startsWith("data:image/svg+xml")).toBe(true);
  });
});
