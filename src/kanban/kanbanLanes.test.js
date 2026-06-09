import { describe, it, expect } from "vitest";
import {
  UNASSIGNED_LANE_KEY,
  UNKNOWN_STAGE_KEY,
  getLaneKey,
  orderLaneKeys,
  partitionLanes,
  resolveLaneLabel,
  bucketRowsByStage,
  sortBuckets,
  resolveWipLimit,
  computeStageCounts,
  evaluateWip,
  findNewlyExceededWip,
} from "./kanbanLanes.js";

// ── lane key resolution ──────────────────────────────────────────────────────
describe("getLaneKey", () => {
  it("reads a field name off the row", () => {
    expect(getLaneKey({ owner: "jane" }, "owner")).toBe("jane");
  });

  it("calls an accessor function", () => {
    expect(getLaneKey({ priority: 2 }, (row) => `p${row.priority}`)).toBe("p2");
  });

  it("String-coerces non-string keys (numbers, booleans)", () => {
    expect(getLaneKey({ priority: 3 }, "priority")).toBe("3");
    expect(getLaneKey({ flagged: false }, "flagged")).toBe("false");
    expect(getLaneKey({ priority: 0 }, "priority")).toBe("0");
  });

  it("maps null / undefined / empty-string to the unassigned lane", () => {
    expect(getLaneKey({ owner: null }, "owner")).toBe(UNASSIGNED_LANE_KEY);
    expect(getLaneKey({}, "owner")).toBe(UNASSIGNED_LANE_KEY);
    expect(getLaneKey({ owner: "" }, "owner")).toBe(UNASSIGNED_LANE_KEY);
    expect(getLaneKey({ owner: "x" }, () => undefined)).toBe(UNASSIGNED_LANE_KEY);
  });

  it("tolerates a missing row", () => {
    expect(getLaneKey(undefined, "owner")).toBe(UNASSIGNED_LANE_KEY);
  });
});

// ── lane ordering ────────────────────────────────────────────────────────────
describe("orderLaneKeys", () => {
  it("returns first-seen order when no explicit order is given", () => {
    expect(orderLaneKeys(["b", "a", "c"])).toEqual(["b", "a", "c"]);
    expect(orderLaneKeys(["b", "a"], [])).toEqual(["b", "a"]);
  });

  it("puts explicitly ordered keys first, in the given order", () => {
    expect(orderLaneKeys(["c", "a", "b"], ["a", "b"])).toEqual(["a", "b", "c"]);
  });

  it("includes explicit keys even when not seen in the data", () => {
    expect(orderLaneKeys(["b"], ["a", "b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("appends unseen-in-order keys in first-seen order", () => {
    expect(orderLaneKeys(["z", "a", "y"], ["a"])).toEqual(["a", "z", "y"]);
  });

  it("dedupes the explicit order and String-coerces its entries", () => {
    expect(orderLaneKeys(["1", "2"], [1, 2, 1])).toEqual(["1", "2"]);
  });

  it("does not mutate its inputs", () => {
    const seen = ["b", "a"];
    const order = ["a"];
    orderLaneKeys(seen, order);
    expect(seen).toEqual(["b", "a"]);
    expect(order).toEqual(["a"]);
  });
});

// ── lane partitioning ────────────────────────────────────────────────────────
describe("partitionLanes", () => {
  const rows = [
    { id: 1, owner: "jane" },
    { id: 2, owner: "bob" },
    { id: 3, owner: "jane" },
    { id: 4, owner: null },
  ];

  it("groups rows by lane key, preserving data order within each lane", () => {
    const { laneKeys, rowsByLane } = partitionLanes(rows, { swimlaneBy: "owner" });
    expect(laneKeys).toEqual(["jane", "bob", UNASSIGNED_LANE_KEY]);
    expect(rowsByLane.jane.map((r) => r.id)).toEqual([1, 3]);
    expect(rowsByLane.bob.map((r) => r.id)).toEqual([2]);
    expect(rowsByLane[UNASSIGNED_LANE_KEY].map((r) => r.id)).toEqual([4]);
  });

  it("supports a function accessor", () => {
    const { laneKeys } = partitionLanes(rows, {
      swimlaneBy: (row) => (row.owner === "jane" ? "team-a" : "team-b"),
    });
    expect(laneKeys).toEqual(["team-a", "team-b"]);
  });

  it("orders lanes via swimlaneOrder and keeps explicit empty lanes", () => {
    const { laneKeys, rowsByLane } = partitionLanes(rows, {
      swimlaneBy: "owner",
      swimlaneOrder: ["bob", "ann", "jane"],
    });
    expect(laneKeys).toEqual(["bob", "ann", "jane", UNASSIGNED_LANE_KEY]);
    expect(rowsByLane.ann).toEqual([]); // explicit lane with no rows still materializes
  });

  it("handles empty input", () => {
    expect(partitionLanes([], { swimlaneBy: "owner" })).toEqual({ laneKeys: [], rowsByLane: {} });
    expect(partitionLanes(undefined, { swimlaneBy: "owner" })).toEqual({
      laneKeys: [],
      rowsByLane: {},
    });
  });
});

// ── lane labels ──────────────────────────────────────────────────────────────
describe("resolveLaneLabel", () => {
  it("reads from a label map", () => {
    expect(resolveLaneLabel("jane", { jane: "Jane Doe" })).toBe("Jane Doe");
  });

  it("calls a label function with the lane key and rows", () => {
    const rows = [{ id: 1 }];
    expect(resolveLaneLabel("jane", (key, laneRows) => `${key} (${laneRows.length})`, rows)).toBe(
      "jane (1)"
    );
  });

  it("falls back to the key when the map or function yields nothing", () => {
    expect(resolveLaneLabel("jane", { bob: "Bob" })).toBe("jane");
    expect(resolveLaneLabel("jane", () => null)).toBe("jane");
    expect(resolveLaneLabel("jane")).toBe("jane");
  });

  it("uses the unassigned label for the unassigned lane", () => {
    expect(resolveLaneLabel(UNASSIGNED_LANE_KEY, undefined, [], "No owner")).toBe("No owner");
    expect(resolveLaneLabel(UNASSIGNED_LANE_KEY)).toBe("Unassigned");
    // explicit labels still win over the fallback
    expect(resolveLaneLabel(UNASSIGNED_LANE_KEY, { [UNASSIGNED_LANE_KEY]: "Nobody" })).toBe(
      "Nobody"
    );
  });
});

// ── stage bucketing ──────────────────────────────────────────────────────────
describe("bucketRowsByStage", () => {
  const stages = [{ value: "new" }, { value: "open" }];
  const getStage = (row) => row.status;

  it("buckets rows under their stage, with empty arrays for cardless stages", () => {
    const buckets = bucketRowsByStage(
      [{ id: 1, status: "new" }, { id: 2, status: "new" }],
      stages,
      getStage
    );
    expect(buckets.new.map((r) => r.id)).toEqual([1, 2]);
    expect(buckets.open).toEqual([]);
  });

  it("collects unknown-stage rows under UNKNOWN_STAGE_KEY", () => {
    const buckets = bucketRowsByStage([{ id: 1, status: "weird" }], stages, getStage);
    expect(buckets[UNKNOWN_STAGE_KEY].map((r) => r.id)).toEqual([1]);
  });

  it("drops rows silently when no stages are configured (legacy pipeline parity)", () => {
    const buckets = bucketRowsByStage([{ id: 1, status: "weird" }], [], getStage);
    expect(buckets).toEqual({});
  });
});

describe("sortBuckets", () => {
  it("returns the same object when no comparator is given", () => {
    const buckets = { a: [{ n: 2 }, { n: 1 }] };
    expect(sortBuckets(buckets, null)).toBe(buckets);
  });

  it("sorts each bucket without mutating the originals", () => {
    const a = [{ n: 2 }, { n: 1 }];
    const sorted = sortBuckets({ a }, (x, y) => x.n - y.n);
    expect(sorted.a.map((r) => r.n)).toEqual([1, 2]);
    expect(a.map((r) => r.n)).toEqual([2, 1]);
  });
});

// ── WIP limit resolution ─────────────────────────────────────────────────────
describe("resolveWipLimit", () => {
  it("reads the per-stage wipLimit", () => {
    expect(resolveWipLimit({ value: "open", wipLimit: 5 })).toBe(5);
  });

  it("prefers the top-level wipLimits override", () => {
    expect(resolveWipLimit({ value: "open", wipLimit: 5 }, { open: 3 })).toBe(3);
    expect(resolveWipLimit({ value: "open" }, { open: 7 })).toBe(7);
  });

  it("falls through a null override to the stage config", () => {
    expect(resolveWipLimit({ value: "open", wipLimit: 5 }, { open: null })).toBe(5);
    expect(resolveWipLimit({ value: "open", wipLimit: 5 }, { other: 1 })).toBe(5);
  });

  it("treats 0 as a valid limit (stage should stay empty)", () => {
    expect(resolveWipLimit({ value: "open", wipLimit: 0 })).toBe(0);
  });

  it("returns null for missing or invalid limits", () => {
    expect(resolveWipLimit({ value: "open" })).toBeNull();
    expect(resolveWipLimit({ value: "open", wipLimit: -1 })).toBeNull();
    expect(resolveWipLimit({ value: "open", wipLimit: NaN })).toBeNull();
    expect(resolveWipLimit({ value: "open", wipLimit: Infinity })).toBeNull();
    expect(resolveWipLimit({ value: "open", wipLimit: "5" })).toBeNull();
    expect(resolveWipLimit(undefined)).toBeNull();
  });
});

// ── stage counts ─────────────────────────────────────────────────────────────
describe("computeStageCounts", () => {
  const stages = [{ value: "new" }, { value: "open" }];

  it("counts loaded bucket lengths by default", () => {
    const counts = computeStageCounts(stages, { new: [{}, {}], open: [] });
    expect(counts).toEqual({ new: 2, open: 0 });
  });

  it("prefers stageMeta.totalCount (server truth) over loaded length", () => {
    const counts = computeStageCounts(
      stages,
      { new: [{}, {}], open: [{}] },
      { new: { totalCount: 42 } }
    );
    expect(counts).toEqual({ new: 42, open: 1 });
  });

  it("treats missing buckets as 0", () => {
    expect(computeStageCounts(stages, {})).toEqual({ new: 0, open: 0 });
    expect(computeStageCounts(stages, undefined)).toEqual({ new: 0, open: 0 });
  });
});

// ── WIP evaluation ───────────────────────────────────────────────────────────
describe("evaluateWip", () => {
  const stages = [
    { value: "new", wipLimit: 2 },
    { value: "open" },
    { value: "done", wipLimit: 0 },
  ];

  it("flags exceeded only when count is STRICTLY greater than the limit", () => {
    const wip = evaluateWip(stages, { new: 3, open: 9, done: 0 });
    expect(wip.new).toEqual({ count: 3, limit: 2, exceeded: true });
    expect(wip.done).toEqual({ count: 0, limit: 0, exceeded: false });
  });

  it("a stage AT its limit is full, not over", () => {
    const wip = evaluateWip(stages, { new: 2, open: 0, done: 0 });
    expect(wip.new.exceeded).toBe(false);
  });

  it("stages without a limit report limit null and never exceed", () => {
    const wip = evaluateWip(stages, { new: 0, open: 999, done: 0 });
    expect(wip.open).toEqual({ count: 999, limit: null, exceeded: false });
  });

  it("applies top-level wipLimits overrides", () => {
    const wip = evaluateWip(stages, { new: 3, open: 4, done: 0 }, { new: 10, open: 3 });
    expect(wip.new.exceeded).toBe(false);
    expect(wip.open).toEqual({ count: 4, limit: 3, exceeded: true });
  });

  it("a 0 limit with any cards is exceeded", () => {
    const wip = evaluateWip(stages, { new: 0, open: 0, done: 1 });
    expect(wip.done).toEqual({ count: 1, limit: 0, exceeded: true });
  });

  it("missing counts default to 0", () => {
    const wip = evaluateWip(stages, {});
    expect(wip.new).toEqual({ count: 0, limit: 2, exceeded: false });
  });
});

// ── exceeded-transition detection ────────────────────────────────────────────
describe("findNewlyExceededWip", () => {
  const exceeded = (count, limit) => ({ count, limit, exceeded: true });
  const ok = (count, limit) => ({ count, limit, exceeded: false });

  it("fires for stages exceeded on first evaluation (empty prev)", () => {
    expect(findNewlyExceededWip({}, { new: exceeded(3, 2) })).toEqual([
      { stageId: "new", count: 3, limit: 2 },
    ]);
    expect(findNewlyExceededWip(undefined, { new: exceeded(3, 2) })).toEqual([
      { stageId: "new", count: 3, limit: 2 },
    ]);
  });

  it("does NOT fire for stages that were already exceeded", () => {
    expect(findNewlyExceededWip({ new: exceeded(3, 2) }, { new: exceeded(3, 2) })).toEqual([]);
  });

  it("does NOT fire when the count grows while already exceeded", () => {
    expect(findNewlyExceededWip({ new: exceeded(3, 2) }, { new: exceeded(4, 2) })).toEqual([]);
  });

  it("fires again after recovering below the limit and re-crossing", () => {
    expect(findNewlyExceededWip({ new: ok(2, 2) }, { new: exceeded(3, 2) })).toEqual([
      { stageId: "new", count: 3, limit: 2 },
    ]);
  });

  it("never fires for non-exceeded stages", () => {
    expect(findNewlyExceededWip({}, { new: ok(1, 2), open: ok(5, null) })).toEqual([]);
  });

  it("reports multiple crossings in stage-key order", () => {
    const prev = { a: ok(2, 2), b: exceeded(5, 1) };
    const next = { a: exceeded(3, 2), b: exceeded(6, 1), c: exceeded(1, 0) };
    expect(findNewlyExceededWip(prev, next)).toEqual([
      { stageId: "a", count: 3, limit: 2 },
      { stageId: "c", count: 1, limit: 0 },
    ]);
  });

  it("handles an empty next evaluation", () => {
    expect(findNewlyExceededWip({ new: exceeded(3, 2) }, {})).toEqual([]);
    expect(findNewlyExceededWip({}, undefined)).toEqual([]);
  });
});
