# Safe wrappers (`hs-uix/safe`)

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](https://github.com/05bmckay/hs-uix/blob/main/LICENSE)

[← All hs-uix components](../../README.md)

Hardened drop-ins for the components that fail worst when given bad props.
HubSpot's primitives have two ugly failure modes:

- **Silent fails** — `Icon` renders *nothing* for an invalid `name` (no error,
  no fallback, just empty space). `StatisticsTrend` rejects any `direction`
  that isn't exactly `"increase"`/`"decrease"`.
- **Throw-blanks-page** — `EmptyState` throws on a bad `imageName`, and
  collection components (`DataTable`, `Select`, …) throw inside HubSpot's
  reconciler when a required array prop arrives `undefined` — which blanks the
  **whole extension** in production.

Every wrapper here keeps the native prop API and turns those failures into
safe degrades plus a **one-time** `console.warn`. They were battle-tested in
[hs-uix-studio](https://github.com/05bmckay/hs-uix-studio)'s renderer, where
LLM-generated UIs hit every one of these traps constantly.

![Safe wrappers repairing an invalid icon and falling back from an invalid EmptyState image](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/safe/assets/showcase-safe-wrappers.jpg)

## Quick Start

```jsx
import {
  SafeIcon,        // bad name → alias repair, else red xCircle placeholder
  SafeEmptyState,  // bad imageName → known alias or "components", not a throw
  SafeDataTable,   // data/columns/… undefined → [] (empty table, not a blank page)
  SafePopover,     // experimental Popover when available, otherwise Modal
} from "hs-uix/safe";

<SafeIcon name="duplicate" />        {/* renders "copy", warns once */}
<SafeEmptyState imageName="new-project" title="Nothing here" />
<SafeDataTable data={rows} columns={columns} />  {/* rows may be undefined while loading */}
```

## What's included

### Repairing wrappers (native components)

| Component | Repairs | Behavior |
|---|---|---|
| `SafeIcon` | `name` | Valid → native pass-through. Known alias (`duplicate`→`copy`, `alert`→`warning`, `trash`→`delete`, …) → repaired with one-time warn. Unknown → alert-colored `xCircle` placeholder with `screenReaderText="Invalid icon: <name>"`. |
| `SafeEmptyState` | `imageName` | `null`/valid → pass-through. Known alias (`new-project`→`components`, …) or unknown → falls back (default `"components"`) instead of throwing. |
| `SafeStatisticsTrend` | `direction` | Valid / non-string → pass-through. Alias (`increasing`, `up`, `positive`, …) → repaired. Unknown string → `"increase"`. |
| `SafePopover` | padding, SDK compatibility | Uses the experimental Popover when available and wraps its children in `<Tile compact>`. If the installed HubSpot SDK does not export Popover, it renders the same content in a native Modal. Set `fallbackTitle` and `fallbackWidth` to customize that modal. |

### Array-coercing wrappers

Required collection props are forced to arrays: `null`/`undefined` → `[]`
silently, any other non-array → `[]` with a one-time warn. The component's own
empty state renders instead of the page blanking. Refs forward through, so
`SafeFormBuilder` keeps FormBuilder's imperative ref API.

| Component | Coerced props |
|---|---|
| `SafeSelect` / `SafeMultiSelect` / `SafeToggleGroup` | `options` |
| `SafeStepIndicator` | `stepNames` |
| `SafeDataTable` | `data`, `columns`, `searchFields`, `filters`, `selectionActions` |
| `SafeKanban` | `data`, `stages` |
| `SafeFormBuilder` | `fields` |
| `SafeAvatarStack` / `SafeKeyValueList` | `items` |
| `SafeFeed` | `items`, `fields` |
| `SafeCalendar` | `events` |
| `SafeCrmKanban` | `cardFields` |

`SafeCrmDataTable.columns` and `SafeCrmKanban.stages` are different: those
props **auto-derive when omitted** (columns from CRM properties, stages from
the batch), and a coerced `[]` would silently turn derivation off. They pass
`null`/`undefined` through untouched, and an invalid non-array is *dropped*
(with a warn) so the derive path takes over.

Wrap anything else yourself:

```js
import { withSafeArrayProps, SAFE_ARRAY_PROPS, SAFE_DERIVE_PROPS } from "hs-uix/safe";

const SafeMyList = withSafeArrayProps(MyList, "MyList", ["entries"]);
// withSafeArrayProps(Component, name, arrayProps, deriveProps?) — the
// SAFE_ARRAY_PROPS / SAFE_DERIVE_PROPS registries hold the lists used above
```

### Catalogs

The validation data is exported for building your own linting/repair layers
(spec validators, codegen checks):

| Export | Contents |
|---|---|
| `NATIVE_ICON_NAMES` | the native `<Icon>` `name` whitelist (190 names) |
| `ICON_NAME_ALIASES` | common mistakes → nearest valid icon |
| `EMPTY_STATE_IMAGES` / `EMPTY_STATE_IMAGE_ALIASES` | valid `imageName` values + repairs |
| `TREND_DIRECTIONS` / `TREND_DIRECTION_ALIASES` | valid `direction` values + repairs |
| `SAFE_ARRAY_PROPS` | required collection props per component |

### Warnings

Each distinct problem warns **once** per session (a bad icon name in a 50-row
table logs one line, not fifty). `resetSafeWarnings()` clears the dedup memory
(useful in tests); `warnOnce(key, message)` is the underlying helper.

## When to use

- Rendering **model-generated or user-configured** UI, where prop values are
  data, not code you control.
- Any surface where `props.data` comes from an async source that can resolve
  `undefined` — the Safe collection components keep the page alive while you
  fix the data path.

If your props are static and hand-written, the natives are fine — these
wrappers add one function call per render and nothing else.
