// ═══════════════════════════════════════════════════════════════════════════
// Skeleton — content placeholders for loading states. The library previously
// had only Spinner (an animated "working…" indicator); skeletons instead hold
// the SHAPE of the incoming content so the layout doesn't jump when data
// arrives. There is no native skeleton component and CSS is forbidden in UI
// Extensions, so each placeholder is a gray rounded-rect SVG data URI rendered
// through the native <Image> (see skeletonSvg.js for the pure builder).
//
// One component, two modes:
//   STATIC  — no children: <Skeleton variant="text" lines={3}/> draws a
//             placeholder. Composite variants (table/board/list/form/
//             keyvalue/stats/input/chip/block) compose the primitives.
//   WRAPPER — with children: <Skeleton loading={...}>{content}</Skeleton>
//             renders children when loading is false; while true it never
//             renders them — it reads each child element's component name and
//             props (see skeletonInference.js) and draws a shape-matched
//             placeholder. Pass `skeleton={...}` to supply your own blocks
//             instead of the inferred ones.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { Flex, Image } from "@hubspot/ui-extensions";
import { makeSkeletonDataUri } from "./skeletonSvg.js";
import {
  applySpecOverrides,
  inferSkeletonSpec,
  resolveElementTypeName,
} from "./skeletonInference.js";

const DEFAULT_ALT = "Loading";

// Variants drawn directly by makeSkeletonDataUri; everything else is a
// composite rendered by renderShape below.
const PRIMITIVE_VARIANTS = new Set(["text", "box", "circle"]);

const renderShape = (spec, key) => {
  switch (spec.kind) {
    case "table":
      return React.createElement(SkeletonTable, {
        key,
        rows: spec.rows ?? 4,
        columns: spec.columns ?? 3,
      });
    case "board":
      return React.createElement(
        Flex,
        { key, direction: "row", gap: "md" },
        ...Array.from({ length: spec.columns ?? 3 }, (_, c) =>
          React.createElement(
            Flex,
            { key: `lane-${c}`, direction: "column", gap: "sm" },
            React.createElement(Skeleton, { variant: "text", lines: 1, width: "sm" }),
            ...Array.from({ length: spec.cardsPerColumn ?? 3 }, (_, i) =>
              React.createElement(SkeletonBox, {
                key: `card-${i}`,
                width: "sm",
                height: 64,
              })
            )
          )
        )
      );
    case "list":
      return React.createElement(
        Flex,
        { key, direction: "column", gap: "md" },
        ...Array.from({ length: spec.rows ?? 4 }, (_, i) =>
          React.createElement(
            Flex,
            { key: `item-${i}`, direction: "row", gap: "sm", align: "center" },
            React.createElement(SkeletonCircle, { size: 32 }),
            React.createElement(SkeletonText, { lines: 2, width: "md", height: 10, gap: 6 })
          )
        )
      );
    case "form":
      return React.createElement(
        Flex,
        { key, direction: "column", gap: "md" },
        ...Array.from({ length: spec.rows ?? 4 }, (_, i) =>
          React.createElement(
            Flex,
            { key: `field-${i}`, direction: "column", gap: "xs" },
            React.createElement(Skeleton, { variant: "text", lines: 1, width: 80, height: 10 }),
            React.createElement(SkeletonBox, { width: "lg", height: 32 })
          )
        )
      );
    case "input":
      return renderShape({ kind: "form", rows: 1 }, key);
    case "keyvalue":
      return React.createElement(
        Flex,
        { key, direction: "column", gap: "sm" },
        ...Array.from({ length: spec.rows ?? 3 }, (_, i) =>
          React.createElement(
            Flex,
            { key: `pair-${i}`, direction: "row", gap: "md" },
            React.createElement(Skeleton, { variant: "text", lines: 1, width: 80 }),
            React.createElement(Skeleton, { variant: "text", lines: 1, width: 140 })
          )
        )
      );
    case "stats":
      return React.createElement(
        Flex,
        { key, direction: "row", gap: "lg" },
        ...Array.from({ length: spec.columns ?? 3 }, (_, i) =>
          React.createElement(
            Flex,
            { key: `stat-${i}`, direction: "column", gap: "xs" },
            React.createElement(Skeleton, { variant: "text", lines: 1, width: 60, height: 10 }),
            React.createElement(SkeletonBox, { width: 100, height: 28 })
          )
        )
      );
    case "chip":
      return React.createElement(SkeletonBox, { key, width: 96, height: 24, radius: 12 });
    case "block":
      return React.createElement(SkeletonBox, { key, width: "lg", height: spec.height ?? 160 });
    case "text":
    default:
      return React.createElement(SkeletonText, {
        key,
        lines: spec.lines ?? 3,
        ...(spec.height != null ? { height: spec.height } : {}),
      });
  }
};

/**
 * <Skeleton /> — loading placeholders.
 *
 * WRAPPER MODE (children given):
 *   loading   — while true, children are replaced by placeholders; when
 *               false (default) children render untouched.
 *   skeleton  — your own placeholder node(s); skips auto-inference.
 *   variant   — override the inferred shape: "table" | "board" | "list" |
 *               "form" | "keyvalue" | "stats" | "input" | "chip" | "block" |
 *               "text" | "box" | "circle".
 *   rows / columns / lines / height — refine the shape's sizing.
 *   Recognized children get tailored placeholders sized from their own props:
 *   hs-uix DataTable/CrmDataTable, Kanban/CrmKanban, Feed, FormBuilder,
 *   KeyValueList, Calendar — plus native Table, Form, DescriptionList,
 *   Statistics, List, charts, Tile/Card/Accordion/Panel, Empty/ErrorState,
 *   Image/Illustration, field inputs, Button/Tag/StatusTag, Text/Heading.
 *   Anything else falls back to a text block.
 *
 * STATIC MODE (no children):
 *   variant        — "text" (stacked lines, default) | "box" | "circle", or
 *                    any composite shape above ("table", "board", …).
 *   width          — px number or "sm" | "md" | "lg" token (120 / 240 / 360).
 *   height         — px. Per-line height for "text" (default 12), block height
 *                    for "box" (default 96), diameter for "circle" (default 40).
 *   lines          — "text" only: number of lines (default 1).
 *   lastLineWidth  — "text" only: final-line width when lines > 1. Numbers in
 *                    (0, 1] are a fraction of `width`; larger numbers are px;
 *                    tokens work too. Default 0.6.
 *   gap            — "text" only: px between lines (default 8).
 *   radius         — corner radius px (default 3; ignored for "circle").
 *   columns        — "box" only: split the block into N equal cells.
 *   columnGap      — "box" only: px between cells (default 16).
 *   fill           — placeholder color (default SKELETON_FILL).
 *   alt            — accessible label on the underlying <Image> (default "Loading").
 *   ...rest        — forwarded to the underlying native <Image>.
 */
export const Skeleton = ({
  loading = false,
  skeleton,
  children,
  variant,
  width,
  height,
  lines,
  lastLineWidth,
  gap,
  radius,
  columns,
  columnGap,
  fill,
  rows,
  alt = DEFAULT_ALT,
  ...rest
}) => {
  const childNodes = React.Children.toArray(children);

  // WRAPPER MODE — children decide; loading gates them.
  if (childNodes.length > 0) {
    if (!loading) return children;
    if (skeleton !== undefined) return skeleton;
    const overrides = { variant, rows, columns, lines, height };
    const shapes = childNodes.map((node, i) => {
      const inferred = React.isValidElement(node)
        ? inferSkeletonSpec(resolveElementTypeName(node.type), node.props)
        : inferSkeletonSpec(null, {});
      return renderShape(applySpecOverrides(inferred, overrides), `skeleton-${i}`);
    });
    if (shapes.length === 1) return shapes[0];
    return React.createElement(Flex, { direction: "column", gap: "lg" }, ...shapes);
  }

  // STATIC MODE — composite variants compose the primitives…
  const kind = variant ?? "text";
  if (!PRIMITIVE_VARIANTS.has(kind)) {
    return renderShape(
      applySpecOverrides({ kind }, { rows, columns, lines, height })
    );
  }

  // …primitive variants draw a single SVG.
  const { src, width: w, height: h } = makeSkeletonDataUri({
    variant: kind,
    width,
    height,
    lines,
    lastLineWidth,
    gap,
    radius,
    columns,
    columnGap,
    fill,
  });
  return React.createElement(Image, { src, width: w, height: h, alt, ...rest });
};
Skeleton.displayName = "Skeleton";

/**
 * <SkeletonText /> — paragraph placeholder: stacked lines with a shorter
 * final line.
 *
 * Props:
 *   lines — number of lines (default 3).
 *   width — px or "sm" | "md" | "lg" token (default "md" = 240).
 *   ...rest — any other <Skeleton> prop (lastLineWidth, gap, height, fill, …).
 */
export const SkeletonText = ({ lines = 3, width = "md", ...rest }) =>
  React.createElement(Skeleton, { variant: "text", lines, width, ...rest });

/**
 * <SkeletonBox /> — solid block placeholder for images, charts, tiles.
 *
 * Props:
 *   width  — px or token (default "md" = 240).
 *   height — px (default 96).
 *   ...rest — any other <Skeleton> prop (radius, fill, …).
 */
export const SkeletonBox = ({ width = "md", height = 96, ...rest }) =>
  React.createElement(Skeleton, { variant: "box", width, height, ...rest });

/**
 * <SkeletonCircle /> — disc placeholder for avatars and icon slots.
 *
 * Props:
 *   size — diameter px (default 40, the avatar "md" size).
 *   ...rest — any other <Skeleton> prop (fill, alt, …).
 */
export const SkeletonCircle = ({ size = 40, ...rest }) =>
  React.createElement(Skeleton, { variant: "circle", width: size, height: size, ...rest });

/**
 * <SkeletonTable /> — a Flex column of row skeletons approximating a table:
 * each row is one SVG split into `columns` equal cells.
 *
 * Props:
 *   rows      — number of rows (default 4).
 *   columns   — cells per row (default 3).
 *   width     — total row width: px or "sm" | "md" | "lg" token (default "lg" = 360).
 *   rowHeight — px height of each row's cells (default 16).
 *   columnGap — px between cells within a row (default 16).
 *   gap       — Flex gap token between rows (default "sm").
 *   radius    — cell corner radius px (default 3).
 *   fill      — placeholder color.
 *   alt       — accessible label applied to each row image (default "Loading table").
 *   ...rest   — forwarded to the wrapping <Flex>.
 */
export const SkeletonTable = ({
  rows = 4,
  columns = 3,
  width = "lg",
  rowHeight = 16,
  columnGap = 16,
  gap = "sm",
  radius,
  fill,
  alt = "Loading table",
  ...rest
}) => {
  const count = Math.max(1, Math.floor(rows) || 1);
  return React.createElement(
    Flex,
    { direction: "column", gap, ...rest },
    ...Array.from({ length: count }, (_, i) =>
      React.createElement(Skeleton, {
        key: `skeleton-row-${i}`,
        variant: "box",
        width,
        height: rowHeight,
        columns,
        columnGap,
        radius,
        fill,
        alt,
      })
    )
  );
};
