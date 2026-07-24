# FilterBuilder (hs-uix/filter)

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](https://github.com/05bmckay/hs-uix/blob/main/LICENSE)

[← All hs-uix components](../../README.md)

The HubSpot list/workflow segment-builder pattern as one component: nested AND/OR groups of property → operator → value rows. If your extension needs "show me deals where amount > 10k AND (stage is X OR stage is Y)", this is the component — stop hand-rolling three Selects in a Flex row with an ad-hoc state shape. The tree it emits converts directly to HubSpot CRM search `filterGroups` via `toCrmSearchFilterGroups`.

Renders entirely with native components: `Select` / `MultiSelect` / `Input` / `NumberInput` / `DateInput` rows inside `Flex`, nested groups in `Tile`. Every action is a `Button` carrying HubSpot's segment-builder iconography — add (`+`) for "Add filter" / "Add filter group", a remove (`x`) icon button on each condition row, and copy / trash icon buttons on each group header for clone / delete.

![A FilterBuilder with a lifecycle condition and nested amount or renewal-date group](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/filter/assets/showcase-filter-builder.jpg)

## Quick Start

```jsx
import { useState } from "react";
import { FilterBuilder, toCrmSearchFilterGroups, validateTree } from "hs-uix/filter";

const PROPERTIES = [
  { name: "dealname", label: "Deal name", type: "string" },
  { name: "amount", label: "Amount", type: "number" },
  { name: "closedate", label: "Close date", type: "date" },
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

const SegmentEditor = () => {
  const [tree, setTree] = useState();

  const runSearch = () => {
    if (!tree || !validateTree(tree, PROPERTIES).valid) return;
    const { filterGroups } = toCrmSearchFilterGroups(tree);
    // → hubspot.fetch CRM search body: { filterGroups, properties: [...], ... }
  };

  return <FilterBuilder properties={PROPERTIES} defaultValue={tree} onChange={setTree} />;
};
```

## The filter tree (public contract)

```js
{
  type: "group",
  operator: "AND" | "OR",
  filters: [
    { type: "condition", property: "amount", operator: "BETWEEN", value: 1000, highValue: 5000 },
    { type: "group", operator: "OR", filters: [ /* nested */ ] },
  ],
}
```

- The root is always a group. An empty root means "no filters".
- Conditions carry `value` (scalar, or array for `IN` / `NOT_IN`) and `highValue` (only `BETWEEN`). `HAS_PROPERTY` / `NOT_HAS_PROPERTY` carry no value.
- Paths into the tree are index arrays: `[]` is the root, `[1, 0]` is the root's second child's first child.

## Operators per property type (CRM search names)

| Type | Operators | Value editor |
|---|---|---|
| `string` | `EQ`, `NEQ`, `CONTAINS_TOKEN`, `NOT_CONTAINS_TOKEN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY` | `Input` |
| `number` | `EQ`, `NEQ`, `GT`, `GTE`, `LT`, `LTE`, `BETWEEN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY` | `NumberInput` (× 2 for `BETWEEN`) |
| `date` / `datetime` | same as `number`, labeled "is after" / "is before" | `DateInput` (× 2 for `BETWEEN`) |
| `enum` | `IN`, `NOT_IN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY` | `MultiSelect` over the property's `options` |
| `bool` | `EQ` | `Select` (True / False → `"true"` / `"false"`) |

`HAS_PROPERTY` / `NOT_HAS_PROPERTY` render no value editor. The native `DateInput` is date-only, so `datetime` properties get day precision in the UI.

## Features

- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`) tree state
- Nested groups to `maxDepth` (default 2 — root plus one level, matching HubSpot's builder)
- Per-group AND/OR toggle rendered between rows; changing any separator updates the whole group
- Nested groups get a numbered heading ("Group 1", "Group 2", …) with clone (copy icon) and delete (trash icon) buttons, matching HubSpot's builder
- Property changes keep the operator when still valid for the new type, otherwise reset it; values are always cleared
- Operator changes keep values whose shape still fits (scalar→scalar, `IN`↔`NOT_IN`)
- Removing a group's last row prunes the now-empty group (root always survives)
- `readOnly` mode renders the tree without add/remove/edit affordances
- Every behavioral rule lives in pure, exported, unit-tested helpers (`filterTree.js`)

## `toCrmSearchFilterGroups(tree, options?)`

Converts the tree to the HubSpot CRM search shape — `{ filterGroups: [{ filters: [...] }] }`, where filters in a group are ANDed and the groups are ORed.

```js
toCrmSearchFilterGroups({
  type: "group", operator: "AND", filters: [
    { type: "condition", property: "amount", operator: "GT", value: 1000 },
    { type: "group", operator: "OR", filters: [
      { type: "condition", property: "dealstage", operator: "IN", value: ["a"] },
      { type: "condition", property: "hs_is_closed", operator: "EQ", value: "false" },
    ] },
  ],
});
// → { filterGroups: [
//      { filters: [{ propertyName: "amount", operator: "GT", value: 1000 }, { propertyName: "dealstage", operator: "IN", values: ["a"] }] },
//      { filters: [{ propertyName: "amount", operator: "GT", value: 1000 }, { propertyName: "hs_is_closed", operator: "EQ", value: "false" }] },
//    ] }
```

**Flattening rules.** The tree is expanded to disjunctive normal form, so nesting at ANY depth converts — `A AND (B OR C)` distributes to `[A,B] | [A,C]`, ORs nested under ORs flatten, and `(A OR B) AND (C OR D)` becomes the 4-group cartesian product. The cost is combinatorial: every OR nested under an AND **multiplies** filterGroups and duplicates the sibling conditions into each one.

**Limits.** CRM search rejects more than 5 filterGroups, 6 filters per group, or 18 filters total. When the expansion exceeds a limit, this **throws** with a descriptive message instead of sending a request that will 400. Tune via `maxGroups` / `maxFiltersPerGroup` / `maxTotalFilters`, or pass `enforceLimits: false`.

**Value coercion** (default on, disable with `coerceValues: false`): `DateInput` value objects (`{ year, month, date }`) become epoch-ms numbers (local midnight, matching the `hs-uix/utils` dateRange helpers); booleans become `"true"` / `"false"` strings. Pre-convert and pass numbers/strings yourself if you need different semantics (e.g. UTC midnight).

Empty nested groups throw — run `validateTree` first and gate your search button on `valid`.

## Props

### `<FilterBuilder />`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `properties` | `FilterProperty[]` | — | Required. `{ name, label?, type?, options? }`; `type` defaults to `"string"`; `enum` needs `options`. |
| `value` | `FilterGroupNode` | — | Controlled tree. |
| `defaultValue` | `FilterGroupNode` | empty AND group | Initial tree for uncontrolled mode. |
| `onChange` | `(tree) => void` | — | Fired with the full new tree after every edit. |
| `maxDepth` | `number` | `2` | Max group nesting; root counts as 1. `1` disables "Add filter group". |
| `labels` | `FilterBuilderLabels` | built-in copy | Overrides for `addFilter`, `addGroup`, `remove`, `removeGroup`, `cloneGroup`, `group`, `and`, `or`, `property`, `operator`, `value`, `values`, `between`, `empty`, `true`, `false`. `remove` / `removeGroup` / `cloneGroup` are screen-reader text on the icon buttons; `group` prefixes group headings. |
| `operatorLabels` | `Record<operator, string>` | — | Per-operator label overrides for the operator dropdowns. |
| `readOnly` | `boolean` | `false` | Render without edit affordances. |
| `namePrefix` | `string` | `"filter-builder"` | Prefix for native input `name`s; set when rendering two builders on one surface. |
| `...rest` | — | — | Spread onto the root `Flex`. |

### Pure helpers (all exported from `hs-uix/filter`)

| Export | Signature | Notes |
|---|---|---|
| `FILTER_OPERATORS` | `Record<type, operator[]>` | The operator sets per property type. |
| `getOperatorOptions` | `(type, labelOverrides?) => { label, value }[]` | Select-ready operator options; date types get before/after phrasing. |
| `operatorExpectsValue` / `operatorExpectsHighValue` / `operatorExpectsValues` | `(operator) => boolean` | Value-arity rules. |
| `createCondition` | `(property?, operator?, value?, highValue?) => node` | `value`/`highValue` keys only present when provided. |
| `createGroup` | `(operator?, filters?) => node` | Defaults to an empty AND group. |
| `isGroupNode` / `isConditionNode` | `(node) => boolean` | Type guards. |
| `getNodeAtPath` | `(tree, path) => node \| undefined` | Lenient read. |
| `addFilter` | `(tree, groupPath, node) => tree` | Immutable append; throws if the path isn't a group. |
| `updateFilter` | `(tree, path, patch \| fn) => tree` | Object patch merges; function patch replaces the node. |
| `removeFilter` | `(tree, path, { pruneEmptyGroups? }) => tree` | Throws on the root path; prune cascades upward but never removes the root. |
| `duplicateFilter` | `(tree, path) => tree` | Deep-clones the node at `path` (condition or group) and inserts the copy right after it. Throws on the root path. |
| `countConditions` | `(node) => number` | Conditions only; groups don't count. |
| `changeConditionProperty` | `(condition, propertyDef) => condition` | Keeps a still-valid operator, clears values. |
| `changeConditionOperator` | `(condition, operator) => condition` | Keeps shape-compatible values. |
| `validateTree` | `(tree, properties?) => { valid, errors: [{ path, message }] }` | Empty root is valid; empty nested groups are not. |
| `conditionToCrmFilter` | `(condition, { coerceValues? }) => crmFilter` | One condition → `{ propertyName, operator, value/values/highValue }`. |
| `toCrmSearchFilterGroups` | `(tree, options?) => { filterGroups }` | DNF expansion + limit enforcement (see above). |
