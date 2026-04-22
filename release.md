# Release Draft

Current version: `1.6.0`

Recommended bump: `patch`

Suggested command:

```bash
npm run release:patch
```

Suggested next version: `1.6.1`

## GitHub Release Notes

```md
### Docs
- **DataTable:** Swap the package-level README over to `hs-uix` / `hs-uix/datatable` (was still referencing the legacy `hubspot-datatable` standalone name), and document `onEditStart` / `onEditCancel`, the `labels` i18n object, `filterInlineLimit`, `showSearch` / `showSelectionBar`, and the `renderSelectionBar` / `renderEmptyState` / `renderLoadingState` / `renderErrorState` override hooks. Column Definition gains `sortOrder`, `sortComparator`, and column-level `footer`.
- **FormBuilder:** Swap the package-level README over to `hs-uix` / `hs-uix/form` (was still referencing `@hs-uix/form`), and document `maxColumns`, `showReadOnlyAlert`, `showInlineAlerts`, `renderReadOnlyAlert`, `renderFieldError`, `defaultCurrency`, and the full set of CRM-association field props (`objectTypeId`, `associationLabels`, `filters`, `sort`).
- **Common Components:** Document the `HS_TAG_*` style constants alongside the existing `HS_FONT_FAMILY` / `HS_TEXT_COLOR` / etc. tokens.
- **AGENT:** Refresh `packages/datatable/AGENT.md`, `packages/form/AGENT.md`, and root `AGENTS.md` to describe the current monorepo layout (DataTable + FormBuilder + Kanban + common-components + utils), the root-only release flow, and the `hs-uix-demos` link setup.

### Bug Fixes
- **Types:** Add missing `formatCurrencyCompact` and `deriveCardFieldsFromColumns` declarations to `utils.d.ts` — the runtime exports were already shipping but TypeScript consumers couldn't import them without `@ts-ignore`.
```

## Pre-Release Checklist

- Run `npm run build`
- Review `git diff` for any unrelated workspace changes before tagging
- Commit the release-ready changes
- Run `npm run release:patch`
- Create the GitHub release using the notes above
