import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Icon, EmptyState, StatisticsTrend, Tile, Select } from "@hubspot/ui-extensions";
import { Popover } from "@hubspot/ui-extensions/experimental";
import { SafeIcon } from "./SafeIcon.js";
import { SafeEmptyState } from "./SafeEmptyState.js";
import { SafeStatisticsTrend } from "./SafeStatisticsTrend.js";
import { SafePopover } from "./SafePopover.js";
import {
  SafeSelect,
  SafeDataTable,
  SafeCrmDataTable,
  SafeCrmKanban,
  SafeFormBuilder,
} from "./safeComponents.js";
import { resetSafeWarnings } from "./warnings.js";

beforeEach(() => {
  resetSafeWarnings();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("SafeIcon", () => {
  it("passes valid names straight through to the native Icon", () => {
    const el = SafeIcon({ name: "edit", color: "success" });
    expect(el.type).toBe(Icon);
    expect(el.props).toEqual({ name: "edit", color: "success" });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("auto-repairs known aliases with a one-time warning", () => {
    const el = SafeIcon({ name: "duplicate" });
    expect(el.props.name).toBe("copy");
    SafeIcon({ name: "duplicate" });
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('"duplicate"'));
  });

  it("renders an alert xCircle placeholder for unknown names", () => {
    const el = SafeIcon({ name: "definitely-not-real" });
    expect(el.props.name).toBe("xCircle");
    expect(el.props.color).toBe("alert");
    expect(el.props.screenReaderText).toBe("Invalid icon: definitely-not-real");
  });

  it("placeholder defaults beat caller props (rest spread first)", () => {
    const el = SafeIcon({ name: "nope", color: "success", screenReaderText: "x" });
    expect(el.props.color).toBe("alert");
    expect(el.props.name).toBe("xCircle");
    expect(el.props.screenReaderText).toBe("Invalid icon: nope");
  });

  it("treats a missing name as invalid", () => {
    const el = SafeIcon({});
    expect(el.props.name).toBe("xCircle");
    expect(el.props.screenReaderText).toBe("Invalid icon: (missing)");
  });
});

describe("SafeEmptyState", () => {
  it("passes valid and missing imageName through", () => {
    expect(SafeEmptyState({ imageName: "deals" }).props.imageName).toBe("deals");
    expect(SafeEmptyState({ title: "t" }).props.imageName).toBeUndefined();
    expect(SafeEmptyState({ imageName: "deals" }).type).toBe(EmptyState);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("repairs known aliases", () => {
    expect(SafeEmptyState({ imageName: "new-project" }).props.imageName).toBe("components");
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("falls back to components for unknown values instead of throwing", () => {
    const el = SafeEmptyState({ imageName: "garbage", title: "t" });
    expect(el.props.imageName).toBe("components");
    expect(el.props.title).toBe("t");
  });
});

describe("SafeStatisticsTrend", () => {
  it("passes valid directions and non-strings through untouched", () => {
    expect(SafeStatisticsTrend({ direction: "decrease" }).props.direction).toBe("decrease");
    expect(SafeStatisticsTrend({}).props.direction).toBeUndefined();
    expect(SafeStatisticsTrend({ direction: "increase" }).type).toBe(StatisticsTrend);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("aliases the common present-participle forms", () => {
    expect(SafeStatisticsTrend({ direction: "increasing" }).props.direction).toBe("increase");
    expect(SafeStatisticsTrend({ direction: "down" }).props.direction).toBe("decrease");
  });

  it("defaults unknown strings to increase, beating caller direction", () => {
    const el = SafeStatisticsTrend({ direction: "sideways", value: "5%" });
    expect(el.props.direction).toBe("increase");
    expect(el.props.value).toBe("5%");
  });
});

describe("SafePopover", () => {
  it("wraps children in a compact Tile inside the experimental Popover", () => {
    const el = SafePopover({ placement: "bottom", children: "content" });
    expect(el.type).toBe(Popover);
    expect(el.props.placement).toBe("bottom");
    const tile = el.props.children;
    expect(tile.type).toBe(Tile);
    expect(tile.props.compact).toBe(true);
    expect(tile.props.children).toBe("content");
  });
});

describe("pre-wrapped components", () => {
  // forwardRef components — invoke .render directly to inspect the element.
  it("SafeSelect coerces options", () => {
    const el = SafeSelect.render({ label: "L" }, null);
    expect(el.type).toBe(Select);
    expect(el.props.options).toEqual([]);
    expect(el.props.label).toBe("L");
  });

  it("SafeDataTable coerces every required collection prop", () => {
    const el = SafeDataTable.render({ data: "not-an-array" }, null);
    expect(el.props.data).toEqual([]);
    expect(el.props.columns).toEqual([]);
    expect(el.props.searchFields).toEqual([]);
    expect(el.props.filters).toEqual([]);
    expect(el.props.selectionActions).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(1); // only data was non-null
  });

  it("SafeCrmDataTable leaves omitted columns alone so auto-derive still runs", () => {
    const el = SafeCrmDataTable.render({ objectType: "deal" }, null);
    expect("columns" in el.props).toBe(false);
    expect(console.warn).not.toHaveBeenCalled();

    const repaired = SafeCrmDataTable.render({ objectType: "deal", columns: "oops" }, null);
    expect("columns" in repaired.props).toBe(false);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("SafeCrmKanban derives stages but still coerces cardFields", () => {
    const el = SafeCrmKanban.render({ objectType: "deal", groupBy: "dealstage" }, null);
    expect("stages" in el.props).toBe(false);
    expect(el.props.cardFields).toEqual([]);
  });

  it("SafeFormBuilder forwards its imperative ref", () => {
    const ref = { current: null };
    const el = SafeFormBuilder.render({ fields: [] }, ref);
    expect(el.ref).toBe(ref);
  });
});
