# Safe wrappers (`hs-uix/safe`)

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

## Quick Start

```jsx
import {
  SafeIcon,        // bad name → alias repair, else red xCircle placeholder
  SafeEmptyState,  // bad imageName → known alias or "components", not a throw
  SafeDataTable,   // data/columns/… undefined → [] (empty table, not a blank page)
  SafePopover,     // children auto-padded in a compact Tile
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
| `SafePopover` | padding | Wraps children in `<Tile compact>` so popover content gets default padding (the experimental Popover renders children flush). Nesting your own Tile still works. |

### Array-coercing wrappers

Required collection props are forced to arrays: `null`/`undefined` → `[]`
silently, any other non-array → `[]` with a one-time warn. The component's own
empty state renders instead of the page blanking.

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
| `SafeCrmDataTable` | `columns` |
| `SafeCrmKanban` | `stages`, `cardFields` |

Wrap anything else yourself:

```js
import { withSafeArrayProps, SAFE_ARRAY_PROPS } from "hs-uix/safe";

const SafeMyList = withSafeArrayProps(MyList, "MyList", ["entries"]);
// SAFE_ARRAY_PROPS holds the per-component prop lists used above
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
