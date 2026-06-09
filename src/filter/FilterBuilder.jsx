// ═══════════════════════════════════════════════════════════════════════════
// FilterBuilder — the HubSpot list/workflow segment-builder pattern as one
// component: nested AND/OR groups of property → operator → value rows.
//
// Every UI Extension that filters CRM-ish data eventually hand-rolls this
// exact surface (three Selects in a Flex row, an "Add filter" button, ad-hoc
// state shape). FilterBuilder standardizes the tree contract
// ({ type: "group", operator, filters }) and renders it with ONLY native
// components — Select / MultiSelect / Input / NumberInput / DateInput rows
// inside Flex, nested groups in Tiles. Every action is a Button carrying
// HubSpot's segment-builder iconography: add (+) to add filters/groups,
// remove (x) on condition rows, copy/delete on group headers.
//
// All tree manipulation and interpretation (operators per type, value arity,
// immutable updates, validation, CRM-search conversion) lives in the pure
// sibling module filterTree.js; this file is the rendering layer only.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  DateInput,
  Flex,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Text,
  Tile,
} from "@hubspot/ui-extensions";
import {
  addFilter,
  changeConditionOperator,
  changeConditionProperty,
  createCondition,
  createGroup,
  duplicateFilter,
  getOperatorOptions,
  isGroupNode,
  operatorExpectsHighValue,
  operatorExpectsValue,
  operatorExpectsValues,
  removeFilter,
  updateFilter,
} from "./filterTree.js";
import { Icon } from "../common-components/Icon.js";

const DEFAULT_LABELS = {
  addFilter: "Add filter",
  addGroup: "Add filter group",
  remove: "Remove filter",
  removeGroup: "Delete group",
  cloneGroup: "Clone group",
  group: "Group",
  and: "AND",
  or: "OR",
  property: "Select a property",
  operator: "Select an operator",
  value: "Enter a value",
  values: "Select values",
  between: "and",
  empty: "No filters yet.",
  true: "True",
  false: "False",
};

const GROUP_OPERATOR_OPTIONS = (labels) => [
  { label: labels.and, value: "AND" },
  { label: labels.or, value: "OR" },
];

const normalizeTree = (tree) => (isGroupNode(tree) ? tree : createGroup("AND", []));

const pathName = (prefix, path, suffix) =>
  `${prefix}-${path.length ? path.join("-") : "root"}-${suffix}`;

// One value editor (or pair, for BETWEEN) keyed off the property type. The
// editor renders nothing for HAS_PROPERTY / NOT_HAS_PROPERTY.
const ValueEditor = ({ condition, propertyDef, path, namePrefix, labels, readOnly, onPatch }) => {
  const { operator } = condition;
  if (!operator || !operatorExpectsValue(operator)) return null;

  const type = propertyDef?.type || "string";
  const setValue = (value) => onPatch(path, { value });
  const setHighValue = (highValue) => onPatch(path, { highValue });

  if (operatorExpectsValues(operator)) {
    return (
      <Box flex={1}>
        <MultiSelect
          label=""
          name={pathName(namePrefix, path, "value")}
          placeholder={labels.values}
          options={propertyDef?.options || []}
          value={Array.isArray(condition.value) ? condition.value : []}
          readOnly={readOnly}
          onChange={setValue}
        />
      </Box>
    );
  }

  if (type === "bool") {
    return (
      <Box flex={1}>
        <Select
          label=""
          name={pathName(namePrefix, path, "value")}
          placeholder={labels.value}
          options={[
            { label: labels.true, value: "true" },
            { label: labels.false, value: "false" },
          ]}
          value={condition.value}
          readOnly={readOnly}
          onChange={setValue}
        />
      </Box>
    );
  }

  if (type === "enum") {
    // Enum operators are normally IN/NOT_IN (handled above); a single Select
    // covers trees built by hand with scalar operators.
    return (
      <Box flex={1}>
        <Select
          label=""
          name={pathName(namePrefix, path, "value")}
          placeholder={labels.value}
          options={propertyDef?.options || []}
          value={condition.value}
          readOnly={readOnly}
          onChange={setValue}
        />
      </Box>
    );
  }

  const isBetween = operatorExpectsHighValue(operator);

  if (type === "number") {
    return (
      <>
        <Box flex={1}>
          <NumberInput
            label=""
            name={pathName(namePrefix, path, "value")}
            placeholder={labels.value}
            value={condition.value ?? ""}
            readOnly={readOnly}
            onChange={setValue}
          />
        </Box>
        {isBetween && (
          <>
            <Text variant="microcopy">{labels.between}</Text>
            <Box flex={1}>
              <NumberInput
                label=""
                name={pathName(namePrefix, path, "high-value")}
                placeholder={labels.value}
                value={condition.highValue ?? ""}
                readOnly={readOnly}
                onChange={setHighValue}
              />
            </Box>
          </>
        )}
      </>
    );
  }

  if (type === "date" || type === "datetime") {
    return (
      <>
        <Box flex={1}>
          <DateInput
            label=""
            name={pathName(namePrefix, path, "value")}
            format="medium"
            value={condition.value ?? null}
            readOnly={readOnly}
            onChange={setValue}
          />
        </Box>
        {isBetween && (
          <>
            <Text variant="microcopy">{labels.between}</Text>
            <Box flex={1}>
              <DateInput
                label=""
                name={pathName(namePrefix, path, "high-value")}
                format="medium"
                value={condition.highValue ?? null}
                readOnly={readOnly}
                onChange={setHighValue}
              />
            </Box>
          </>
        )}
      </>
    );
  }

  return (
    <Box flex={1}>
      <Input
        label=""
        name={pathName(namePrefix, path, "value")}
        placeholder={labels.value}
        value={condition.value ?? ""}
        readOnly={readOnly}
        onChange={setValue}
      />
    </Box>
  );
};

// Icon-only transparent Button — the affordance HubSpot's builder uses for
// every row/group action. The label rides along as screen-reader text.
const IconButton = ({ icon, label, onClick, size }) => (
  <Button size="extra-small" variant="transparent" onClick={onClick}>
    <Icon name={icon} screenReaderText={label} {...(size ? { size } : {})} />
  </Button>
);

// property Select → operator Select → value editor(s) → remove (x) button.
const ConditionRow = ({
  condition,
  path,
  properties,
  propertyOptions,
  namePrefix,
  labels,
  operatorLabels,
  readOnly,
  onPropertyChange,
  onOperatorChange,
  onPatch,
  onRemove,
}) => {
  const propertyDef = properties.find((property) => property.name === condition.property);
  const operatorOptions = getOperatorOptions(propertyDef?.type, operatorLabels);

  return (
    <Flex direction="row" gap="xs" align="center" wrap="wrap">
      <Box flex={1}>
        <Select
          label=""
          name={pathName(namePrefix, path, "property")}
          placeholder={labels.property}
          options={propertyOptions}
          value={condition.property || undefined}
          readOnly={readOnly}
          onChange={(name) => onPropertyChange(path, name)}
        />
      </Box>
      <Box flex={1}>
        <Select
          label=""
          name={pathName(namePrefix, path, "operator")}
          placeholder={labels.operator}
          options={operatorOptions}
          value={condition.operator || undefined}
          readOnly={readOnly || !condition.property}
          onChange={(operator) => onOperatorChange(path, operator)}
        />
      </Box>
      <ValueEditor
        condition={condition}
        propertyDef={propertyDef}
        path={path}
        namePrefix={namePrefix}
        labels={labels}
        readOnly={readOnly}
        onPatch={onPatch}
      />
      {!readOnly && (
        <IconButton icon="remove" label={labels.remove} onClick={() => onRemove(path)} />
      )}
    </Flex>
  );
};

// AND/OR control rendered between sibling rows. Every separator in a group is
// bound to the SAME group operator, so changing any one updates them all —
// exactly how HubSpot's segment builder behaves.
const GroupOperatorSeparator = ({ group, path, namePrefix, labels, readOnly, index, onGroupOperatorChange }) => {
  if (readOnly) {
    return (
      <Text variant="microcopy" format={{ fontWeight: "demibold" }}>
        {group.operator === "OR" ? labels.or : labels.and}
      </Text>
    );
  }
  return (
    <Box alignSelf="start">
      <Select
        label=""
        name={pathName(namePrefix, path, `separator-${index}`)}
        variant="transparent"
        options={GROUP_OPERATOR_OPTIONS(labels)}
        value={group.operator}
        onChange={(operator) => onGroupOperatorChange(path, operator)}
      />
    </Box>
  );
};

const GroupEditor = ({ group, path, depth, ctx }) => {
  const { labels, maxDepth, readOnly, namePrefix, handlers } = ctx;
  const isRoot = path.length === 0;
  const filters = Array.isArray(group.filters) ? group.filters : [];

  // HubSpot numbers groups ("Group 1", "Group 2") counting only group
  // siblings, skipping interleaved condition rows.
  let groupNumber = 0;

  const children = filters.map((child, index) => {
    const childPath = [...path, index];
    if (isGroupNode(child)) groupNumber += 1;
    const row = isGroupNode(child) ? (
      <Tile compact={true}>
        <Flex direction="column" gap="xs">
          <Flex direction="row" justify="between" align="center">
            <Text format={{ fontWeight: "demibold" }}>
              {/* non-breaking space — "Group" and its number must never wrap apart */}
              {`${labels.group}\u00A0${groupNumber}`}
            </Text>
            {!readOnly && (
              <Flex direction="row" gap="xs" justify="end">
                <IconButton
                  icon="copy"
                  label={labels.cloneGroup}
                  size="sm"
                  onClick={() => handlers.onDuplicate(childPath)}
                />
                <IconButton
                  icon="delete"
                  label={labels.removeGroup}
                  size="sm"
                  onClick={() => handlers.onRemove(childPath)}
                />
              </Flex>
            )}
          </Flex>
          <GroupEditor group={child} path={childPath} depth={depth + 1} ctx={ctx} />
        </Flex>
      </Tile>
    ) : (
      <ConditionRow
        condition={child}
        path={childPath}
        properties={ctx.properties}
        propertyOptions={ctx.propertyOptions}
        namePrefix={namePrefix}
        labels={labels}
        operatorLabels={ctx.operatorLabels}
        readOnly={readOnly}
        onPropertyChange={handlers.onPropertyChange}
        onOperatorChange={handlers.onOperatorChange}
        onPatch={handlers.onPatch}
        onRemove={handlers.onRemove}
      />
    );
    return (
      <React.Fragment key={childPath.join("-")}>
        {index > 0 && (
          <GroupOperatorSeparator
            group={group}
            path={path}
            namePrefix={namePrefix}
            labels={labels}
            readOnly={readOnly}
            index={index}
            onGroupOperatorChange={handlers.onGroupOperatorChange}
          />
        )}
        {row}
      </React.Fragment>
    );
  });

  return (
    // Nested groups pack tight (row / AND-OR / row reads as one unit, like
    // HubSpot's builder); the root keeps more air between its sections.
    <Flex direction="column" gap={isRoot ? "sm" : "xs"}>
      {isRoot && filters.length === 0 && (
        <Text variant="microcopy">{labels.empty}</Text>
      )}
      {children}
      {!readOnly && (
        <Flex direction="row" gap="md" align="center">
          <Button
            size="extra-small"
            variant="transparent"
            onClick={() => handlers.onAddCondition(path)}
          >
            <Icon name="add" /> {labels.addFilter}
          </Button>
          {depth < maxDepth && (
            <Button
              size="extra-small"
              variant="transparent"
              onClick={() => handlers.onAddGroup(path)}
            >
              <Icon name="add" /> {labels.addGroup}
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
};

/**
 * Segment-builder for nested AND/OR property filters, mirroring the HubSpot
 * list/workflow enrollment UI. Controlled or uncontrolled; emits the full
 * tree on every change. Pair with `toCrmSearchFilterGroups` /
 * `validateTree` from the same subpath to run the result against CRM search.
 *
 * Props:
 * - properties: array of `{ name, label, type, options? }` the user can filter
 *   on. `type` is one of "string" | "number" | "date" | "datetime" | "enum" |
 *   "bool" (default "string"); enum properties need `options` ({ label, value }).
 * - value / defaultValue: filter tree (`{ type: "group", operator: "AND"|"OR",
 *   filters: [...] }`). Provide `value` for controlled mode, `defaultValue`
 *   to seed uncontrolled mode. Defaults to an empty AND group.
 * - onChange: `(tree) => void`, called with the new tree after every edit.
 * - maxDepth: maximum group nesting (default 2 — the root plus one level of
 *   nested groups, matching HubSpot's builder). 1 disables "Add filter group".
 * - labels: copy overrides ({ addFilter, addGroup, remove, removeGroup,
 *   cloneGroup, group, and, or, property, operator, value, values, between,
 *   empty, true, false }). `remove` / `removeGroup` / `cloneGroup` are
 *   screen-reader text on the icon buttons; `group` prefixes group headings.
 * - operatorLabels: per-operator label overrides ({ EQ: "is", ... }) applied
 *   to the operator dropdowns.
 * - readOnly: render the current tree without any add/remove/edit affordances.
 * - namePrefix: prefix for the native inputs' `name` attributes (default
 *   "filter-builder") — set it when rendering two builders on one surface.
 * - ...rest: spread onto the root Flex (e.g. `gap`).
 */
export const FilterBuilder = ({
  properties = [],
  value,
  defaultValue,
  onChange,
  maxDepth = 2,
  labels: labelOverrides,
  operatorLabels,
  readOnly = false,
  namePrefix = "filter-builder",
  ...rest
}) => {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...(labelOverrides || {}) }), [labelOverrides]);
  const [internalTree, setInternalTree] = useState(() => normalizeTree(defaultValue));
  const isControlled = value !== undefined;
  const tree = isControlled ? normalizeTree(value) : internalTree;

  const propertyOptions = useMemo(
    () => properties.map((property) => ({ label: property.label ?? property.name, value: property.name })),
    [properties]
  );

  const commit = (next) => {
    if (!isControlled) setInternalTree(next);
    onChange?.(next);
  };

  const handlers = {
    onAddCondition: (groupPath) => commit(addFilter(tree, groupPath, createCondition())),
    onAddGroup: (groupPath) =>
      commit(addFilter(tree, groupPath, createGroup("AND", [createCondition()]))),
    onRemove: (path) => commit(removeFilter(tree, path, { pruneEmptyGroups: true })),
    onDuplicate: (path) => commit(duplicateFilter(tree, path)),
    onGroupOperatorChange: (groupPath, operator) =>
      commit(updateFilter(tree, groupPath, { operator })),
    onPropertyChange: (path, name) => {
      const def = properties.find((property) => property.name === name);
      commit(updateFilter(tree, path, (node) => changeConditionProperty(node, def ?? name)));
    },
    onOperatorChange: (path, operator) =>
      commit(updateFilter(tree, path, (node) => changeConditionOperator(node, operator))),
    onPatch: (path, patch) => commit(updateFilter(tree, path, patch)),
  };

  const ctx = { properties, propertyOptions, labels, operatorLabels, maxDepth, readOnly, namePrefix, handlers };

  return (
    <Flex direction="column" gap="sm" {...rest}>
      <GroupEditor group={tree} path={[]} depth={1} ctx={ctx} />
    </Flex>
  );
};
