# Next Release (unreleased)

Changes queued for the next version bump.

## Added

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
