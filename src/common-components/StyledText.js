import React from "react";
import { Image, Tag } from "@hubspot/ui-extensions";
import {
  HS_FONT_FAMILY,
  HS_SUBTLE_BG,
  HS_TAG_BORDER_RADIUS,
  HS_TAG_BORDER_WIDTH,
  HS_TAG_FONT_SIZE,
  HS_TAG_LINE_HEIGHT,
  HS_TAG_PADDING_X,
  HS_TAG_PADDING_Y,
  HS_TAG_SUBTLE_BORDER,
  HS_TAG_TEXT_COLOR,
  HS_TEXT_COLOR,
} from "./svgDefaults.js";

// ---------------------------------------------------------------------------
// StyledText — drop-in enhancement over HubSpot's <Text> component for cases
// where you need capabilities native Text can't do: custom rotation (vertical
// labels), custom colors, pill backgrounds, specific font sizes. Rendered as
// an inline-SVG data URI through <Image>.
//
// Accepts the same `variant` / `format` props as HubSpot's Text component so
// existing usage patterns carry over. Adds:
//   * `orientation: "horizontal" | "vertical-up" | "vertical-down" | number`
//   * `color: string` — override the glyph color (HS Text can't do this)
//   * `background: { color, radius, paddingX, paddingY }` — pill behind text
//   * `fontFamily`, `fontSize`, `width`, `height` — low-level overrides
//
// HubSpot font metrics (from the native CSS) are the defaults:
//   microcopy  → 12px / 18 line-height / 400
//   bodytext   → 14px / 24 line-height / 400  (default)
//   demibold   → 14px / 24 line-height / 600  (via format.fontWeight)
// All in "Lexend Deca", Helvetica, Arial, sans-serif.
//
// LIMITATION: Text rendered through <Image> as a data URI is NOT user-
// selectable — the glyphs live inside a rasterized image boundary, not the
// DOM tree. If the text needs to be selectable/copyable, use the native
// <Text> component instead. StyledText is for cases where you need visual
// effects native Text can't provide.
// ---------------------------------------------------------------------------

const VARIANT_PRESETS = {
  bodytext:  { fontSize: 14, lineHeight: 24, fontWeight: 400 },
  microcopy: { fontSize: 12, lineHeight: 18, fontWeight: 400 },
};

const WEIGHT_ALIASES = {
  bold: 700,
  demibold: 600,
  regular: 400,
};

const LINE_DECORATION = {
  strikethrough: "line-through",
  underline: "underline",
};

const ORIENTATION_ROTATION = {
  horizontal: 0,
  "vertical-up": -90,
  "vertical-down": 90,
};

const BACKGROUND_PRESETS = {
  tag: {
    color: HS_SUBTLE_BG,
    borderColor: HS_TAG_SUBTLE_BORDER,
    borderWidth: HS_TAG_BORDER_WIDTH,
    radius: HS_TAG_BORDER_RADIUS,
    paddingX: HS_TAG_PADDING_X,
    paddingY: HS_TAG_PADDING_Y,
    height: HS_TAG_LINE_HEIGHT,
    textColor: HS_TAG_TEXT_COLOR,
    fontSize: HS_TAG_FONT_SIZE,
    canvasPaddingX: 0,
    canvasPaddingY: 0,
  },
};

const TAG_VARIANTS = {
  default: {
    color: HS_SUBTLE_BG,
    borderColor: HS_TAG_SUBTLE_BORDER,
    textColor: HS_TAG_TEXT_COLOR,
  },
  success: {
    color: "#E5F8F6",
    borderColor: "#00BDA5",
    textColor: "#00BDA5",
  },
  warning: {
    color: "#FEF8F0",
    borderColor: "#F5C26B",
    textColor: "#D39913",
  },
  error: {
    color: "#FDEDEE",
    borderColor: "#F2545B",
    textColor: "#F2545B",
  },
  danger: {
    color: "#FDEDEE",
    borderColor: "#F2545B",
    textColor: "#F2545B",
  },
  info: {
    color: "#E5F5F8",
    borderColor: "#00A4BD",
    textColor: "#00A4BD",
  },
};

const NATIVE_TAG_VARIANT_ALIASES = {
  danger: "error",
};

const escapeSvgText = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const applyTextTransform = (text, transform) => {
  if (!transform || transform === "none") return String(text);
  const s = String(text);
  switch (transform) {
    case "uppercase":    return s.toUpperCase();
    case "lowercase":    return s.toLowerCase();
    case "capitalize":   return s.replace(/\b\w/g, (c) => c.toUpperCase());
    case "sentenceCase": return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    default:             return s;
  }
};

// Rough-cut width estimator — ~0.58em per char for Lexend Deca. Good enough
// for canvas sizing; don't rely on it for pixel-perfect layout.
const estimateTextWidth = (text, fontSize) =>
  Math.max(fontSize, Math.round(String(text).length * fontSize * 0.58));

const resolveBackground = (background) => {
  if (!background) return null;
  const preset = background.preset ? BACKGROUND_PRESETS[background.preset] : null;
  const variant =
    background.preset === "tag" && background.variant
      ? TAG_VARIANTS[background.variant] || null
      : null;
  return {
    ...(preset || {}),
    ...(variant || {}),
    ...background,
  };
};

const buildBackgroundRect = ({ background, x, y, width, height }) => {
  const radius = background?.radius ?? 3;
  const fill = background?.color ?? "transparent";
  const borderWidth = background?.borderWidth ?? 0;
  const borderColor = background?.borderColor;

  if (!borderColor || borderWidth <= 0) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" />`;
  }

  const isTagPreset = background?.preset === "tag";
  const fillRect =
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" />`;

  const strokeInset = borderWidth / 2;
  const strokeX = x + strokeInset;
  const strokeY = y + strokeInset;
  const strokeW = Math.max(0, width - borderWidth);
  const strokeH = Math.max(0, height - borderWidth);

  return (
    fillRect +
    `<rect x="${strokeX}" y="${strokeY}" width="${strokeW}" height="${strokeH}" rx="${Math.max(
      0,
      radius - strokeInset
    )}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"${
      isTagPreset ? ` shape-rendering="crispEdges"` : ""
    } />`
  );
};

const canUseNativeTag = ({
  background,
  orientation,
  color,
  fontFamily,
  fontSize,
  width,
  height,
  paddingX,
  paddingY,
  format = {},
}) => {
  if (!background || background.preset !== "tag") return false;

  const resolvedOrientation =
    typeof orientation === "number"
      ? orientation
      : (ORIENTATION_ROTATION[orientation ?? "horizontal"] ?? 0);

  if (resolvedOrientation !== 0) return false;
  if (color != null || fontFamily != null || fontSize != null) return false;
  if (width != null || height != null || paddingX != null || paddingY != null) return false;
  if (background.color != null || background.textColor != null) return false;
  if (background.borderColor != null || background.borderWidth != null) return false;
  if (background.radius != null || background.height != null) return false;
  if (background.paddingX != null || background.paddingY != null) return false;
  if (background.canvasPaddingX != null || background.canvasPaddingY != null) return false;
  if (format.italic || format.lineDecoration) return false;
  if (format.textTransform && format.textTransform !== "none") return false;

  return true;
};

/**
 * Build the SVG data URI + intrinsic dimensions for a piece of styled text.
 * Use directly when you need to compose the result into a larger SVG; use the
 * <StyledText> component wrapper otherwise.
 *
 * @returns {{ src: string, width: number, height: number }}
 */
export const makeStyledTextDataUri = (text, opts = {}) => {
  const {
    variant = "bodytext",
    format = {},
    orientation = "horizontal",
    color: colorProp = HS_TEXT_COLOR,
    fontFamily = HS_FONT_FAMILY,
    background: backgroundProp = null,
    paddingX: paddingXProp = 4,
    paddingY: paddingYProp = 2,
    width: widthOverride,
    height: heightOverride,
    fontSize: fontSizeOverride,
  } = opts;

  const preset = VARIANT_PRESETS[variant] || VARIANT_PRESETS.bodytext;
  const background = resolveBackground(backgroundProp);
  const fontSize = fontSizeOverride ?? background?.fontSize ?? preset.fontSize;
  const rawWeight = format.fontWeight;
  const fontWeight = rawWeight
    ? (WEIGHT_ALIASES[rawWeight] ?? rawWeight)
    : preset.fontWeight;
  const fontStyle = format.italic ? "italic" : "normal";
  const textDecoration = LINE_DECORATION[format.lineDecoration] || "none";
  const transformed = applyTextTransform(text, format.textTransform);
  const lineHeight = background?.height ?? preset.lineHeight ?? fontSize;
  const color = background?.textColor ?? colorProp;
  const paddingX = background?.canvasPaddingX ?? paddingXProp;
  const paddingY = background?.canvasPaddingY ?? paddingYProp;

  const rotate =
    typeof orientation === "number"
      ? orientation
      : (ORIENTATION_ROTATION[orientation] ?? 0);

  const textW = estimateTextWidth(transformed, fontSize);

  let pillW = 0;
  let pillH = 0;
  if (background) {
    const bgPadX = background.paddingX ?? 6;
    const bgPadY = background.paddingY ?? 3;
    pillW = textW + bgPadX * 2;
    pillH = background.height ?? Math.max(lineHeight, fontSize + bgPadY * 2);
  }

  const intrinsicW = (background ? pillW : textW) + paddingX * 2;
  const intrinsicH = (background ? pillH : lineHeight) + paddingY * 2;

  // 90/-90/270 rotations swap the bounding box. Other angles keep the
  // intrinsic axes — caller can override `width`/`height` for custom angles.
  const isOrthoRotation = rotate === 90 || rotate === -90 || rotate === 270;
  const canvasW = widthOverride ?? (isOrthoRotation ? intrinsicH : intrinsicW);
  const canvasH = heightOverride ?? (isOrthoRotation ? intrinsicW : intrinsicH);

  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const rectX = cx - pillW / 2;
  const rectY = cy - pillH / 2;

  const group =
    (background
      ? buildBackgroundRect({
          background,
          x: rectX,
          y: rectY,
          width: pillW,
          height: pillH,
        })
      : "") +
    `<text x="${cx}" y="${cy}" ` +
    `text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${fontFamily.replace(/"/g, "&quot;")}" ` +
    `font-size="${fontSize}" font-weight="${fontWeight}" ` +
    `font-style="${fontStyle}" text-decoration="${textDecoration}" ` +
    `fill="${color}">` +
    `${escapeSvgText(transformed)}` +
    `</text>`;

  const wrapped = rotate
    ? `<g transform="rotate(${rotate} ${cx} ${cy})">${group}</g>`
    : group;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">` +
    wrapped +
    `</svg>`;

  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    width: canvasW,
    height: canvasH,
  };
};

/**
 * React component wrapper. Same props as `makeStyledTextDataUri`, plus:
 *   - `children`: alternate to the `text` prop (for `<StyledText>...</StyledText>` usage)
 *   - `alt`: accessible label on the underlying <Image>
 */
export const StyledText = ({
  children,
  text,
  alt,
  variant,
  format,
  orientation,
  color,
  background,
  fontFamily,
  fontSize,
  paddingX,
  paddingY,
  width,
  height,
}) => {
  const resolvedText = text ?? (typeof children === "string" ? children : "");
  if (
    canUseNativeTag({
      background,
      orientation,
      color,
      fontFamily,
      fontSize,
      width,
      height,
      paddingX,
      paddingY,
      format,
    })
  ) {
    const nativeVariant = NATIVE_TAG_VARIANT_ALIASES[background?.variant] ?? background?.variant ?? "default";
    return React.createElement(Tag, { variant: nativeVariant }, resolvedText);
  }

  const { src, width: w, height: h } = makeStyledTextDataUri(resolvedText, {
    variant,
    format,
    orientation,
    color,
    background,
    fontFamily,
    fontSize,
    paddingX,
    paddingY,
    width,
    height,
  });
  return React.createElement(Image, {
    src,
    width: w,
    height: h,
    alt: alt ?? String(resolvedText),
  });
};
