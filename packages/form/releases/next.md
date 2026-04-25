# Next Release (unreleased)

## Features
- FormBuilder: add `alwaysEditable` field prop — per-field escape hatch that keeps a field editable even when the form-level `readOnly` is set (#8).
- FormBuilder: surface submit-time validation failures via a new `onValidationFail({ errors, fields, firstInvalidField })` callback, and add `openSectionOnValidationFail` to auto-open the accordion section containing the first invalid field (#9).

## Docs
- Update README to use `hs-uix` / `hs-uix/form` import paths (was still referencing the legacy `@hs-uix/form` standalone name).
- Document `maxColumns`, `showReadOnlyAlert`, `showInlineAlerts`, `renderReadOnlyAlert`, `renderFieldError`, and `defaultCurrency` in the FormBuilder Props reference table.
- Document the CRM-association field props (`objectTypeId`, `associationLabels`, `filters`, `sort`) plus `properties`/`direction`/`objectId` in the Field Props reference table.
- Note `allValues` deprecation in the custom-render helper signature.
- Refresh `AGENT.md` to describe the current monorepo layout and the root-only release flow.
