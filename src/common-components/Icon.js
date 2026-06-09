import React from "react";
import { Image, Icon as HsIcon, Link } from "@hubspot/ui-extensions";
import { HS_TEXT_COLOR } from "./svgDefaults.js";
import { GENERATED_ICONS } from "./icons.generated.js";
import { NATIVE_ICON_NAMES } from "./nativeIconNames.js";

// ---------------------------------------------------------------------------
// Icon — a superset of HubSpot's native <Icon>. The native component is great
// but boxed in three ways: a fixed `name` whitelist, only 4 colors
// ("inherit" | "alert" | "warning" | "success"), and only 3 sizes
// (small | medium | large). This wrapper lifts all three.
//
// Strategy (mirrors StyledText's native-<Tag> fallback): if a request is fully
// expressible by the native component, DELEGATE to it — you keep auto-sizing,
// real `color="inherit"`, and proper screen-reader semantics. Only when the
// caller needs something native can't do (an unregistered glyph, an arbitrary
// hex color, or a pixel size) do we fall back to the SVG-data-URI-in-<Image>
// trick the rest of this library uses.
//
// To add a custom glyph: open the icon in HubSpot's web app (or any source),
// copy its `viewBox` and each <path>'s `d`, and drop an entry into ICONS.
//
// FALLBACK-PATH LIMITATIONS (native path has none of these):
//   * Color is baked into the SVG — no live `currentColor`, so a fallback icon
//     won't auto-inherit surrounding color. Pass `color` explicitly.
//   * Multi-color glyphs: give a path its own `fill` in the registry; a single
//     `color` prop only recolors paths that don't declare one.
// ---------------------------------------------------------------------------

// The native component's full `name` whitelist now lives in
// nativeIconNames.js (shared with hs-uix/safe's SafeIcon). If a requested
// name is in there AND color/size are native-expressible, we let the real
// <Icon> render it.

const NATIVE_COLORS = new Set(["inherit", "alert", "warning", "success"]);

// native size token -> normalized token the real <Icon> accepts
const NATIVE_SIZE_TOKENS = {
  sm: "sm", small: "sm",
  md: "md", medium: "md",
  lg: "lg", large: "lg",
};

// Hex equivalents of the native semantic colors, so a FALLBACK icon can still
// honor color="success" etc. (matches StyledText's TAG_VARIANTS palette).
const SEMANTIC_HEX = {
  inherit: HS_TEXT_COLOR,
  alert: "#F2545B",
  warning: "#D39913",
  success: "#00BDA5",
};

// Pixel sizes for the fallback path's t-shirt tokens. Native auto-sizes, so
// these only apply when we're already in the SVG path; numbers pass through.
const SIZE_TOKENS = {
  xs: 12, "extra-small": 12,
  sm: 14, "small": 14,
  md: 16, "med": 16, "medium": 16,
  lg: 20, "large": 20,
  xl: 24, "extra-large": 24,
};

const resolveSize = (size) => {
  if (typeof size === "number") return size;
  if (typeof size === "string" && SIZE_TOKENS[size] != null) return SIZE_TOKENS[size];
  return 16; // default = medium, matching native Icon
};

const escapeXmlAttr = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ---------------------------------------------------------------------------
// Custom-glyph registry. Each entry:
//   { viewBox?: "0 0 24 24", paths: [ "M…" | { d, fill?, fillRule? }, … ] }
// `viewBox` defaults to "0 0 24 24". A bare-string path inherits the resolved
// `color`; an object can pin its own `fill` for multi-color glyphs.
//
// Keys are icon NAMES. Glyphs scraped from HubSpot's web app keep their
// `data-icon-name` verbatim (PascalCase, e.g. "Settings") and live in the
// auto-generated module; the hand-curated block below adds a few names native
// lacks (plain chevrons, bare check/plus). On a key collision the hand-curated
// entry wins. Regenerate scraped icons with `node scripts/build-icons.mjs`.
// ---------------------------------------------------------------------------
const PLUS_24 = "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z";

const CURATED_ICONS = {
  checkBare:    { paths: ["M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"] },
  plusBare:     { paths: [PLUS_24] },
  // Close = a plus rotated 45° → a clean X (reuses transform support, no new
  // path data to hand-author/get-wrong).
  Close:        { paths: [PLUS_24], transform: "rotate(45 12 12)" },
  // Universal media-transport glyphs, authored at 32×32 to match the scraped
  // canvas so they sit at the same optical size as the rest of the set.
  Play:         { viewBox: "0 0 32 32", paths: ["M9 6v20l17-10z"] },
  Pause:        { viewBox: "0 0 32 32", paths: ["M10 6h4v20h-4z M18 6h4v20h-4z"] },
  Stop:         { viewBox: "0 0 32 32", paths: ["M8 8h16v16H8z"] },
  // Hand-authored to match HubSpot's filled/rounded weight (verified visually
  // against the scraped set) for genuine gaps the scrape didn't cover.
  Unlocked: {
    viewBox: "0 0 32 32",
    paths: [
      "M9.5 14v-3.4c0-3.57 2.9-6.46 6.46-6.46 2.66 0 5.02 1.64 5.97 4.07a1.6 1.6 0 1 1-2.98 1.16 3.23 3.23 0 0 0-2.99-2.03c-1.78 0-3.23 1.45-3.23 3.23V14z",
      { d: "M6.3 14h19.4a3.2 3.2 0 0 1 3.2 3.2v8.6a3.2 3.2 0 0 1-3.2 3.2H6.3a3.2 3.2 0 0 1-3.2-3.2v-8.6A3.2 3.2 0 0 1 6.3 14Zm9.7 4.4a2.1 2.1 0 0 0-1.05 3.92V25a1.05 1.05 0 0 0 2.1 0v-2.68A2.1 2.1 0 0 0 16 18.4Z", fillRule: "evenodd" },
    ],
  },
  Print: {
    viewBox: "0 0 32 32",
    paths: [
      "M9 4h14a1 1 0 0 1 1 1v6H8V5a1 1 0 0 1 1-1z",
      { d: "M5 12h22a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3v-3H8v3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm18 3.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z", fillRule: "evenodd" },
      "M10 21h12v6a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1z",
    ],
  },
  Shrink: {
    viewBox: "0 0 32 32",
    paths: [
      "M14.05 4.1c1.08 0 1.95.87 1.95 1.95v8a1.95 1.95 0 0 1-1.95 1.95h-8a1.95 1.95 0 1 1 0-3.9h3.28L3.17 5.93A1.95 1.95 0 0 1 5.93 3.17l6.17 6.17V6.05c0-1.08.87-1.95 1.95-1.95Z",
      "M17.95 27.9a1.95 1.95 0 0 1-1.95-1.95v-8a1.95 1.95 0 0 1 1.95-1.95h8a1.95 1.95 0 1 1 0 3.9h-3.28l6.18 6.17a1.95 1.95 0 0 1-2.76 2.76l-6.17-6.17v3.29c0 1.08-.87 1.95-1.95 1.95Z",
    ],
  },
  Heart:        { viewBox: "0 0 32 32", paths: ["M16 26.5C9 21 5 17 5 12.4 5 9.1 7.6 6.5 11 6.5c2 0 3.8 1 5 2.6 1.2-1.6 3-2.6 5-2.6 3.4 0 6 2.6 6 5.9 0 4.6-4 8.6-11 14.1Z"] },
  CircleFilled: { viewBox: "0 0 32 32", paths: ["M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2z"] },
  // Dark = crescent moon, pairs with the scraped Light (sun) for theme toggles.
  Dark:         { viewBox: "0 0 32 32", paths: ["M19 3.5A12 12 0 1 0 28.5 19 9.6 9.6 0 0 1 19 3.5Z"] },
  Export:       { viewBox: "0 0 32 32", paths: ["M16 3l5 5h-3.5v7h-3V8H11z", "M6 16h4v6h12v-6h4v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"] },
  Import:       { viewBox: "0 0 32 32", paths: ["M16 16l5-5h-3.5V4h-3v7H11z", "M6 17h4v5h12v-5h4v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"] },
  // Backward = horizontal mirror of the scraped Forward arrow (x' = 32 - x).
  // Derived so it stays in sync if Forward is ever re-scraped.
  ...(GENERATED_ICONS.Forward
    ? { Backward: { ...GENERATED_ICONS.Forward, transform: "translate(32 0) scale(-1 1)" } }
    : {}),
};

export const ICONS = { ...GENERATED_ICONS, ...CURATED_ICONS };

/**
 * Turn a raw scraped `<svg>` string (e.g. copied from HubSpot's web app) into
 * an ICONS registry entry: `{ viewBox, paths }`. Hardcoded fills are dropped so
 * the `color` prop can recolor the glyph; an explicit non-currentColor fill or
 * a fill-rule is preserved (object path form) so multi-color / even-odd glyphs
 * survive intact.
 *
 *   ICONS.settings = svgToIconEntry(`<svg viewBox="0 0 32 32">…</svg>`);
 *
 * @returns {{ viewBox: string, paths: Array<string|{d,fill?,fillRule?}> }}
 */
export const svgToIconEntry = (raw) => {
  const vb = /viewBox="([^"]+)"/i.exec(raw);
  const viewBox = vb ? vb[1] : "0 0 24 24";
  // Drop definition blocks — paths inside <mask>/<defs>/<clipPath>/<symbol> are
  // not rendered content (HubSpot's masked icons stash a full-rect mask path
  // there that would otherwise paint a solid square over the glyph).
  const rendered = raw.replace(
    /<(mask|defs|clipPath|symbol)\b[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  const paths = [];
  const pathRe = /<path\b([^>]*?)\/?>/gi;
  let m;
  while ((m = pathRe.exec(rendered)) !== null) {
    const attrs = m[1];
    const d = /\bd="([^"]+)"/i.exec(attrs);
    if (!d) continue;
    const fill = /\bfill="([^"]+)"/i.exec(attrs);
    const fillRule = /\bfill-rule="([^"]+)"/i.exec(attrs);
    const keepFill = fill && fill[1] !== "currentColor" && fill[1] !== "none";
    if (keepFill || fillRule) {
      paths.push({
        d: d[1],
        ...(keepFill ? { fill: fill[1] } : {}),
        ...(fillRule ? { fillRule: fillRule[1] } : {}),
      });
    } else {
      paths.push(d[1]);
    }
  }
  return { viewBox, paths };
};

const ICON_NAME_ALIASES = {
  call: "calling",
  phone: "calling",
  meeting: "appointment",
  note: "comment",
  notes: "comment",
  task: "tasks",
  open: "record",
  openRecord: "record",
  office: "record",
  company: "record",
  external: "link",
  externalLink: "link",
  down: "Down",
  up: "Up",
  pencil: "edit",
  trash: "delete",
};

const NATIVE_ICON_NAME_ALIASES = new Map([
  ...[...NATIVE_ICON_NAMES].map((nativeName) => [nativeName.toLowerCase(), nativeName]),
  ...Object.entries(ICON_NAME_ALIASES).map(([alias, nativeName]) => [alias.toLowerCase(), nativeName]),
]);

const resolveIconName = (name) => {
  if (typeof name !== "string") return name;
  if (NATIVE_ICON_NAMES.has(name)) return name;
  if (ICONS[name]) return name;

  const nativeOrAlias = NATIVE_ICON_NAME_ALIASES.get(name.toLowerCase());
  if (nativeOrAlias) return nativeOrAlias;

  return name;
};

const canUseNative = (name, color, size) =>
  NATIVE_ICON_NAMES.has(resolveIconName(name)) &&
  (color == null || NATIVE_COLORS.has(color)) &&
  (size == null || typeof size === "string" && NATIVE_SIZE_TOKENS[size] != null);

/**
 * Build the SVG data URI + intrinsic dimensions for an icon. `nameOrEntry` is
 * either a registered glyph name (looked up in ICONS) or an inline entry object
 * (`{ viewBox?, paths, transform? }`) to render ad-hoc. Returns null for an
 * unknown name. `color` accepts a semantic token or any CSS color.
 *
 * @returns {{ src: string, width: number, height: number } | null}
 */
export const makeIconDataUri = (nameOrEntry, opts = {}) => {
  const entry =
    nameOrEntry && typeof nameOrEntry === "object"
      ? nameOrEntry
      : ICONS[nameOrEntry];
  if (!entry || !entry.paths) return null;

  const size = resolveSize(opts.size);
  const rawColor = opts.color;
  const color = (rawColor && SEMANTIC_HEX[rawColor]) || rawColor || HS_TEXT_COLOR;
  const viewBox = entry.viewBox ?? "0 0 24 24";

  const body = entry.paths
    .map((p) => {
      const d = typeof p === "string" ? p : p.d;
      const fill = (typeof p === "object" && p.fill) || color;
      const fillRule = typeof p === "object" && p.fillRule
        ? ` fill-rule="${p.fillRule}"`
        : "";
      return `<path d="${escapeXmlAttr(d)}" fill="${fill}"${fillRule} />`;
    })
    .join("");

  // Optional entry `transform` (e.g. a mirror) wraps all paths in a <g>. Used
  // to derive icons like Backward from Forward without duplicating path data.
  const inner = entry.transform
    ? `<g transform="${escapeXmlAttr(entry.transform)}">${body}</g>`
    : body;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${size}" height="${size}" viewBox="${viewBox}">` +
    inner +
    `</svg>`;

  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    width: size,
    height: size,
  };
};

/** Custom glyphs registered in this library (excludes native names). */
export const ICON_NAMES = Object.keys(ICONS);

/** The native component's `name` whitelist, as a sorted array. */
export const NATIVE_ICON_NAME_LIST = [...NATIVE_ICON_NAMES].sort((a, b) =>
  a.localeCompare(b)
);

/**
 * Superset <Icon>. Props mirror the native component:
 *   - `name`             (required) native name OR a custom ICONS key
 *   - `color`            "inherit"|"alert"|"warning"|"success" OR any CSS color
 *   - `size`             "sm"|"md"|"lg" (native) OR xs..xl OR a pixel number
 *   - `screenReaderText` accessible label
 *   - `onClick` / `href`  make the icon interactive
 *
 * Delegates to native <Icon> when the request is native-expressible; otherwise
 * renders the registered glyph through <Image>. HubSpot's native Icon remote
 * component does not accept interaction props reliably, so interactive native
 * icons are rendered as a native Icon inside a Link. That preserves the native
 * glyph while using a primitive that is allowed to own `onClick` / `href`.
 */
export const Icon = ({ name, color, size, screenReaderText, onClick, href }) => {
  const resolvedName = resolveIconName(name);

  const renderNativeIcon = () =>
    React.createElement(HsIcon, {
      name: resolvedName,
      ...(color != null ? { color } : {}),
      ...(size != null ? { size: NATIVE_SIZE_TOKENS[size] } : {}),
      ...(screenReaderText != null ? { screenReaderText } : {}),
    });

  const renderNative = () => {
    const icon = renderNativeIcon();
    if (onClick == null && href == null) return icon;
    return React.createElement(
      Link,
      {
        ...(onClick != null ? { onClick } : {}),
        ...(href != null ? { href } : {}),
      },
      icon
    );
  };

  if (canUseNative(name, color, size)) return renderNative();

  const result = makeIconDataUri(resolvedName, { size, color });
  if (!result) {
    // No registered glyph to draw. If the name is native-expressible, render the
    // native icon (which can't be clickable) rather than nothing.
    return canUseNative(name, color, size) ? renderNative() : null;
  }
  return React.createElement(Image, {
    src: result.src,
    width: result.width,
    height: result.height,
    alt: screenReaderText ?? name,
    ...(onClick != null ? { onClick } : {}),
    ...(href != null ? { href } : {}),
  });
};
