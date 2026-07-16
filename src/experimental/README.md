# experimental (`hs-uix/experimental`)

APIs that are shipping for real-world feedback but whose surface may still
change in a minor release. Graduating components move to a stable subpath or
barrel with compatibility re-exports left here for at least one minor version.
See the [experimental graduation audit](../../docs/experimental-graduation-audit.md)
for current decisions, blockers, and migration policies.

Currently here:

- **`Wizard` / `OnboardingChecklist`** — available only from this experimental
  subpath; a future graduation would add `hs-uix/wizard`.
- **`ExperimentalDataTable`** — an alias of DataTable with the in-progress
  row-expansion API documented and typed experimentally.
- **`Skeleton`** (+ `SkeletonText`, `SkeletonBox`, `SkeletonCircle`,
  `SkeletonTable`, `makeSkeletonDataUri`, `SKELETON_WIDTH_TOKENS`) — loading
  placeholders, documented below.

---

## Skeleton

Content placeholders for loading states. `Spinner` says "something is
happening"; `Skeleton` holds the **shape** of the incoming content so the
layout doesn't jump when data lands. There is no native skeleton component and
CSS is forbidden, so each placeholder is a gray rounded-rect SVG data URI
rendered through the native `<Image>` — the same technique as `StyledText` and
`AvatarStack`.

One component, two modes.

### Wrapper mode (auto) — the default way to use it

Wrap any surface, pass `loading`, done. While loading, `Skeleton` never
renders its children — it reads each child element's component name and props
and draws a placeholder with the same footprint; when `loading` flips false
the children render untouched.

```jsx
import { Skeleton } from "hs-uix/experimental";

<Skeleton loading={isLoading}>
  <DataTable data={rows} columns={COLUMNS} pageSize={10} />
</Skeleton>
// while loading → a 10-row table skeleton with COLUMNS.length columns
```

Recognized children and what sizes their placeholder:

| Child | Shape | Sized from |
|---|---|---|
| `DataTable` / `CrmDataTable` | table rows | `columns.length` / `properties.length`, `pageSize` |
| native `Table` | table rows | 4 × 3 default |
| `Kanban` / `CrmKanban` | board columns of cards | `stages.length` |
| `Feed` | avatar + text rows | `pageSize` |
| `FormBuilder` / native `Form` | label + input rows | `fields.length` |
| `KeyValueList` / `DescriptionList` | label/value pairs | `items.length` / child count |
| native `Statistics` | metric blocks | child count |
| native field inputs (`Select`, `Input`, `DateInput`, …) | one label + input row | — |
| `Button` / `Tag` / `StatusTag` | small pill | — |
| `BarChart` / `LineChart` / `Calendar` / `Tile` / `Card` / `Image` / … | block | chart/image height |
| `Text` / `Heading` / `List` | text lines | child count |
| anything else | text block | `lines` (default 3) |

Native components work because they are remote *string* types (`"Table"`,
`"Select"`) — the element type is the name. hs-uix components carry explicit
`displayName`s, so matching survives minified bundles.

Overrides, when the inference isn't what you want:

```jsx
// Pick the shape yourself…
<Skeleton loading={isLoading} variant="board" columns={4}>…</Skeleton>

// …or supply your own static blocks
<Skeleton
  loading={isLoading}
  skeleton={
    <Flex direction="column" gap="md">
      <SkeletonBox height={48} />
      <SkeletonText lines={4} />
    </Flex>
  }
>
  <MyCustomPanel … />
</Skeleton>
```

`variant` replaces the inferred shape (`"table" | "board" | "list" | "form" |
"keyvalue" | "stats" | "input" | "chip" | "block" | "text" | "box" |
"circle"`); `rows` / `columns` / `lines` / `height` refine it. Multiple
children each get their own skeleton, stacked in a column.

### Static mode — the building blocks

Without children, `Skeleton` is the placeholder primitive itself, and the
composite shapes work standalone too:

```jsx
import {
  Skeleton,
  SkeletonText,
  SkeletonBox,
  SkeletonCircle,
  SkeletonTable,
} from "hs-uix/experimental";

{loading ? <SkeletonText lines={3} width="md" /> : <Text>{description}</Text>}

<Flex direction="row" gap="sm" align="center">
  <SkeletonCircle size={32} />
  <SkeletonText lines={2} width="sm" height={10} gap={6} />
</Flex>

<SkeletonTable rows={5} columns={4} />
<Skeleton variant="board" columns={3} />   {/* composite variants work statically */}
```

| Prop | Type | Default | Notes |
| ---- | ---- | ------- | ----- |
| `loading` | boolean | `false` | Wrapper mode: gate for `children`. |
| `skeleton` | node | — | Wrapper mode: your own placeholder; skips inference. |
| `variant` | shape | `"text"` | Static shape, or inference override in wrapper mode. |
| `width` | px \| `"sm"`\|`"md"`\|`"lg"` | varies | Tokens = 120 / 240 / 360 (`SKELETON_WIDTH_TOKENS`). |
| `height` | px | varies | Line height (text), block height (box), diameter (circle). |
| `lines` / `rows` / `columns` | number | varies | Sizing for text / composite shapes. |
| `lastLineWidth`, `gap`, `radius`, `columnGap`, `fill`, `alt` | — | — | Primitive styling (see JSDoc). |

`makeSkeletonDataUri(opts)` returns `{ src, width, height }` for composing
placeholders into larger SVGs.
