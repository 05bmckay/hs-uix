import React from "react";
import { Image } from "@hubspot/ui-extensions";
import {
  HS_FONT_FAMILY,
  HS_TEXT_COLOR,
  HS_NEUTRAL_CHIP,
} from "./svgDefaults.js";

// ---------------------------------------------------------------------------
// AvatarStack — overlapping circular avatars rendered as a single SVG.
// UI Extensions don't expose negative margins or absolute positioning, so we
// draw the whole stack in one <svg> via the Image primitive.
//
// Each entry can be:
//   * a string letter/initials  → colored circle with white initials
//   * a `data:image/...` URI    → circular-clipped image (in-line)
//   * an `http(s):...` URL      → circular-clipped image (CORS-dependent)
//   * { letter, color, src }    → explicit shape, useful when you need a
//                                  specific color for a specific person
//
// Visual details to match HubSpot's native deal board:
//   * 14px center-to-center offset → ~10px visible overlap at size=24
//   * white halo (r=13) between adjacent avatars so they don't bleed
//   * overflow chip ("+N") as the last slot when items > maxVisible
// ---------------------------------------------------------------------------

const DEFAULT_COLORS = [
  "#0091ae", "#8B0000", "#ff5c35", "#00bda5",
  "#fdcc00", "#516f90", "#003366", "#8e7cc3",
];

// T-shirt sizing tokens — match HubSpot's naming ("xs" / "extra-small",
// "sm" / "small", etc.) so AvatarStack sits next to the rest of the
// component library without a bespoke scale. Step (center-to-center) is
// ~58% of diameter so the visible overlap stays proportional across sizes.
const SIZE_TOKENS = {
  xs: 16, "extra-small": 16,
  sm: 20, "small": 20,
  md: 24, "med": 24, "medium": 24,
  lg: 32, "large": 32,
  xl: 40, "extra-large": 40,
};

const resolveSize = (size) => {
  if (typeof size === "number") return size;
  if (typeof size === "string" && SIZE_TOKENS[size] != null) return SIZE_TOKENS[size];
  return 24; // default = medium
};

const isImageUri = (s) =>
  typeof s === "string" && /^(https?:|data:image\/)/i.test(s);

const escapeXmlAttr = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const pickColor = (key, palette, index) => {
  if (!key) return palette[index % palette.length];
  const code = String(key).charCodeAt(0) || 0;
  return palette[(code + index) % palette.length];
};

const normalizeEntry = (entry) => {
  if (entry == null) return null;
  if (typeof entry === "string") {
    if (entry.length === 0) return null;
    if (isImageUri(entry)) return { src: entry };
    return { letter: entry.slice(0, 2).toUpperCase() };
  }
  if (typeof entry === "object") {
    if (entry.src) return { src: entry.src, letter: entry.letter };
    if (entry.letter) return { letter: String(entry.letter).slice(0, 2).toUpperCase(), color: entry.color };
  }
  return null;
};

/**
 * Build an SVG data URI of overlapping stacked avatars.
 *
 * @param {Array} rawEntries — list of letters, image URLs, or `{letter, color, src}`.
 * @param {object} [opts]
 * @param {number | "xs" | "extra-small" | "sm" | "small" | "md" | "medium" | "lg" | "large" | "xl" | "extra-large"} [opts.size="medium"]
 *   Avatar diameter. Accepts HubSpot t-shirt tokens (xs=16, sm=20, md=24,
 *   lg=32, xl=40) or a raw pixel number.
 * @param {number} [opts.overlap] — pixels each avatar overlaps its neighbor.
 *   0 = no overlap (side by side), `size` = fully stacked. Defaults to ~42%
 *   of size (matches HubSpot's native look at md). Ignored if `step` is set.
 * @param {number} [opts.step] — advanced: center-to-center horizontal offset.
 *   Overrides `overlap` when both are provided.
 * @param {number} [opts.maxVisible=4] — cap on visible avatars; extras become
 *   "+N" as the last slot. Set higher to show more individual chips, lower
 *   to collapse to the overflow chip sooner.
 * @param {string[]} [opts.colors] — palette for letter-avatar backgrounds.
 * @param {string} [opts.overflowBg] — background for the "+N" chip.
 * @param {string} [opts.overflowColor] — text color for the "+N" chip.
 * @param {string} [opts.fontFamily]
 * @returns {null | { src: string, width: number, height: number, count: number }}
 */
export const makeAvatarStackDataUri = (rawEntries, opts = {}) => {
  const {
    size: sizeProp = "medium",
    step: stepProp,
    overlap: overlapProp,
    maxVisible = 4,
    colors = DEFAULT_COLORS,
    overflowBg = HS_NEUTRAL_CHIP,
    overflowColor = HS_TEXT_COLOR,
    fontFamily = HS_FONT_FAMILY,
  } = opts;

  const size = resolveSize(sizeProp);

  // Step resolution: explicit `step` wins; else derive from `overlap`; else
  // default to ~42% overlap (matches HubSpot's native look at md=24 where
  // step=14 → overlap=10).
  let step;
  if (stepProp != null) {
    step = stepProp;
  } else if (overlapProp != null) {
    // Clamp so step stays positive (avatars can't overlap by more than their
    // own diameter or the layout math breaks).
    const clampedOverlap = Math.max(0, Math.min(size - 1, overlapProp));
    step = size - clampedOverlap;
  } else {
    // Default ~35% overlap (step ≈ 65% of diameter). At md=24 → step=16 / 8px
    // overlap. Slightly less overlap than HubSpot's native look so the initials
    // stay legible when stacks run deep.
    step = Math.round(size * 0.65);
  }

  const entries = (rawEntries || []).map(normalizeEntry).filter(Boolean);
  if (entries.length === 0) return null;

  const visible = entries.slice(0, maxVisible);
  const overflowCount = entries.length - visible.length;
  const slots =
    overflowCount > 0
      ? [...entries.slice(0, maxVisible - 1), { overflow: overflowCount }]
      : visible;

  const count = slots.length;
  const r = size / 2;
  const haloR = r + 1;
  const width = size + (count - 1) * step;
  const height = size;

  // Single shared clipPath — each <image> group translates to its slot and
  // references this circle. Keeps the SVG small even with many avatars.
  const defs =
    `<defs><clipPath id="hsuixAvatarClip"><circle cx="${r}" cy="${r}" r="${r}"/></clipPath></defs>`;

  const fontFamilyAttr = fontFamily.replace(/"/g, "&quot;");

  const pieces = slots.map((slot, i) => {
    const cx = r + i * step;
    const tx = i * step;
    const halo = i > 0 ? `<circle cx="${cx}" cy="${r}" r="${haloR}" fill="#ffffff" />` : "";

    if (slot.overflow) {
      return (
        halo +
        `<circle cx="${cx}" cy="${r}" r="${r}" fill="${overflowBg}" />` +
        `<text x="${cx}" y="${r + 1}" text-anchor="middle" dominant-baseline="central" ` +
          `font-family="${fontFamilyAttr}" ` +
          `font-size="${Math.round(size * 0.42)}" font-weight="700" fill="${overflowColor}">+${slot.overflow}</text>`
      );
    }

    if (slot.src) {
      return (
        halo +
        `<g transform="translate(${tx}, 0)">` +
        `<image href="${escapeXmlAttr(slot.src)}" x="0" y="0" width="${size}" height="${size}" ` +
          `preserveAspectRatio="xMidYMid slice" clip-path="url(#hsuixAvatarClip)" />` +
        `</g>`
      );
    }

    const letter = slot.letter || "?";
    const bgColor = slot.color || pickColor(letter, colors, i);
    return (
      halo +
      `<circle cx="${cx}" cy="${r}" r="${r}" fill="${bgColor}" />` +
      `<text x="${cx}" y="${r + 1}" text-anchor="middle" dominant-baseline="central" ` +
        `font-family="${fontFamilyAttr}" ` +
        `font-size="${Math.round(size * 0.46)}" font-weight="700" fill="#ffffff">${escapeXmlAttr(letter)}</text>`
    );
  });

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
      `width="${width}" height="${height}">` +
    defs +
    pieces.join("") +
    `</svg>`;

  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    width,
    height,
    count,
  };
};

/**
 * Render overlapping stacked avatars. Returns null for empty input so you can
 * use it unconditionally in card bodies without a surrounding guard.
 */
export const AvatarStack = ({
  items,
  size,
  overlap,
  step,
  maxVisible,
  colors,
  overflowBg,
  overflowColor,
  fontFamily,
  alt,
}) => {
  const stack = makeAvatarStackDataUri(items, {
    size, overlap, step, maxVisible, colors, overflowBg, overflowColor, fontFamily,
  });
  if (!stack) return null;
  return React.createElement(Image, {
    src: stack.src,
    width: stack.width,
    height: stack.height,
    alt: alt ?? `${items.length} associated records`,
  });
};
