// ═══════════════════════════════════════════════════════════════════════════
// Row-expansion set logic for DataTable detail rows.
//
// Expansion state is a Set of row IDs (same id-extraction rules as row
// selection: `row[rowIdField]`, null/undefined ids are ignored), so expanded
// rows persist across pagination and survive grouping/sorting reshuffles.
// All set operations are pure and return NEW sets — DataTable stores the
// result directly in React state, and callers in controlled mode receive the
// next array via `onExpandedRowsChange` without us mutating their input.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract a row's unique id, mirroring DataTable's selection logic
 * (`row[rowIdField]`). Returns `fallback` (default `undefined`) when the row
 * is missing or has no usable id — rows without ids cannot be expanded,
 * exactly like they cannot be selected.
 *
 * @param {object} row
 * @param {string} [rowIdField="id"]
 * @param {*} [fallback]
 * @returns {*} the row id, or `fallback` when absent
 */
export const extractRowId = (row, rowIdField = "id", fallback = undefined) => {
  const id = row == null ? undefined : row[rowIdField];
  return id != null ? id : fallback;
};

/**
 * Coerce an expanded-ids input (array, Set, single id, or nothing) into a
 * fresh Set, dropping null/undefined entries.
 *
 * @param {Array|Set|*} ids
 * @returns {Set} a new Set of ids
 */
export const normalizeExpandedIds = (ids) => {
  if (ids == null) return new Set();
  const list = ids instanceof Set ? [...ids] : Array.isArray(ids) ? ids : [ids];
  return new Set(list.filter((id) => id != null));
};

/**
 * Expand a row id. In `expandSingle` (accordion) mode the result contains
 * ONLY the given id — expanding one row collapses all others.
 * Returns the input set unchanged (same reference) when `rowId` is unusable.
 *
 * @param {Set} expandedIds current expanded set
 * @param {*} rowId
 * @param {boolean} [expandSingle=false]
 * @returns {Set} next expanded set
 */
export const expandRowId = (expandedIds, rowId, expandSingle = false) => {
  if (rowId == null) return expandedIds;
  if (expandSingle) return new Set([rowId]);
  const next = new Set(expandedIds);
  next.add(rowId);
  return next;
};

/**
 * Collapse a row id. Returns the input set unchanged (same reference) when
 * the id is unusable or not currently expanded, so no-ops are cheap to detect.
 *
 * @param {Set} expandedIds current expanded set
 * @param {*} rowId
 * @returns {Set} next expanded set
 */
export const collapseRowId = (expandedIds, rowId) => {
  if (rowId == null || !expandedIds.has(rowId)) return expandedIds;
  const next = new Set(expandedIds);
  next.delete(rowId);
  return next;
};

/**
 * Toggle a row id: collapse it when expanded, expand it otherwise (honoring
 * `expandSingle` accordion behavior on expand).
 *
 * @param {Set} expandedIds current expanded set
 * @param {*} rowId
 * @param {boolean} [expandSingle=false]
 * @returns {Set} next expanded set
 */
export const toggleExpandedId = (expandedIds, rowId, expandSingle = false) => {
  if (rowId == null) return expandedIds;
  return expandedIds.has(rowId)
    ? collapseRowId(expandedIds, rowId)
    : expandRowId(expandedIds, rowId, expandSingle);
};

/**
 * Interleave detail-row markers into DataTable's display-row list: after every
 * `{ type: "data", row }` item whose id is expanded, insert
 * `{ type: "detail", row }`. Group headers (and rows hidden inside collapsed
 * groups, which never reach this list) pass through untouched, so detail rows
 * always render directly under their data row — inside groups included.
 *
 * @param {Array<{type: string, row?: object}>} items display-row items
 * @param {Set} expandedIds expanded row ids
 * @param {string} [rowIdField="id"]
 * @returns {Array<{type: string, row?: object}>} items with detail rows inserted
 */
export const withDetailRows = (items, expandedIds, rowIdField = "id") => {
  if (!expandedIds || expandedIds.size === 0) return items;
  const out = [];
  items.forEach((item) => {
    out.push(item);
    if (item.type === "data" && expandedIds.has(extractRowId(item.row, rowIdField))) {
      out.push({ type: "detail", row: item.row });
    }
  });
  return out;
};
