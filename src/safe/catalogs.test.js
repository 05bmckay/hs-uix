import { describe, it, expect } from "vitest";
import {
  NATIVE_ICON_NAMES,
  ICON_NAME_ALIASES,
  EMPTY_STATE_IMAGES,
  EMPTY_STATE_IMAGE_ALIASES,
  TREND_DIRECTIONS,
  TREND_DIRECTION_ALIASES,
  SAFE_ARRAY_PROPS,
} from "./catalogs.js";

describe("catalogs", () => {
  it("ships the full native icon whitelist", () => {
    expect(NATIVE_ICON_NAMES.size).toBe(190);
    expect(NATIVE_ICON_NAMES.has("xCircle")).toBe(true);
    expect(NATIVE_ICON_NAMES.has("warning")).toBe(true);
    expect(NATIVE_ICON_NAMES.has("copy")).toBe(true);
    expect(NATIVE_ICON_NAMES.has("not-an-icon")).toBe(false);
  });

  it("maps every icon alias to a valid native name", () => {
    for (const [alias, target] of Object.entries(ICON_NAME_ALIASES)) {
      expect(NATIVE_ICON_NAMES.has(target), `${alias} → ${target}`).toBe(true);
      // an alias that IS a valid name would never be reached
      expect(NATIVE_ICON_NAMES.has(alias), `alias ${alias} shadows a real name`).toBe(false);
    }
  });

  it("maps every empty-state alias (and the hard fallback) to a valid image", () => {
    expect(EMPTY_STATE_IMAGES.has("components")).toBe(true); // hard fallback
    for (const [alias, target] of Object.entries(EMPTY_STATE_IMAGE_ALIASES)) {
      expect(EMPTY_STATE_IMAGES.has(target), `${alias} → ${target}`).toBe(true);
      expect(EMPTY_STATE_IMAGES.has(alias), `alias ${alias} shadows a real name`).toBe(false);
    }
  });

  it("maps every trend alias to a valid direction", () => {
    expect([...TREND_DIRECTIONS].sort()).toEqual(["decrease", "increase"]);
    for (const [alias, target] of Object.entries(TREND_DIRECTION_ALIASES)) {
      expect(TREND_DIRECTIONS.has(target), `${alias} → ${target}`).toBe(true);
      expect(TREND_DIRECTIONS.has(alias), `alias ${alias} shadows a real value`).toBe(false);
    }
  });

  it("lists required array props as non-empty string arrays", () => {
    expect(Object.keys(SAFE_ARRAY_PROPS).length).toBe(13);
    for (const [name, props] of Object.entries(SAFE_ARRAY_PROPS)) {
      expect(Array.isArray(props), name).toBe(true);
      expect(props.length, name).toBeGreaterThan(0);
      for (const p of props) expect(typeof p, `${name}.${p}`).toBe("string");
    }
    // the native StepIndicator prop is stepNames (not steps)
    expect(SAFE_ARRAY_PROPS.StepIndicator).toEqual(["stepNames"]);
  });
});
