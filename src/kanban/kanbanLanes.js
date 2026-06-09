// ═══════════════════════════════════════════════════════════════════════════
// Kanban lane partitioning + WIP-limit evaluation.
//
// Swimlanes (vertical secondary grouping) and WIP limits (per-stage capacity
// signals) are pure data problems wrapped in board chrome: which lane does a
// row belong to, in what order do lanes render, how many cards sit in each
// stage versus its limit, and which stages JUST crossed their limit. All of
// that logic lives here — pure, deterministic, and exhaustively testable —
// so Kanban.jsx stays a rendering layer and callers can reuse the same
// evaluation server-side (e.g. to decide whether to alert on a webhook).
// ═══════════════════════════════════════════════════════════════════════════

/** Lane key used for rows whose swimlane value is null/undefined/"". */
export const UNASSIGNED_LANE_KEY = "__unassigned";

/** Bucket key used for rows whose stage value matches no configured stage. */
export const UNKNOWN_STAGE_KEY = "__unknown";

// ---------------------------------------------------------------------------
// Lane partitioning
// ---------------------------------------------------------------------------

/**
 * Resolve the swimlane key for a row. `swimlaneBy` is either a field name or
 * an accessor function. Null / undefined / empty-string values land in the
 * shared UNASSIGNED_LANE_KEY lane; everything else is String()-coerced so
 * numbers and booleans make stable object keys.
 *
 * @param {object} row
 * @param {string | ((row: object) => unknown)} swimlaneBy
 * @returns {string}
 */
export const getLaneKey = (row, swimlaneBy) => {
  const raw = typeof swimlaneBy === "function" ? swimlaneBy(row) : row?.[swimlaneBy];
  if (raw == null || raw === "") return UNASSIGNED_LANE_KEY;
  return String(raw);
};

/**
 * Order lane keys for rendering. Keys listed in `swimlaneOrder` render first,
 * in that exact order (deduped, and INCLUDED EVEN WHEN EMPTY — an explicit
 * order doubles as an explicit lane list, so "High / Medium / Low" lanes hold
 * their slots when one has no rows). Keys seen in the data but absent from
 * `swimlaneOrder` append afterwards in first-seen order.
 *
 * @param {string[]} seenKeys - lane keys in first-seen data order
 * @param {string[]} [swimlaneOrder]
 * @returns {string[]}
 */
export const orderLaneKeys = (seenKeys, swimlaneOrder) => {
  const seen = Array.isArray(seenKeys) ? seenKeys : [];
  if (!Array.isArray(swimlaneOrder) || swimlaneOrder.length === 0) return [...seen];
  const explicit = [];
  for (const key of swimlaneOrder) {
    const normalized = String(key);
    if (!explicit.includes(normalized)) explicit.push(normalized);
  }
  const rest = seen.filter((key) => !explicit.includes(key));
  return [...explicit, ...rest];
};

/**
 * Partition rows into swimlanes. Returns `{ laneKeys, rowsByLane }` where
 * `laneKeys` is the render order (see orderLaneKeys) and `rowsByLane` maps
 * every lane key — including explicitly ordered empty lanes — to its rows in
 * original data order.
 *
 * @param {object[]} rows
 * @param {{ swimlaneBy?: string | ((row: object) => unknown), swimlaneOrder?: string[] }} [options]
 * @returns {{ laneKeys: string[], rowsByLane: Record<string, object[]> }}
 */
export const partitionLanes = (rows, { swimlaneBy, swimlaneOrder } = {}) => {
  const rowsByLane = {};
  const firstSeen = [];
  for (const row of rows || []) {
    const key = getLaneKey(row, swimlaneBy);
    if (!rowsByLane[key]) {
      rowsByLane[key] = [];
      firstSeen.push(key);
    }
    rowsByLane[key].push(row);
  }
  const laneKeys = orderLaneKeys(firstSeen, swimlaneOrder);
  for (const key of laneKeys) {
    if (!rowsByLane[key]) rowsByLane[key] = [];
  }
  return { laneKeys, rowsByLane };
};

/**
 * Resolve the display label for a lane. `swimlaneLabels` is either a
 * `{ key: label }` map or a `(laneKey, rows) => label` function; a null /
 * undefined result falls through to the defaults: `unassignedLabel` for the
 * unassigned lane, else the lane key itself.
 *
 * @param {string} laneKey
 * @param {Record<string, string> | ((laneKey: string, rows: object[]) => unknown)} [swimlaneLabels]
 * @param {object[]} [rows] - the lane's rows (passed to a label function)
 * @param {string} [unassignedLabel] - fallback for UNASSIGNED_LANE_KEY
 * @returns {unknown} label (string or ReactNode from a label function)
 */
export const resolveLaneLabel = (laneKey, swimlaneLabels, rows, unassignedLabel) => {
  if (typeof swimlaneLabels === "function") {
    const out = swimlaneLabels(laneKey, rows || []);
    if (out != null) return out;
  } else if (swimlaneLabels && typeof swimlaneLabels === "object") {
    const out = swimlaneLabels[laneKey];
    if (out != null) return out;
  }
  if (laneKey === UNASSIGNED_LANE_KEY) return unassignedLabel || "Unassigned";
  return String(laneKey);
};

// ---------------------------------------------------------------------------
// Stage bucketing (shared by the flat board and each lane)
// ---------------------------------------------------------------------------

/**
 * Bucket rows by stage. Every configured stage gets an array (possibly
 * empty); rows whose stage value matches no configured stage collect under
 * UNKNOWN_STAGE_KEY (only when at least one stage is configured — mirrors the
 * original Kanban pipeline behavior).
 *
 * @param {object[]} rows
 * @param {{ value: string }[]} stages
 * @param {(row: object) => string} getStage
 * @returns {Record<string, object[]>}
 */
export const bucketRowsByStage = (rows, stages, getStage) => {
  const map = {};
  for (const stage of stages || []) map[stage.value] = [];
  for (const row of rows || []) {
    const key = getStage(row);
    if (map[key]) {
      map[key].push(row);
    } else if ((stages || []).length > 0) {
      if (!map[UNKNOWN_STAGE_KEY]) map[UNKNOWN_STAGE_KEY] = [];
      map[UNKNOWN_STAGE_KEY].push(row);
    }
  }
  return map;
};

/**
 * Sort each bucket with the given comparator without mutating the inputs.
 * Returns the same object when no comparator is provided.
 *
 * @param {Record<string, object[]>} buckets
 * @param {((a: object, b: object) => number) | null | undefined} comparator
 * @returns {Record<string, object[]>}
 */
export const sortBuckets = (buckets, comparator) => {
  if (!comparator) return buckets;
  const out = {};
  for (const key of Object.keys(buckets || {})) {
    out[key] = [...buckets[key]].sort(comparator);
  }
  return out;
};

// ---------------------------------------------------------------------------
// WIP limits
// ---------------------------------------------------------------------------

/**
 * Resolve the effective WIP limit for a stage. The top-level
 * `wipLimits={{ [stageId]: n }}` override wins over the per-stage
 * `stage.wipLimit`. Only finite numbers >= 0 count as limits (0 is valid —
 * "this stage should stay empty"); anything else returns null (no limit).
 *
 * @param {{ value: string, wipLimit?: number }} stage
 * @param {Record<string, number>} [wipLimits]
 * @returns {number | null}
 */
export const resolveWipLimit = (stage, wipLimits) => {
  const override = wipLimits ? wipLimits[stage?.value] : undefined;
  const limit = override != null ? override : stage?.wipLimit;
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 0) return null;
  return limit;
};

/**
 * Per-stage card counts used for WIP evaluation and header display. Prefers
 * the server-truth `stageMeta[stage].totalCount` when present (matching what
 * the column header shows), falling back to the loaded bucket length.
 *
 * @param {{ value: string }[]} stages
 * @param {Record<string, object[]>} buckets
 * @param {Record<string, { totalCount?: number }>} [stageMeta]
 * @returns {Record<string, number>}
 */
export const computeStageCounts = (stages, buckets, stageMeta) => {
  const counts = {};
  for (const stage of stages || []) {
    const meta = stageMeta ? stageMeta[stage.value] : undefined;
    counts[stage.value] =
      meta && meta.totalCount != null ? meta.totalCount : (buckets?.[stage.value] || []).length;
  }
  return counts;
};

/**
 * Evaluate WIP status for every stage. Returns
 * `{ [stageId]: { count, limit, exceeded } }` where `limit` is null for
 * stages without one and `exceeded` is true only when count is STRICTLY
 * greater than the limit (a column AT its limit is full, not over).
 *
 * @param {{ value: string, wipLimit?: number }[]} stages
 * @param {Record<string, number>} counts
 * @param {Record<string, number>} [wipLimits]
 * @returns {Record<string, { count: number, limit: number | null, exceeded: boolean }>}
 */
export const evaluateWip = (stages, counts, wipLimits) => {
  const out = {};
  for (const stage of stages || []) {
    const limit = resolveWipLimit(stage, wipLimits);
    const count = counts?.[stage.value] || 0;
    out[stage.value] = { count, limit, exceeded: limit != null && count > limit };
  }
  return out;
};

/**
 * Diff two WIP evaluations and return the stages that TRANSITIONED into the
 * exceeded state — the contract behind `onWipExceeded`, which must fire once
 * per crossing, not on every render. Stages missing from `prev` count as
 * not-exceeded, so a board that mounts already over a limit reports it once
 * on mount. A stage that stays exceeded (even with a growing count) produces
 * no new event; it must recover below the limit and cross again.
 *
 * @param {Record<string, { count: number, limit: number | null, exceeded: boolean }> | null | undefined} prev
 * @param {Record<string, { count: number, limit: number | null, exceeded: boolean }>} next
 * @returns {{ stageId: string, count: number, limit: number }[]}
 */
export const findNewlyExceededWip = (prev, next) => {
  const events = [];
  for (const stageId of Object.keys(next || {})) {
    const entry = next[stageId];
    if (!entry || !entry.exceeded) continue;
    if (prev && prev[stageId] && prev[stageId].exceeded) continue;
    events.push({ stageId, count: entry.count, limit: entry.limit });
  }
  return events;
};
