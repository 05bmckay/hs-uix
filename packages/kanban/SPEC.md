# Kanban — Spec

Status: draft
Target: `hs-uix/kanban` (single-file React component, same shape as `DataTable` and `FormBuilder`)

---

## 1. Goals

Bring HubSpot's native kanban ergonomics (Deals "Board view") to UI Extensions without requiring drag-and-drop, which the extension runtime doesn't expose. Developers supply data + a column (stage) definition; the component handles layout, toolbar, per-column aggregation, card density, and stage transitions through an explicit control (Select/menu), not drag.

Non-goals for v0.1:
- HTML5 drag-and-drop (unavailable in UI Extensions).
- Per-card inline editing beyond the stage transition. Cards are read-mostly; the consumer routes to the CRM record for edits.
- Swimlanes (secondary grouping). On the roadmap; left out of v0.1 to keep scope tight.

---

## 2. Conventions inherited from DataTable / FormBuilder

These are hard requirements — a Kanban that diverges will feel foreign in a mixed app.

| Convention | Source | Applied to Kanban |
|---|---|---|
| Single `.jsx` file under `packages/<name>/src/<Component>.jsx` | Both | `packages/kanban/src/Kanban.jsx` |
| Hand-written `index.d.ts` at package root | Both | `packages/kanban/index.d.ts` |
| Peer deps only: `react`, `@hubspot/ui-extensions` | Both | Same |
| No external utility libs (no lodash/date-fns) | Both | Same |
| `data` + `columns` array-of-objects config | DataTable | `data` + `stages` |
| `renderCell` per column; full-row escape via `renderRow` | DataTable | `renderCard` per stage (global default) + per-stage override |
| Controlled/uncontrolled dual mode using `prop ?? internal` | Both | Applied to `filterValues`, `searchValue`, `collapsedStages`, `sort` |
| `filters` prop: `select` / `multiselect` / `dateRange`, inline-then-overflow | DataTable | Same |
| `labels` bag for i18n of every hardcoded string | Both | Same shape |
| `render{Empty,Loading,Error}State` escape hatches | DataTable | Same + `renderColumn`, `renderCard`, `renderToolbar` |
| Section-banner comments inside the component file | Both | Same |
| Inline `// comment` on each prop declaration | Both | Same |
| Dual ESM+CJS via tsup; `"files": ["dist", "index.d.ts", "README.md"]` | Both | Same |

---

## 3. Core mental model

> **A Kanban is a DataTable grouped by a stage field, where each group renders as a vertical stack of cards instead of rows, plus a stage-change control on each card.**

That framing drives the API: anything DataTable does (search, filter, sort, server-side, loading/error/empty, labels) should have a near-identical prop on Kanban. The new surface area is:

1. `stages` — the ordered column list (not just values found in data).
2. `groupBy` — how a row maps to a stage (defaults to `field: "status"`).
3. `renderCard` — per-card renderer (like `renderCell`, but for the whole card).
4. `onStageChange` — commit callback when a user moves a card.
5. Column footer / aggregation per stage (like DataTable's column `footer`).

Everything else is DataTable under a different layout.

---

## 4. Public API (v0.1)

### 4.1 Main props

```ts
interface KanbanProps<Row, Id = string | number> {
  // --- Data ---
  data: Row[];
  stages: KanbanStage<Row>[];                  // ordered columns
  groupBy?: string | ((row: Row) => string);   // default: "status"
  rowIdField?: string;                         // default: "id"

  // --- Card rendering ---
  renderCard?: (row: Row, context: CardRenderContext<Row>) => ReactNode;
  cardFields?: KanbanCardField<Row>[];         // declarative alternative to renderCard
  cardDensity?: "compact" | "comfortable";     // default: "compact"
  cardDividers?: boolean | KanbanCardDividers; // default: false. `true` = dividers at every seam. Object = per-seam toggle.
  cardBodyAs?: "descriptionList" | "stack";    // default: "descriptionList" — aligns labels across cards for consistent height
  titleLinkExternal?: boolean;                 // default: false — title-as-Link never renders the external-link glyph
  maxCardsPerColumn?: number;                  // default: 10 (then "Show more")
  maxCardsExpanded?: number;                   // default: 50
  expandedStages?: string[];                   // controlled
  onExpandedStagesChange?: (stages: string[]) => void;

  // --- Selection (per-card checkbox, top-right) ---
  selectable?: boolean;                        // default: false
  selectedIds?: Id[];                          // controlled
  onSelectionChange?: (selectedIds: Id[]) => void;
  selectionActions?: KanbanSelectionAction<Id>[];  // bulk-action bar above the board when any selected
  recordLabel?: { singular: string; plural: string };
  selectionResetKey?: unknown;
  resetSelectionOnQueryChange?: boolean;       // default: true

  // --- Per-stage pagination (server-side friendly) ---
  stageMeta?: Record<string, KanbanStageMeta>; // per-stage hasMore / totalCount / loading
  onLoadMore?: (stage: string) => void;        // fires when column's load-more is clicked
  loadMoreLabel?: string | ((stage: KanbanStage<Row>, meta?: KanbanStageMeta) => string);

  // --- Stage transitions ---
  stageControl?: "select" | "menu" | "none";   // default: "menu" in compact, "select" in comfortable
  onStageChange?: (row: Row, newStage: string, oldStage: string, result?: { extraProperties?: Record<string, unknown> }) => void | Promise<unknown>;
  isStageChanging?: (row: Row) => boolean;     // caller-owned pending flag per card
  canMove?: (row: Row, toStage: string) => boolean;  // disables invalid targets

  // --- Toolbar (same shape as DataTable) ---
  searchFields?: string[];                     // required to enable search behavior and render the search input
  searchPlaceholder?: string;
  fuzzySearch?: boolean;
  filters?: DataTableFilterConfig<Row>[];      // reuse the exact type
  showFilterBadges?: boolean;
  filterInlineLimit?: number;                  // default 2

  // --- Sort (applies within each column) ---
  sortOptions?: KanbanSortOption<Row>[];       // dropdown options; required if sortable
  defaultSort?: string;                        // a sortOptions `value`
  sort?: string;                               // controlled
  onSortChange?: (value: string) => void;

  // --- Column-level aggregation ---
  columnFooter?: (rows: Row[], stage: KanbanStage<Row>) => ReactNode;
  showColumnCount?: boolean;                   // default: true

  // --- Column collapse / hide ---
  collapsedStages?: string[];                  // controlled
  onCollapsedStagesChange?: (stages: string[]) => void;
  stagePickerLabel?: string;                   // overflow menu label, default "Columns"
  showStagePicker?: boolean;                   // default: true when stages.length > 5

  // --- Appearance ---
  columnWidth?: number;                        // default: 300 (px) — AutoGrid minimum per column, flexible=true
  columnMaxWidth?: number;                     // default: none
  scrollable?: boolean;                        // default: true (horizontal scroll)

  // --- State props (mirror DataTable) ---
  serverSide?: boolean;
  loading?: boolean;
  error?: string | boolean;
  totalCount?: number;
  searchValue?: string;
  filterValues?: Record<string, unknown>;
  onSearchChange?: (term: string) => void;
  onFilterChange?: (values: Record<string, unknown>) => void;
  onParamsChange?: (params: KanbanParams) => void;
  searchDebounce?: number;                     // default: 250

  // --- Labels (i18n) ---
  labels?: KanbanLabels;

  // --- Escape hatches ---
  renderToolbar?: (ctx: ToolbarRenderContext) => ReactNode;
  renderColumn?: (ctx: ColumnRenderContext<Row>) => ReactNode;
  renderColumnHeader?: (ctx: ColumnHeaderRenderContext<Row>) => ReactNode;
  renderEmptyState?: (ctx: EmptyStateRenderContext) => ReactNode;
  renderEmptyColumn?: (ctx: { stage: KanbanStage<Row> }) => ReactNode;
  renderLoadingState?: (ctx: LoadingStateRenderContext) => ReactNode;
  renderErrorState?: (ctx: ErrorStateRenderContext) => ReactNode;
}
```

### 4.1a Card divider config

```ts
interface KanbanCardDividers {
  afterTitle?: boolean;     // between title row and body
  afterSubtitle?: boolean;  // only rendered when subtitle is present (comfortable density)
  afterBody?: boolean;      // between body and footer
  afterFooter?: boolean;    // below footer, above a full-width stage control (comfortable with stageControl="select")
}
```

Dividers are opt-in per seam. `cardDividers={true}` is sugar for all four true; `cardDividers={false}` (default in compact) is all four false. An object lets a caller mix — e.g. `cardDividers={{ afterTitle: true, afterBody: false, afterFooter: false }}` renders a single seam separating title+meta from the rest.

A divider only renders when both adjacent regions are populated; empty regions never produce phantom dividers.

### 4.2 Stage pagination metadata

```ts
interface KanbanStageMeta {
  hasMore?: boolean;       // column shows "Load more" at bottom
  totalCount?: number;     // shown in column header as "{loaded} of {total}"
  loading?: boolean;       // column shows a spinner under the last card
  error?: string;          // column shows an inline error row (with retry if onLoadMore is wired)
}
```

Supplied per stage in a flat map: `stageMeta={{ "Uncontacted": { hasMore: true, totalCount: 420, loading: false } }}`. Stages not in the map are treated as fully loaded.

### 4.3 Stage definition

```ts
interface KanbanStage<Row> {
  value: string;                                 // stage key, matches groupBy output
  label: string;                                 // column title
  shortLabel?: string;                           // truncated label for narrow columns
  description?: string;                          // tooltip on header
  variant?: "success" | "info" | "warning" | "default";  // drives StatusTag color
  color?: string;                                // optional dot color for header
  icon?: string;                                 // optional Icon name for header
  terminal?: boolean;                            // "closed" stage — hidden behind "Show closed" toggle
  order?: number;                                // explicit order override (else array order)
  footer?: (rows: Row[]) => ReactNode;           // per-stage footer (overrides columnFooter)
  canEnter?: (row: Row) => boolean;              // gates cards moving into this stage
  onEnterRequired?: {                            // reason-required transitions (e.g. Lost → reason select)
    render: (ctx: TransitionPromptContext<Row>) => ReactNode;
  };
}
```

### 4.4 Card rendering — declarative vs render-prop

Most callers should use `cardFields` (like DataTable columns) for consistent density. `renderCard` is the escape hatch when the card has custom layout.

```ts
interface KanbanCardField<Row> {
  field?: string;                                    // data key (optional if using render)
  label?: string;                                    // description-list term for placement="body"; inline prefix otherwise
  render?: (value: unknown, row: Row) => ReactNode;
  placement?: "title" | "subtitle" | "meta" | "body" | "footer";
  // title:    large, bold, first line — rendered as a Link when href is provided
  // subtitle: muted, second line (location, email)
  // meta:     right-aligned on the title row (date, score) — selection checkbox also lives on this row (rightmost)
  // body:     description-list rows (dt/dd) — label column alignment gives cards consistent heights
  // footer:   bottom row — avatars/text on the left, KanbanCardActions on the right (align="end" default)
  href?: string | { url: string; external?: boolean } | ((row: Row) => string | { url: string; external?: boolean });
  // href + placement="title" → renders as Link without the external-link glyph (titleLinkExternal defaults to false)
  truncate?: true | number;
  visible?: (row: Row) => boolean;
  colSpan?: number;                                  // reserved for future grid-body variants
}
```

- **Title-as-link.** When a `placement: "title"` field has `href`, the component wraps the rendered value in `Link` with the external glyph suppressed (matches user preference — "title links out, but I don't want to see the link-out button"). The link still opens in a new tab if `href.external === true`; only the visual glyph is hidden.
- **Body as description list.** `placement: "body"` fields render as `DescriptionListItem { label }` rows inside a single `DescriptionList`. Labels align across cards within a column, so cards in the same column have identical heights even when some values are short and others wrap. Override globally with `cardBodyAs="stack"` for a simple vertical stack (no label alignment) when cards don't need fixed height.
- **Meta + selection.** Meta fields render right-aligned on the title row. When `selectable={true}`, the selection `Checkbox` is appended as the rightmost element on that row — matches the user's preference for "checkbox in the far right corner of the card".

Example equivalent to the HubSpot native deal card:

```jsx
cardFields={[
  { field: "name", placement: "title",
    render: (val, row) => <Link href={dealUrl(row)}>{val}</Link> },
  { field: "amount", placement: "body", label: "Amount",
    render: (val) => formatCurrency(val) },
  { field: "closeDate", placement: "body", label: "Close date",
    render: (val) => formatDate(val) },
  { field: "score", placement: "meta",
    render: (val) => <ScoreBadge value={val} /> },
  { field: "owners", placement: "footer",
    render: (val) => <OwnerAvatars owners={val} /> },
]}
```

### 4.4a Selection actions

```ts
interface KanbanSelectionAction<Id> {
  label: string;
  icon?: string;
  variant?: "primary" | "secondary" | "transparent";
  onClick: (selectedIds: Id[]) => void;
}
```

Same shape as `DataTableSelectionAction`. When any card checkboxes are checked, a selection bar appears directly above the board frame (not inside it), matching DataTable's selection bar. The bar is horizontally aligned to the toolbar, shows "{n} {plural} selected", `Select all`, `Deselect all`, and each declared action as a `Button`. The bar disappears when selection is cleared.

### 4.5 KanbanCardActions — shipped helper

Callers asked for a dedicated helper instead of stitching `Button` rows themselves. Lives in the same entry point (`import { KanbanCardActions } from "hs-uix/kanban"`) and is usable anywhere — typical placement is `placement: "footer"` inside `cardFields`, or inside a custom `renderCard`.

```ts
interface KanbanCardAction {
  key?: string;
  label: string;                         // always required; used as aria-label when display="icon"
  icon?: string;                         // HubSpot Icon name
  tooltip?: string;                      // hover tooltip; defaults to label when display="icon"
  variant?: "primary" | "secondary" | "transparent";  // default "transparent"
  disabled?: boolean;
  visible?: boolean;                     // default true; hidden actions don't render or take space
  onClick?: () => void;
  href?: string | { url: string; external?: boolean };  // mutually exclusive with onClick
}

interface KanbanCardActionsProps {
  actions: KanbanCardAction[];
  display?: "icon" | "label" | "iconAndLabel";   // default "icon"
  size?: "xs" | "sm";                            // default "xs"
  align?: "start" | "end" | "between";           // default "start"
  gap?: string;                                  // default "xs"
  separator?: "none" | "pipe";                   // default "none"; "pipe" renders Text "|" between actions (matches prototype)
  overflowAfter?: number;                        // collapse extras into an overflow menu; default undefined (show all)
  overflowLabel?: string;                        // "More"
}
```

Behavior:
- `display="icon"`: renders each action as an icon-only button (no label width). This is the native HubSpot kanban footer look.
- `display="iconAndLabel"`: renders icon + label side by side. Use in `comfortable` density.
- `display="label"`: matches the prototype's `Email | Note | Task` row — combine with `separator="pipe"`.
- `overflowAfter={N}` collapses actions past index N into a `⋯` Button that opens a `Select`-like menu (or `ButtonRow` if HubSpot doesn't expose a menu primitive yet — decided during implementation).
- No internal state; a pure layout helper.

Example:

```jsx
<KanbanCardActions
  display="icon"
  actions={[
    { label: "Open record", icon: "record", href: { url: recordUrl, external: true } },
    { label: "Email", icon: "email", onClick: () => openEmail(row) },
    { label: "Note",  icon: "comment", onClick: () => openNote(row) },
    { label: "Task",  icon: "tasks", onClick: () => openTask(row) },
  ]}
/>
```

> Icon names must come from HubSpot's `IconNames` union (`add`, `email`, `comment`, `tasks`, `record`, `calling`, `left`, `right`, etc.). There is no `note` or `office` icon — use `comment` for a note-style action (reserve `edit` for "edit the card itself") and `record` or `contact` for an open-record-style action.

### 4.6 Sort options

```ts
interface KanbanSortOption<Row> {
  value: string;
  label: string;
  field?: string;         // optional grouping key for richer field+direction sort UI
  direction?: "asc" | "desc";
  fieldLabel?: string;    // label shown in the grouped-field select
  comparator: (a: Row, b: Row) => number;
}
```

Sort is a single-select dropdown (one sort applies to every column) because that matches native Deals behavior and avoids the combinatoric explosion of per-column sort.

When every sort option includes `field` plus `direction`, the toolbar can render the richer "field picker + Asc/Desc toggle" UI. If those properties are missing or mixed, it falls back to the simple flat option list.

### 4.7 Render contexts

```ts
interface CardRenderContext<Row> {
  stage: KanbanStage<Row>;
  isChanging: boolean;                     // pending stage change?
  density: "compact" | "comfortable";
  onStageChange: (newStage: string) => void;
  stageControl: (props?: StageControlProps) => ReactNode;  // prebuilt select/menu — drop anywhere
}

interface ColumnRenderContext<Row> {
  stage: KanbanStage<Row>;
  rows: Row[];                             // post filter/search/sort
  visibleRows: Row[];                      // after Show more clamp
  collapsed: boolean;
  expanded: boolean;
  onToggleCollapsed: () => void;
  onToggleExpanded: () => void;
  renderCard: (row: Row) => ReactNode;     // prebuilt — use this when wrapping the column
}

interface KanbanParams {
  search: string;
  filters: Record<string, unknown>;
  sort: string | null;
  collapsedStages: string[];
}
```

### 4.8 Labels

```ts
interface KanbanLabels {
  search?: string;                         // "Search cards..."
  showMore?: (shown: number, total: number) => string;
  showLess?: string;
  loadMore?: (loaded: number, total?: number) => string;  // per-column "Load more" button
  loadingMore?: string;                                    // per-column spinner label
  retryLoadMore?: string;                                  // retry button on column error
  emptyColumn?: string;                    // "—"
  emptyTitle?: string;                     // "No cards"
  emptyMessage?: string;                   // "Nothing matches the current filters."
  loading?: string;
  errorTitle?: string;
  errorMessage?: string;
  cardCount?: (n: number) => string;       // "{n}"
  moveTo?: string;                         // menu control label
  filtersButton?: string;                  // "Filters"
  sortButton?: string;                     // "Sort" — button on toolbar
  sortAscending?: string;                  // "Ascending"
  sortDescending?: string;                 // "Descending"
  metricsButton?: string;                  // "Metrics" — toolbar toggle
  dateFrom?: string;                       // "From" — dateRange input label
  dateTo?: string;                         // "To" — dateRange input label
  clearAll?: string;                       // "Clear all" — reset filter chips
  selected?: (n: number, label: string) => string;          // "{n} {deals} selected"
  selectAll?: string | ((n: number, label: string) => string);  // "Select all {n} {deals}"
  deselectAll?: string;                    // "Deselect all"
}
```

---

### 4.9 Metrics panel

The toolbar's **Metrics** button opens an expandable panel rendered via HubSpot's
[`<Statistics>`](https://developers.hubspot.com/docs/apps/developer-platform/add-features/ui-extensions/ui-components/standard-components/statistics) component. Use it to surface headline numbers above the board — pipeline totals, weighted amounts, record counts, average ages, etc. The button only renders when `metrics` is provided.

#### Quick start — shorthand item array

The common path: pass an array of `KanbanMetricItem` objects. The library renders each as a `<StatisticsItem>` automatically.

```jsx
<Kanban
  {...rest}
  metrics={[
    { label: "Total deal amount",    number: "$123.58M" },
    { label: "Weighted deal amount", number: "$32.54M"  },
    { label: "Open deal amount",     number: "$13.23M"  },
    { label: "Closed deal amount",   number: "$28.46M"  },
    { label: "New deal amount",      number: "$0"       },
    { label: "Average deal age",     number: "3.5 months" },
  ]}
/>
```

```ts
interface KanbanMetricItem {
  id?: string;                    // unique key; defaults to label or index
  label: string;                  // "Total deal amount"
  number: string | number;        // "$123.58M" or 42
  trend?: {                       // optional up/down indicator
    direction?: "increase" | "decrease";
    value: string;                // "12%"
    color?: "red" | "green";
  };
}
```

The `trend` field renders as a `<StatisticsTrend>` with an up/down arrow. Omit
for pure headline numbers (matches HubSpot's own Deals board, which doesn't
show trends on the board metrics panel).

#### Controlled visibility

By default the metrics panel is uncontrolled — clicking Metrics toggles it
locally. For controlled visibility (e.g. syncing with URL state):

```jsx
const [showMetrics, setShowMetrics] = useState(false);

<Kanban
  metrics={...}
  showMetrics={showMetrics}
  onMetricsToggle={setShowMetrics}
/>
```

#### Full custom rendering (escape hatch)

Pass a `ReactNode` to `metrics` instead of an array when you need layouts the
shorthand can't express — multiple rows, a chart, a custom `<Statistics>`
grouping, or the `<BarChart>` / `<LineChart>` primitives:

```jsx
import { Statistics, StatisticsItem, BarChart } from "@hubspot/ui-extensions";

<Kanban
  metrics={
    <Flex direction="column" gap="sm">
      <Statistics>
        <StatisticsItem label="Pipeline" number="$123.58M" />
        <StatisticsItem label="Forecast" number="$32.54M" />
      </Statistics>
      <BarChart data={monthlyForecast} options={{ xAxis: "month", yAxis: "amount" }} />
    </Flex>
  }
/>
```

#### Formatting the numbers

`hs-uix/utils` ships `formatCurrencyCompact` for the `$123.58M / $4.16K / $32`
shorthand HubSpot uses:

```jsx
import { formatCurrencyCompact } from "hs-uix/utils";

const metrics = useMemo(() => {
  const total = sumBy(rows, "amount");
  const weighted = rows.reduce((s, r) => s + r.amount * r.probability, 0);
  return [
    { label: "Total deal amount",    number: formatCurrencyCompact(total) },
    { label: "Weighted deal amount", number: formatCurrencyCompact(weighted) },
    { label: "Deal count",           number: rows.length },
  ];
}, [rows]);

<Kanban metrics={metrics} />
```

#### Guidelines

- **Keep it to 4–6 items.** HubSpot's own `<Statistics>` guidance caps at 4
  side-by-side; native Deals boards stretch to 6. Beyond that, use the escape
  hatch to stack rows.
- **Use `formatCurrencyCompact`** (or similar) for dollar amounts — raw
  `$123,583,400` is unreadable in a headline slot.
- **Drop `trend`** for board-level metrics. HubSpot's native board does.
  Reserve trends for time-series context where the period is obvious.
- **Memoize.** Metrics recompute on every render otherwise.
- **Pair with `columnFooter`** for per-stage totals. Metrics = board total;
  columnFooter = per-stage total. They complement each other.

---

## 5. Visual + functional design

### 5.1 Layout regions (top → bottom)

```
┌ Toolbar ────────────────────────────────────────────────────────────┐
│  [Search …]  [Filter: Owner ▾] [Filter: Date ▾] (Filters ▾)         │
│  [Sort ▾]  [Columns ▾]  [☐ Show closed]                             │
│  ▸ Active filter chips …  · Clear all                               │
└─────────────────────────────────────────────────────────────────────┘
┌ Board (horizontal scroll) ──────────────────────────────────────────┐
│ ┌ Column ──┐ ┌ Column ──┐ ┌ Column ──┐ ┌ Column ──┐ ┌ Column ──┐    │
│ │ Header   │ │ Header   │ │ Header   │ │ Header   │ │ Header   │    │
│ │ ──────── │ │ ──────── │ │ ──────── │ │ ──────── │ │ ──────── │    │
│ │  Card    │ │  Card    │ │  Card    │ │   —      │ │  Card    │    │
│ │  Card    │ │  Card    │ │  Card    │ │          │ │          │    │
│ │  Card    │ │          │ │          │ │          │ │          │    │
│ │ Show +   │ │          │ │          │ │          │ │          │    │
│ │ ──────── │ │ ──────── │ │ ──────── │ │ ──────── │ │ ──────── │    │
│ │ Footer   │ │ Footer   │ │ Footer   │ │ Footer   │ │ Footer   │    │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Column header

Two-row compact header to match HubSpot native, without exceeding one visual line of weight:

```
[●] Uncontacted     42   [⌃]
Total value: $8.5M
```

- Row 1: optional color dot + stage label + count badge + collapse chevron (right-aligned).
- Row 2: footer slot rendered as muted microcopy (shown in header for scannability; also pinned at column bottom if `columnFooter` is set).
- Divider below.

The collapse chevron collapses the column to a narrow (~36px) vertical strip showing a rotated label + count, matching native. Collapsed stages ignore `maxCardsPerColumn`.

### 5.3 Card anatomy

Five fixed regions (`title`, `subtitle`, `meta`, `body`, `footer`). Default density is `compact`; `comfortable` is an opt-in for boards with fewer stages or wider columns. Dividers are **off by default**, toggled globally with `cardDividers={true}` — matches the user requirement that section dividers are flexible, not mandatory.

**Compact (default)** — matches HubSpot's native deal card:

```
┌ Tile ─────────────────────────────────────────────┐
│ Jane Smith — Acme Corp         04/02/26   [ ☐ ]  │  title (Link, no external glyph) + meta + selection checkbox (far right)
│ ─ (optional divider if cardDividers) ────────────│
│ Amount         $8.5M                              │  DescriptionListItem: term — value
│ Close date     06/30/26                           │
│ Owner          Jane D.                            │
│ ─ (optional divider) ────────────────────────────│
│ [JD] [MA]                         🔗 ✉ 📝 ✓       │  footer: left cluster (avatars/text), actions bottom-right (align="end")
└───────────────────────────────────────────────────┘
```

- **Title row.** `placement: "title"` field renders as `Link` (no external-link glyph). `placement: "meta"` is right-aligned on the same row. When `selectable={true}`, a `Checkbox` pins to the far right of this row.
- **Subtitle.** Suppressed in compact — `placement: "subtitle"` fields don't render.
- **Body.** `DescriptionList` with `DescriptionListItem` per body field. Two-column dt/dd layout means labels align column-wide → every card in a column has the same height when they share the same set of body fields. Max 3 rows by default (extras truncated); override per board with `maxBodyLines`.
- **Footer.** Flex row: avatars/text on the left, `KanbanCardActions` (`display="icon"`, `align="end"`) bottom-right. This is where the 4-icon native look comes from.
- **Stage control.** Rendered as the `menu` style — a compact `Move ▾` icon button that sits *inside* the footer actions cluster, on the left of the action icons. So the full bottom-right reads: `[Move ▾] 🔗 ✉ 📝 ✓`. Callers can still set `stageControl="select"` to get a full-width select below the footer.
- **Dividers.** Off by default. `cardDividers={true}` inserts a thin `Divider` between any two populated regions (title/body/footer). Never rendered around empty regions.

**Comfortable** — opt-in with `cardDensity="comfortable"`:

```
┌ Tile ─────────────────────────────────────────────┐
│ Jane Smith — Acme Corp         04/02/26   [ ☐ ]  │  title + meta + selection checkbox
│ Enterprise deal · Boston                          │  subtitle
│ ─────────────────────────────────────────────── │  (dividers default ON in comfortable)
│ Amount          $8.5M                             │  DescriptionList body
│ Close date      06/30/26                          │
│ Owner           Jane D.                           │
│ ─────────────────────────────────────────────── │
│ [JD] [MA]                     Email | Note | Task │  footer, labeled actions, bottom-right
│ ─────────────────────────────────────────────── │
│ [ In Progress                              ▾ ]    │  full-width stage Select (comfortable default)
└───────────────────────────────────────────────────┘
```

- Subtitle visible, body up to 5 rows, stage control is a full-width `Select` below the footer.
- `cardDividers` defaults to `true` at this density.
- Default `KanbanCardActions` display becomes `"label"` with `separator="pipe"` (matches the current lead-board prototype); `align="end"` so actions still sit bottom-right.

**Summary of density defaults:**

| Prop | compact | comfortable |
|---|---|---|
| Subtitle visible | no | yes |
| `cardDividers` | false | true |
| Body line cap | 3 | 5 |
| `stageControl` default | `menu` (icon in footer cluster) | `select` (full-width below footer) |
| `KanbanCardActions` default display | `icon` | `label` with pipe separators |

Density only shifts defaults — every knob is overridable per board.

### 5.4 Stage transitions with required prompts

Pattern from the lead board's Lost → reason flow. Instead of the consumer managing UI state for "pending reason selection", the stage itself declares what it needs:

```jsx
{
  value: "Lost",
  label: "Lost",
  variant: "default",
  onEnterRequired: {
    render: ({ row, onConfirm, onCancel }) => (
      <FormBuilder
        fields={[{ name: "reason", type: "select", label: "Reason", options: LOST_REASONS, required: true }]}
        onSubmit={(v) => onConfirm({ extraProperties: { closed_lost__reason: v.reason } })}
        onCancel={onCancel}
      />
    ),
  },
}
```

The card flips to the prompt renderer in place; `onStageChange` is only invoked after `onConfirm({ extraProperties })` fires. This is a deliberate composition with FormBuilder — no new "reason prompt" DSL.

### 5.5 Empty / loading / error

Same ternary chain as DataTable (error → loading → empty → content). Loading defaults to a three-column skeleton: column header + 2–3 Tile placeholders per column. Empty state renders inside the board frame so the toolbar stays visible (so users can clear filters).

### 5.6 Narrow viewport

Horizontal scroll, not wrapping. With 5+ columns at 280px min width, the board always needs horizontal scroll on typical card viewports (~600–700px wide). That's the native behavior and matches what users expect. `scrollable={false}` is offered only for single-column demos.

### 5.7 Overflow controls

- **`Columns` dropdown** (multi-select of hideable stages) replaces the raw checkbox-per-stage row in the current prototype. Matches DataTable's `filters` pattern when `stages.length > 5`.
- **`Show closed`** is a toggle that filters out stages marked `terminal: true`.
- **`Sort`** is a single-select dropdown.
- All three live in the same toolbar row so the board doesn't take three lines of chrome.

---

## 6. Behavior details

### 6.1 Data pipeline (per render)

Identical to DataTable, with grouping substituted for row flattening:

1. **Filter** — `filters` config + `searchFields` applied to `data`.
2. **Terminal stage filter** — drop rows whose stage is `terminal: true` when `Show closed` is off.
3. **Bucket** — map each row to its stage using `groupBy`. Rows whose stage doesn't appear in `stages` go to a `__unknown` bucket, rendered as a trailing column (dev warning in console once).
4. **Sort** — apply selected sort comparator inside each bucket.
5. **Clamp** — each column slices to `maxCardsPerColumn` (collapsed to `maxCardsExpanded` when expanded).

Client-side is the default. `serverSide={true}` skips steps 1–4 and trusts the parent; the component just renders the supplied `data` bucketed by `groupBy`.

### 6.1a Pagination (client vs server vs per-column)

Three shapes co-exist without modes:

1. **Fully client-side (default).** `data` holds everything, clamp kicks in at `maxCardsPerColumn` with a "Show more ({shown} of {total})" button in each column. `onLoadMore` not wired.
2. **Per-column server load-more.** Caller supplies `onLoadMore(stage)` and `stageMeta[stage].hasMore`. The "Show more" button in that column becomes "Load more"; clicking fires `onLoadMore(stage)`. While `stageMeta[stage].loading` is true, the column shows a spinner under the last card. The parent appends the new rows to `data` — the component never mutates. Columns without `hasMore` retain the client-side show-more behavior.
3. **Parent pre-buckets.** Caller may provide `data` already filtered per stage and sets `serverSide={true}`. Component trusts the buckets; `stageMeta.totalCount` drives column header counts.

These combine cleanly: a caller can keep two columns pre-buckets + five columns client-side + one column server-load-more in the same board. The component just reads `stageMeta[stage.value]` for each column and picks the right rendering for the bottom slot ("Show more" vs "Load more" vs nothing vs spinner vs error).

Column header count format:
- No meta: `{loaded}`.
- `totalCount` present: `{loaded} of {totalCount}`.
- `loading`: append a trailing inline `LoadingSpinner size="xs"`.

### 6.2 Controlled/uncontrolled matrix

| State | Uncontrolled | Controlled |
|---|---|---|
| Search | `internalSearch` | `searchValue` + `onSearchChange` |
| Filters | `internalFilters` | `filterValues` + `onFilterChange` |
| Sort | `internalSort` (initialized from `defaultSort`) | `sort` + `onSortChange` |
| Collapsed stages | `internalCollapsed` | `collapsedStages` + `onCollapsedStagesChange` |
| Expanded stages | `internalExpanded` | `expandedStages` + `onExpandedStagesChange` |

Pattern: `resolved = external != null ? external : internal`.

### 6.3 Stage change flow

```
user selects new stage in card control
  → isStageChanging(row)?  (caller-owned; component only shows spinner)
  → stage.canEnter?(row) === false?  → block, no callback
  → stage.onEnterRequired?  → flip card to prompt renderer
      → prompt calls onConfirm({ extraProperties })
      → component calls onStageChange(row, newStage, oldStage, { extraProperties })
  → else: component calls onStageChange(row, newStage, oldStage)
```

The component never mutates `data`. Updating the board is the caller's job (via their own `setState` / cache), same as DataTable's `onRowEdit`. This keeps Kanban stateless on the write path.

### 6.4 Aggregation (per-column footers)

Declared at two levels:

- Global default: `columnFooter(rows, stage)`.
- Per-stage override: `stage.footer(rows)`.

Computed after filter+sort but before clamp, so "Total amount: $8.5M" reflects the entire bucket, not just the visible slice.

### 6.5 What gets memoized

Same `useMemo` boundaries as DataTable, applied in this order: `filteredRows` → `bucketedRows` → `sortedByStage` → `visibleByStage`. Each stage's footer memoizes off `bucketedRows[stage.value]`.

---

## 7. Migration path from the current lead-board prototype

The prototype in the user message has ~600 lines of UI concerns mixed with ~400 lines of data plumbing (fetch, delta refresh, association join, prefs). Moving to the Kanban component shrinks the UI layer to roughly:

```jsx
<Kanban
  data={rows}
  stages={STAGES}                               // each stage declares variant, terminal, onEnterRequired, etc.
  groupBy="leadstatus"
  rowIdField="id"

  cardFields={[
    { field: "name", placement: "title",
      render: (val, row) => <Link href={contactUrl(row)}>{val}</Link> },
    { field: "createDate", placement: "meta",
      render: (val) => formatDate(val) },
    { field: "loc", placement: "body", render: (val) => val },
    { field: "nextTaskDue", placement: "body",
      render: (val) => val ? taskDueLabel(val) : "No task" },
    { placement: "footer",
      render: (_, row) => (
        <KanbanCardActions
          display="icon"
          actions={[
            { label: "Open", icon: "office", href: { url: contactUrl(row), external: true } },
            { label: "Email", icon: "email", onClick: () => openEmail(row) },
            { label: "Note", icon: "note", onClick: () => openNote(row) },
            { label: "Task", icon: "tasks", onClick: () => openTask(row) },
          ]}
        />
      ),
    },
  ]}

  searchFields={["name", "email"]}
  filters={[
    { name: "loc", type: "select", options: locations, placeholder: "All locations" },
  ]}
  sortOptions={LEAD_SORTS}
  defaultSort="newest_created"

  // stageControl defaults to "menu" in compact density; leave unset
  onStageChange={handleStageChange}
  isStageChanging={(row) => updatingId === row.id}

  // Per-column server-side pagination — one call per column when user clicks Load more
  stageMeta={stageMeta}
  onLoadMore={(stage) => loadMoreForStage(stage)}

  columnFooter={(rows) => `${rows.length} leads`}
  loading={loading}
  error={error}
  labels={{ filtersButton: t("filters"), /* … */ }}
/>
```

The consumer keeps: data loading, pagination/load-more, delta refresh, user prefs, team scoping, alerts. The component takes over: layout, toolbar, column collapse/hide/expand, card density, stage control, reason-required prompt, empty/loading/error.

---

## 8. Decisions and remaining open questions

### Resolved (baked into the spec above)

- **Card action icons.** Ship a dedicated `KanbanCardActions` helper exported from the same entry point (§4.5). Used inside `cardFields` (placement `"footer"`) or inside a custom `renderCard`. Supports icon / label / icon+label display, pipe separator, and optional overflow menu.
- **Server-side pagination shape.** Per-column pagination via `stageMeta[stage]` + `onLoadMore(stage)` (§4.1, §4.2, §6.1a). Three pagination shapes (fully client, per-column server load-more, parent-prebuckets) compose freely — a caller can mix them column-by-column.
- **Default card density.** `compact` (§4.1, §5.3). Matches HubSpot's native deal card; `comfortable` is an opt-in closer to the current lead-board prototype.
- **Sort dropdown scope.** Single board-wide sort (matches prototype; avoids combinatoric per-column sort state).

### Still open

1. **Collapse chevron icon.** Currently uses `Icon name="left"` / `name="right"` in a `Button variant="transparent" size="sm"`. Works, but confirm these names are in the supported HubSpot icon set before v0.1 ships.
1a. **Collapsed column label.** HubSpot UI Extensions has no CSS transforms, so a proper rotated label is unavailable. Current rendering stacks each character vertically in its own `Text` element — matches the native visual closely but becomes tall for long stage names. Callers with long names should use `shortLabel` (already respected for expanded headers; collapsed header falls back to `label` today to preserve clarity during expansion).
1b. **External-link glyph on card titles.** HubSpot's `Link` primitive always shows the external-link glyph when `href.external === true`, with no prop to suppress it. To get a title link *without* the glyph, omit `external: true` on the href — the URL then opens in the same tab. New-tab + no-glyph is not possible with the current primitive.
2. **Overflow menu primitive.** `KanbanCardActions` `overflowAfter` needs a menu primitive. If HubSpot exposes a `Menu` / `DropdownMenu` we use it; otherwise the overflow becomes a `Select`-as-menu (label hidden, options are actions) or a hidden-until-click `ButtonRow`. Decide during implementation by surveying available primitives — do not add a new HubSpot dependency.
3. **Stage reordering.** `stages` array order is authoritative in v0.1. Adding `stageOrder` as a controlled prop (user-draggable via future DnD primitive or "Move left/right" buttons) is flagged for a later version.
4. **Icon set for footer actions.** The native card uses 4 stage-specific icons (record, task, email, note). Exact HubSpot `Icon` names need confirmation against the current `@hubspot/ui-extensions` version before the example in §7 becomes authoritative.
5. **Selection bar placement under horizontal scroll.** When the board horizontally scrolls, does the selection bar scroll with the columns (inside the scroll container) or pin to the toolbar (outside)? DataTable doesn't scroll horizontally so there's no precedent. Recommend: pin to the toolbar area (outside the scroll container) so bulk actions remain accessible.

---

## 9. Out of scope (flag for future versions)

- Swimlanes (secondary grouping — e.g. by owner within stage).
- WIP limits / over-capacity warnings per column.
- Drag-and-drop (requires a HubSpot primitive that doesn't exist yet).
- Column reordering.
- Card previews / expandable detail.

> Note: bulk select + a selection-action bar were originally listed here and have been moved into v0.1 scope (§4.1 `selectable`, §4.4a `KanbanSelectionAction`) after the decision to put a checkbox on every card.

---

## 10. File layout (once scaffolded)

```
packages/kanban/
├── package.json              # name: hs-uix/kanban bundled under root hs-uix
├── tsup.config.js
├── index.d.ts                # hand-written, mirrors DataTable layout
├── src/
│   ├── index.js              # barrel
│   └── Kanban.jsx            # single-file component, section-banner organized
├── README.md
├── AGENT.md
├── SPEC.md                   # this doc
└── assets/                   # screenshots
```

Re-exports from `src/kanban.js` at the monorepo root, wired into `package.json` `exports` as `"./kanban"` — same pattern as `./datatable` and `./form`.
