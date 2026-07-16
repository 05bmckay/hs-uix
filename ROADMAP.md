# hs-uix Roadmap

> **One package.** Everything ships as the single [`hs-uix`](https://www.npmjs.com/package/hs-uix)
> package, imported by subpath. The old scoped `@hs-uix/*` packages
> (`@hs-uix/datatable`, `@hs-uix/form`, …) are **deprecated** — do not publish or
> depend on them. The `src/<component>/` folders are internal source modules, not
> separately published packages.

```js
import { DataTable }     from "hs-uix/datatable";
import { FormBuilder }   from "hs-uix/form";
import { Kanban }        from "hs-uix/kanban";
import { Feed }          from "hs-uix/feed";
import { Calendar }      from "hs-uix/calendar";
import { FilterBuilder } from "hs-uix/filter";
// shared building blocks
import { Icon }         from "hs-uix/common-components";
import { CrmDataTable } from "hs-uix/utils";
// APIs still under evaluation
import { Wizard, Skeleton } from "hs-uix/experimental";
```

## Components

| Component | Subpath | Status | Summary |
|---|---|---|---|
| DataTable | `hs-uix/datatable` | Shipped stable | Filterable, sortable, paginated tables; inline edit; row selection; client & server modes |
| FormBuilder | `hs-uix/form` | Shipped stable | Declarative config-driven forms; validation; multi-step; repeaters; CRM helpers |
| Kanban | `hs-uix/kanban` | Shipped stable | Drag-free board; stage transitions; swimlanes; WIP limits; metrics; filters; server-side mode |
| Feed | `hs-uix/feed` | Shipped stable | Activity feed / timeline; grouping; search/filters; load-more |
| Calendar | `hs-uix/calendar` | Shipped stable | Month / Week / Day / Agenda views (+ experimental Gantt); overlays; search/filters |
| FilterBuilder | `hs-uix/filter` | Shipped stable | Nested AND/OR filter groups, typed value editors, validation, and CRM filter conversion |

Shared stable exports also ship through `hs-uix/common-components` (Icon,
DateRangePicker, CrmRecordPicker, AvatarStack, CollectionToolbar, StatusTag
helpers, SVG/data-URI builders) and `hs-uix/utils` (CRM search adapters,
query/filter helpers, formatters, `CrmDataTable` / `CrmKanban`).

### API maturity

- **Stable:** FilterBuilder, DateRangePicker, CrmRecordPicker, and Kanban
  swimlanes/WIP limits are available through their documented stable subpaths or
  the root barrel.
- **Experimental:** Wizard, OnboardingChecklist, and Skeleton loaders are
  available only from `hs-uix/experimental`. DataTable row expansion is
  implemented but remains an experimental DataTable API.
- **Not graduated by availability alone:** experimental APIs can be tried now,
  but their names, props, or export paths may still change before becoming
  stable.

---

## Future ideas

This section records completed enhancements alongside remaining candidates.
Unchecked items are ideas, not commitments; each would land as a minor bump to
the single `hs-uix` package.

### DataTable
- [x] Row expansion (detail row) — shipped as an experimental DataTable API
- [ ] Column resizing & reordering
- [ ] Export to CSV

### FormBuilder
- [x] Schema generation from HubSpot property definitions — shipped stable as `fieldsFromHubSpotProperties`
- [ ] Warn on dirty close (unsaved-changes confirmation)
- [ ] Field-level loading spinners while fetching options

### Kanban
- [x] WIP limits per stage — shipped stable
- [x] Swimlanes (group rows by a second dimension) — shipped stable

### Feed
- [x] Real-time append — shipped stable with immediate or buffered-new-items behavior
- [x] Per-type icon/color presets — shipped stable through `typePresets` and `DEFAULT_FEED_TYPE_PRESETS`

### Calendar
- [x] Resource/lane view (rows = owners/resources) — shipped stable
- [x] Drag-free reschedule via per-event action menu — shipped stable
- [ ] Promote Gantt out of experimental

---

## Net-new components & abstractions

The six stable component surfaces cover the big CRM patterns (tables, forms,
boards, timelines, calendars, and nested filters). This backlog is about the
**next layer** — patterns the
HubSpot product UI leans on that have no clean primitive or hs-uix equivalent,
plus abstractions we already built and battle-tested inside
[`hs-uix-studio`](../hs-uix-studio) that deserve to be public.

Two streams feed one backlog:

- **🅐 App-parity** — a pattern visible across the HubSpot app with no clean
  native primitive and no hs-uix composite. Built from scratch.
- **🅑 Studio harvest** — an abstraction that already exists, in production, inside
  the Studio app (`apps/studio-app/src/app/pages`). The hard part is done; the
  work is decoupling it from Studio, defining the public API, docs + types.

Effort is rough order-of-magnitude (S = days, M = a week-ish, L = multi-week).

### Phase 1 — Harvest the quick wins (shipped in `2.2`)

Low-risk Studio harvests that shipped through stable subpaths.

| Component | Subpath | Stream | Source | Effort |
|---|---|---|---|---|
| ✅ **`applyPatches`** — RFC-6902 JSON Patch subset (add/replace/remove/move/copy), permissive path-creation, structural sharing. Generic streaming-UI utility. | `hs-uix/utils` | 🅑 | `renderer/apply-patch.js` | XS |
| ✅ **Safe wrappers** — hardened drop-ins that turn native silent-fails / throw-blanks-page into safe degrades: Icon alias-repair, EmptyState `imageName` fallback, StatisticsTrend `direction` aliasing, Popover compact-Tile padding, required-array coercion on collection props. | `hs-uix/safe` | 🅑 | `renderer/components.js` safety-net layer | S |

> **Not building: Toaster.** The SDK's native [`actions.addAlert`](https://developers.hubspot.com/docs/apps/developer-platform/add-features/ui-extensions/ui-extensions-sdk/actions#display-alert-banners)
> already renders host toast banners in every extension point (`settings`, `home`,
> `crm.record.*`, `crm.preview`, `helpdesk.sidebar`). Studio's `PreviewToasts` only
> exists because specs render *outside* a deployed extension, where `addAlert` has
> no host to call — not a gap real extensions have.

### Phase 2 — High-value net-new (`2.3`–`2.4`)

High-demand app patterns, including work that has already reached stable or
experimental availability.

| Component | Current export | Status | Notes | Effort |
|---|---|---|---|---|
| ✅ **FilterBuilder** — nested AND/OR groups, property → operator → value rows, and per-type value editors. | `hs-uix/filter` | Shipped stable | Composes from native Select/inputs + Box/Flex grouping and pairs with DataTable/Kanban server modes. | L |
| **Dashboard / MetricCard** — the gap is *not* charting (native `BarChart`/`LineChart`/`ScoreCircle`/`Statistics` cover that). It's the **card chrome** ("metric + delta + comparison period + drill-in"), the **responsive report grid**, and the **missing chart types** (donut / funnel / gauge / sparkline). | `hs-uix/dashboard` (planned) | Backlog | Wrap native charts in card+grid; only hand-roll the chart types the SDK lacks. | M |
| 🧪 **Wizard + Onboarding Checklist** — orchestrated multi-step flow and getting-started progress card. | `hs-uix/experimental` | Shipped experimental | Distinct from FormBuilder multi-step; remains experimental pending the graduation checks below. | M |

### Phase 3 — The flagship (`3.0`)

| Component | Subpath | Stream | Notes | Effort |
|---|---|---|---|---|
| **Renderer engine** — declarative JSON → live HubSpot UI. Expression language (`$eq/$and/$if`, arithmetic, `$length/$slice/$concat/$coalesce`, `{{...}}` templates), two-way `$bindState`, `$forEach`, `$render` lazy callback props, SDK-mirroring action descriptors, JSON-Patch streaming. Nothing like it exists anywhere. | `hs-uix/render` | 🅑 | `renderer/renderNode + resolve + actions + apply-patch + components` (~1,200 LOC). **Major version** — needs the pure engine split cleanly from Studio's comment-overlay layer (`commentable.js`, `CommentTarget`, `commentMode`); the `if (!ctx.commentMode)` seams make this a clean cut. Public spec schema is the key design decision. | L |

### Phase 4 — Structural, input & collaboration (later)

Completed lifts are marked below; unchecked candidates are not committed and
should be sequenced by demand.

**Layout / navigation (🅐)**
- [ ] **Tree / nested disclosure** — folders, nested associations, workflow hierarchy
- [ ] **Split view / master-detail** — list pane + detail pane (inbox, conversations)
- [x] 🧪 **Skeleton loaders** — shipped through `hs-uix/experimental`; pending graduation
- [ ] **Pagination** — promote the control trapped inside DataTable to a standalone export
- [ ] **Breadcrumbs** — no native; used throughout HS nav

**Inputs / selection (🅐)**
- [x] **DateRangePicker** — shipped stable through `hs-uix/common-components` and the root export
- [x] **CrmRecordPicker** — multi-record CRM search/selection with optional inline create; shipped stable through `hs-uix/common-components` and the root export
- [ ] **Tag / token free-entry input**

**Collaboration (🅑)**
- [ ] **CommentThread** — queued/completed accordion, per-item complete/delete/select, middle-truncation, show-more modal — from `components/CommentsPanel.jsx`. Ships with its composer (TextArea + send-gating + optional toolbar slot, from `components/Composer.jsx`) as a sub-part — not worth a standalone component, since native `TextArea` + `Button` is most of it.
- [ ] **AnnotatableCanvas** — click any node to pin a comment dot — from `renderer/commentable.js` + `CommentTarget.jsx` (the niche half of the renderer split)

### Experimental graduation readiness

Wizard/OnboardingChecklist, Skeleton loaders, and DataTable row expansion are
implemented, but they are **not graduation-ready yet**. Moving any of them to a
stable export requires:

1. an explicit public API review (names, props, controlled/uncontrolled behavior,
   accessibility, and compatibility expectations);
2. stable export paths, hand-maintained types, and public examples/reference docs;
3. a documented migration/re-export policy for existing experimental imports; and
4. HubSpot host-layout validation in the extension contexts the component is
   intended to support.

This documentation pass does not graduate or rename any API.

### Sequencing rationale

1. **Phase 1 is complete** — `applyPatches` and the safe wrappers ship through stable subpaths.
2. **FilterBuilder is stable; Wizard is experimental** — Phase 2's remaining net-new gap is Dashboard / MetricCard, while Wizard follows the graduation gate above.
3. **Renderer is its own major** — real API decisions (public spec schema, engine/annotation split) warrant not rushing it into a minor.
4. Remaining Phase-4 lifts should reuse shipped foundations where possible; for example, Pagination can be promoted from DataTable rather than rebuilt.

---

## Repo layout

```
hs-uix/
├── package.json            ← the only published package (subpath exports)
├── index.d.ts              ← root barrel: re-exports every component + shared types
├── <component>.d.ts        ← per-subpath type entry (export * from ./src/<comp>/index)
├── tsup.config.js          ← one entry per subpath
└── src/
    ├── index.js            ← root barrel (mirrors index.d.ts)
    ├── datatable/          ← DataTable source, tests, README, index.d.ts
    ├── form/
    ├── kanban/
    ├── feed/
    ├── calendar/
    ├── filter/             ← stable FilterBuilder + pure filter-tree helpers
    ├── wizard/             ← Wizard / Onboarding source (experimental export)
    ├── experimental/       ← explicit pre-stable public barrel
    ├── common-components/  ← shared Icon / Collection* / SVG primitives
    ├── safe/               ← hardened wrappers around native and hs-uix components
    └── utils/              ← CRM adapters, query helpers, formatters
```

## Build, test, release

```bash
npm run build     # tsup → dist/ (esm + cjs per subpath)
npm test          # vitest (src/**/*.test.{js,jsx})

# release the single package (from repo root)
npm run release:patch   # or release:minor / release:major
```
