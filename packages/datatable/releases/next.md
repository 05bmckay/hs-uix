# Next Release (unreleased)

Changes queued for the next version bump.

## Added

- **Column-level `footer`** — declare footer content directly on column definitions instead of manually building `<TableRow>`/`<TableHeader>` markup. Accepts a static `ReactNode` (e.g. `"Total"`) or a function `(rows) => ReactNode` that receives filtered data. DataTable auto-generates the footer row with correct alignment, accounting for selectable checkbox and row action columns. The existing `footer` render-function prop still works for full custom control.
- Filter toolbar visibility controls:
  - `showFilterBadges` (default `true`) to show/hide active filter chips.
  - `showClearFiltersButton` (default `true`) to show/hide the "Clear all" filter reset action.
- You can now hide badges while still keeping reset available, e.g. `showFilterBadges={false}` with `showClearFiltersButton={true}`.
- Bundled TypeScript declarations (`index.d.ts`) are now shipped with the package and exposed via `types`/`exports.types`.
- Type declarations now reflect width behavior accurately:
  - `width` supports `"min" | "max" | "auto" | number`
  - `cellWidth` supports `"min" | "max" | "auto"` only
- `rowCountText` callback now receives current-page data row count as first argument (`shownOnPage`) and total matching rows as second argument (`totalMatching`).
- README now includes a dedicated row-count customization section with explicit `rowCountText(shownOnPage, totalMatching)` semantics.
