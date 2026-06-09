# common-components

Reusable UI wrappers built on top of HubSpot UI Extensions primitives.

## Current components

- `AutoStatusTag` — status tag whose variant is inferred from the value
- `AutoTag` — generic tag with inferred variant + display text
- `AvatarStack` — overlapping circular avatars (letters or image URLs)
- `Icon` — superset of HubSpot's native `<Icon>`: custom glyphs, any CSS color, pixel sizes
- `CrmLookupSelect` — CRM-backed `Select` / `MultiSelect` with live, debounced search
- `CrmRecordPicker` — multi-association record picker: search CRM records, select many, get ids AND records back, optional inline create
- `CollectionToolbar`, `CollectionFilterControl`, `ActiveFilterChips`, `CollectionSortSelect`, `CollectionCount` — shared search/filter/sort/count primitives used by DataTable, Kanban, Feed, and Calendar
- `DateRangePicker` — HubSpot-style date filter value control with preset, static-date, rolling, range, and presence operator layouts
- `SectionHeader` — title + optional description row
- `KeyValueList` — vertical list of label/value rows
- `StyledText` — SVG-rendered text with rotation, custom colors, pill backgrounds
- `Spinner` — animated unicode/braille loading indicator

Plus utilities + constants:

- `makeAvatarStackDataUri`, `makeStyledTextDataUri`, `makeIconDataUri` — low-level builders that return `{ src, width, height }` for composing into larger SVGs
- `ICONS`, `ICON_NAMES`, `NATIVE_ICON_NAME_LIST`, `svgToIconEntry` — the custom icon registry and helpers behind `Icon`
- `SPINNERS`, `SPINNER_NAMES` — spinner presets and registry
- `HS_DATE_PRESETS`, `HS_DATE_DIRECTION_LABELS` — HubSpot's native quick-date preset list
- `presetToRange`, `toHsDateValue`, `compareHsDateValues`, `isValidDateRange`, `DATE_FILTER_OPERATORS`, `DATE_ROLLING_UNIT_OPTIONS`, `DATE_RANGE_CUSTOM_VALUE` — date-filter constants and math behind `DateRangePicker`
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
  Icon,
  CrmLookupSelect,
  CrmRecordPicker,
  CollectionToolbar,
  CollectionSortSelect,
  DateRangePicker,
  SectionHeader,
  KeyValueList,
  StyledText,
  Spinner,
  HS_DATE_PRESETS,
} from "hs-uix/common-components";
```

Or from the root package:

```js
import { AvatarStack, Icon, StyledText } from "hs-uix";
```

---

## Collection controls

The collection controls are the low-level toolbar primitives used internally by `DataTable`, `Kanban`, `Feed`, and `Calendar`. Use them when you are building a custom collection view but want the same search/filter/sort/count UX as the packaged components.

```jsx
import {
  CollectionToolbar,
  CollectionSortSelect,
} from "hs-uix/common-components";
import {
  buildActiveFilterChips,
  resetFilterValues,
} from "hs-uix/utils";

const activeChips = buildActiveFilterChips(filters, filterValues);

<CollectionToolbar
  search={{
    name: "deals-search",
    value: search,
    placeholder: "Search deals...",
    onChange: setSearch,
  }}
  filters={{
    items: filters,
    values: filterValues,
    inlineLimit: 2,
    onChange: (name, value) => setFilterValues((prev) => ({ ...prev, [name]: value })),
  }}
  chips={{
    items: activeChips,
    onRemove: (key) => setFilterValues((prev) => resetFilterValues(filters, prev, key)),
  }}
  right={
    <CollectionSortSelect
      value={sort}
      options={sortOptions}
      placeholder="Sort"
      onChange={setSort}
    />
  }
/>
```

### Design notes

- These primitives are **controlled**. They render controls and emit changes; callers own query state and data filtering.
- `CollectionToolbar` automatically appends a per-toolbar suffix to child input/select names using React `useId()`. This prevents collisions when multiple tables, boards, feeds, or calendars render in the same extension. Pass `idPrefix` for a stable suffix or `uniqueNames={false}` to opt out.
- The right-side slot defaults to `alignSelf="end"`, so counts/sort controls sit on the lowest toolbar row. This keeps them aligned with active filter chips when chips are visible.
- `CollectionToolbar` accepts `leftFlex` / `rightFlex` for view-specific space allocation. Calendar uses a 3/2 split (60/40) by default because its right side contains Today, previous/next, and view controls.

### Shared filter config vocabulary

```js
{
  name: "stage",
  type: "select", // "select" | "multiselect" | "dateRange"
  label: "Stage",
  placeholder: "All stages",
  chipLabel: "Stage",
  emptyValue: "",
  options: [
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
  ],
}
```

`CollectionFilterControl` also supports `includeAll`, `allValue`, `allLabel`, `fromLabel`, and `toLabel` for advanced cases. Prefer `emptyValue` for new filter configs; the library default is `""` for select filters. Feed keeps its legacy `"all"` empty value internally for compatibility, but custom shared configs should generally use `emptyValue: ""`.

---

## DateRangePicker

HubSpot's CRM filter editor changes the value control based on the selected date operator. `DateRangePicker` follows that pattern: `is` renders a quick-preset `Select`, static comparisons render one date input, rolling comparisons render a number plus unit dropdown, `is between` renders two date inputs with a `to` separator, and known / unknown render no value input. Its `onChange` payload preserves the operator so server-side CRM search builders can distinguish preset, static-date, rolling, explicit-range, and presence filters.

```jsx
import { DateRangePicker } from "hs-uix/common-components";

const [range, setRange] = useState({
  operator: "InRollingDateRange",
  preset: "today",
});

<DateRangePicker
  label="Close date"
  name="close-date"
  value={range}
  onChange={setRange}
  clearable
/>
```

Features:

- **HubSpot-style operator values.** The built-in operators are `InRollingDateRange` (`is`), `Equal` (`is equal to`), `BeforeDateStaticOrDynamic` (`is before`), `AfterDateStaticOrDynamic` (`is after`), `InRange` (`is between`), `GreaterRolling` (`is more than`), `LessRolling` (`is less than`), `Known` (`is known`), and `NotKnown` (`is unknown`).
- **Presets can still resolve to dates.** Picking "Last quarter" includes the computed `{ from, to }` bounds in `meta.range` via `presetToRange`.
- **Compact date inputs by default.** Date inputs use the same no-label treatment as `FilterBuilder` for CRM-filter-style rows. Set `showDateLabels` to `true` to render labels.
- **Only valid explicit ranges escape.** If an `InRange` edit would make `from > to`, the invalid half is held locally with an error message and `onChange` is NOT called until the user fixes either side.
- **Controlled or uncontrolled** via `value` / `defaultValue` / `onChange`.
- **Plain `{ from, to }` compatibility.** Passing the older range shape is treated as `operator: "InRange"`.

| Prop | Type | Default | Notes |
| ---- | ---- | ------- | ----- |
| `value` | operator value | — | Controlled value. Use `{ operator: "InRollingDateRange", preset }`, `{ operator: "Equal", date }`, `{ operator: "BeforeDateStaticOrDynamic", date }`, `{ operator: "AfterDateStaticOrDynamic", date }`, `{ operator: "GreaterRolling", amount, unit, direction }`, `{ operator: "LessRolling", amount, unit, direction }`, `{ operator: "InRange", from, to }`, `{ operator: "Known" }`, `{ operator: "NotKnown" }`, or legacy `{ from, to }`. |
| `defaultValue` | operator value | `{ operator: "InRollingDateRange", preset: "today" }` | Initial value for uncontrolled usage. |
| `onChange` | `(value, meta) => void` | — | Fires with the normalized operator value. `meta` includes `{ operator, field?, preset, range? }`. |
| `label` | `ReactNode` | — | Group label rendered above the control. |
| `name` | `string` | `"date-range"` | Base for inner input names. |
| `field` / `defaultField` | `string` | — | Controlled or uncontrolled selected CRM property when `showFieldSelect` is enabled. |
| `onFieldChange` | `(field) => void` | — | Fires when the field dropdown changes. |
| `showFieldSelect` | `boolean` | `false` | Render a CRM property dropdown before the operator and value controls. |
| `fieldOptions` | array | `[]` | Options for the field dropdown, shaped like `{ label, value }`. |
| `operator` / `defaultOperator` | date operator | — / `"InRollingDateRange"` | Controlled or uncontrolled operator. |
| `showOperatorSelect` | `boolean` | `true` | Render the operator dropdown. |
| `operatorOptions` | array | `DATE_FILTER_OPERATORS` | Override operator labels or available operators. |
| `presets` | `boolean \| array` | `true` | `true` = `HS_DATE_PRESETS`; `false` = no preset Select; or a custom `{ label, value, getRange? }` array — `value` is a `presetToRange` key, or supply `getRange(now)` for fully custom presets. |
| `rollingUnitOptions` | array | `DATE_ROLLING_UNIT_OPTIONS` | Options for the rolling amount unit/direction dropdown. |
| `direction` | `"row" \| "column"` | `"row"` | Layout direction for the operator/value controls. |
| `clearable` | `boolean` | `false` | Show a Clear link when the current operator has a non-empty value. |
| `min` / `max` | date object | — | Passed through to both `DateInput`s. |
| `fromLabel` / `toLabel` / `dateLabel` | `string` | `"Start date"` / `"End date"` / `"Date"` | Date input labels used when `showDateLabels` is true. |
| `showDateLabels` | `boolean` | `false` | Render DateInput labels visibly instead of the compact no-label CRM-filter layout. |
| `format` | `string` | `"medium"` | `DateInput` display format. |
| `presetPlaceholder` | `string` | `"Enter value"` | Placeholder for the preset Select. |
| `customPresetLabel` | `string` | `"Custom"` | Label for the appended Custom option. |
| `clearLabel` | `ReactNode` | `"Clear"` | Clear link text. |
| `invalidRangeMessage` | `string` | `"Start date must be on or before end date"` | Shown on the held invalid input. |
| `readOnly` | `boolean` | `false` | Pass-through to all inner controls (also hides the Clear link). |
| `gap` | `string` | `"xs"` row / `"sm"` column | Flex gap between controls. |
| `gridColumnWidth` | `number` | `260` | Minimum column width for the field-enabled flexible AutoGrid layout. |

### Pure helpers (`dateRangePresets.js`)

- `presetToRange(presetKey, now?)` — translate an `HS_DATE_PRESETS` key into `{ from, to }` HubSpot date objects. Weeks run Sunday–Saturday; `7d`/`30d`/`90d` are rolling windows ending (and including) today; months/quarters/years are full calendar units. Returns `null` for unknown/`"custom"`/empty keys. Pass a fixed `now` Date for determinism.
- `toHsDateValue(date)` — JS `Date` → `{ year, month, date }` (or `null`).
- `compareHsDateValues(a, b)` — sort-style comparator; `null` sides compare as `0`.
- `isValidDateRange(range)` — `true` when open-ended or `from <= to`.
- `DATE_RANGE_CUSTOM_VALUE` — the `"custom"` sentinel used by the preset Select.

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

## Icon

A drop-in superset of HubSpot's native `<Icon>`. The native component is great but boxed in three ways: a fixed `name` whitelist, only 4 colors (`inherit` / `alert` / `warning` / `success`), and only 3 sizes (`small` / `medium` / `large`). `Icon` lifts all three.

When a request is **fully native-expressible** (a whitelisted `name`, a semantic `color`, and an `sm`/`md`/`lg` `size`) it **delegates to the real `<Icon>`** — so you keep native auto-sizing, real `color="inherit"`, and proper screen-reader semantics. Otherwise it falls back to rendering a registered SVG glyph as a data-URI `<Image>`, which is what unlocks custom glyphs, arbitrary colors, and pixel sizes.

```jsx
import { Icon } from "hs-uix/common-components";

// Native-expressible → delegates to HubSpot's <Icon>
<Icon name="email" size="md" color="inherit" />

// Custom glyph + arbitrary color + pixel size → SVG fallback
<Icon name="AdvancedFilters" color="#516f90" size={20} />

// Semantic color on a custom glyph
<Icon name="trophy" color="success" size="lg" screenReaderText="Top performer" />
```

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `name` | string | — | A registered glyph name — native (see `NATIVE_ICON_NAME_LIST`) or custom (see `ICON_NAMES`). An unknown, non-native name renders nothing. |
| `color` | string | `"inherit"` | A semantic token (`inherit` / `alert` / `warning` / `success`) or **any CSS color** (e.g. `#516f90`). Non-semantic colors force the SVG fallback. |
| `size` | t-shirt token \| number | `"md"` | `xs`/`extra-small` (12), `sm`/`small` (14), `md`/`medium` (16), `lg`/`large` (20), `xl`/`extra-large` (24), or a raw pixel number. Only `sm`/`md`/`lg` stay on the native path. |
| `screenReaderText` | string | `name` | Accessible label. On the fallback path it becomes the `<Image alt>`. |

### Custom glyphs & helpers

`ICONS` is the bundled custom-glyph registry (~248 glyphs scraped from HubSpot's web app); `ICON_NAMES` are its keys and `NATIVE_ICON_NAME_LIST` is the native whitelist. To use a glyph the native component doesn't expose, add it to the registry — or build one from a copied `<svg>`:

```js
import { makeIconDataUri, svgToIconEntry } from "hs-uix/common-components";

// Build a data URI directly (returns { src, width, height }, or null for an unknown name)
const { src, width, height } = makeIconDataUri("AdvancedFilters", { size: 20, color: "#516f90" });

// Turn a raw <svg> string into a registry entry (drops <mask>/<defs> and `currentColor`
// fills so `color` can recolor it; keeps explicit fills / fill-rules for multi-color glyphs)
const entry = svgToIconEntry('<svg viewBox="0 0 24 24"><path d="…" /></svg>');
```

**Fallback caveat:** a data-URI glyph can't inherit `currentColor`, so a fallback `Icon` won't auto-match surrounding text color — pass `color` explicitly. For multi-color glyphs, give individual paths their own `fill` in the registry entry; a single `color` prop only recolors paths that don't declare one.

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

## CrmLookupSelect

A CRM-backed `Select` (or `MultiSelect` when `multiple`) that searches live as the user types. It wraps HubSpot's CRM search so you point it at an object type and properties and get a debounced, paginated lookup — no manual data-source wiring.

![CrmLookupSelect live search](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/common-components/assets/crmLookUp.gif)

A picked option stays valid after the live results change (the component remembers selected options internally), it shows `loadingOption` during the debounce window — not just the in-flight request — and only shows `noResultsOption` once a query has settled, so it never flashes "no results" while you're still typing. It fetches the first `pageLength` matches for each query; for custom lookup UIs that need native cursor controls, use `useCrmSearchOptions`, which exposes `pagination` / `hasMore` from HubSpot's fixed `useCrmSearch` response.

```jsx
import { CrmLookupSelect } from "hs-uix/common-components";

<CrmLookupSelect
  objectType="contact"
  properties={["firstname", "lastname", "email"]}
  label="Primary contact"
  value={contactId}
  onChange={setContactId}
  labelProperty={(r) => `${r.firstname} ${r.lastname}`}
  valueProperty="hs_object_id"
  descriptionProperty="email"
/>
```

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `objectType` | string | — | CRM object to search (`"contact"`, `"company"`, `"deal"`, or any object type id/name). |
| `properties` | `string[]` | — | Properties to fetch and search across. |
| `value` / `onChange` | value \| `(value) => void` | — | Controlled selected value(s). |
| `multiple` | boolean | `false` | Render a `MultiSelect` and allow multiple picks. |
| `labelProperty` / `valueProperty` / `descriptionProperty` | string \| `(row) => unknown` | — | How to derive each option's label / value / description from a record. |
| `option` | object | — | Advanced mapping: `{ label, value, description, fallbackLabel, mapOption }` for full control over option shape. |
| `debounce` | number | — | Milliseconds to debounce the search query. |
| `minSearchLength` | number | — | Minimum query length before searching. |
| `pageLength` | number | — | Results fetched per query. |
| `loadingOption` / `noResultsOption` | option | — | Placeholder options shown while debouncing/loading and after an empty settled query. |
| `query` / `onSearchChange` | string \| `(q) => void` | — | Controlled search query. |
| `variant` | `"transparent"` \| `"input"` | — | Visual variant passed to the underlying select. |
| `placeholder`, `description`, `tooltip`, `required`, `readOnly`, `error`, `validationMessage` | — | — | Standard field props forwarded to the native select. |

---

## CrmRecordPicker

The association picker. `CrmLookupSelect` answers "pick ONE record" — `CrmRecordPicker` answers "pick MANY, give me the records back, and let the user create one inline". Use it whenever you're managing a record's associations (contacts on a deal, companies on a ticket) or any selection where you need the full record objects, not just ids.

What you get over a hand-rolled `MultiSelect` + `useCrmSearchOptions`:

- **Selections never vanish.** A selected record stays visible as an option even when the live search page no longer contains it.
- **ids AND records.** `onChange(ids, records)` hands back both — no second fetch to resolve what the user picked. `value` accepts ids, records, or a mix.
- **`max` enforcement.** Picks beyond the cap are rejected (the existing selection is kept), and the create option hides at the cap.
- **Guarded inline create.** With `allowCreate`, a settled search with no exact label match appends `Create "<term>"`; choosing it awaits `onCreate(term)`, selects the result, and merges it into the options. Double-fires are blocked while the create call is pending.

```jsx
import { CrmRecordPicker } from "hs-uix/common-components";

<CrmRecordPicker
  objectType="contact"
  properties={["firstname", "lastname", "email"]}
  label="Associated contacts"
  labelField={(r) => `${r.firstname} ${r.lastname}`}
  descriptionField="email"
  value={contactIds}
  onChange={(ids, records) => {
    setContactIds(ids);
    syncAssociations(records);
  }}
  max={10}
  allowCreate={{
    label: (term) => `Create contact "${term}"`,
    onCreate: async (term) => {
      const created = await hubspot.serverless("createContact", { parameters: { email: term } });
      return created; // record object or its id — both work
    },
  }}
/>
```

Single-select mode (`multi={false}`) behaves like `CrmLookupSelect` but keeps this component's richer API: `onChange(id, record)` with a scalar id (or `null` when cleared), plus `allowCreate` — which `CrmLookupSelect` doesn't have.

### Props

| Prop | Type | Default | Notes |
| ---- | ---- | ------- | ----- |
| `objectType` | string | — | CRM object to search (`"contact"`, `"company"`, `"deal"`, or any object type id/name). |
| `properties` | `string[]` | — | Properties to fetch (drive labels/descriptions). |
| `labelField` | string \| `(record) => unknown` | — | Option label: dotted property path or accessor. Falls back to `name`, `properties.name`, then `fallbackLabel`. |
| `descriptionField` | string \| `(record) => unknown` | — | Option description (omitted when empty). |
| `value` / `defaultValue` | array of ids and/or records (scalar when `multi={false}`) | — | Controlled / uncontrolled selection. Record objects seed the id→record registry. |
| `onChange` | `(ids, records) => void` | — | Multi: arrays. Single: scalar id (or `null`) + record (or `null`). Never-seen ids come back as `{ objectId: id }` stubs. |
| `multi` | boolean | `true` | `MultiSelect` vs `Select`. |
| `max` | number | — | Selection cap. The pick that would exceed it is rejected. |
| `allowCreate` | `false` \| `{ label?, onCreate }` | `false` | `onCreate: async (term) => recordOrId`. `label` is a string or `(term) => string`; default `Create "<term>"`. |
| `filterMap` | `(filters, params) => filterGroups` | — | Scope the search with full HubSpot CRM search syntax (e.g. restrict to a pipeline). |
| `pageLength` | number | `20` | Results fetched per query. |
| `debounce` / `minSearchLength` | number | `300` / `0` | Search tuning. |
| `fallbackLabel` | string | `"Untitled record"` | Label for records whose `labelField` resolves empty. |
| `onSearchChange` | `(query) => void` | — | Observe the live search input. |
| `format` / `baseConfig` | object | — | Advanced passthroughs to the CRM search config. |
| `label`, `name`, `placeholder`, `description`, `tooltip`, `required`, `readOnly`, `error`, `validationMessage`, `variant` | — | — | Standard field props forwarded to the native select; any other props are spread through too. |

The pure decision logic (option merging, max enforcement, create-option rules, id↔record mapping) is exported from `recordPickerCore.js` — `mergePickerOptions`, `enforceSelectionMax`, `shouldShowCreateOption`, `makeCreateOption`, `splitCreateSelection`, `normalizeRecordSelection`, `mapIdsToRecords`, `getRecordId`, `upsertRecords`, `CREATE_OPTION_VALUE` — if you're building a custom picker UI on the same rules.

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

The preset values are stable identifiers (`"today"`, `"7d"`, `"this_quarter"`, etc.). To translate them into actual date bounds, use `presetToRange(presetKey, now?)` from this module (see [DateRangePicker](#daterangepicker)) — or do it yourself via `filterFn` on the filter config / server-side in `onFilterChange`.

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
| `SKELETON_FILL` | `#DFE3EB` | Skeleton placeholder gray |
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
