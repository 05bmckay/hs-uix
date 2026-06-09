import { describe, it, expect } from "vitest";
import {
  resolveResourceId,
  buildResourceLanes,
  eventsIntersectingRange,
  laneEventsForDay,
} from "./resourceLanes.js";

// ── resolveResourceId ────────────────────────────────────────────────────────
describe("resolveResourceId", () => {
  const record = { ownerId: 42, room: "A", empty: "", zero: 0 };

  it("resolves a key spec", () => {
    expect(resolveResourceId(record, "ownerId")).toBe(42);
    expect(resolveResourceId(record, "room")).toBe("A");
  });

  it("resolves an accessor spec", () => {
    expect(resolveResourceId(record, (r) => r.ownerId)).toBe(42);
  });

  it("normalizes missing / null / empty-string to null", () => {
    expect(resolveResourceId(record, "missing")).toBeNull();
    expect(resolveResourceId(record, "empty")).toBeNull();
    expect(resolveResourceId({ ownerId: null }, "ownerId")).toBeNull();
    expect(resolveResourceId(null, "ownerId")).toBeNull();
    expect(resolveResourceId(record, null)).toBeNull();
  });

  it("treats 0 as a VALID id (falsy but real)", () => {
    expect(resolveResourceId(record, "zero")).toBe(0);
  });
});

// ── buildResourceLanes ───────────────────────────────────────────────────────
describe("buildResourceLanes", () => {
  const ev = (key, ownerId) => ({ key, raw: { ownerId } , ownerId });
  const getId = (e) => (e.ownerId == null || e.ownerId === "" ? null : e.ownerId);

  it("keeps declared resource order and partitions events", () => {
    const events = [ev("a", "u2"), ev("b", "u1"), ev("c", "u2")];
    const lanes = buildResourceLanes(events, {
      resources: [
        { id: "u1", label: "Ana" },
        { id: "u2", label: "Ben" },
      ],
      getId,
    });
    expect(lanes.map((l) => l.id)).toEqual(["u1", "u2"]);
    expect(lanes[0].events.map((e) => e.key)).toEqual(["b"]);
    expect(lanes[1].events.map((e) => e.key)).toEqual(["a", "c"]);
  });

  it("declared lanes render even with zero events", () => {
    const lanes = buildResourceLanes([], { resources: [{ id: "u1", label: "Ana" }], getId });
    expect(lanes).toHaveLength(1);
    expect(lanes[0].events).toEqual([]);
    expect(lanes[0].declared).toBe(true);
  });

  it("labels: declared label > resourceLabels > String(id)", () => {
    const lanes = buildResourceLanes([ev("a", "u3")], {
      resources: [{ id: "u1", label: "Ana" }, { id: "u2" }, "u4"],
      resourceLabels: { u2: "Ben", u3: "Cara" },
      getId,
    });
    expect(lanes.map((l) => l.label)).toEqual(["Ana", "Ben", "u4", "Cara"]);
  });

  it("appends a derived lane (after declared ones) for ids never declared", () => {
    const events = [ev("a", "ghost"), ev("b", "u1")];
    const lanes = buildResourceLanes(events, {
      resources: [{ id: "u1", label: "Ana" }],
      getId,
    });
    expect(lanes.map((l) => l.id)).toEqual(["u1", "ghost"]);
    expect(lanes[1].declared).toBe(false);
    expect(lanes[1].label).toBe("ghost");
  });

  it("derives all lanes in first-seen order when no resources are declared", () => {
    const events = [ev("a", "u2"), ev("b", "u1"), ev("c", "u2")];
    const lanes = buildResourceLanes(events, { getId });
    expect(lanes.map((l) => l.id)).toEqual(["u2", "u1"]);
  });

  it("matches numeric and string ids as the same lane (String(id) keying)", () => {
    const lanes = buildResourceLanes([ev("a", "7"), ev("b", 7)], {
      resources: [{ id: 7, label: "Seven" }],
      getId,
    });
    expect(lanes).toHaveLength(1);
    expect(lanes[0].events.map((e) => e.key)).toEqual(["a", "b"]);
  });

  it("sends id-less events to a trailing Unassigned lane (only when non-empty)", () => {
    const events = [ev("a", "u1"), ev("b", null), ev("c", undefined)];
    const lanes = buildResourceLanes(events, {
      resources: [{ id: "u1", label: "Ana" }],
      getId,
      unassignedLabel: "No owner",
    });
    expect(lanes).toHaveLength(2);
    const last = lanes[lanes.length - 1];
    expect(last.unassigned).toBe(true);
    expect(last.id).toBeNull();
    expect(last.label).toBe("No owner");
    expect(last.events.map((e) => e.key)).toEqual(["b", "c"]);

    // no unassigned events → no unassigned lane
    const clean = buildResourceLanes([ev("a", "u1")], {
      resources: [{ id: "u1" }],
      getId,
    });
    expect(clean.some((l) => l.unassigned)).toBe(false);
  });

  it("omits id-less events entirely when showUnassignedLane is false", () => {
    const lanes = buildResourceLanes([ev("a", "u1"), ev("b", null)], {
      resources: [{ id: "u1" }],
      getId,
      showUnassignedLane: false,
    });
    expect(lanes).toHaveLength(1);
    expect(lanes[0].events.map((e) => e.key)).toEqual(["a"]);
  });
});

// ── day / range intersection ─────────────────────────────────────────────────
describe("eventsIntersectingRange / laneEventsForDay", () => {
  const tue9 = new Date(2026, 5, 9, 9, 0);
  const tue10 = new Date(2026, 5, 9, 10, 0);
  const events = [
    { key: "late", start: new Date(2026, 5, 9, 15, 0), end: new Date(2026, 5, 9, 16, 0) },
    { key: "early", start: tue9, end: tue10 },
    { key: "multi", start: new Date(2026, 5, 8, 12, 0), end: new Date(2026, 5, 11, 12, 0) },
    { key: "other-week", start: new Date(2026, 5, 20, 9, 0), end: new Date(2026, 5, 20, 10, 0) },
    { key: "no-start", start: null, end: null },
  ];

  it("keeps only events whose interval touches the range", () => {
    const hits = eventsIntersectingRange(
      events,
      new Date(2026, 5, 7),
      new Date(2026, 5, 13, 23, 59, 59, 999)
    );
    expect(hits.map((e) => e.key)).toEqual(["late", "early", "multi"]);
  });

  it("laneEventsForDay includes multi-day spans on every day they touch, sorted by start", () => {
    const tue = laneEventsForDay(events, new Date(2026, 5, 9));
    expect(tue.map((e) => e.key)).toEqual(["multi", "early", "late"]);
    const thu = laneEventsForDay(events, new Date(2026, 5, 11));
    expect(thu.map((e) => e.key)).toEqual(["multi"]);
  });

  it("drops events with no start", () => {
    expect(laneEventsForDay(events, new Date(2026, 5, 9)).some((e) => e.key === "no-start")).toBe(
      false
    );
  });
});
