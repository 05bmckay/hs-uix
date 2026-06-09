// ═══════════════════════════════════════════════════════════════════════════
// skeletonInference — pure inference for <Skeleton>'s auto wrapper mode:
// given a child element's component name and props, decide what placeholder
// SHAPE to draw so the skeleton matches the incoming content and the layout
// doesn't jump. Kept free of React so the mapping rules are unit-testable.
//
// Native @hubspot/ui-extensions components are remote string types ("Table",
// "Select", …), so their element type IS the name — minification-proof.
// hs-uix components carry explicit displayName for the same reason.
// ═══════════════════════════════════════════════════════════════════════════

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** Resolve a stable component name from a React element type. */
export const resolveElementTypeName = (type) => {
  if (typeof type === "string") return type;
  if (typeof type === "function" || (type && typeof type === "object")) {
    return type.displayName || type.name || null;
  }
  return null;
};

const countChildren = (children, fallback) => {
  if (Array.isArray(children)) return children.length || fallback;
  return children != null ? 1 : fallback;
};

const INPUT_TYPES = new Set([
  "Input", "NumberInput", "CurrencyInput", "StepperInput", "DateInput",
  "TimeInput", "SearchInput", "TextArea", "Textarea", "Select", "MultiSelect",
  "Toggle", "Checkbox", "RadioButton", "ToggleGroup",
]);

/**
 * Map a component name + its props to a skeleton spec.
 *
 * Returns { kind, ...sizing }:
 *   table    — { rows, columns }            DataTable / CrmDataTable / native Table
 *   board    — { columns, cardsPerColumn }  Kanban / CrmKanban
 *   list     — { rows }                     Feed
 *   form     — { rows }                     FormBuilder / native Form
 *   keyvalue — { rows }                     KeyValueList / DescriptionList
 *   stats    — { columns }                  native Statistics
 *   input    — single label + input row     native field inputs
 *   chip     — small pill                   Button / Tag / StatusTag
 *   block    — { height }                   Calendar, charts, Tile/Card, images
 *   text     — { lines }                    Text/List/anything unrecognized
 *
 * Counts are read from the child's own props (columns, stages, fields, items,
 * pageSize, children) and clamped to sane placeholder sizes.
 */
export const inferSkeletonSpec = (typeName, props = {}) => {
  if (typeName && INPUT_TYPES.has(typeName)) return { kind: "input" };
  switch (typeName) {
    // hs-uix
    case "DataTable":
    case "CrmDataTable":
      return {
        kind: "table",
        rows: clamp(props.pageSize ?? 5, 1, 10),
        columns: clamp(
          props.columns?.length ?? props.properties?.length ?? 4,
          1,
          8
        ),
      };
    case "Kanban":
    case "CrmKanban":
      return {
        kind: "board",
        columns: clamp(props.stages?.length || 3, 1, 6),
        cardsPerColumn: 3,
      };
    case "Feed":
      return { kind: "list", rows: clamp(props.pageSize ?? 4, 1, 8) };
    case "FormBuilder":
      return { kind: "form", rows: clamp(props.fields?.length || 4, 1, 10) };
    case "KeyValueList":
      return { kind: "keyvalue", rows: clamp(props.items?.length || 3, 1, 10) };
    case "Calendar":
      return { kind: "block", height: 320 };
    // native @hubspot/ui-extensions (string remote types)
    case "Table":
      return { kind: "table", rows: 4, columns: 3 };
    case "Form":
      return { kind: "form", rows: 4 };
    case "DescriptionList":
      return { kind: "keyvalue", rows: clamp(countChildren(props.children, 3), 1, 10) };
    case "Statistics":
      return { kind: "stats", columns: clamp(countChildren(props.children, 3), 1, 6) };
    case "List":
      return { kind: "text", lines: clamp(countChildren(props.children, 4), 1, 10) };
    case "BarChart":
    case "LineChart":
      return { kind: "block", height: 240 };
    case "Accordion":
    case "Tile":
    case "Card":
    case "Panel":
      return { kind: "block", height: 120 };
    case "EmptyState":
    case "ErrorState":
      return { kind: "block", height: 160 };
    case "Image":
    case "Illustration":
      return {
        kind: "block",
        height: typeof props.height === "number" ? props.height : 120,
      };
    case "Button":
    case "LoadingButton":
    case "Tag":
    case "StatusTag":
      return { kind: "chip" };
    case "Text":
      return { kind: "text", lines: 1 };
    case "Heading":
      return { kind: "text", lines: 1, height: 18 };
    default:
      return { kind: "text", lines: 3 };
  }
};

/**
 * Merge explicit <Skeleton> overrides into an inferred spec. `variant`
 * replaces the kind entirely; rows/columns/lines/height refine whatever kind
 * is in effect.
 */
export const applySpecOverrides = (spec, { variant, rows, columns, lines, height } = {}) => {
  const out = { ...spec };
  if (variant) out.kind = variant;
  if (rows != null) out.rows = rows;
  if (columns != null) out.columns = columns;
  if (lines != null) out.lines = lines;
  if (height != null) out.height = height;
  return out;
};
