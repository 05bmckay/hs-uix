# Release Draft

Current version: `1.5.1`

Recommended bump: `minor`

Suggested command:

```bash
npm run release:minor
```

Suggested next version: `1.6.0`

## GitHub Release Notes

```md
### Features
- **Kanban:** Add the new `Kanban` board package and publish it through the root package plus the `hs-uix/kanban` subpath export.
- **Common Components:** Add reusable UI helpers including `AutoTag`, `AutoStatusTag`, `AvatarStack`, `SectionHeader`, `KeyValueList`, `StyledText`, date presets, and SVG builder utilities.
- **FormBuilder:** Support `colSpan: "full"` on fields to force a standalone full-width row inside a multi-column section, add a `description` microcopy line to `groups` options, and default group labels to a start-cased version of the group key.
- **Utils:** Add `formatCurrencyCompact` for HubSpot-style compact money (`$123.6M`, `$4.2K`) and new `viewAdapters` helpers (`deriveCardFieldsFromColumns`) for projecting a single DataTable column config into a Kanban `cardFields` array.

### Bug Fixes
- **StyledText:** Add a HubSpot-style `tag` preset with semantic variants (`default`, `success`, `warning`, `error`/`danger`, `info`) so SVG-backed tags render closer to native HubSpot tags.
- **Kanban:** Update collapsed stage count badges to use the shared HubSpot-style tag preset instead of ad hoc pill styling.
- **Types/Exports:** Sync runtime exports with declaration files for common-components, kanban, SVG helpers, and style constants so published imports match the documented API. Adds `FormBuilderGroupOptions` to the form type exports.

### Docs
- **README:** Add root-level documentation for Common Components and Utils, plus updated examples for the new shared component surface.
- **Common Components:** Document `AvatarStack`, `StyledText` tag presets and semantic variants, date presets, and SVG style constants for release consumers.
- **Utils:** Expand the Utils README with `formatCurrencyCompact`, `viewAdapters`, and end-to-end examples.
```

## Pre-Release Checklist

- Run `npm run build`
- Review `git diff` for any unrelated workspace changes before tagging
- Commit the release-ready changes
- Run `npm run release:minor`
- Create the GitHub release using the notes above
