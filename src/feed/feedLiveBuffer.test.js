import { describe, it, expect } from "vitest";
import { partitionNewItems, flushBuffer, toTimestampMs } from "./feedLiveBuffer.js";

const getTs = (item) => item.timestamp;
const item = (id, timestamp, extra = {}) => ({ id, timestamp, ...extra });

describe("toTimestampMs", () => {
  it("passes epoch numbers through", () => {
    expect(toTimestampMs(1700000000000)).toBe(1700000000000);
    expect(toTimestampMs(0)).toBe(0);
  });

  it("reads Dates and ISO strings", () => {
    const date = new Date(2026, 5, 9, 10, 30);
    expect(toTimestampMs(date)).toBe(date.getTime());
    expect(toTimestampMs("2026-06-09T10:30:00Z")).toBe(Date.parse("2026-06-09T10:30:00Z"));
  });

  it("reads HubSpot date value objects (month 0-indexed)", () => {
    expect(toTimestampMs({ year: 2026, month: 5, date: 9 })).toBe(new Date(2026, 5, 9).getTime());
    expect(toTimestampMs({ year: 2026, month: 5, date: 9, hour: 8, minute: 15 })).toBe(
      new Date(2026, 5, 9, 8, 15).getTime()
    );
  });

  it("returns null for unparseable values", () => {
    expect(toTimestampMs(null)).toBeNull();
    expect(toTimestampMs(undefined)).toBeNull();
    expect(toTimestampMs("")).toBeNull();
    expect(toTimestampMs("not a date")).toBeNull();
    expect(toTimestampMs(new Date("garbage"))).toBeNull();
    expect(toTimestampMs(Infinity)).toBeNull();
  });
});

describe("partitionNewItems", () => {
  it("never buffers on first load (null watermark), even out of order", () => {
    const items = [item("b", 2000), item("a", 500), item("c", 1500)];
    const result = partitionNewItems(null, items, getTs);
    expect(result.buffered).toEqual([]);
    expect(result.visible).toEqual(items);
    expect(result.newestTs).toBe(2000);
  });

  it("handles undefined watermark like first load", () => {
    const result = partitionNewItems(undefined, [item("a", 100)], getTs);
    expect(result.buffered).toEqual([]);
    expect(result.newestTs).toBe(100);
  });

  it("buffers only items strictly newer than the watermark", () => {
    const items = [item("a", 900), item("b", 1100), item("c", 1000)];
    const result = partitionNewItems(1000, items, getTs);
    expect(result.buffered.map((i) => i.id)).toEqual(["b"]);
    expect(result.visible.map((i) => i.id)).toEqual(["a", "c"]);
  });

  it("does NOT buffer items with timestamps equal to the watermark", () => {
    const result = partitionNewItems(1000, [item("a", 1000)], getTs);
    expect(result.buffered).toEqual([]);
    expect(result.visible.map((i) => i.id)).toEqual(["a"]);
    expect(result.newestTs).toBe(1000);
  });

  it("handles out-of-order arrival, preserving input order in each set", () => {
    const items = [item("b", 2000), item("a", 500), item("c", 1500), item("d", 800)];
    const result = partitionNewItems(1000, items, getTs);
    expect(result.buffered.map((i) => i.id)).toEqual(["b", "c"]);
    expect(result.visible.map((i) => i.id)).toEqual(["a", "d"]);
  });

  it("keeps the watermark pinned to visible items only", () => {
    const result = partitionNewItems(1000, [item("a", 900), item("b", 5000)], getTs);
    expect(result.buffered.map((i) => i.id)).toEqual(["b"]);
    expect(result.newestTs).toBe(1000);
  });

  it("never buffers items with missing or unparseable timestamps", () => {
    const items = [item("a", undefined), item("b", "garbage"), item("c", 2000)];
    const result = partitionNewItems(1000, items, getTs);
    expect(result.visible.map((i) => i.id)).toEqual(["a", "b"]);
    expect(result.buffered.map((i) => i.id)).toEqual(["c"]);
  });

  it("treats known ids as UPDATES (visible) and unknown ids as INSERTS (buffered)", () => {
    const updated = item("x", 1500);
    const inserted = item("y", 1500);
    const result = partitionNewItems(1000, [updated, inserted], getTs, {
      knownIds: new Set(["x"]),
    });
    expect(result.visible).toEqual([updated]);
    expect(result.buffered).toEqual([inserted]);
  });

  it("advances the watermark when a known item's timestamp moves past it", () => {
    const result = partitionNewItems(1000, [item("x", 1500)], getTs, {
      knownIds: new Set(["x"]),
    });
    expect(result.visible.map((i) => i.id)).toEqual(["x"]);
    expect(result.newestTs).toBe(1500);
  });

  it("keeps the watermark monotonic when items are removed", () => {
    const result = partitionNewItems(2000, [item("a", 1000)], getTs);
    expect(result.newestTs).toBe(2000);
  });

  it("returns ids via the default id accessor (id, then key, then index)", () => {
    const items = [{ id: "a", timestamp: 1 }, { key: "k", timestamp: 2 }, { timestamp: 3 }];
    const result = partitionNewItems(null, items, getTs);
    expect(result.visibleIds).toEqual(["a", "k", 2]);
    expect(result.bufferedIds).toEqual([]);
  });

  it("uses a custom getId when provided", () => {
    const items = [item("a", 2000)];
    const result = partitionNewItems(1000, items, getTs, {
      getId: (i, index) => `row-${i.id}-${index}`,
    });
    expect(result.bufferedIds).toEqual(["row-a-0"]);
  });

  it("is safe with non-array items", () => {
    expect(partitionNewItems(null, null, getTs)).toEqual({
      visible: [],
      buffered: [],
      visibleIds: [],
      bufferedIds: [],
      newestTs: null,
    });
    expect(partitionNewItems(500, undefined, getTs).newestTs).toBe(500);
  });
});

describe("flushBuffer", () => {
  it("merges buffered items FIRST and reports the new watermark across all", () => {
    const visible = [item("a", 1000)];
    const buffered = [item("b", 2000), item("c", 1500)];
    const result = flushBuffer(visible, buffered, getTs);
    expect(result.items.map((i) => i.id)).toEqual(["b", "c", "a"]);
    expect(result.flushed).toEqual(buffered);
    expect(result.newestTs).toBe(2000);
  });

  it("works with an empty buffer", () => {
    const visible = [item("a", 1000)];
    const result = flushBuffer(visible, [], getTs);
    expect(result.items).toEqual(visible);
    expect(result.flushed).toEqual([]);
    expect(result.newestTs).toBe(1000);
  });

  it("ignores unparseable timestamps and returns null when none parse", () => {
    const result = flushBuffer([item("a", "garbage")], [item("b", undefined)], getTs);
    expect(result.items.map((i) => i.id)).toEqual(["b", "a"]);
    expect(result.newestTs).toBeNull();
  });

  it("is safe with non-array inputs", () => {
    expect(flushBuffer(null, undefined, getTs)).toEqual({ items: [], flushed: [], newestTs: null });
  });

  it("round-trips with partitionNewItems (partition → flush → no re-buffer)", () => {
    const items = [item("a", 1000), item("b", 2000)];
    const first = partitionNewItems(1000, items, getTs);
    expect(first.buffered.map((i) => i.id)).toEqual(["b"]);

    const flushed = flushBuffer(first.visible, first.buffered, getTs);
    expect(flushed.newestTs).toBe(2000);

    // Re-partitioning the same items against the post-flush watermark holds
    // nothing back.
    const second = partitionNewItems(flushed.newestTs, items, getTs);
    expect(second.buffered).toEqual([]);
    expect(second.visible.map((i) => i.id)).toEqual(["a", "b"]);
  });
});
