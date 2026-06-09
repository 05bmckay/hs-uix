// ═══════════════════════════════════════════════════════════════════════════
// skeletonSvg — pure SVG-data-URI builder behind <Skeleton>. HubSpot UI
// Extensions forbid HTML/CSS, so loading placeholders can't be styled divs;
// instead we draw gray rounded rectangles (or circles) into an inline SVG and
// hand the result to the native <Image> — the same technique as
// makeStyledTextDataUri and makeAvatarStackDataUri. Kept free of React so the
// geometry (line counts, canvas dimensions, token resolution) is unit-testable
// in a plain node environment.
// ═══════════════════════════════════════════════════════════════════════════

import { SKELETON_FILL } from "./svgDefaults.js";

/** Width tokens accepted anywhere a skeleton takes a `width`. */
export const SKELETON_WIDTH_TOKENS = { sm: 120, md: 240, lg: 360 };

const DEFAULT_TEXT_WIDTH = SKELETON_WIDTH_TOKENS.md; // 240
const DEFAULT_LINE_HEIGHT = 12;  // ≈ bodytext glyph height; pairs with gap=8 → 20px pitch
const DEFAULT_LINE_GAP = 8;
const DEFAULT_BOX_HEIGHT = 96;   // card-ish block
const DEFAULT_CIRCLE_SIZE = 40;  // avatar "md"
const DEFAULT_RADIUS = 3;        // matches HubSpot Tile corner rounding
const DEFAULT_LAST_LINE_FRACTION = 0.6;
const DEFAULT_COLUMN_GAP = 16;

const isPositiveNumber = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;

/**
 * Resolve a width that may be a pixel number or a "sm" | "md" | "lg" token.
 * Anything else falls back to `fallback`.
 */
const resolveWidth = (width, fallback) => {
  if (isPositiveNumber(width)) return Math.round(width);
  if (typeof width === "string" && SKELETON_WIDTH_TOKENS[width] != null) {
    return SKELETON_WIDTH_TOKENS[width];
  }
  return fallback;
};

const rect = ({ x, y, width, height, radius, fill }) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" />`;

const wrapSvg = (width, height, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
  body +
  `</svg>`;

const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/**
 * Build the SVG data URI + intrinsic dimensions for a skeleton placeholder.
 * Use directly when composing into a larger SVG; use the <Skeleton> component
 * (and its presets) otherwise.
 *
 * @param {object} [opts]
 * @param {"text"|"box"|"circle"} [opts.variant="text"]
 * @param {number|"sm"|"md"|"lg"} [opts.width] — px or token (sm=120, md=240, lg=360).
 * @param {number} [opts.height] — px. Per-line height for "text" (default 12),
 *   block height for "box" (default 96), diameter for "circle" (default 40).
 * @param {number} [opts.lines=1] — "text" only: number of stacked lines.
 * @param {number|"sm"|"md"|"lg"} [opts.lastLineWidth] — "text" only: width of the
 *   final line when `lines > 1`. Numbers in (0, 1] are a fraction of `width`,
 *   larger numbers are px. Default 0.6.
 * @param {number} [opts.gap=8] — "text" only: px between lines.
 * @param {number} [opts.radius=3] — corner radius px (ignored for "circle").
 * @param {number} [opts.columns=1] — "box" only: split the block into N equal
 *   cells (used by <SkeletonTable> rows).
 * @param {number} [opts.columnGap=16] — "box" only: px between cells.
 * @param {string} [opts.fill] — placeholder color. Default SKELETON_FILL.
 * @returns {{ src: string, width: number, height: number }}
 */
export const makeSkeletonDataUri = (opts = {}) => {
  const {
    variant = "text",
    width,
    height,
    lines,
    lastLineWidth,
    gap,
    radius,
    columns,
    columnGap,
    fill = SKELETON_FILL,
  } = opts;

  if (variant === "circle") {
    const size = Math.round(
      isPositiveNumber(height) ? height : resolveWidth(width, DEFAULT_CIRCLE_SIZE)
    );
    const r = size / 2;
    const svg = wrapSvg(size, size, `<circle cx="${r}" cy="${r}" r="${r}" fill="${fill}" />`);
    return { src: toDataUri(svg), width: size, height: size };
  }

  if (variant === "box") {
    const w = resolveWidth(width, DEFAULT_TEXT_WIDTH);
    const h = isPositiveNumber(height) ? Math.round(height) : DEFAULT_BOX_HEIGHT;
    const r = isPositiveNumber(radius) || radius === 0 ? radius : DEFAULT_RADIUS;
    const cols = isPositiveNumber(columns) ? Math.max(1, Math.floor(columns)) : 1;
    const colGap = isPositiveNumber(columnGap) || columnGap === 0 ? columnGap : DEFAULT_COLUMN_GAP;

    let body;
    if (cols === 1) {
      body = rect({ x: 0, y: 0, width: w, height: h, radius: r, fill });
    } else {
      const cellW = Math.max(1, (w - (cols - 1) * colGap) / cols);
      body = Array.from({ length: cols }, (_, i) =>
        rect({ x: i * (cellW + colGap), y: 0, width: cellW, height: h, radius: r, fill })
      ).join("");
    }
    return { src: toDataUri(wrapSvg(w, h, body)), width: w, height: h };
  }

  // variant === "text" (default)
  const w = resolveWidth(width, DEFAULT_TEXT_WIDTH);
  const lineH = isPositiveNumber(height) ? Math.round(height) : DEFAULT_LINE_HEIGHT;
  const n = isPositiveNumber(lines) ? Math.max(1, Math.floor(lines)) : 1;
  const g = isPositiveNumber(gap) || gap === 0 ? gap : DEFAULT_LINE_GAP;
  const r = isPositiveNumber(radius) || radius === 0 ? radius : DEFAULT_RADIUS;

  // Last line is shorter when there are multiple lines — reads as a paragraph.
  let lastW = w;
  if (n > 1) {
    if (isPositiveNumber(lastLineWidth) && lastLineWidth <= 1) {
      lastW = Math.round(w * lastLineWidth);
    } else {
      lastW = Math.min(w, resolveWidth(lastLineWidth, Math.round(w * DEFAULT_LAST_LINE_FRACTION)));
    }
  }

  const body = Array.from({ length: n }, (_, i) =>
    rect({
      x: 0,
      y: i * (lineH + g),
      width: i === n - 1 ? lastW : w,
      height: lineH,
      radius: r,
      fill,
    })
  ).join("");

  const canvasH = n * lineH + (n - 1) * g;
  return { src: toDataUri(wrapSvg(w, canvasH, body)), width: w, height: canvasH };
};
