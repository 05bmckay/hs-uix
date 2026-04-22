// ---------------------------------------------------------------------------
// viewAdapters — shape transforms between DataTable and Kanban configs, so a
// caller can define one set of field metadata and project it into both views
// (the "same data, toggle between table / kanban" pattern).
// ---------------------------------------------------------------------------

/**
 * Convert a DataTable `columns` array into a Kanban `cardFields` array.
 *
 * Default mapping:
 *   - first column (or `opts.titleField`)    → placement: "title"
 *   - everything else                         → placement: "body"
 *   - `col.renderCell`                        → `field.render`
 *   - `col.truncate`                          → `field.truncate`
 *   - `col.label`, `col.field`                → passed through
 *
 * Dropped (not meaningful on a card):
 *   sortable, sortComparator, width, cellWidth, align, description,
 *   editable / editType / edit* — all table-specific.
 *
 * @param {Array} columns — DataTable columns config.
 * @param {object} [opts]
 * @param {string} [opts.titleField] — which column's `field` becomes the title. Default: first filtered column.
 * @param {(row) => string | { url: string, external?: boolean }} [opts.titleHref]
 *   Optional href factory applied only to the title field.
 * @param {Record<string, "title" | "subtitle" | "meta" | "body" | "footer">} [opts.placements]
 *   Per-field placement overrides keyed by `field` name.
 * @param {string[]} [opts.exclude] — field names to drop entirely.
 * @param {string[]} [opts.include] — whitelist; if set, only these fields are emitted.
 * @param {number} [opts.maxBodyFields] — cap on `placement: "body"` entries.
 *   Cards don't handle unlimited body lines gracefully; 3-5 is typical.
 * @returns {Array} Kanban-ready cardFields.
 */
export const deriveCardFieldsFromColumns = (columns, opts = {}) => {
  const {
    titleField,
    titleHref,
    placements = {},
    exclude,
    include,
    maxBodyFields,
  } = opts;

  const excludeSet = new Set(exclude || []);
  const includeSet = include ? new Set(include) : null;

  const filtered = (columns || []).filter((col) => {
    if (!col || !col.field) return false;
    if (excludeSet.has(col.field)) return false;
    if (includeSet && !includeSet.has(col.field)) return false;
    return true;
  });

  // Resolve which field becomes the title:
  //   1. explicit opts.titleField (even if the placement override isn't set)
  //   2. first field whose placement override === "title"
  //   3. first filtered column
  const resolvedTitleField =
    titleField ||
    Object.keys(placements).find((k) => placements[k] === "title") ||
    filtered[0]?.field;

  const out = [];
  let bodyCount = 0;

  for (const col of filtered) {
    const placement =
      placements[col.field] ||
      (col.field === resolvedTitleField ? "title" : "body");

    if (placement === "body" && maxBodyFields != null && bodyCount >= maxBodyFields) {
      continue;
    }
    if (placement === "body") bodyCount += 1;

    const cardField = {
      key: col.field,
      field: col.field,
      placement,
    };

    if (col.label != null) cardField.label = col.label;
    if (col.renderCell) cardField.render = col.renderCell;
    if (col.truncate != null) cardField.truncate = col.truncate;

    if (placement === "title" && titleHref) cardField.href = titleHref;

    out.push(cardField);
  }

  return out;
};
