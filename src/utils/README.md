# Utilities (`hs-uix/utils`)

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](https://github.com/05bmckay/hs-uix/blob/main/LICENSE)

[← All hs-uix components](../../README.md)

Pure helper functions for formatting, mapping, guards, and lightweight data transformations.

## Current modules

- `formatters.js` — number / currency / date / percentage formatters (locale-aware, `Intl`-based)
- `options.js` — build `{ label, value }` option arrays from raw records; resolve labels from values
- `hubspotValues.js` — type guards for HubSpot's `DateInput` / `TimeInput` / `DateTimeInput` value shapes
- `collections.js` — tiny array helpers (`sumBy`)
- `tagVariants.js` — map free-form status strings to semantic tag variants, plus sort comparators keyed by variant
- `viewAdapters.js` — shape transforms between DataTable columns and Kanban cardFields (power a single "same data, different view" toggle)
- `query.js` — shared collection query helpers: empty filter values, filter reset, active-filter chips, filtering, and search
- `crmSearchAdapters.js` — CRM-bound data components (`CrmDataTable`, `CrmKanban`) plus the lower-level CRM search hooks and config builders behind them
- `applyPatches.js` — RFC 6902 JSON Patch applier (add/replace/remove/move/copy) with structural sharing, built for streaming-UI flows

## Purpose

This folder is for non-visual logic only.

Use `utils` when the export is a pure function that helps format values, build config, validate HubSpot-shaped objects, or transform data for display.

## Import path

```js
import {
  // formatters
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatDateTime,
  formatPercentage,
  // options
  buildOptions,
  findOptionLabel,
  // hubspotValues
  isDateValueObject,
  isTimeValueObject,
  isDateTimeValueObject,
  // collections
  sumBy,
  // tagVariants
  getAutoTagVariant,
  getAutoStatusTagVariant,
  getAutoTagDisplayValue,
  createStatusTagSortComparator,
  // viewAdapters
  deriveCardFieldsFromColumns,
  // query
  buildActiveFilterChips,
  resetFilterValues,
  getEmptyFilterValues,
  filterRows,
  searchRows,
  // crmSearchAdapters
  CrmDataTable,
  CrmKanban,
  useCrmSearchDataSource,
  useCrmSearchOptions,
  makeCrmSearchSelectField,
  makeCrmSearchMultiSelectField,
} from "hs-uix/utils";
```

---

## formatters.js

All formatters are pure `Intl.NumberFormat` / `toLocaleString` wrappers. Every option accepts a trailing `options` object that spreads into the underlying `Intl` call, so anything `Intl.NumberFormat` supports (narrow symbol, specific fraction digits, grouping) is reachable.

Defaults: `locale = "en-US"`, `currency = "USD"`. All formatters treat `null` / `undefined` as `0` or `""` so they're safe to use on partially-loaded data.

### `formatCurrency(value, opts?)`

Standard currency with no fractional digits by default.

```js
formatCurrency(1234.56)           // → "$1,235"
formatCurrency(1234.56, { maximumFractionDigits: 2 }) // → "$1,234.56"
formatCurrency(9500, { currency: "EUR" })             // → "€9,500"
formatCurrency(null)              // → "$0"
```

| Option | Default | Notes |
| ------ | ------- | ----- |
| `locale` | `"en-US"` | Any `Intl` locale tag |
| `currency` | `"USD"` | ISO 4217 code |
| `maximumFractionDigits` | `0` | Set to `2` for cents |
| _any `Intl.NumberFormat` option_ | — | Spreads through |

### `formatCurrencyCompact(value, opts?)`

Same as `formatCurrency` but uses compact notation — the `$123.58M / $4.16K / $32` shorthand HubSpot uses for headline numbers (deal totals, pipeline value). Good for metric panels where the raw figure would dominate.

```js
formatCurrencyCompact(123_580_000)    // → "$123.6M"
formatCurrencyCompact(4160)           // → "$4.2K"
formatCurrencyCompact(32)             // → "$32"
formatCurrencyCompact(12_000, { compactDisplay: "long" }) // → "$12 thousand"
```

| Option | Default | Notes |
| ------ | ------- | ----- |
| `locale`, `currency` | (as above) | — |
| `maximumFractionDigits` | `1` | One fractional digit reads cleanly across magnitudes |
| `compactDisplay` | `"short"` | `"short"` → M / K, `"long"` → million / thousand |

### `formatDate(value, opts?)`

Accepts a `Date`, ISO string, or timestamp; returns a formatted date string. Invalid/null input returns `""`.

```js
formatDate(new Date(2026, 3, 15))             // → "Apr 15, 2026"
formatDate("2026-04-15")                      // → "Apr 15, 2026"
formatDate(Date.now(), { month: "numeric" }) // → "4/15/2026"
formatDate(null)                              // → ""
```

Defaults: `month: "short"`, `day: "numeric"`, `year: "numeric"`.

### `formatDateTime(value, opts?)`

Same as `formatDate` but includes time of day.

```js
formatDateTime(new Date(2026, 3, 15, 14, 30))   // → "Apr 15, 2026, 2:30 PM"
formatDateTime("2026-04-15T14:30:00Z")          // → "Apr 15, 2026, 9:30 AM" (local)
```

Defaults add `hour: "numeric"`, `minute: "2-digit"` to the date options.

### `formatPercentage(value, opts?)`

Takes a **ratio** (0.15 = 15%), not a percentage number.

```js
formatPercentage(0.15)                                  // → "15%"
formatPercentage(0.1567, { maximumFractionDigits: 1 }) // → "15.6%"
formatPercentage(1)                                     // → "100%"
```

---

## options.js

### `buildOptions(items, opts?)`

Map a raw array into the `{ label, value }` shape every HubSpot `Select` / `MultiSelect` expects. Supports custom key names, map functions, and optional `description` passthrough.

```js
buildOptions(["Draft", "Published"])
// → [{ label: "Draft", value: "Draft" }, { label: "Published", value: "Published" }]

buildOptions(
  [{ name: "Acme", id: 1 }, { name: "Globex", id: 2 }],
  { labelKey: "name", valueKey: "id" }
)
// → [{ label: "Acme", value: 1 }, { label: "Globex", value: 2 }]

buildOptions(users, {
  mapLabel: (u) => `${u.firstName} ${u.lastName}`,
  mapValue: (u) => u.id,
  mapDescription: (u) => u.email,
})
// → [{ label: "Alex Rivers", value: 101, description: "alex@..." }, ...]
```

### `findOptionLabel(options, value, fallback?)`

Reverse lookup — find the display label for a value in an options array.

```js
const OPTS = [{ label: "High", value: "h" }, { label: "Low", value: "l" }];
findOptionLabel(OPTS, "h")           // → "High"
findOptionLabel(OPTS, "x", "—")     // → "—"
```

---

## hubspotValues.js

Type guards for HubSpot's structured date/time value objects (as emitted by `DateInput`, `TimeInput`, `DateTimeInput`). Use in `filterFn`, `sortComparator`, or anywhere you need to distinguish a HubSpot date-object from a raw string/Date.

```js
isDateValueObject({ year: 2026, month: 3, date: 15 })       // → true
isDateValueObject("2026-04-15")                              // → false
isTimeValueObject({ hours: 14, minutes: 30 })               // → true
isDateTimeValueObject({ date: { year: ... }, time: { ... } }) // → true
```

---

## collections.js

### `sumBy(items, keyOrFn)`

Sum a numeric property (by key name or accessor fn) across an array. Non-numeric / missing values count as 0.

```js
sumBy(deals, "amount")                   // → sum of all amounts
sumBy(deals, (d) => d.amount * d.probability) // → weighted sum
sumBy(null, "amount")                     // → 0
```

---

## tagVariants.js

Heuristic mappers from free-form status strings to semantic tag variants. Used internally by `AutoTag` / `AutoStatusTag`, exported so you can reuse the logic in custom cells, sort comparators, etc.

### `getAutoTagVariant(value, opts?)`

Returns a `Tag` variant — `"success" | "warning" | "error" | "info" | "default"`.

```js
getAutoTagVariant("Active")         // → "success"
getAutoTagVariant("At risk")        // → "warning"
getAutoTagVariant("Failed")         // → "error"
getAutoTagVariant("New")            // → "info"
getAutoTagVariant("Wibble")         // → "default"
```

Pass `overrides` to force specific values to specific variants, and `fallback` to change the default-case variant.

```js
getAutoTagVariant("Processing", {
  overrides: { Processing: "warning" },
  fallback: "info",
})
// → "warning"
```

Matches are case-insensitive and tolerant of underscores / dashes / multi-word phrases (`"in_progress"`, `"on hold"`, `"at-risk"` all resolve).

### `getAutoStatusTagVariant(value, opts?)`

Same as `getAutoTagVariant`, but returns `"danger"` instead of `"error"` (for the `StatusTag` component, which uses the `danger` naming).

### `getAutoTagDisplayValue(value)`

Normalizes booleans to `"True"` / `"False"`; passes through everything else unchanged. Used when the tag display text needs to be a string but the raw value is a bool.

### `createStatusTagSortComparator(opts?)`

Builds a sort comparator keyed by the resolved StatusTag variant, then alphabetically within each color group. Drop-in for a `DataTable` column's `sortComparator`.

```js
import { createStatusTagSortComparator } from "hs-uix/utils";

<DataTable
  columns={[
    {
      field: "status",
      sortable: true,
      sortComparator: createStatusTagSortComparator(),
    },
  ]}
/>
```

Default variant ordering: `success → warning → danger/error → info → default`. Override via `variantOrder`, or supply `getLabel` for custom tie-breaking.

---

## viewAdapters.js

Shape transforms for powering "same data, toggle between table and kanban" views. The state props on `DataTable` and `Kanban` are already wire-compatible (data, search, filters, selection, loading, error) — these adapters handle the one part that isn't: the rendering config.

### `deriveCardFieldsFromColumns(columns, opts?)`

Convert a `DataTable` columns config into a ready-to-use Kanban `cardFields` array.

**The common case** — share state, derive card fields from the same columns config:

```jsx
import { DataTable } from "hs-uix/datatable";
import { Kanban } from "hs-uix/kanban";
import { deriveCardFieldsFromColumns } from "hs-uix/utils";

const COLUMNS = [
  { field: "name",      label: "Deal name",   sortable: true, renderCell: (v, row) => <Link href={`/deal/${row.id}`}>{v}</Link> },
  { field: "owner",     label: "Deal owner",  sortable: true },
  { field: "amount",    label: "Amount",      renderCell: (v) => formatCurrency(v) },
  { field: "closeDate", label: "Close date",  sortable: true },
];

const CARD_FIELDS = deriveCardFieldsFromColumns(COLUMNS, {
  titleField: "name",
  titleHref: (row) => ({ url: `https://app.hubspot.com/deals/0/deal/${row.id}` }),
});

const [view, setView] = useState("table");

const shared = { data, rowIdField: "id", searchFields: ["name", "owner"], filters, selectable: true, ... };

return view === "table"
  ? <DataTable {...shared} columns={COLUMNS} />
  : <Kanban    {...shared} stages={STAGES} groupBy="status" cardFields={CARD_FIELDS} />;
```

### Default mapping

| DataTable column | Kanban cardField |
| ---------------- | ---------------- |
| first column (or `opts.titleField`) | `placement: "title"` |
| every other column | `placement: "body"` |
| `col.label` | `field.label` |
| `col.field` | `field.field` + `field.key` |
| `col.renderCell(v, row)` | `field.render(v, row)` |
| `col.truncate` | `field.truncate` |
| `col.sortable`, `col.sortComparator`, `col.width`, `col.cellWidth`, `col.align`, `col.description`, `col.editable`/`col.edit*` | **dropped** — table-only concepts |

### Options

| Option | Type | Description |
| ------ | ---- | ----------- |
| `titleField` | `string` | Which column's `field` becomes `placement: "title"`. Default: first filtered column. |
| `titleHref` | `(row) => string \| { url, external? }` | Optional href factory applied to the title field only. Turns the title into a `<Link>` in the card. |
| `placements` | `Record<string, "title" \| "subtitle" \| "meta" \| "body" \| "footer">` | Per-field placement overrides keyed by `field` name. Wins over `titleField`. |
| `exclude` | `string[]` | Field names to drop entirely (e.g. `["internalId", "debugMeta"]`). |
| `include` | `string[]` | Whitelist. If provided, only these fields are emitted. Applied before `exclude` logic. |
| `maxBodyFields` | `number` | Cap on `placement: "body"` entries emitted. 3–5 is typical for cards — anything more hurts legibility at 350px column widths. |

### Examples

**Put some columns in the card footer instead of the body:**

```jsx
const CARD_FIELDS = deriveCardFieldsFromColumns(COLUMNS, {
  titleField: "name",
  placements: {
    name:   "title",
    owner:  "subtitle",
    amount: "footer",   // render bottom-right, next to actions
  },
});
```

**Skip table-only columns that don't make sense on a card:**

```jsx
const CARD_FIELDS = deriveCardFieldsFromColumns(COLUMNS, {
  exclude: ["lastModifiedBy", "internalNotes", "hubspotScore"],
  titleField: "name",
});
```

**Cap the card body to 3 fields (rest are dropped from the card view):**

```jsx
const CARD_FIELDS = deriveCardFieldsFromColumns(COLUMNS, {
  titleField: "name",
  maxBodyFields: 3,
});
```

**Full explicit mapping — no heuristics:**

```jsx
const CARD_FIELDS = deriveCardFieldsFromColumns(COLUMNS, {
  include: ["name", "owner", "amount"],
  placements: {
    name:   "title",
    owner:  "body",
    amount: "footer",
  },
});
```

### What it intentionally doesn't do

- **Add selectable action buttons to the card footer.** Use `<KanbanCardActions>` explicitly for those — they're not derivable from table columns.
- **Port `renderCell` that assumes a table context** (e.g. returns `<TableCell>` elements). If your renderer targets a `<td>`-shaped cell, it'll need a card-compatible version. Plain value formatters and `<Link>` / `<Tag>` / `<Text>` renderers carry over fine.
- **Adapt sort.** DataTable's per-column sort (click column header) and Kanban's board-wide `sortOptions` are different models — you still maintain a separate `sortOptions` array for Kanban.

See also: [Kanban SPEC § cardFields](../kanban/SPEC.md#44-card-rendering--declarative-vs-render-prop).

---

## query.js

Shared query helpers for collection-style views. These are the same primitives used internally by DataTable, Kanban, Calendar, and Feed's active-filter chips.

```js
import {
  buildActiveFilterChips,
  resetFilterValues,
  getEmptyFilterValues,
  filterRows,
  searchRows,
} from "hs-uix/utils";

const [filterValues, setFilterValues] = useState(() => getEmptyFilterValues(filters));
const activeChips = buildActiveFilterChips(filters, filterValues);

const clearFilter = (key) => {
  setFilterValues((prev) => resetFilterValues(filters, prev, key));
};

const visibleRows = searchRows(
  filterRows(rows, filters, filterValues),
  search,
  ["name", "email"]
);
```

### `getEmptyFilterValues(filters, opts?)`

Builds a `{ [filter.name]: emptyValue }` object from a filter config list. Defaults are `""` for select filters, `[]` for multiselect, and `{ from: null, to: null }` for date ranges. A filter-level `emptyValue` overrides the select default; pass `getEmptyValue` for broader custom dialects such as Feed's legacy `"all"` empty select value.

### `resetFilterValues(filters, values, key, opts?)`

Returns a new values object with either one filter reset or all filters reset when `key === "all"`.

### `buildActiveFilterChips(filters, values, opts?)`

Returns `[{ key, label }]` descriptors for active filters. Supports select labels, multiselect joined labels, date range labels, custom active detection, and custom date formatting.

### `filterRows(rows, filters, values)` / `searchRows(rows, term, fields, opts?)`

Pure in-memory filtering/search helpers used by DataTable, Kanban, and Calendar. Feed intentionally keeps its own row pipeline because it supports path/accessor-based values and string-coercing equality.

---

## crmSearchAdapters.js

CRM-bound data components and the search plumbing behind them. `CrmDataTable` and `CrmKanban` are the high-level entry points — point them at a CRM `objectType` + `properties` and you get a fully wired table or board with no manual data-source code.

### Pagination model

By default both components **fetch one batch (`pageLength`, default 100) and do search / sort / filter / pagination client-side** — a single request, no refetch per interaction, and pagination "just works" via in-memory slicing. When the result set exceeds the batch they show a "first N of M" note rather than silently showing a partial view. Pass **`serverSide`** to force search/filter/sort to run as fresh CRM queries from the first render. A built-in sort translator maps the active column/board sort to CRM `sorts` (honoring `propertyMap`) in server-query mode, so you don't hand-write a `sortMap`.

HubSpot fixed the `useCrmSearch().pagination.nextPage()` offset issue in platform `2026.03`; the lower-level hooks now also expose `pagination` / `hasMore` from the native response for custom views. `CrmDataTable` now uses that native cursor to lazy-load additional batches: with `pageLength={100}` and `pageSize={10}`, clicking table page 11 fetches the next CRM batch and appends it before rendering that page. `CrmKanban` exposes the same batch loading through its column `Load more` affordance when more CRM results are available.

> Note: these are JSX components that live in `utils` because they're CRM-data adapters; the underlying `useCrmSearch*` hooks live here too.

### `CrmDataTable`

A `DataTable` bound to CRM search. Accepts all `DataTable` props except the data-source ones it manages for you (`data`, `loading`, `error`, `searchValue`, `onParamsChange`).

```jsx
import { CrmDataTable } from "hs-uix/utils";

<CrmDataTable
  objectType="deal"
  properties={["dealname", "amount", "dealstage", "closedate"]}
  columns={[
    { field: "dealname", label: "Deal", sortable: true },
    { field: "amount", label: "Amount", renderCell: (v) => formatCurrency(v) },
    { field: "dealstage", label: "Stage" },
  ]}
  searchFields={["dealname"]}
  autoFilters={["dealstage"]}
/>
```

### `CrmKanban`

The board analog of `CrmDataTable`. `stages` is optional — pass it for real pipeline labels, or let stages auto-derive from the batch (labelled via `stageLabels`).

```jsx
import { CrmKanban } from "hs-uix/utils";

<CrmKanban
  objectType="deal"
  properties={["dealname", "amount", "dealstage"]}
  groupBy="dealstage"
  stageLabels={{ appointmentscheduled: "Appointment", qualifiedtobuy: "Qualified" }}
  cardFields={[
    { field: "dealname", placement: "title" },
    { field: "amount", placement: "meta", render: (v) => formatCurrency(v) },
  ]}
/>
```

### Shared props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `objectType` | string | — | CRM object to query (`"contact"`, `"company"`, `"deal"`, or any object type id/name). |
| `properties` | `string[]` | — | CRM properties to fetch. |
| `pageLength` | number | `100` | Batch size fetched per query. |
| `serverSide` | boolean | `false` | Force search/filter/sort to refetch from CRM instead of waiting until the first batch is capped. Table/board pagination stays client-side over loaded rows, and loads the next CRM cursor batch as needed. |
| `autoFilters` | `boolean \| string[] \| { fields? }` | — | Auto-generate select filters from properties (optionally capped by `autoFilterMaxOptions`). |
| `propertyMap` | `Record<string,string>` | — | Map your field names to CRM property names (used for sorts/filters). |
| `filterMap` / `sortMap` | fn | — | Advanced overrides for translating filters/sorts to CRM config. |
| `searchFields` | `string[]` | — | Fields the search box queries. |
| `mapRecord` | `(record) => Row` | — | Customize how a raw CRM record becomes a row. |
| `dataTableProps` / `kanbanProps` | object | — | Escape hatch to pass anything straight through to the underlying `DataTable` / `Kanban`. |

`CrmKanban` additionally takes `groupBy` (required), `stages` (optional), and `stageLabels`.

### Lower-level building blocks

If you need to drive a custom view, the hooks and helpers are exported directly:

- `useCrmSearchDataSource(params, options)` — the hook both components use; returns `{ data, loading, error, totalCount, pagination, hasMore, ... }` for a CRM search.
- `useCrmSearchOptions(params, options)` — CRM search shaped into `{ label, value }` options for a `Select`.
- `buildCrmSearchConfig(params, options)` — build the CRM search request config (appends a stable `hs_object_id` sort tiebreaker so cursor paging is deterministic).
- `normalizeCrmSearchRecord` / `normalizeCrmSearchRows` — flatten raw CRM responses into plain rows.
- `crmSearchResultToOption` — map a single CRM record into an option.
- `makeCrmSearchSelectField` / `makeCrmSearchMultiSelectField` — build FormBuilder field configs backed by CRM search.
- `resolveCrmObjectType` — normalize object-type aliases (`"contact"` ↔ `"contacts"`, etc.).

---

## applyPatches.js

RFC 6902 JSON Patch applier — the minimal subset that streaming UIs need.
Supported ops: `add`, `replace`, `remove`, `move`, `copy`; anything else
(including `test`) is skipped with a console warning.

### `applyPatches(doc, patches)`

```js
import { applyPatches } from "hs-uix/utils";

const doc = { meta: { title: "Dashboard" }, rows: [] };

const next = applyPatches(doc, [
  { op: "replace", path: "/meta/title", value: "Pipeline" },
  { op: "add", path: "/rows/-", value: { id: "r1" } },
]);
// → { meta: { title: "Pipeline" }, rows: [{ id: "r1" }] }

next === doc;          // → false (never mutates input)
next.meta === doc.meta; // → false (changed branch)
```

Behavior worth knowing:

| Behavior | Detail |
|---|---|
| Immutability | Returns a **new** document; untouched branches keep reference equality (structural sharing), so memoized renderers only re-render what changed. |
| Permissive paths | Where RFC 6902 would error on a missing path prefix, `add`/`replace` create it — objects by default, arrays when the next segment is numeric or `-`. Built for patch streams where `/elements/x/props` can arrive before `/elements`. |
| Root pointer | `path: ""` (or `"/"`) replaces the whole document. |
| Array `add` vs `replace` | Per RFC 6902, `add` at an existing index **inserts** (shifts the rest right); `replace` overwrites in place. The standard `-` index appends (`{ op: "add", path: "/rows/-", value }`). |
| Array `remove` | An invalid or out-of-range index (`/rows/-`, `/rows/foo`, `/rows/99`) is a safe no-op — same spirit as removing a missing object key. |
| Escaping | Standard RFC 6901 unescaping: `~1` → `/`, `~0` → `~`. |
| `copy` / `move` | `copy` deep-clones the source (JSON-safe values only — no `Date`/`Map`/`Set`). Pointers resolve own properties only, so `/constructor`-style segments read as missing instead of leaking functions into the document. |
| Null doc | `applyPatches(null, patches)` starts from `{}`. Empty/missing `patches` returns the input as-is. |

---

## Guidelines

- Keep helpers pure and side-effect free
- Prefer small focused utilities over broad catch-all helpers
- Put JSX wrappers in `src/common-components/`
- All formatters accept a trailing options object that spreads into the underlying `Intl` call — reach for that before inventing a new formatter
