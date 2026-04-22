# common-components

Reusable UI wrappers built on top of HubSpot UI Extensions primitives.

## Current components

- `AutoStatusTag` — status tag whose variant is inferred from the value
- `AutoTag` — generic tag with inferred variant + display text
- `AvatarStack` — overlapping circular avatars (letters or image URLs)
- `SectionHeader` — title + optional description row
- `KeyValueList` — vertical list of label/value rows
- `StyledText` — SVG-rendered text with rotation, custom colors, pill backgrounds

Plus utilities + constants:

- `makeAvatarStackDataUri`, `makeStyledTextDataUri` — low-level builders that return `{ src, width, height }` for composing into larger SVGs
- `HS_DATE_PRESETS`, `HS_DATE_DIRECTION_LABELS` — HubSpot's native quick-date preset list
- `HS_FONT_FAMILY`, `HS_TEXT_COLOR`, `HS_SUBTLE_BG`, `HS_MUTED_TEXT`, `HS_NEUTRAL_CHIP` — style constants matching native HubSpot CSS

## Purpose

This folder is for composable visual building blocks.

Use `common-components` when the export renders JSX and wraps HubSpot primitives into a reusable display pattern, or when the export is a style-related constant (fonts, colors, preset option lists) that sits alongside those visual wrappers.

## Import paths

```js
import {
  AutoStatusTag,
  AutoTag,
  AvatarStack,
  SectionHeader,
  KeyValueList,
  StyledText,
  HS_DATE_PRESETS,
} from "hs-uix/common-components";
```

Or from the root package:

```js
import { AvatarStack, StyledText } from "hs-uix";
```

---

## AvatarStack

Overlapping circular avatars rendered as a single SVG via `<Image>`. Letters get colored circles with white initials; `http(s):` or `data:image/...` URIs get circular-clipped images. Extras beyond `maxVisible` collapse into a neutral `+N` chip.

```jsx
import { AvatarStack } from "hs-uix/common-components";

<AvatarStack
  items={["AR", "JK", "SP"]}
  size="medium"
  maxVisible={4}
  overlap={8}
/>

// Mixed letters + image URLs
<AvatarStack
  items={[
    "AR",
    "https://cdn.example.com/photos/jordan.png",
    { letter: "SP", color: "#8B0000" },
  ]}
/>
```

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items` | `(string \| { letter, color, src })[]` | — | Each entry: a letter (2-char initials), an image URL (http(s)/data:image), or an explicit `{letter, color, src}` object. Empty/`null` values are filtered out. |
| `size` | t-shirt token \| number | `"medium"` | Diameter. Tokens: `xs`/`extra-small` (16), `sm`/`small` (20), `md`/`medium` (24), `lg`/`large` (32), `xl`/`extra-large` (40). Or any pixel number. |
| `overlap` | number | ~35% of `size` | Pixels each chip overlaps its neighbor. `0` = side-by-side, `size` = fully stacked. Clamped internally. |
| `step` | number | (derived from `overlap`) | Advanced: explicit center-to-center offset. Overrides `overlap` when set. |
| `maxVisible` | number | `4` | Cap on visible chips; extras become the `+N` overflow chip. |
| `colors` | `string[]` | built-in palette | Background palette for letter avatars (picked via char-code hash). |
| `overflowBg` | string | `HS_NEUTRAL_CHIP` | Background color for the `+N` chip. |
| `overflowColor` | string | `HS_TEXT_COLOR` | Text color for the `+N` chip. |
| `fontFamily` | string | `HS_FONT_FAMILY` | CSS font-family for letter initials. |
| `alt` | string | `"N associated records"` | Accessibility label on the underlying `<Image>`. |

### Low-level builder

```js
import { makeAvatarStackDataUri } from "hs-uix/common-components";

const { src, width, height } = makeAvatarStackDataUri(items, { size: "sm", overlap: 6 });
// → paint anywhere an <Image> is valid
```

Returns `null` when `items` resolves to zero valid entries — callers can unconditionally render without guarding.

**Image-URL caveat:** SVG `<image>` loads external assets via the browser's fetcher; the host must serve CORS-friendly headers. HubSpot-served avatars and most CDN hosts work; self-hosted images behind restricted CORS may not paint.

---

## StyledText

Drop-in enhancement over HubSpot's `<Text>` for cases native `<Text>` can't express — rotation, custom colors, pill backgrounds, specific font sizes. Rendered as an inline-SVG data URI through `<Image>`.

Accepts the same `variant` / `format` props as HubSpot's `<Text>` so existing usage patterns carry over; adds SVG-only extras.

```jsx
import { StyledText } from "hs-uix/common-components";

// Rotated column-header label in a collapsed rail
<StyledText
  text="Pricing Complete"
  variant="bodytext"
  format={{ fontWeight: "demibold" }}
  orientation="vertical-down"
/>

// Pill-wrapped count indicator
<StyledText
  text="339"
  variant="microcopy"
  format={{ fontWeight: "demibold" }}
  background={{ preset: "tag" }}
/>

// Custom color (native <Text> can't do this)
<StyledText text="High priority" color="#f2545b" format={{ fontWeight: "bold" }} />

// Semantic tag colors with HubSpot-style tag chrome
<StyledText
  text="At risk"
  variant="microcopy"
  format={{ fontWeight: "demibold" }}
  background={{ preset: "tag", variant: "warning" }}
/>
```

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `text` / `children` | string | — | The text to render. `text` prop or a string child. |
| `variant` | `"bodytext"` \| `"microcopy"` | `"bodytext"` | Size preset. `bodytext` → 14px, `microcopy` → 12px. Matches HubSpot's native CSS. |
| `format` | object | `{}` | `{ fontWeight: "bold" \| "demibold" \| "regular", italic, lineDecoration: "underline" \| "strikethrough", textTransform: "uppercase" \| "lowercase" \| "capitalize" \| "sentenceCase" }`. Same shape as HubSpot's `<Text format>`. |
| `orientation` | `"horizontal"` \| `"vertical-up"` \| `"vertical-down"` \| number | `"horizontal"` | Rotation. Number = custom degrees. |
| `color` | string | `HS_TEXT_COLOR` | Glyph color. Native `<Text>` can't override color; this can. |
| `background` | `{ preset, variant, color, textColor, borderColor, borderWidth, radius, paddingX, paddingY, height, fontSize, canvasPaddingX, canvasPaddingY }` | — | Optional pill behind the text. `preset: "tag"` uses the native HubSpot `Tag` component for plain horizontal tags, and falls back to SVG only for rotated/custom cases. `variant` supports `default`, `success`, `warning`, `error`/`danger`, and `info`. |
| `fontFamily` | string | `HS_FONT_FAMILY` | CSS font-family string. |
| `fontSize` | number | (from `variant`) | Override the computed font size. |
| `paddingX`, `paddingY` | number | `4, 2` | Canvas padding. |
| `width`, `height` | number | auto | Override computed canvas dimensions (useful for custom rotation angles). |
| `alt` | string | `text` | Accessibility label on the underlying `<Image>`. |

### Low-level builder

```js
import { makeStyledTextDataUri } from "hs-uix/common-components";

const { src, width, height } = makeStyledTextDataUri("Sort", {
  variant: "microcopy",
  orientation: "vertical-down",
});
```

### ⚠️ Selection caveat

Text rendered through `<Image>` as a data URI is **not user-selectable** — glyphs live inside a rasterized image boundary, not the DOM tree. If the text needs to be selectable/copyable, use the native `<Text>` component instead. `StyledText` is for cases where you need visual effects `<Text>` can't provide.

For `background={{ preset: "tag" }}` specifically: plain horizontal tags now render through native HubSpot `Tag` so they match the platform exactly. The SVG path is still used when you rotate the tag or override the tag chrome.

---

## HS_DATE_PRESETS

HubSpot's native quick-date preset list — matches the Create date dropdown on the Deals board. Use as the `options` for a `select` filter on Kanban / DataTable so consumers don't have to retype the list.

```jsx
import { HS_DATE_PRESETS } from "hs-uix/common-components";

filters={[
  {
    name: "createDate",
    type: "select",
    placeholder: "Create date",
    chipLabel: "Created",
    options: HS_DATE_PRESETS,
  },
]}
```

The preset values are stable identifiers (`"today"`, `"7d"`, `"this_quarter"`, etc.) — it's up to the consumer to translate them into actual date bounds (via `filterFn` on the filter config or server-side in `onFilterChange`).

Also exports `HS_DATE_DIRECTION_LABELS` (`{ asc: "Ascending", desc: "Descending" }`) for pairing with direction-specific sort UIs.

---

## Style constants (svgDefaults)

Raw style tokens used internally by `StyledText` and `AvatarStack` so they match the rest of HubSpot's UI. Exported so consumers can reuse them when composing their own SVG/data-URI visuals.

| Export | Value | Use |
| ------ | ----- | --- |
| `HS_FONT_FAMILY` | `"Lexend Deca", Helvetica, Arial, sans-serif` | All SVG text |
| `HS_TEXT_COLOR` | `#33475b` | Primary body text |
| `HS_SUBTLE_BG` | `#F5F8FA` | Tag `variant="subtle"` background |
| `HS_MUTED_TEXT` | `#7C98B6` | Secondary / microcopy gray |
| `HS_NEUTRAL_CHIP` | `#CBD6E2` | Neutral chip background (`+N` overflow) |
| `HS_TAG_SUBTLE_BORDER` | — | Border color for subtle-variant tag pills |
| `HS_TAG_TEXT_COLOR` | — | Text color inside tag pills |
| `HS_TAG_FONT_SIZE` | — | Font size (px) for tag pill text |
| `HS_TAG_LINE_HEIGHT` | — | Line height (px) for tag pill text |
| `HS_TAG_PADDING_X` / `HS_TAG_PADDING_Y` | — | Horizontal / vertical padding inside tag pills |
| `HS_TAG_BORDER_RADIUS` | — | Corner radius for tag pills |
| `HS_TAG_BORDER_WIDTH` | — | Border width for tag pills |
| `DEFAULT_SVG_FONT_WEIGHT` | `600` | Default demibold weight inside SVG text |

The `HS_TAG_*` constants mirror the computed styles of HubSpot's native `<Tag>` so `StyledText` can draw pixel-matching pill backgrounds when the SVG fallback is needed.

---

## Guidelines

- Keep components thin and composable
- Prefer wrapping native HubSpot primitives over inventing new abstractions
- Reach for `StyledText` only when native `<Text>` can't do what you need (rotation, custom color, pill background) — selection/copy-paste breaks with SVG-as-image
- Put non-visual helper logic in `src/utils/`
