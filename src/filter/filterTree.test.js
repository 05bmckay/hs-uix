import { describe, it, expect } from "vitest";
import {
  FILTER_OPERATORS,
  getOperatorOptions,
  operatorExpectsValue,
  operatorExpectsHighValue,
  operatorExpectsValues,
  isGroupNode,
  isConditionNode,
  createCondition,
  createGroup,
  getNodeAtPath,
  addFilter,
  updateFilter,
  removeFilter,
  duplicateFilter,
  countConditions,
  changeConditionProperty,
  changeConditionOperator,
  validateTree,
  conditionToCrmFilter,
  toCrmSearchFilterGroups,
} from "./filterTree.js";

const PROPERTIES = [
  { name: "dealname", label: "Deal name", type: "string" },
  { name: "amount", label: "Amount", type: "number" },
  { name: "closedate", label: "Close date", type: "date" },
  { name: "hs_lastmodifieddate", label: "Last modified", type: "datetime" },
  {
    name: "dealstage",
    label: "Stage",
    type: "enum",
    options: [
      { label: "Appointment", value: "appointmentscheduled" },
      { label: "Qualified", value: "qualifiedtobuy" },
    ],
  },
  { name: "hs_is_closed", label: "Is closed", type: "bool" },
];

const cond = (property, operator, value, highValue) =>
  createCondition(property, operator, value, highValue);

// ── operator metadata ────────────────────────────────────────────────────────
describe("FILTER_OPERATORS", () => {
  it("mirrors the HubSpot CRM search operator sets per type", () => {
    expect(FILTER_OPERATORS.string).toEqual([
      "EQ", "NEQ", "CONTAINS_TOKEN", "NOT_CONTAINS_TOKEN", "HAS_PROPERTY", "NOT_HAS_PROPERTY",
    ]);
    expect(FILTER_OPERATORS.number).toEqual([
      "EQ", "NEQ", "GT", "GTE", "LT", "LTE", "BETWEEN", "HAS_PROPERTY", "NOT_HAS_PROPERTY",
    ]);
    expect(FILTER_OPERATORS.date).toEqual(FILTER_OPERATORS.number);
    expect(FILTER_OPERATORS.datetime).toEqual(FILTER_OPERATORS.number);
    expect(FILTER_OPERATORS.enum).toEqual(["IN", "NOT_IN", "HAS_PROPERTY", "NOT_HAS_PROPERTY"]);
    expect(FILTER_OPERATORS.bool).toEqual(["EQ"]);
  });
});

describe("getOperatorOptions", () => {
  it("returns { label, value } options for every operator of the type", () => {
    const options = getOperatorOptions("string");
    expect(options.map((o) => o.value)).toEqual(FILTER_OPERATORS.string);
    expect(options.find((o) => o.value === "CONTAINS_TOKEN").label).toBe("contains");
    expect(options.find((o) => o.value === "HAS_PROPERTY").label).toBe("is known");
  });

  it("uses before/after phrasing for date and datetime", () => {
    for (const type of ["date", "datetime"]) {
      const options = getOperatorOptions(type);
      expect(options.find((o) => o.value === "GT").label).toBe("is after");
      expect(options.find((o) => o.value === "LT").label).toBe("is before");
      expect(options.find((o) => o.value === "GTE").label).toBe("is on or after");
      expect(options.find((o) => o.value === "BETWEEN").label).toBe("is between");
    }
    // number keeps comparator phrasing
    expect(getOperatorOptions("number").find((o) => o.value === "GT").label).toBe("is greater than");
  });

  it("applies label overrides", () => {
    const options = getOperatorOptions("bool", { EQ: "is" });
    expect(options).toEqual([{ label: "is", value: "EQ" }]);
  });

  it("returns [] for unknown types", () => {
    expect(getOperatorOptions("geo")).toEqual([]);
    expect(getOperatorOptions(undefined)).toEqual([]);
  });
});

describe("operator arity helpers", () => {
  it("HAS_PROPERTY / NOT_HAS_PROPERTY take no value", () => {
    expect(operatorExpectsValue("HAS_PROPERTY")).toBe(false);
    expect(operatorExpectsValue("NOT_HAS_PROPERTY")).toBe(false);
    for (const op of ["EQ", "NEQ", "GT", "GTE", "LT", "LTE", "BETWEEN", "IN", "NOT_IN", "CONTAINS_TOKEN", "NOT_CONTAINS_TOKEN"]) {
      expect(operatorExpectsValue(op)).toBe(true);
    }
  });

  it("only BETWEEN takes a highValue", () => {
    expect(operatorExpectsHighValue("BETWEEN")).toBe(true);
    expect(operatorExpectsHighValue("EQ")).toBe(false);
    expect(operatorExpectsHighValue("IN")).toBe(false);
  });

  it("only IN / NOT_IN take a values list", () => {
    expect(operatorExpectsValues("IN")).toBe(true);
    expect(operatorExpectsValues("NOT_IN")).toBe(true);
    expect(operatorExpectsValues("EQ")).toBe(false);
    expect(operatorExpectsValues("BETWEEN")).toBe(false);
  });
});

// ── node constructors / guards ──────────────────────────────────────────────
describe("createCondition / createGroup", () => {
  it("builds a condition with value/highValue keys only when provided", () => {
    expect(cond("amount", "EQ", 5)).toEqual({ type: "condition", property: "amount", operator: "EQ", value: 5 });
    expect(cond("amount", "BETWEEN", 1, 10)).toEqual({
      type: "condition", property: "amount", operator: "BETWEEN", value: 1, highValue: 10,
    });
    const empty = createCondition();
    expect(empty).toEqual({ type: "condition", property: "", operator: "" });
    expect("value" in empty).toBe(false);
    expect("highValue" in empty).toBe(false);
  });

  it("builds groups with AND as the default operator", () => {
    expect(createGroup()).toEqual({ type: "group", operator: "AND", filters: [] });
    const child = cond("dealname", "EQ", "Acme");
    expect(createGroup("OR", [child])).toEqual({ type: "group", operator: "OR", filters: [child] });
  });

  it("type guards distinguish nodes", () => {
    expect(isGroupNode(createGroup())).toBe(true);
    expect(isGroupNode(createCondition())).toBe(false);
    expect(isGroupNode(null)).toBe(false);
    expect(isConditionNode(createCondition())).toBe(true);
    expect(isConditionNode(createGroup())).toBe(false);
    expect(isConditionNode(undefined)).toBe(false);
  });
});

// ── path reads ───────────────────────────────────────────────────────────────
describe("getNodeAtPath", () => {
  const a = cond("dealname", "EQ", "Acme");
  const b = cond("amount", "GT", 100);
  const inner = createGroup("OR", [b]);
  const tree = createGroup("AND", [a, inner]);

  it("returns the root for []", () => {
    expect(getNodeAtPath(tree, [])).toBe(tree);
  });

  it("resolves nested paths", () => {
    expect(getNodeAtPath(tree, [0])).toBe(a);
    expect(getNodeAtPath(tree, [1])).toBe(inner);
    expect(getNodeAtPath(tree, [1, 0])).toBe(b);
  });

  it("returns undefined for out-of-bounds or condition-descending paths", () => {
    expect(getNodeAtPath(tree, [9])).toBeUndefined();
    expect(getNodeAtPath(tree, [0, 0])).toBeUndefined();
    expect(getNodeAtPath(tree, [1, 0, 2])).toBeUndefined();
  });
});

// ── addFilter ────────────────────────────────────────────────────────────────
describe("addFilter", () => {
  it("appends to the root group", () => {
    const tree = createGroup("AND", [cond("dealname", "EQ", "Acme")]);
    const added = cond("amount", "GT", 50);
    const next = addFilter(tree, [], added);
    expect(next.filters).toHaveLength(2);
    expect(next.filters[1]).toBe(added);
  });

  it("appends to a nested group by path", () => {
    const inner = createGroup("OR", [cond("amount", "GT", 50)]);
    const tree = createGroup("AND", [cond("dealname", "EQ", "Acme"), inner]);
    const added = cond("amount", "LT", 10);
    const next = addFilter(tree, [1], added);
    expect(next.filters[1].filters).toHaveLength(2);
    expect(next.filters[1].filters[1]).toBe(added);
  });

  it("does not mutate the input and shares untouched branches", () => {
    const a = cond("dealname", "EQ", "Acme");
    const inner = createGroup("OR", [cond("amount", "GT", 50)]);
    const tree = createGroup("AND", [a, inner]);
    const next = addFilter(tree, [1], cond("amount", "LT", 10));
    expect(tree.filters[1].filters).toHaveLength(1); // original untouched
    expect(next).not.toBe(tree);
    expect(next.filters[0]).toBe(a); // untouched sibling keeps identity
  });

  it("throws when the path points at a condition", () => {
    const tree = createGroup("AND", [cond("dealname", "EQ", "Acme")]);
    expect(() => addFilter(tree, [0], cond("amount", "GT", 1))).toThrow(/group/);
  });

  it("throws when the path is out of bounds", () => {
    const tree = createGroup("AND", [cond("dealname", "EQ", "Acme")]);
    expect(() => addFilter(tree, [4], cond("amount", "GT", 1))).toThrow(/no filter at index 4/);
  });
});

// ── updateFilter ─────────────────────────────────────────────────────────────
describe("updateFilter", () => {
  it("shallow-merges an object patch", () => {
    const tree = createGroup("AND", [cond("amount", "GT", 50)]);
    const next = updateFilter(tree, [0], { value: 75 });
    expect(next.filters[0]).toEqual({ type: "condition", property: "amount", operator: "GT", value: 75 });
  });

  it("replaces the node when given a function patch", () => {
    const tree = createGroup("AND", [cond("amount", "BETWEEN", 1, 10)]);
    const next = updateFilter(tree, [0], () => cond("amount", "HAS_PROPERTY"));
    expect(next.filters[0]).toEqual({ type: "condition", property: "amount", operator: "HAS_PROPERTY" });
    expect("value" in next.filters[0]).toBe(false); // stale keys dropped
  });

  it("updates a group's operator via path", () => {
    const inner = createGroup("AND", [cond("amount", "GT", 1), cond("amount", "LT", 9)]);
    const tree = createGroup("AND", [cond("dealname", "EQ", "x"), inner]);
    const next = updateFilter(tree, [1], { operator: "OR" });
    expect(next.filters[1].operator).toBe("OR");
    expect(next.filters[1].filters).toBe(inner.filters); // children shared
  });

  it("does not mutate the input and shares untouched siblings", () => {
    const a = cond("dealname", "EQ", "x");
    const tree = createGroup("AND", [a, cond("amount", "GT", 1)]);
    const next = updateFilter(tree, [1], { value: 2 });
    expect(tree.filters[1].value).toBe(1);
    expect(next.filters[0]).toBe(a);
  });

  it("throws for paths that do not resolve", () => {
    const tree = createGroup("AND", [cond("amount", "GT", 1)]);
    expect(() => updateFilter(tree, [0, 0], { value: 2 })).toThrow(/non-group/);
    expect(() => updateFilter(tree, [3], { value: 2 })).toThrow(/no filter at index/);
  });
});

// ── removeFilter ─────────────────────────────────────────────────────────────
describe("removeFilter", () => {
  it("removes a root-level condition", () => {
    const a = cond("dealname", "EQ", "x");
    const b = cond("amount", "GT", 1);
    const tree = createGroup("AND", [a, b]);
    const next = removeFilter(tree, [0]);
    expect(next.filters).toEqual([b]);
    expect(tree.filters).toHaveLength(2); // input untouched
  });

  it("removes a nested condition", () => {
    const inner = createGroup("OR", [cond("amount", "GT", 1), cond("amount", "LT", 9)]);
    const tree = createGroup("AND", [inner]);
    const next = removeFilter(tree, [0, 1]);
    expect(next.filters[0].filters).toHaveLength(1);
    expect(next.filters[0].filters[0].operator).toBe("GT");
  });

  it("throws on the root path", () => {
    expect(() => removeFilter(createGroup(), [])).toThrow(/root/);
  });

  it("keeps a now-empty nested group by default", () => {
    const tree = createGroup("AND", [createGroup("OR", [cond("amount", "GT", 1)])]);
    const next = removeFilter(tree, [0, 0]);
    expect(next.filters).toHaveLength(1);
    expect(next.filters[0]).toEqual({ type: "group", operator: "OR", filters: [] });
  });

  it("prunes empty ancestor groups when pruneEmptyGroups is set", () => {
    const tree = createGroup("AND", [
      cond("dealname", "EQ", "x"),
      createGroup("OR", [cond("amount", "GT", 1)]),
    ]);
    const next = removeFilter(tree, [1, 0], { pruneEmptyGroups: true });
    expect(next.filters).toHaveLength(1);
    expect(next.filters[0].type).toBe("condition");
  });

  it("prune cascades up multiple levels but never removes the root", () => {
    const tree = createGroup("AND", [
      createGroup("OR", [createGroup("AND", [cond("amount", "GT", 1)])]),
    ]);
    const next = removeFilter(tree, [0, 0, 0], { pruneEmptyGroups: true });
    expect(next).toEqual({ type: "group", operator: "AND", filters: [] });
  });

  it("does not prune ancestors that still have other children", () => {
    const tree = createGroup("AND", [
      createGroup("OR", [cond("amount", "GT", 1), cond("amount", "LT", 9)]),
    ]);
    const next = removeFilter(tree, [0, 0], { pruneEmptyGroups: true });
    expect(next.filters[0].filters).toHaveLength(1);
  });
});

// ── duplicateFilter ──────────────────────────────────────────────────────────
describe("duplicateFilter", () => {
  it("inserts a copy of a condition immediately after the original", () => {
    const a = cond("dealname", "EQ", "x");
    const b = cond("amount", "GT", 1);
    const tree = createGroup("AND", [a, b]);
    const next = duplicateFilter(tree, [0]);
    expect(next.filters).toHaveLength(3);
    expect(next.filters[0]).toEqual(a);
    expect(next.filters[1]).toEqual(a);
    expect(next.filters[2]).toEqual(b);
    expect(tree.filters).toHaveLength(2); // input untouched
  });

  it("deep-clones a group so the copy shares no references", () => {
    const inner = createGroup("OR", [cond("dealstage", "IN", ["qualifiedtobuy"])]);
    const tree = createGroup("AND", [inner]);
    const next = duplicateFilter(tree, [0]);
    expect(next.filters).toHaveLength(2);
    expect(next.filters[1]).toEqual(inner);
    expect(next.filters[1]).not.toBe(inner);
    expect(next.filters[1].filters[0]).not.toBe(inner.filters[0]);
    expect(next.filters[1].filters[0].value).not.toBe(inner.filters[0].value);
  });

  it("duplicates a nested node in place", () => {
    const inner = createGroup("OR", [cond("amount", "GT", 1), cond("amount", "LT", 9)]);
    const tree = createGroup("AND", [inner]);
    const next = duplicateFilter(tree, [0, 0]);
    expect(next.filters[0].filters.map((f) => f.operator)).toEqual(["GT", "GT", "LT"]);
  });

  it("throws on the root path and bad indices", () => {
    expect(() => duplicateFilter(createGroup(), [])).toThrow(/root/);
    expect(() => duplicateFilter(createGroup("AND", [cond("dealname", "EQ", "x")]), [4]))
      .toThrow(/no filter at index/);
  });
});

// ── countConditions ──────────────────────────────────────────────────────────
describe("countConditions", () => {
  it("counts conditions across nesting (groups themselves don't count)", () => {
    expect(countConditions(createGroup())).toBe(0);
    expect(countConditions(cond("a", "EQ", 1))).toBe(1);
    const tree = createGroup("AND", [
      cond("a", "EQ", 1),
      createGroup("OR", [cond("b", "EQ", 2), createGroup("AND", [cond("c", "EQ", 3)])]),
    ]);
    expect(countConditions(tree)).toBe(3);
  });
});

// ── changeConditionProperty ──────────────────────────────────────────────────
describe("changeConditionProperty", () => {
  it("resets the operator to the new type's first operator and clears values", () => {
    const before = cond("dealname", "CONTAINS_TOKEN", "acme");
    const next = changeConditionProperty(before, PROPERTIES[1]); // amount: number
    expect(next).toEqual({ type: "condition", property: "amount", operator: "EQ" });
    expect("value" in next).toBe(false);
  });

  it("keeps the operator when still valid for the new type, but clears the value", () => {
    const before = cond("amount", "GT", 100);
    const next = changeConditionProperty(before, PROPERTIES[2]); // closedate: date
    expect(next.property).toBe("closedate");
    expect(next.operator).toBe("GT");
    expect("value" in next).toBe(false);
  });

  it("seeds [] for multi-value operators (enum)", () => {
    const before = cond("dealname", "EQ", "acme");
    const next = changeConditionProperty(before, PROPERTIES[4]); // dealstage: enum
    expect(next).toEqual({ type: "condition", property: "dealstage", operator: "IN", value: [] });
  });

  it("resets the operator to '' when given a bare name with no type info", () => {
    const next = changeConditionProperty(cond("amount", "GT", 1), "mystery");
    expect(next).toEqual({ type: "condition", property: "mystery", operator: "" });
  });
});

// ── changeConditionOperator ──────────────────────────────────────────────────
describe("changeConditionOperator", () => {
  it("keeps a scalar value across scalar→scalar switches", () => {
    const next = changeConditionOperator(cond("amount", "EQ", 5), "NEQ");
    expect(next).toEqual({ type: "condition", property: "amount", operator: "NEQ", value: 5 });
  });

  it("drops all values when switching to HAS_PROPERTY / NOT_HAS_PROPERTY", () => {
    const next = changeConditionOperator(cond("amount", "BETWEEN", 1, 10), "HAS_PROPERTY");
    expect(next).toEqual({ type: "condition", property: "amount", operator: "HAS_PROPERTY" });
  });

  it("keeps the low value when switching to BETWEEN (no highValue yet)", () => {
    const next = changeConditionOperator(cond("amount", "GT", 5), "BETWEEN");
    expect(next).toEqual({ type: "condition", property: "amount", operator: "BETWEEN", value: 5 });
  });

  it("keeps value + highValue across BETWEEN→BETWEEN-compatible edits, drops highValue otherwise", () => {
    const between = cond("amount", "BETWEEN", 1, 10);
    const next = changeConditionOperator(between, "GT");
    expect(next).toEqual({ type: "condition", property: "amount", operator: "GT", value: 1 });
    expect("highValue" in next).toBe(false);
  });

  it("keeps arrays across IN↔NOT_IN and seeds [] from scalars", () => {
    const inCond = cond("dealstage", "IN", ["a", "b"]);
    expect(changeConditionOperator(inCond, "NOT_IN").value).toEqual(["a", "b"]);
    expect(changeConditionOperator(cond("dealstage", "HAS_PROPERTY"), "IN").value).toEqual([]);
    expect(changeConditionOperator(cond("dealname", "EQ", "x"), "IN").value).toEqual([]);
  });

  it("drops array values when switching to a scalar operator", () => {
    const next = changeConditionOperator(cond("dealstage", "IN", ["a"]), "HAS_PROPERTY");
    expect("value" in next).toBe(false);
    const scalar = changeConditionOperator(cond("dealstage", "IN", ["a"]), "EQ");
    expect("value" in scalar).toBe(false);
  });
});

// ── validateTree ─────────────────────────────────────────────────────────────
describe("validateTree", () => {
  it("accepts a complete tree", () => {
    const tree = createGroup("AND", [
      cond("dealname", "CONTAINS_TOKEN", "acme"),
      createGroup("OR", [
        cond("amount", "BETWEEN", 1, 10),
        cond("dealstage", "IN", ["qualifiedtobuy"]),
        cond("hs_is_closed", "EQ", "false"),
        cond("closedate", "HAS_PROPERTY"),
      ]),
    ]);
    expect(validateTree(tree, PROPERTIES)).toEqual({ valid: true, errors: [] });
  });

  it("treats an empty ROOT group as valid (means: no filters)", () => {
    expect(validateTree(createGroup(), PROPERTIES).valid).toBe(true);
  });

  it("rejects a non-group root", () => {
    const result = validateTree(cond("amount", "EQ", 1), PROPERTIES);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: [], message: "Root must be a group node." }]);
  });

  it("rejects empty NESTED groups with the right path", () => {
    const tree = createGroup("AND", [cond("dealname", "EQ", "x"), createGroup("OR", [])]);
    const result = validateTree(tree, PROPERTIES);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({ path: [1], message: "Group has no filters." });
  });

  it("rejects bad group operators", () => {
    const tree = { type: "group", operator: "XOR", filters: [cond("dealname", "EQ", "x")] };
    const result = validateTree(tree, PROPERTIES);
    expect(result.errors[0].message).toMatch(/"AND" or "OR"/);
  });

  it("rejects missing property / operator", () => {
    const tree = createGroup("AND", [createCondition(), cond("dealname", "")]);
    const result = validateTree(tree, PROPERTIES);
    expect(result.errors).toContainEqual({ path: [0], message: "Condition is missing a property." });
    expect(result.errors).toContainEqual({ path: [1], message: "Condition is missing an operator." });
  });

  it("rejects unknown properties when a property list is given", () => {
    const result = validateTree(createGroup("AND", [cond("nope", "EQ", 1)]), PROPERTIES);
    expect(result.errors[0].message).toMatch(/Unknown property "nope"/);
  });

  it("rejects operators that are invalid for the property's type", () => {
    const result = validateTree(createGroup("AND", [cond("amount", "CONTAINS_TOKEN", "x")]), PROPERTIES);
    expect(result.errors[0].message).toMatch(/not valid for type "number"/);
  });

  it("without a property list, any known operator passes and unknown ones fail", () => {
    expect(validateTree(createGroup("AND", [cond("anything", "CONTAINS_TOKEN", "x")])).valid).toBe(true);
    const bad = validateTree(createGroup("AND", [cond("anything", "LIKE", "x")]));
    expect(bad.errors[0].message).toMatch(/Unknown operator "LIKE"/);
  });

  it("HAS_PROPERTY / NOT_HAS_PROPERTY require no value", () => {
    const tree = createGroup("AND", [cond("dealname", "NOT_HAS_PROPERTY")]);
    expect(validateTree(tree, PROPERTIES).valid).toBe(true);
  });

  it("requires a value for single-value operators", () => {
    const result = validateTree(createGroup("AND", [cond("dealname", "EQ")]), PROPERTIES);
    expect(result.errors[0].message).toMatch(/requires a value/);
    // empty string is missing too
    expect(validateTree(createGroup("AND", [cond("dealname", "EQ", "")]), PROPERTIES).valid).toBe(false);
    // zero and false are real values
    expect(validateTree(createGroup("AND", [cond("amount", "EQ", 0)]), PROPERTIES).valid).toBe(true);
  });

  it("requires a non-empty array for IN / NOT_IN", () => {
    expect(validateTree(createGroup("AND", [cond("dealstage", "IN", [])]), PROPERTIES).valid).toBe(false);
    expect(validateTree(createGroup("AND", [cond("dealstage", "IN", "x")]), PROPERTIES).valid).toBe(false);
    expect(validateTree(createGroup("AND", [cond("dealstage", "IN", ["x"])]), PROPERTIES).valid).toBe(true);
  });

  it("requires both bounds for BETWEEN, with a path into nesting", () => {
    const tree = createGroup("AND", [createGroup("OR", [cond("amount", "BETWEEN", 5)])]);
    const result = validateTree(tree, PROPERTIES);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      { path: [0, 0], message: 'Operator "BETWEEN" requires an upper bound (highValue).' },
    ]);
  });

  it("rejects unknown node types", () => {
    const tree = createGroup("AND", [{ type: "mystery" }]);
    expect(validateTree(tree).errors[0].message).toMatch(/Unknown node type "mystery"/);
  });
});

// ── conditionToCrmFilter ─────────────────────────────────────────────────────
describe("conditionToCrmFilter", () => {
  it("maps a scalar condition to { propertyName, operator, value }", () => {
    expect(conditionToCrmFilter(cond("dealname", "EQ", "Acme"))).toEqual({
      propertyName: "dealname", operator: "EQ", value: "Acme",
    });
  });

  it("omits value entirely for HAS_PROPERTY / NOT_HAS_PROPERTY", () => {
    const filter = conditionToCrmFilter(cond("dealname", "HAS_PROPERTY", "stale"));
    expect(filter).toEqual({ propertyName: "dealname", operator: "HAS_PROPERTY" });
    expect("value" in filter).toBe(false);
  });

  it("uses `values` for IN / NOT_IN, wrapping stray scalars", () => {
    expect(conditionToCrmFilter(cond("dealstage", "IN", ["a", "b"]))).toEqual({
      propertyName: "dealstage", operator: "IN", values: ["a", "b"],
    });
    expect(conditionToCrmFilter(cond("dealstage", "NOT_IN", "a")).values).toEqual(["a"]);
    expect(conditionToCrmFilter(cond("dealstage", "IN")).values).toEqual([]);
  });

  it("maps BETWEEN to value + highValue", () => {
    expect(conditionToCrmFilter(cond("amount", "BETWEEN", 10, 100))).toEqual({
      propertyName: "amount", operator: "BETWEEN", value: 10, highValue: 100,
    });
  });

  it("coerces DateInput value objects to epoch ms (local midnight)", () => {
    const may1 = { year: 2026, month: 4, date: 1 }; // month is 0-indexed
    const expected = new Date(2026, 4, 1).getTime();
    expect(conditionToCrmFilter(cond("closedate", "GTE", may1)).value).toBe(expected);
    const between = conditionToCrmFilter(
      cond("closedate", "BETWEEN", may1, { year: 2026, month: 4, date: 31 })
    );
    expect(between.value).toBe(expected);
    expect(between.highValue).toBe(new Date(2026, 4, 31).getTime());
  });

  it("coerces booleans to 'true'/'false' strings", () => {
    expect(conditionToCrmFilter(cond("hs_is_closed", "EQ", true)).value).toBe("true");
    expect(conditionToCrmFilter(cond("hs_is_closed", "EQ", false)).value).toBe("false");
  });

  it("passes values through untouched with coerceValues: false", () => {
    const may1 = { year: 2026, month: 4, date: 1 };
    expect(conditionToCrmFilter(cond("closedate", "EQ", may1), { coerceValues: false }).value).toBe(may1);
    expect(conditionToCrmFilter(cond("hs_is_closed", "EQ", true), { coerceValues: false }).value).toBe(true);
  });

  it("throws on incomplete conditions", () => {
    expect(() => conditionToCrmFilter(cond("", "EQ", 1))).toThrow(/missing a property/);
    expect(() => conditionToCrmFilter(cond("amount", "", 1))).toThrow(/missing an operator/);
    expect(() => conditionToCrmFilter(createGroup())).toThrow(/condition node/);
  });
});

// ── toCrmSearchFilterGroups ──────────────────────────────────────────────────
describe("toCrmSearchFilterGroups", () => {
  const A = cond("dealname", "EQ", "a");
  const B = cond("amount", "GT", 1);
  const C = cond("dealstage", "IN", ["x"]);
  const D = cond("closedate", "HAS_PROPERTY");

  const names = (result) =>
    result.filterGroups.map((group) => group.filters.map((f) => f.propertyName));

  it("returns { filterGroups: [] } for an empty root", () => {
    expect(toCrmSearchFilterGroups(createGroup())).toEqual({ filterGroups: [] });
  });

  it("throws when the root is not a group", () => {
    expect(() => toCrmSearchFilterGroups(A)).toThrow(/group node at the root/);
  });

  it("maps a flat AND group to ONE filterGroup with all filters", () => {
    const result = toCrmSearchFilterGroups(createGroup("AND", [A, B]));
    expect(result).toEqual({
      filterGroups: [{
        filters: [
          { propertyName: "dealname", operator: "EQ", value: "a" },
          { propertyName: "amount", operator: "GT", value: 1 },
        ],
      }],
    });
  });

  it("maps a flat OR group to one filterGroup PER condition", () => {
    const result = toCrmSearchFilterGroups(createGroup("OR", [A, B, C]));
    expect(names(result)).toEqual([["dealname"], ["amount"], ["dealstage"]]);
  });

  it("maps the canonical OR-of-ANDs tree directly", () => {
    const tree = createGroup("OR", [createGroup("AND", [A, B]), createGroup("AND", [C, D])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([
      ["dealname", "amount"],
      ["dealstage", "closedate"],
    ]);
  });

  it("distributes an OR nested under an AND: A AND (B OR C) → [A,B] | [A,C]", () => {
    const tree = createGroup("AND", [A, createGroup("OR", [B, C])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([
      ["dealname", "amount"],
      ["dealname", "dealstage"],
    ]);
  });

  it("flattens ORs nested under ORs: A OR (B OR C) → 3 groups", () => {
    const tree = createGroup("OR", [A, createGroup("OR", [B, C])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([["dealname"], ["amount"], ["dealstage"]]);
  });

  it("takes the cartesian product of sibling ORs: (A OR B) AND (C OR D) → 4 groups", () => {
    const tree = createGroup("AND", [createGroup("OR", [A, B]), createGroup("OR", [C, D])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([
      ["dealname", "dealstage"],
      ["dealname", "closedate"],
      ["amount", "dealstage"],
      ["amount", "closedate"],
    ]);
  });

  it("handles depth-3 nesting: A AND (B OR (C AND D))", () => {
    const tree = createGroup("AND", [A, createGroup("OR", [B, createGroup("AND", [C, D])])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([
      ["dealname", "amount"],
      ["dealname", "dealstage", "closedate"],
    ]);
  });

  it("flattens collapsed AND-of-AND nesting into one group", () => {
    const tree = createGroup("AND", [A, createGroup("AND", [B, C])]);
    expect(names(toCrmSearchFilterGroups(tree))).toEqual([["dealname", "amount", "dealstage"]]);
  });

  it("throws on empty nested groups with the offending path", () => {
    const tree = createGroup("AND", [A, createGroup("OR", [])]);
    expect(() => toCrmSearchFilterGroups(tree)).toThrow(/empty group at \[1\]/);
  });

  it("enforces the max filterGroups limit (default 5)", () => {
    const six = createGroup("OR", Array.from({ length: 6 }, (_, i) => cond(`p${i}`, "EQ", i)));
    expect(() => toCrmSearchFilterGroups(six)).toThrow(/6 filterGroups; HubSpot CRM search allows at most 5/);
    const five = createGroup("OR", Array.from({ length: 5 }, (_, i) => cond(`p${i}`, "EQ", i)));
    expect(toCrmSearchFilterGroups(five).filterGroups).toHaveLength(5);
  });

  it("enforces the max filters-per-group limit (default 6)", () => {
    const seven = createGroup("AND", Array.from({ length: 7 }, (_, i) => cond(`p${i}`, "EQ", i)));
    expect(() => toCrmSearchFilterGroups(seven)).toThrow(/7 filters.*at most 6 per group/);
  });

  it("enforces the max total filters limit (default 18)", () => {
    // (A OR B OR C OR D) AND (5 conditions) → 4 groups × 5 filters = 20 > 18
    const or4 = createGroup("OR", Array.from({ length: 4 }, (_, i) => cond(`o${i}`, "EQ", i)));
    const tree = createGroup("AND", [or4, ...Array.from({ length: 4 }, (_, i) => cond(`a${i}`, "EQ", i))]);
    expect(() => toCrmSearchFilterGroups(tree)).toThrow(/20 total filters.*at most 18/);
  });

  it("respects custom limits and enforceLimits: false", () => {
    const six = createGroup("OR", Array.from({ length: 6 }, (_, i) => cond(`p${i}`, "EQ", i)));
    expect(toCrmSearchFilterGroups(six, { enforceLimits: false }).filterGroups).toHaveLength(6);
    expect(toCrmSearchFilterGroups(six, { maxGroups: 6 }).filterGroups).toHaveLength(6);
    const three = createGroup("OR", [A, B, C]);
    expect(() => toCrmSearchFilterGroups(three, { maxGroups: 2 })).toThrow(/at most 2/);
  });

  it("threads value coercion through nested conditions", () => {
    const may1 = { year: 2026, month: 4, date: 1 };
    const tree = createGroup("AND", [cond("closedate", "GTE", may1), cond("hs_is_closed", "EQ", true)]);
    const [group] = toCrmSearchFilterGroups(tree).filterGroups;
    expect(group.filters[0].value).toBe(new Date(2026, 4, 1).getTime());
    expect(group.filters[1].value).toBe("true");
  });
});
