# Changelog

## 2.2.0 — 2026-06-09

- **Calendar**: resource-view lane labels now shrink-wrap to their content
  instead of truncating, so long owner / room / team names can drive the
  resource column width.
- **DateRangePicker**: expanded the HubSpot CRM date filter operator set beyond
  preset / greater-than rolling / explicit range. It now supports static date
  comparisons (`Equal`, `BeforeDateStaticOrDynamic`,
  `AfterDateStaticOrDynamic`), less-than rolling (`LessRolling`), and presence
  checks (`Known`, `NotKnown`), plus an optional CRM property field dropdown for
  filter-builder rows. Public typings and common-component docs cover the new
  value shapes and field-selection props.

## 2.1.0 — 2026-06-03

- **New: `Calendar`** (`hs-uix/calendar`) — a presentational calendar surface.
  Hand it `events` plus an `eventFields` map and it renders **Month**, **Week**,
  **Day**, or **Agenda** views behind a Today / ‹ › / view-switcher toolbar, with
  optional search + filters (the DataTable/Kanban config shape) and click-to-open
  event overlays (`overlayMode`: Popover / Modal / Panel / none). Highlights:
  - Controlled or uncontrolled `view` and `focusedDate`; `weekStartsOn`,
    `hideWeekends`, `maxEventsPerDay`, `dayStartHour`/`dayEndHour`.
  - Multi-day events render across each day they span (with a `→` continuation
    marker and per-day overlay ids); month cells overflow to a "+N more" popover
    whose rows open the same detail overlay as the chips.
  - Week/Day time grid: an all-day band, multi-hour blocks that repeat with a
    "↑ cont. through …"/"↓ from …" note, and events fully outside the visible hour
    window pinned to an edge row (with a "before/after" note) instead of vanishing.
  - **Robust date coercion** (`toDate`): `Date`, epoch ms (number/string), ISO, or
    a `DateInput` value object. Date-only values — including UTC-midnight epoch
    "date" properties — are anchored to LOCAL midnight so events never render a day
    early in behind-UTC timezones.
  - **Timezone support (opt-in)**: OFF by default — with no tz props, events render
    exactly as provided (no conversion, browser-local), so callers never have to
    think about zones. Opt in by setting `timeZone` (or enabling the built-in
    `showTimeZoneSelect` toolbar dropdown with DST-aware "UTC −05:00 Central Time"
    labels, which starts at UTC) and every time, hour-grid placement, and
    day-grouping resolves in the chosen IANA zone. Implemented by converting each
    event instant to a wall-clock `Date` in the zone, so the local-time grid logic
    resolves there with no other changes. New props `timeZone` / `defaultTimeZone` /
    `onTimeZoneChange` / `showTimeZoneSelect` / `timeZoneOptions`, type
    `CalendarTimeZoneOption`, and `dateUtils` helpers `zonedParts` / `toWallClock` /
    `formatTimeZoneLabel` / `getBrowserTimeZone`.
  - Server-side friendly (`onRangeChange` + `loading`/`error`), render-override
    slots (`renderToolbar`/`renderDayCell`/`renderEmptyState`/…), full i18n via
    `labels`. Ships `calendar.d.ts` and a package README.

- **New: `Icon`** — a drop-in superset of HubSpot's native `<Icon>`. When a
  request is fully native-expressible (a whitelisted `name`, a semantic `color`
  of `inherit`/`alert`/`warning`/`success`, and an `sm`/`md`/`lg` `size`) it
  **delegates to the real `<Icon>`**, preserving auto-sizing, `color="inherit"`,
  and screen-reader semantics. Otherwise it renders a registered SVG glyph as a
  data-URI `<Image>`, lifting all three native limits: unregistered/custom glyph
  names, any CSS color (not just the 4 semantic ones), and `xs`–`xl` tokens or an
  explicit pixel `size`. Multi-color / even-odd glyphs are supported via per-path
  `fill`/`fillRule`. _(Fallback caveat: a data-URI glyph can't inherit
  `currentColor`, so pass `color` explicitly.)_
- **New: icon registry & helpers** ship with `Icon` — `ICONS` (the custom glyph
  registry, ~248 glyphs scraped from HubSpot's web app merged with a
  hand-curated set), `ICON_NAMES` (its keys), and `NATIVE_ICON_NAME_LIST` (the
  native `<Icon>` name whitelist, sorted). Plus two utilities:
  `makeIconDataUri(nameOrEntry, { size, color })` returns `{ src, width, height }`
  (or `null` for an unknown name) for use anywhere an SVG data URI is needed, and
  `svgToIconEntry(rawSvg)` parses a copied `<svg>` string into a registry entry —
  dropping `<mask>`/`<defs>` and `currentColor` fills so `color` can recolor the
  glyph, while preserving explicit fills/fill-rules. New exported types:
  `IconProps`, `IconEntry`, `IconPath`, `IconPathObject`, `IconSize`,
  `IconDataUriResult`, `IconDataUriOptions`.
- **Tooling: icon build pipeline** — added a `build:icons` npm script
  (`node scripts/build-icons.mjs`) and a two-step authoring flow:
  `scripts/scrape-hs-icons.console.js` harvests `data-icon-name` SVGs from
  HubSpot's web app in the DevTools console, and `scripts/build-icons.mjs` merges
  the scraped JSON **additively** into the committed
  `src/common-components/icons.generated.js` (deterministic, alphabetically
  sorted for clean diffs; `--replace` to start fresh). The intermediate
  `scripts/scraped-icons.json` dump is gitignored.

- **DataTable inline-edit selects show their dropdown directly.** In discrete
  edit mode, editable `select`/`multiselect` columns no longer render a `"--"`
  click-to-edit link that must be clicked before the dropdown appears — the
  control now renders in place (`select` uses the transparent variant;
  `MultiSelect` has no transparent variant so it shows as a normal field).
  Empty cells default their placeholder to "Select", overridable via
  `editProps.placeholder`.

- **CRM cursor pagination fixed** — `buildCrmSearchConfig` now appends a unique
  `hs_object_id` tiebreaker to every CRM search sort. CRM `after`-cursor paging
  is only deterministic over a totally-ordered set; with no sort (or a sort with
  ties) the order drifted between page requests, so cursors overlapped, pages
  came back short, and `hasMore` was wrong (the "blank/short page 2, page 3
  unreachable" bug). With the stable tiebreaker, all CRM result ordering is now
  deterministic.
- **CrmDataTable / CrmKanban lazy-load additional CRM batches.** They still use
  client-side UI pagination over loaded rows, but now consume HubSpot's fixed
  `useCrmSearch().pagination.nextPage()` cursor under the hood: e.g.
  `pageLength={100}` + `pageSize={10}` lets DataTable pages 1–10 render from the
  first batch, and clicking page 11 fetches/appends rows 101–200. CrmKanban uses
  the same cursor via its `Load more` affordance. The lower-level CRM search
  adapters also expose native `pagination` / `hasMore` for custom views.

- **New: `CrmKanban`** — the board analog of `CrmDataTable`. Fetches one batch
  and groups / searches / filters / sorts client-side by default. `stages` is
  optional: pass it for real pipeline labels, or let stages auto-derive from the
  batch (labelled via `stageLabels` or prettified). Same `serverSide` opt-in and
  "first N of M" note. Removes the hand-wiring (params, data source, stage
  derivation, prop threading) the deal-board demo previously needed.

- **CrmDataTable**: now **fetches one batch (`pageLength`, default 100) and does
  search / sort / filter / pagination client-side by default** — a single
  request, no refetch per interaction, and pagination "just works" (in-memory
  slicing). When the result set exceeds the batch it shows a "first N of M" note
  rather than silently showing a partial view. `serverSide` forces CRM-backed
  search/filter/sort from the first render. A built-in sort translator maps the
  active column sort to CRM `sorts` (honoring `propertyMap`) in server-query mode,
  so callers no longer hand-write a `sortMap`. The data-source options are
  memoized so the underlying config no longer churns every render.
- **DataTable, Kanban, Feed**: consistent default empty and loading states —
  both now render the same `EmptyState` component (Tile-wrapped, `layout="vertical"`),
  so they match exactly with no layout shift. Empty uses the default illustration;
  loading uses the `building` illustration with a loading title + a short message
  (overridable via `labels.loadingMessage`). (Previously Kanban/Feed loading was
  a bare spinner.)
- **CrmLookupSelect**: a picked option now stays valid after the live search
  results change — the component remembers selected options internally (no need
  to pass `selectedOptions`). It also shows `loadingOption` during the debounce
  window (not just the in-flight request) and only shows `noResultsOption` once
  a query has settled, so it no longer flashes "no results" while typing.
- **FormBuilder**: repeater reorder controls always render now, disabled on the
  first row's "up" and the last row's "down", so rows stay column-aligned;
  `repeaterProps.renderMoveUp` / `renderMoveDown` receive a `disabled` flag.
- **FormBuilder**: tightened the spacing between the repeater "add" icon and its
  label (`gap="flush"` → `gap="xs"`).
- **Collection toolbar standardization**: `DataTable`, `Kanban`, `Feed`, and
  `Calendar` now share the same toolbar/filter/chip primitives internally, so
  search, inline filters, overflow filters, active chips, "Clear all", sort
  selects, and count alignment behave consistently across views. Right-side
  controls/counts align to the lowest toolbar row by default, matching the
  DataTable chip-row behavior. DataTable, Kanban, and Feed expose optional
  `toolbarLeftFlex` / `toolbarRightFlex` props (default `3 / 1`); Calendar
  defaults to a 60/40 toolbar split via `toolbarLeftFlex={3}` /
  `toolbarRightFlex={2}` so Today/prev/next/view controls have enough room.
- **New shared collection primitives** exposed from `hs-uix/common-components`:
  `CollectionToolbar`, `CollectionFilterControl`, `ActiveFilterChips`,
  `CollectionSortSelect`, `CollectionCount`, and `formatCollectionCount`.
  Toolbar child input/select names are automatically uniqued with React `useId`,
  so multiple tables/boards/feeds/calendars can render in the same extension
  without form-control name collisions.
- **New shared query helpers** exposed from `hs-uix/utils`:
  `getEmptyFilterValues`, `resetFilterValues`, and `buildActiveFilterChips`
  alongside the existing filter/search helpers. Filter configs now support a
  canonical `emptyValue` for custom select-empty semantics. These helpers power
  the shared toolbar behavior and are covered by unit tests.
- **Kanban**: toolbar sort now matches Feed's compact transparent `Select`
  style instead of opening a sort modal. Existing `sortOptions` still drive the
  board-wide sort.
- **Feed**: active filter chips and clear/reset behavior now match DataTable and
  Kanban; `showFilterBadges`, `showClearFiltersButton`, and filter `chipLabel`
  are supported. The Collapse/Expand all link keeps its words together to avoid
  wrapping `all` onto its own line.
- **DataTable, Kanban**: `showClearFiltersButton` now defaults to the value of
  `showFilterBadges` instead of always `true`. Hiding the active-filter chips
  (`showFilterBadges={false}`) now also hides the "Clear all" reset button by
  default, so a single prop suppresses both filter affordances. Callers who want
  the reset button without chips can still opt in with
  `showClearFiltersButton={true}`, and an explicit `false` is unchanged. The
  default with `showFilterBadges` left at `true` is identical to before.
  ([#10](https://github.com/05bmckay/hs-uix/issues/10))
- **DataTable**: the record count now sits on the title row when a `title` is set
  and the toolbar has no left-hand content (search and filters hidden), instead
  of always living in the toolbar's right column. Previously a count-only header
  stacked the title and count on two lines; now they share one line, and the
  count still rides in the toolbar whenever search/filter controls are present.

### Internal architecture refactor (no public API changes)

Internal restructuring to make the library more testable and AI-navigable.
Most component APIs remain backward-compatible; several shared collection
building blocks and query helpers are now intentionally exported for custom
views. A vitest harness was added; **89 unit tests** now cover the extracted
modules.

### Shared query pipeline
- New internal `src/utils/query.js`: the filter / search primitives and the
  filter+search pipeline that were **copy-pasted identically** into `DataTable`
  and `Kanban` (`getEmptyFilterValue`, `isFilterActive`, `formatDateChip`,
  `dateToTimestamp`, `toStableKey`, `filterRows`, `searchRows`) now live in one
  unit-tested place. `DataTable.jsx` and `Kanban.jsx` import from it.
  - _Feed keeps its own path-accessor filtering dialect on purpose — folding it
    in would have changed Feed's (string-coercing) behavior._

### FormBuilder validation & dependencies
- New `src/form/formValues.js`: pure value model (empty values,
  emptiness, deep equality/clone, HubSpot date/time shape predicates).
- New `src/form/formValidation.js`: the validation engine
  (required / type / pattern / min-max / custom sync + async validators,
  field-config resolution). Previously buried in the component and only
  reachable by mounting the form; now pure and directly tested.
- New `src/form/formDependencies.js`: the dependent-field cascade
  (`resolveDependentCascade`) — formerly a BFS walk inside `handleFieldChange`,
  now a pure, table-tested function (multi-level chains, multiselect filtering,
  value-no-longer-valid clearing).

### CRM helpers
- New `src/utils/objectPath.js` (`getByPath`): removes a byte-for-byte
  duplicate definition that lived in both `crmSearchAdapters.js` and
  `CrmLookupSelect.js`.

### Shared interaction hooks
- New `src/utils/interactionHooks.js`: `useDebouncedDispatch` (search
  debounce-settle) and `useSelectionReset` (clear selection on query change) —
  the two stateful patterns that `DataTable` and `Kanban` each reimplemented.

### DataTable edit validation
- New `src/datatable/editValidation.js` (`editValidationError`):
  the `editValidate`-result interpretation rule, previously duplicated in four
  places, now centralized and tested.
- See `docs/adr/0001-no-unified-edit-control-factory.md` for why the larger
  edit-control factory was **deliberately not** extracted (it would have been a
  shallow abstraction with no test surface).

### Tooling
- Added `vitest` dev dependency and unit test coverage for the extracted modules.
