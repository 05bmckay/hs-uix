# Next Release (unreleased)

## Docs
- Update README to use `hs-uix` / `hs-uix/datatable` import paths and the main `hs-uix` npm package (was still referencing the legacy `hubspot-datatable` standalone name).
- Document `onEditStart`, `onEditCancel`, `labels` (i18n), `filterInlineLimit`, `showSearch`, `showSelectionBar`, and the `renderSelectionBar` / `renderEmptyState` / `renderLoadingState` / `renderErrorState` override hooks in the DataTable Props reference table.
- Add `sortOrder`, `sortComparator`, and column-level `footer` to the Column Definition reference table. Correct `label` to `ReactNode` and widen `truncate` to include `number`.
- Correct the `GroupBy.label` return type to `ReactNode`.
- Drop the outdated `hubspot-datatable-demo` link block.
- Refresh `AGENT.md` to describe the current monorepo layout and the root-only release flow.
