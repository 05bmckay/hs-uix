import type { ReactNode } from "react";

export type FilterPropertyType = "string" | "number" | "date" | "datetime" | "enum" | "bool";

export type FilterOperator =
  | "EQ"
  | "NEQ"
  | "CONTAINS_TOKEN"
  | "NOT_CONTAINS_TOKEN"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "BETWEEN"
  | "IN"
  | "NOT_IN"
  | "HAS_PROPERTY"
  | "NOT_HAS_PROPERTY";

export type FilterGroupOperator = "AND" | "OR";

/** Path into nested `filters` arrays. `[]` is the root group, `[1, 0]` is the root's second child's first child. */
export type FilterTreePath = number[];

export interface FilterPropertyOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterProperty {
  name: string;
  label?: string;
  /** Defaults to "string". Enum properties need `options`. */
  type?: FilterPropertyType;
  options?: FilterPropertyOption[];
}

export interface FilterConditionNode {
  type: "condition";
  property: string;
  /** "" while the user has not picked an operator yet. */
  operator: FilterOperator | "";
  /** Scalar for most operators; array for IN / NOT_IN; absent for HAS_PROPERTY / NOT_HAS_PROPERTY. */
  value?: unknown;
  /** Upper bound, BETWEEN only. */
  highValue?: unknown;
}

export interface FilterGroupNode {
  type: "group";
  operator: FilterGroupOperator;
  filters: FilterNode[];
}

export type FilterNode = FilterConditionNode | FilterGroupNode;

export interface FilterBuilderLabels {
  addFilter?: string;
  addGroup?: string;
  /** Screen-reader text on the condition row's remove (x) icon button. */
  remove?: string;
  /** Screen-reader text on the group header's delete (trash) icon button. */
  removeGroup?: string;
  /** Screen-reader text on the group header's clone (copy) icon button. */
  cloneGroup?: string;
  /** Group heading prefix — rendered as "Group 1", "Group 2", … */
  group?: string;
  and?: string;
  or?: string;
  property?: string;
  operator?: string;
  value?: string;
  values?: string;
  between?: string;
  empty?: string;
  true?: string;
  false?: string;
}

export interface FilterValidationError {
  path: FilterTreePath;
  message: string;
}

export interface FilterValidationResult {
  valid: boolean;
  errors: FilterValidationError[];
}

export interface FilterCrmSearchFilter {
  propertyName: string;
  operator: FilterOperator;
  value?: string | number | boolean;
  highValue?: string | number | boolean;
  values?: Array<string | number | boolean>;
}

export interface FilterCrmSearchFilterGroups {
  filterGroups: Array<{ filters: FilterCrmSearchFilter[] }>;
}

export interface FilterToCrmSearchOptions {
  /** Max filterGroups after DNF expansion (default 5, the CRM search limit). */
  maxGroups?: number;
  /** Max filters per filterGroup (default 6). */
  maxFiltersPerGroup?: number;
  /** Max filters across all groups (default 18). */
  maxTotalFilters?: number;
  /** Set false to skip limit checks (default true). */
  enforceLimits?: boolean;
  /** Set false to pass values through without DateInput→epoch-ms / boolean→string coercion (default true). */
  coerceValues?: boolean;
}

export interface FilterConditionToCrmOptions {
  coerceValues?: boolean;
}

export interface FilterRemoveOptions {
  /** Also remove ancestor groups left empty by the removal (root is never pruned). */
  pruneEmptyGroups?: boolean;
}

export interface FilterBuilderProps {
  properties: FilterProperty[];
  /** Controlled tree value. */
  value?: FilterGroupNode | null;
  /** Initial tree for uncontrolled mode. */
  defaultValue?: FilterGroupNode | null;
  onChange?: (tree: FilterGroupNode) => void;
  /** Max group nesting depth; root counts as 1 (default 2). */
  maxDepth?: number;
  labels?: FilterBuilderLabels;
  /** Per-operator label overrides for the operator dropdowns. */
  operatorLabels?: Partial<Record<FilterOperator, string>>;
  readOnly?: boolean;
  /** Prefix for native input `name`s; set when rendering two builders on one surface. */
  namePrefix?: string;
  /** Remaining props are spread onto the root Flex. */
  [key: string]: unknown;
}

export declare const FILTER_OPERATORS: Record<FilterPropertyType, FilterOperator[]>;

export declare function getOperatorOptions(
  type?: FilterPropertyType | string,
  labelOverrides?: Partial<Record<FilterOperator, string>>
): Array<{ label: string; value: FilterOperator }>;

export declare function operatorExpectsValue(operator?: string): boolean;
export declare function operatorExpectsHighValue(operator?: string): boolean;
export declare function operatorExpectsValues(operator?: string): boolean;

export declare function isGroupNode(node: unknown): node is FilterGroupNode;
export declare function isConditionNode(node: unknown): node is FilterConditionNode;

export declare function createCondition(
  property?: string,
  operator?: FilterOperator | "",
  value?: unknown,
  highValue?: unknown
): FilterConditionNode;

export declare function createGroup(
  operator?: FilterGroupOperator,
  filters?: FilterNode[]
): FilterGroupNode;

export declare function getNodeAtPath(tree: FilterNode, path: FilterTreePath): FilterNode | undefined;

export declare function addFilter(
  tree: FilterGroupNode,
  path: FilterTreePath,
  node: FilterNode
): FilterGroupNode;

export declare function updateFilter(
  tree: FilterGroupNode,
  path: FilterTreePath,
  patch: Partial<FilterConditionNode> | Partial<FilterGroupNode> | ((node: FilterNode) => FilterNode)
): FilterGroupNode;

export declare function removeFilter(
  tree: FilterGroupNode,
  path: FilterTreePath,
  options?: FilterRemoveOptions
): FilterGroupNode;

export declare function duplicateFilter(
  tree: FilterGroupNode,
  path: FilterTreePath
): FilterGroupNode;

export declare function countConditions(node: FilterNode): number;

export declare function changeConditionProperty(
  condition: FilterConditionNode,
  property: FilterProperty | string
): FilterConditionNode;

export declare function changeConditionOperator(
  condition: FilterConditionNode,
  operator: FilterOperator | ""
): FilterConditionNode;

export declare function validateTree(
  tree: FilterNode,
  properties?: FilterProperty[]
): FilterValidationResult;

export declare function conditionToCrmFilter(
  condition: FilterConditionNode,
  options?: FilterConditionToCrmOptions
): FilterCrmSearchFilter;

export declare function toCrmSearchFilterGroups(
  tree: FilterGroupNode,
  options?: FilterToCrmSearchOptions
): FilterCrmSearchFilterGroups;

export declare function FilterBuilder(props: FilterBuilderProps): ReactNode;
