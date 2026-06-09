# hs-uix Roadmap

> **One package.** Everything ships as the single [`hs-uix`](https://www.npmjs.com/package/hs-uix)
> package, imported by subpath. The old scoped `@hs-uix/*` packages
> (`@hs-uix/datatable`, `@hs-uix/form`, …) are **deprecated** — do not publish or
> depend on them. The `src/<component>/` folders are internal source modules, not
> separately published packages.

```js
import { DataTable }   from "hs-uix/datatable";
import { FormBuilder } from "hs-uix/form";
import { Kanban }      from "hs-uix/kanban";
import { Feed }        from "hs-uix/feed";
import { Calendar }    from "hs-uix/calendar";
// shared building blocks
import { Icon }        from "hs-uix/common-components";
import { CrmDataTable } from "hs-uix/utils";
```

## Components

| Component | Subpath | Status | Summary |
|---|---|---|---|
| DataTable | `hs-uix/datatable` | Shipped | Filterable, sortable, paginated tables; inline edit; row selection; client & server modes |
| FormBuilder | `hs-uix/form` | Shipped | Declarative config-driven forms; validation; multi-step; repeaters; CRM helpers |
| Kanban | `hs-uix/kanban` | Shipped | Drag-free board; stage transitions; metrics; filters; server-side mode |
| Feed | `hs-uix/feed` | Shipped | Activity feed / timeline; grouping; search/filters; load-more |
| Calendar | `hs-uix/calendar` | Shipped | Month / Week / Day / Agenda views (+ experimental Gantt); overlays; search/filters |

Shared internals: `hs-uix/common-components` (Icon, AvatarStack, CollectionToolbar,
StatusTag helpers, SVG/data-URI builders) and `hs-uix/utils` (CRM search adapters,
query/filter helpers, formatters, `CrmDataTable` / `CrmKanban`).

---

## Future ideas

These are candidate enhancements, not commitments. Each lands as a minor bump to
the single `hs-uix` package.

### DataTable
- [ ] Column resizing & reordering
- [ ] Export to CSV
- [ ] Row expansion (detail row)

### FormBuilder
- [ ] Warn on dirty close (unsaved-changes confirmation)
- [ ] Field-level loading spinners while fetching options
- [ ] Schema generation from HubSpot property definitions

### Kanban
- [ ] WIP limits per stage
- [ ] Swimlanes (group rows by a second dimension)

### Feed
- [ ] Real-time append (prepend new items without full reload)
- [ ] Per-type icon/color presets

### Calendar
- [ ] Resource/lane view (rows = owners/resources)
- [ ] Drag-free reschedule via per-event action menu
- [ ] Promote Gantt out of experimental

---

## Net-new components & abstractions

The five shipped components cover the big CRM surfaces (tables, forms, boards,
timelines, calendars). This backlog is about the **next layer** — patterns the
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

### Phase 1 — Harvest the quick wins (next minor, `2.2`)

Low-risk, mostly-built code that closes real gaps. Ship as one "harvest" release.

| Component | Subpath | Stream | Source | Effort |
|---|---|---|---|---|
| **Safe wrappers** — hardened drop-ins that turn native silent-fails / throw-blanks-page into safe degrades: Icon alias-repair, EmptyState `imageName` fallback, StatisticsTrend `direction` aliasing, Popover compact-Tile padding, required-array coercion on collection props. | `hs-uix/safe` | 🅑 | `renderer/components.js` safety-net layer | S |
| ✅ **`applyPatches`** — RFC-6902 JSON Patch subset (add/replace/remove/move/copy), permissive path-creation, structural sharing. Generic streaming-UI utility. | `hs-uix/utils` | 🅑 | `renderer/apply-patch.js` | XS |

> **Not building: Toaster.** The SDK's native [`actions.addAlert`](https://developers.hubspot.com/docs/apps/developer-platform/add-features/ui-extensions/ui-extensions-sdk/actions#display-alert-banners)
> already renders host toast banners in every extension point (`settings`, `home`,
> `crm.record.*`, `crm.preview`, `helpdesk.sidebar`). Studio's `PreviewToasts` only
> exists because specs render *outside* a deployed extension, where `addAlert` has
> no host to call — not a gap real extensions have.

### Phase 2 — High-value net-new (`2.3`–`2.4`)

The app patterns with the highest demand and zero current coverage.

| Component | Subpath | Stream | Notes | Effort |
|---|---|---|---|---|
| **FilterBuilder** — the list/workflow segment builder: nested AND/OR groups, property → operator → value rows, per-type value editors. Biggest single gap; `CollectionFilterControl` is only the flat version. | `hs-uix/filter` | 🅐 | Composes from native Select/inputs + Box/Flex grouping — no host-known-component risk. Pairs with DataTable/Kanban server modes. | L |
| **Dashboard / MetricCard** — the gap is *not* charting (native `BarChart`/`LineChart`/`ScoreCircle`/`Statistics` cover that). It's the **card chrome** ("metric + delta + comparison period + drill-in"), the **responsive report grid**, and the **missing chart types** (donut / funnel / gauge / sparkline). | `hs-uix/dashboard` | 🅐 | Wrap native charts in card+grid; only hand-roll the chart types the SDK lacks. | M |
| **Wizard + Onboarding Checklist** — orchestrated multi-step flow (side step-nav, gating, review/summary) and the "getting started" progress card. `StepIndicator` is just the dots. | `hs-uix/wizard` | 🅐 | Distinct from FormBuilder multi-step (which is form-only). | M |

### Phase 3 — The flagship (`3.0`)

| Component | Subpath | Stream | Notes | Effort |
|---|---|---|---|---|
| **Renderer engine** — declarative JSON → live HubSpot UI. Expression language (`$eq/$and/$if`, arithmetic, `$length/$slice/$concat/$coalesce`, `{{...}}` templates), two-way `$bindState`, `$forEach`, `$render` lazy callback props, SDK-mirroring action descriptors, JSON-Patch streaming. Nothing like it exists anywhere. | `hs-uix/render` | 🅑 | `renderer/renderNode + resolve + actions + apply-patch + components` (~1,200 LOC). **Major version** — needs the pure engine split cleanly from Studio's comment-overlay layer (`commentable.js`, `CommentTarget`, `commentMode`); the `if (!ctx.commentMode)` seams make this a clean cut. Public spec schema is the key design decision. | L |

### Phase 4 — Structural, input & collaboration (later)

Candidate, not committed — sequence by demand.

**Layout / navigation (🅐)**
- [ ] **Tree / nested disclosure** — folders, nested associations, workflow hierarchy
- [ ] **Split view / master-detail** — list pane + detail pane (inbox, conversations)
- [ ] **Skeleton loaders** — content placeholders (only a spinner today)
- [ ] **Pagination** — promote the control trapped inside DataTable to a standalone export
- [ ] **Breadcrumbs** — no native; used throughout HS nav

**Inputs / selection (🅐)**
- [ ] **Date range picker** — `DateInput` is single-date; range logic already exists in Calendar presets
- [ ] **Multi-association / record picker** — search + create; `CrmLookupSelect` is single-select
- [ ] **Tag / token free-entry input**

**Collaboration (🅑)**
- [ ] **CommentThread** — queued/completed accordion, per-item complete/delete/select, middle-truncation, show-more modal — from `components/CommentsPanel.jsx`. Ships with its composer (TextArea + send-gating + optional toolbar slot, from `components/Composer.jsx`) as a sub-part — not worth a standalone component, since native `TextArea` + `Button` is most of it.
- [ ] **AnnotatableCanvas** — click any node to pin a comment dot — from `renderer/commentable.js` + `CommentTarget.jsx` (the niche half of the renderer split)

### Sequencing rationale

1. **Phase 1 first** — it's mostly written, low-risk, and ships value in days while bigger items are scoped.
2. **FilterBuilder leads Phase 2** — highest demand, zero coverage, composes only from safe primitives.
3. **Renderer is its own major** — real API decisions (public spec schema, engine/annotation split) warrant not rushing it into a minor.
4. Several Phase-4 items are *lifts, not builds* — Pagination and date-range logic already live inside DataTable/Calendar; promoting them to standalone exports is cheap reuse.

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
    ├── common-components/  ← shared Icon / Collection* / SVG primitives
    └── utils/              ← CRM adapters, query helpers, formatters
```

## Build, test, release

```bash
npm run build     # tsup → dist/ (esm + cjs per subpath)
npm test          # vitest (src/**/*.test.{js,jsx})

# release the single package (from repo root)
npm run release:patch   # or release:minor / release:major
```
