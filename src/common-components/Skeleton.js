// ═══════════════════════════════════════════════════════════════════════════
// Skeleton — content placeholders for loading states. The library previously
// had only Spinner (an animated "working…" indicator); skeletons instead hold
// the SHAPE of the incoming content so the layout doesn't jump when data
// arrives. There is no native skeleton component and CSS is forbidden in UI
// Extensions, so each placeholder is a gray rounded-rect SVG data URI rendered
// through the native <Image> (see skeletonSvg.js for the pure builder).
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { Flex, Image } from "@hubspot/ui-extensions";
import { makeSkeletonDataUri } from "./skeletonSvg.js";

const DEFAULT_ALT = "Loading";

/**
 * <Skeleton /> — the base placeholder. Prefer the presets (SkeletonText,
 * SkeletonBox, SkeletonCircle, SkeletonTable) for common shapes.
 *
 * Props:
 *   variant        — "text" (stacked lines, default) | "box" (solid block) |
 *                    "circle" (avatar-style disc).
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
  variant = "text",
  width,
  height,
  lines,
  lastLineWidth,
  gap,
  radius,
  columns,
  columnGap,
  fill,
  alt = DEFAULT_ALT,
  ...rest
}) => {
  const { src, width: w, height: h } = makeSkeletonDataUri({
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
  });
  return React.createElement(Image, { src, width: w, height: h, alt, ...rest });
};

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
 *   width  — px or "sm" | "md" | "lg" token (default "md" = 240).
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
