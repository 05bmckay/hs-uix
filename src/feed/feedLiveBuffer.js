// ═══════════════════════════════════════════════════════════════════════════
// Feed live-append buffer — pure, dependency-free, unit-testable.
//
// Real-time feeds prepend items while the user is reading. Re-rendering is
// cheap (Feed memoizes its pipeline) but *visually* disruptive: rows shove
// down mid-read. `newItemsBehavior="pill"` fixes that by holding items that
// arrive NEWER than the previously-newest visible timestamp in a buffer and
// surfacing a "Show N new items" pill instead. This module is the entire
// decision kernel for that behavior: given the previous high-water timestamp
// and the current items array, decide what is visible, what is buffered, and
// where the new high-water mark sits. It is deliberately free of React so the
// tricky cases — out-of-order arrival, equal timestamps, id-keyed updates vs
// inserts, first load — are exhaustively unit-testable (feedLiveBuffer.test.js).
//
// Invariants the kernel guarantees:
//   1. The FIRST load never buffers — there is no previous watermark, so
//      everything is visible and the watermark initializes to the newest ts.
//   2. An item whose id is already known (i.e. it is an UPDATE to a visible
//      item) is never buffered, even if its timestamp moved past the
//      watermark — buffering it would make a visible row vanish.
//   3. Equal timestamps are NOT "newer": only ts strictly greater than the
//      watermark buffers, so re-delivered snapshots don't re-buffer.
//   4. Items with unparseable/missing timestamps are never buffered — we
//      cannot prove they are new, so they stay visible.
//   5. The watermark is monotonic: it never moves backwards when items are
//      removed from the array.
// ═══════════════════════════════════════════════════════════════════════════

const isDateValueObject = (v) =>
  v != null &&
  typeof v === "object" &&
  typeof v.year === "number" &&
  typeof v.month === "number" &&
  typeof v.date === "number";

/**
 * Coerce any Feed-supported timestamp shape to epoch ms, or null when
 * unparseable. Accepts Date | number (epoch ms) | parseable string |
 * HubSpot date value object ({ year, month, date, hour?, minute? },
 * month 0-indexed).
 */
export const toTimestampMs = (value) => {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (isDateValueObject(value)) {
    return new Date(value.year, value.month, value.date, value.hour || 0, value.minute || 0).getTime();
  }
  const parsed = new Date(value);
  const time = parsed.getTime();
  return Number.isNaN(time) ? null : time;
};

const defaultGetId = (item, index) => item?.id ?? item?.key ?? index;

/**
 * Split `items` into the visible set and the held-back buffer.
 *
 * @param {number|null|undefined} prevNewestTs Previous newest VISIBLE epoch-ms
 *   watermark; null/undefined means "first load" (nothing buffers).
 * @param {Array} items Current full items array (any order).
 * @param {Function} getTs `(item) => timestamp-ish` accessor; the value is
 *   coerced via `toTimestampMs`.
 * @param {{ knownIds?: Set, getId?: Function }} [options] `knownIds` is the
 *   set of ids already rendered (updates to those never buffer); `getId` is
 *   `(item, index) => id` and defaults to `item.id ?? item.key ?? index`.
 * @returns {{ visible: Array, buffered: Array, visibleIds: Array,
 *   bufferedIds: Array, newestTs: number|null }} Arrays preserve input order;
 *   `newestTs` is the new monotonic watermark over VISIBLE items only.
 */
export const partitionNewItems = (prevNewestTs, items, getTs, options = {}) => {
  const { knownIds = null, getId = defaultGetId } = options;
  const safeItems = Array.isArray(items) ? items : [];
  const firstLoad = prevNewestTs == null;

  const visible = [];
  const visibleIds = [];
  const buffered = [];
  const bufferedIds = [];
  let newestTs = typeof prevNewestTs === "number" ? prevNewestTs : null;

  safeItems.forEach((item, index) => {
    const id = getId(item, index);
    const ts = toTimestampMs(typeof getTs === "function" ? getTs(item) : undefined);
    const isKnown = knownIds != null && id !== undefined && knownIds.has(id);
    const isNewArrival = !firstLoad && !isKnown && ts != null && ts > prevNewestTs;

    if (isNewArrival) {
      buffered.push(item);
      bufferedIds.push(id);
      return;
    }

    visible.push(item);
    visibleIds.push(id);
    if (ts != null && (newestTs == null || ts > newestTs)) newestTs = ts;
  });

  return { visible, buffered, visibleIds, bufferedIds, newestTs };
};

/**
 * Flush the buffer into the visible list. Buffered (newer) items are placed
 * FIRST so an unsorted feed reads newest-at-top; sorted feeds re-order anyway.
 *
 * @param {Array} visible Currently visible items.
 * @param {Array} buffered Held-back items to release.
 * @param {Function} getTs `(item) => timestamp-ish` accessor.
 * @returns {{ items: Array, flushed: Array, newestTs: number|null }} `items`
 *   is the merged list, `flushed` echoes the released buffer, and `newestTs`
 *   is the new watermark across ALL merged items (null when none parse).
 */
export const flushBuffer = (visible, buffered, getTs) => {
  const safeVisible = Array.isArray(visible) ? visible : [];
  const safeBuffered = Array.isArray(buffered) ? buffered : [];
  const items = [...safeBuffered, ...safeVisible];

  let newestTs = null;
  items.forEach((item) => {
    const ts = toTimestampMs(typeof getTs === "function" ? getTs(item) : undefined);
    if (ts != null && (newestTs == null || ts > newestTs)) newestTs = ts;
  });

  return { items, flushed: safeBuffered, newestTs };
};
