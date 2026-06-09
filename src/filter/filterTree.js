// ═══════════════════════════════════════════════════════════════════════════
// FilterBuilder tree primitives — pure, immutable, unit-testable.
//
// The public contract of hs-uix/filter is a recursive AND/OR tree:
//
//   group     = { type: "group", operator: "AND" | "OR", filters: [node...] }
//   condition = { type: "condition", property, operator, value?, highValue? }
//
// Everything that manipulates or interprets that tree lives here, NOT in the
// component: which CRM-search operators each property type supports, what
// value shape each operator expects, immutable add/update/remove by path,
// validation, and conversion to HubSpot's CRM search `{ filterGroups }` shape
// (OR of ANDs, derived via disjunctive normal form). FilterBuilder.jsx is a
// thin rendering layer over these functions, so every behavioral rule is
// testable without mounting a component.
//
// Paths are arrays of indices into nested `filters` arrays: `[]` is the root
// group, `[1]` is the root's second child, `[1, 0]` is that child's first
// child, etc. All mutators return a NEW tree and never modify the input;
// untouched branches keep referential identity (structural sharing).
// ═══════════════════════════════════════════════════════════════════════════

const NUMERIC_OPERATORS = ["EQ", "NEQ", "GT", "GTE", "LT", "LTE", "BETWEEN", "HAS_PROPERTY", "NOT_HAS_PROPERTY"];

/**
 * CRM-search operators supported per property type. Mirrors HubSpot's CRM
 * search API operator names exactly (these strings go on the wire).
 */
export const FILTER_OPERATORS = {
  string: ["EQ", "NEQ", "CONTAINS_TOKEN", "NOT_CONTAINS_TOKEN", "HAS_PROPERTY", "NOT_HAS_PROPERTY"],
  number: NUMERIC_OPERATORS,
  date: NUMERIC_OPERATORS,
  datetime: NUMERIC_OPERATORS,
  enum: ["IN", "NOT_IN", "HAS_PROPERTY", "NOT_HAS_PROPERTY"],
  bool: ["EQ"],
};

const ALL_OPERATORS = [...new Set(Object.values(FILTER_OPERATORS).flat())];

const BASE_OPERATOR_LABELS = {
  EQ: "is equal to",
  NEQ: "is not equal to",
  CONTAINS_TOKEN: "contains",
  NOT_CONTAINS_TOKEN: "doesn't contain",
  GT: "is greater than",
  GTE: "is greater than or equal to",
  LT: "is less than",
  LTE: "is less than or equal to",
  BETWEEN: "is between",
  IN: "is any of",
  NOT_IN: "is none of",
  HAS_PROPERTY: "is known",
  NOT_HAS_PROPERTY: "is unknown",
};

// Date comparisons read better as before/after than greater/less than.
const DATE_OPERATOR_LABELS = {
  EQ: "is",
  NEQ: "is not",
  GT: "is after",
  GTE: "is on or after",
  LT: "is before",
  LTE: "is on or before",
};

/**
 * Operator `{ label, value }` options for a property type, ready for a native
 * Select. Date/datetime types get before/after phrasing. `labelOverrides`
 * (operator → label) wins over the built-in copy.
 *
 * @param {string} [type] one of FILTER_OPERATORS' keys; unknown → []
 * @param {Record<string, string>} [labelOverrides]
 * @returns {Array<{ label: string, value: string }>}
 */
export const getOperatorOptions = (type, labelOverrides) => {
  const operators = FILTER_OPERATORS[type] || [];
  const dateLabels = type === "date" || type === "datetime" ? DATE_OPERATOR_LABELS : null;
  return operators.map((operator) => ({
    label:
      labelOverrides?.[operator] ??
      dateLabels?.[operator] ??
      BASE_OPERATOR_LABELS[operator] ??
      operator,
    value: operator,
  }));
};

/** Does this operator take a value at all? (HAS_PROPERTY / NOT_HAS_PROPERTY do not.) */
export const operatorExpectsValue = (operator) =>
  operator !== "HAS_PROPERTY" && operator !== "NOT_HAS_PROPERTY";

/** Does this operator take an upper bound (`highValue`)? Only BETWEEN. */
export const operatorExpectsHighValue = (operator) => operator === "BETWEEN";

/** Does this operator take a LIST of values? (IN / NOT_IN → CRM `values: []`.) */
export const operatorExpectsValues = (operator) => operator === "IN" || operator === "NOT_IN";

/** Is this node a group? */
export const isGroupNode = (node) => node != null && node.type === "group";

/** Is this node a condition? */
export const isConditionNode = (node) => node != null && node.type === "condition";

/**
 * Create a condition node. `value` / `highValue` keys are only present when
 * provided, so empty conditions serialize cleanly.
 *
 * @param {string} [property]
 * @param {string} [operator]
 * @param {any} [value]
 * @param {any} [highValue]
 */
export const createCondition = (property = "", operator = "", value, highValue) => {
  const node = { type: "condition", property, operator };
  if (value !== undefined) node.value = value;
  if (highValue !== undefined) node.highValue = highValue;
  return node;
};

/**
 * Create a group node.
 *
 * @param {"AND"|"OR"} [operator]
 * @param {Array<object>} [filters]
 */
export const createGroup = (operator = "AND", filters = []) => ({
  type: "group",
  operator,
  filters,
});

/**
 * Read the node at a path. Lenient: returns `undefined` for out-of-bounds
 * indices or paths that descend into a condition.
 *
 * @param {object} tree
 * @param {number[]} path
 */
export const getNodeAtPath = (tree, path) => {
  let node = tree;
  for (const index of path || []) {
    if (!isGroupNode(node) || !Array.isArray(node.filters)) return undefined;
    node = node.filters[index];
    if (node === undefined) return undefined;
  }
  return node;
};

// Strict immutable rewrite of the node at `path` via `fn`; shares untouched
// branches. Throws on paths that don't resolve (mutating a node that doesn't
// exist is always a caller bug worth surfacing).
const updateNodeAtPath = (node, path, fn) => {
  if (!path || path.length === 0) return fn(node);
  if (!isGroupNode(node) || !Array.isArray(node.filters)) {
    throw new Error("filterTree: path descends into a non-group node");
  }
  const [index, ...rest] = path;
  if (typeof index !== "number" || index < 0 || index >= node.filters.length) {
    throw new Error(`filterTree: no filter at index ${index} (group has ${node.filters.length})`);
  }
  const filters = node.filters.slice();
  filters[index] = updateNodeAtPath(filters[index], rest, fn);
  return { ...node, filters };
};

/**
 * Append `node` to the group at `path` (`[]` = root). Immutable; throws if
 * `path` does not resolve to a group.
 *
 * @param {object} tree root group
 * @param {number[]} path path to a GROUP node
 * @param {object} node condition or group to append
 * @returns {object} new tree
 */
export const addFilter = (tree, path, node) =>
  updateNodeAtPath(tree, path, (group) => {
    if (!isGroupNode(group)) {
      throw new Error("filterTree: addFilter path must point at a group node");
    }
    return { ...group, filters: [...(group.filters || []), node] };
  });

/**
 * Update the node at `path`. `patch` is either an object (shallow-merged onto
 * the node) or a function `(node) => nextNode` (full replacement — use this
 * when stale keys like `value` / `highValue` must be dropped).
 *
 * @param {object} tree root group
 * @param {number[]} path path to any node
 * @param {object | ((node: object) => object)} patch
 * @returns {object} new tree
 */
export const updateFilter = (tree, path, patch) =>
  updateNodeAtPath(tree, path, (node) =>
    typeof patch === "function" ? patch(node) : { ...node, ...patch }
  );

/**
 * Remove the node at `path`. Immutable; throws on the root path `[]`.
 * With `pruneEmptyGroups`, ancestor groups left empty by the removal are
 * removed too (cascading upward) — the root group is never pruned.
 *
 * @param {object} tree root group
 * @param {number[]} path non-empty path to the node to remove
 * @param {{ pruneEmptyGroups?: boolean }} [options]
 * @returns {object} new tree
 */
export const removeFilter = (tree, path, options = {}) => {
  if (!path || path.length === 0) {
    throw new Error("filterTree: cannot remove the root group");
  }

  const doRemove = (currentTree, targetPath) => {
    const parentPath = targetPath.slice(0, -1);
    const index = targetPath[targetPath.length - 1];
    return updateNodeAtPath(currentTree, parentPath, (group) => {
      if (!isGroupNode(group)) {
        throw new Error("filterTree: removeFilter parent is not a group node");
      }
      if (typeof index !== "number" || index < 0 || index >= group.filters.length) {
        throw new Error(`filterTree: no filter at index ${index} (group has ${group.filters.length})`);
      }
      return { ...group, filters: group.filters.filter((_, i) => i !== index) };
    });
  };

  let next = doRemove(tree, path);

  if (options.pruneEmptyGroups) {
    let parentPath = path.slice(0, -1);
    while (parentPath.length > 0) {
      const parent = getNodeAtPath(next, parentPath);
      if (!isGroupNode(parent) || parent.filters.length > 0) break;
      next = doRemove(next, parentPath);
      parentPath = parentPath.slice(0, -1);
    }
  }

  return next;
};

/** Count condition nodes in a tree (groups themselves don't count). */
export const countConditions = (node) => {
  if (isConditionNode(node)) return 1;
  if (!isGroupNode(node) || !Array.isArray(node.filters)) return 0;
  return node.filters.reduce((sum, child) => sum + countConditions(child), 0);
};

/**
 * Rewrite a condition for a newly selected property. Keeps the operator when
 * it is still valid for the new property's type, otherwise resets it to the
 * type's first operator; always clears `value` / `highValue` (old values are
 * meaningless against a different property). Multi-value operators get a
 * fresh `[]` so MultiSelect editors are immediately usable.
 *
 * @param {object} condition
 * @param {{ name: string, type?: string } | string} property property definition (or bare name — no type info means the operator resets to "")
 * @returns {object} new condition node
 */
export const changeConditionProperty = (condition, property) => {
  const name = typeof property === "string" ? property : property?.name ?? "";
  const type = typeof property === "object" && property !== null ? property.type : undefined;
  const operators = FILTER_OPERATORS[type] || [];
  const operator = operators.includes(condition?.operator)
    ? condition.operator
    : operators[0] ?? "";
  const next = { type: "condition", property: name, operator };
  if (operatorExpectsValues(operator)) next.value = [];
  return next;
};

/**
 * Rewrite a condition for a newly selected operator, keeping the value only
 * when its shape still fits: scalar values survive scalar→scalar switches,
 * arrays survive IN↔NOT_IN, everything else is dropped (HAS_PROPERTY-style
 * operators drop all values; BETWEEN keeps the low value and any highValue).
 *
 * @param {object} condition
 * @param {string} operator
 * @returns {object} new condition node
 */
export const changeConditionOperator = (condition, operator) => {
  const next = { type: "condition", property: condition?.property ?? "", operator };
  if (!operatorExpectsValue(operator)) return next;
  if (operatorExpectsValues(operator)) {
    next.value = Array.isArray(condition?.value) ? condition.value : [];
    return next;
  }
  if (condition?.value !== undefined && !Array.isArray(condition.value)) {
    next.value = condition.value;
  }
  if (operatorExpectsHighValue(operator) && condition?.highValue !== undefined) {
    next.highValue = condition.highValue;
  }
  return next;
};

const isMissing = (value) => value == null || value === "";

/**
 * Validate a tree for completeness. Returns `{ valid, errors }` where each
 * error carries the `path` of the offending node and a human message.
 *
 * Rules:
 *  - root must be a group; an EMPTY ROOT is valid (it means "no filters")
 *  - nested empty groups are invalid (they can't be converted or evaluated)
 *  - group operators must be "AND" or "OR"
 *  - conditions need a property and an operator; with a `properties` list the
 *    property must exist and the operator must be legal for its type
 *  - value arity must match the operator: none for HAS_PROPERTY/NOT_HAS_PROPERTY,
 *    non-empty array for IN/NOT_IN, `value` + `highValue` for BETWEEN, a
 *    single value otherwise
 *
 * @param {object} tree
 * @param {Array<{ name: string, type?: string }>} [properties] optional property definitions for stricter checks
 * @returns {{ valid: boolean, errors: Array<{ path: number[], message: string }> }}
 */
export const validateTree = (tree, properties) => {
  const errors = [];
  const byName = Array.isArray(properties)
    ? new Map(properties.map((property) => [property.name, property]))
    : null;

  if (!isGroupNode(tree)) {
    return { valid: false, errors: [{ path: [], message: "Root must be a group node." }] };
  }

  const visitCondition = (node, path) => {
    if (!node.property) {
      errors.push({ path, message: "Condition is missing a property." });
      return;
    }
    let type;
    if (byName) {
      const def = byName.get(node.property);
      if (!def) {
        errors.push({ path, message: `Unknown property "${node.property}".` });
        return;
      }
      type = def.type;
    }
    const allowed = type !== undefined ? FILTER_OPERATORS[type] || [] : ALL_OPERATORS;
    if (!node.operator) {
      errors.push({ path, message: "Condition is missing an operator." });
      return;
    }
    if (!allowed.includes(node.operator)) {
      errors.push({
        path,
        message: type !== undefined
          ? `Operator "${node.operator}" is not valid for type "${type}".`
          : `Unknown operator "${node.operator}".`,
      });
      return;
    }
    if (!operatorExpectsValue(node.operator)) return;
    if (operatorExpectsValues(node.operator)) {
      if (!Array.isArray(node.value) || node.value.length === 0) {
        errors.push({ path, message: `Operator "${node.operator}" requires at least one value.` });
      }
      return;
    }
    if (isMissing(node.value)) {
      errors.push({ path, message: `Operator "${node.operator}" requires a value.` });
    }
    if (operatorExpectsHighValue(node.operator) && isMissing(node.highValue)) {
      errors.push({ path, message: 'Operator "BETWEEN" requires an upper bound (highValue).' });
    }
  };

  const visit = (node, path) => {
    if (node == null || typeof node !== "object") {
      errors.push({ path, message: "Filter node must be an object." });
      return;
    }
    if (node.type === "group") {
      if (node.operator !== "AND" && node.operator !== "OR") {
        errors.push({ path, message: `Group operator must be "AND" or "OR" (got "${node.operator}").` });
      }
      if (!Array.isArray(node.filters)) {
        errors.push({ path, message: "Group filters must be an array." });
        return;
      }
      if (node.filters.length === 0 && path.length > 0) {
        errors.push({ path, message: "Group has no filters." });
      }
      node.filters.forEach((child, index) => visit(child, [...path, index]));
      return;
    }
    if (node.type === "condition") {
      visitCondition(node, path);
      return;
    }
    errors.push({ path, message: `Unknown node type "${node.type}".` });
  };

  visit(tree, []);
  return { valid: errors.length === 0, errors };
};

// ─── CRM search conversion ───────────────────────────────────────────────────

/** Is this a HubSpot DateInput value object ({ year, month, date })? */
const isDateValueObject = (value) =>
  value != null &&
  typeof value === "object" &&
  typeof value.year === "number" &&
  typeof value.month === "number" &&
  typeof value.date === "number";

// DateInput value object → epoch ms at LOCAL midnight. Identical semantics to
// utils/query.js `dateToTimestamp`, deliberately inlined: query.js imports
// fuse.js, and esbuild preserves that import in the bundle even when the
// search helpers are tree-shaken away — importing it here would make every
// hs-uix/filter consumer ship fuse.js for a three-line date conversion.
const dateValueToTimestamp = (dateObj) =>
  new Date(dateObj.year, dateObj.month, dateObj.date).getTime();

// DateInput value objects → epoch ms (local midnight, matching query.js
// dateRange filtering); booleans → "true"/"false" strings (the CRM search API
// matches bool/enumeration values as strings). Everything else passes through.
const coerceCrmValue = (value) => {
  if (isDateValueObject(value)) return dateValueToTimestamp(value);
  if (typeof value === "boolean") return String(value);
  return value;
};

/**
 * Convert ONE condition node to a CRM search filter object:
 * `{ propertyName, operator }` plus `value`, `value` + `highValue` (BETWEEN),
 * or `values` (IN / NOT_IN) per the operator's arity. With `coerceValues`
 * (default true) DateInput objects become epoch-ms numbers and booleans
 * become "true"/"false" strings.
 *
 * @param {object} condition
 * @param {{ coerceValues?: boolean }} [options]
 * @returns {object} CRM search filter
 */
export const conditionToCrmFilter = (condition, options = {}) => {
  const { coerceValues = true } = options;
  if (!isConditionNode(condition)) {
    throw new Error("filterTree: conditionToCrmFilter expects a condition node");
  }
  if (!condition.property) {
    throw new Error("filterTree: condition is missing a property");
  }
  if (!condition.operator) {
    throw new Error(`filterTree: condition on "${condition.property}" is missing an operator`);
  }
  const coerce = coerceValues ? coerceCrmValue : (value) => value;
  const filter = { propertyName: condition.property, operator: condition.operator };
  if (!operatorExpectsValue(condition.operator)) return filter;
  if (operatorExpectsValues(condition.operator)) {
    const values = Array.isArray(condition.value)
      ? condition.value
      : condition.value == null
        ? []
        : [condition.value];
    filter.values = values.map(coerce);
    return filter;
  }
  filter.value = coerce(condition.value);
  if (operatorExpectsHighValue(condition.operator)) {
    filter.highValue = coerce(condition.highValue);
  }
  return filter;
};

// Recursive disjunctive-normal-form expansion. Returns an array of
// "conjunctions"; each conjunction is an array of CRM filter objects that are
// ANDed together, and the conjunctions themselves are ORed.
//   condition → [[filter]]
//   OR group  → concat of children's conjunction lists
//   AND group → cartesian product of children's conjunction lists
const nodeToDnf = (node, path, options) => {
  if (isConditionNode(node)) {
    return [[conditionToCrmFilter(node, options)]];
  }
  if (!isGroupNode(node)) {
    throw new Error(`filterTree: unknown node type "${node?.type}" at [${path.join(", ")}]`);
  }
  if (!Array.isArray(node.filters) || node.filters.length === 0) {
    throw new Error(
      `filterTree: empty group at [${path.join(", ")}] cannot be converted — remove it or add a condition (run validateTree first)`
    );
  }
  const childDnfs = node.filters.map((child, index) => nodeToDnf(child, [...path, index], options));
  if (node.operator === "OR") {
    return childDnfs.flat();
  }
  // AND: distribute — every combination of one conjunction per child.
  return childDnfs.reduce(
    (acc, childDnf) => {
      const out = [];
      for (const left of acc) {
        for (const right of childDnf) out.push([...left, ...right]);
      }
      return out;
    },
    [[]]
  );
};

/**
 * Convert a filter tree to HubSpot CRM search shape:
 * `{ filterGroups: [{ filters: [...] }] }` — filters within a group are ANDed,
 * groups are ORed.
 *
 * Flattening rules: the tree is expanded to disjunctive normal form. Nested
 * groups at ANY depth are handled — `A AND (B OR C)` distributes to
 * `[[A, B], [A, C]]`, nested ORs flatten into their parent OR, and so on. The
 * cost is combinatorial: each OR nested under an AND MULTIPLIES filterGroups
 * (`(A OR B) AND (C OR D)` → 4 groups), and each condition under it is
 * duplicated into every group it distributes into.
 *
 * Limits: HubSpot CRM search rejects requests with more than `maxGroups`
 * filterGroups (default 5), `maxFiltersPerGroup` filters per group (default
 * 6), or `maxTotalFilters` filters overall (default 18). When the expansion
 * exceeds a limit this THROWS with a descriptive message rather than sending
 * a request that will 400. Pass `enforceLimits: false` to skip the checks
 * (e.g. when targeting an API with different limits), or adjust the numbers.
 *
 * An empty root group returns `{ filterGroups: [] }` ("no filters"); empty
 * NESTED groups throw — validate with `validateTree` first.
 *
 * @param {object} tree root group node
 * @param {{ maxGroups?: number, maxFiltersPerGroup?: number, maxTotalFilters?: number, enforceLimits?: boolean, coerceValues?: boolean }} [options]
 * @returns {{ filterGroups: Array<{ filters: Array<object> }> }}
 */
export const toCrmSearchFilterGroups = (tree, options = {}) => {
  const {
    maxGroups = 5,
    maxFiltersPerGroup = 6,
    maxTotalFilters = 18,
    enforceLimits = true,
    coerceValues = true,
  } = options;

  if (!isGroupNode(tree)) {
    throw new Error("filterTree: toCrmSearchFilterGroups expects a group node at the root");
  }
  if (!Array.isArray(tree.filters) || tree.filters.length === 0) {
    return { filterGroups: [] };
  }

  const conjunctions = nodeToDnf(tree, [], { coerceValues });

  if (enforceLimits) {
    if (conjunctions.length > maxGroups) {
      throw new Error(
        `filterTree: tree expands to ${conjunctions.length} filterGroups; HubSpot CRM search allows at most ${maxGroups}. Reduce OR branches (each OR nested under an AND multiplies groups).`
      );
    }
    const oversized = conjunctions.findIndex((filters) => filters.length > maxFiltersPerGroup);
    if (oversized !== -1) {
      throw new Error(
        `filterTree: filterGroup ${oversized} has ${conjunctions[oversized].length} filters; HubSpot CRM search allows at most ${maxFiltersPerGroup} per group.`
      );
    }
    const total = conjunctions.reduce((sum, filters) => sum + filters.length, 0);
    if (total > maxTotalFilters) {
      throw new Error(
        `filterTree: tree expands to ${total} total filters; HubSpot CRM search allows at most ${maxTotalFilters}.`
      );
    }
  }

  return { filterGroups: conjunctions.map((filters) => ({ filters })) };
};
