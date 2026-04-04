# @hs-ui/form — FormBuilder

## Project Structure

```
hs-ui-form/
├── package.json        ← npm package config (@hs-ui/form)
├── tsup.config.js      ← build: JSX → ESM + CJS
├── src/
│   ├── index.js        ← barrel export
│   └── FormBuilder.jsx ← the component (single file)
├── index.d.ts          ← TypeScript definitions
├── dist/               ← built output (gitignored)
└── README.md
```

## Build

```bash
npm run build       # one-time build
npm run dev         # watch mode
```

tsup compiles `src/` → `dist/` (ESM + CJS). React and @hubspot/ui-extensions are externals (peer deps, not bundled).

## Release Process

All-in-one commands that bump version, build, publish to npm, and push tags:

```bash
npm run release:patch    # bug fix:      0.1.0 → 0.1.1
npm run release:minor    # new feature:  0.1.0 → 0.2.0
npm run release:major    # breaking:     0.1.0 → 1.0.0
```

## Component Architecture

FormBuilder is a single exported component in `src/FormBuilder.jsx`. It takes a `fields` array and `onSubmit` callback, rendering a complete form with state management, validation, and layout — all using HubSpot UI Extension primitives.

### Modes

- **Uncontrolled (default)**: Component owns form values via `initialValues`
- **Controlled**: Parent owns values via `values` + `onChange`

### Exports

- `FormBuilder` — the main component (default)
- `useFormPrefill` — hook to map CRM property values to form initial values

### Internal Code Organization

The component follows a strict section order, separated by `// ---` comment banners:

1. **Props destructuring** — grouped by concern (core, submit lifecycle, values, validation, multi-step, buttons, appearance, states, events)
2. **Internal state** — `internalValues`, `internalErrors`, `internalStep`, `internalLoading`, `touchedFields`, `validatingFields`
3. **State resolution** — controlled vs uncontrolled (`formValues = values != null ? values : internalValues`)
4. **Dirty tracking** — JSON.stringify snapshot comparison with `initialSnapshot` ref
5. **Auto-save** — debounced effect watching `formValues` + `isDirty`
6. **Visible fields computation** — `useMemo` filtering by `visible` predicate and current step
7. **Validation engine** — `validateField`, `validateVisibleFields`, `updateErrors`
8. **Async validation engine** — `runAsyncValidation`, `triggerAsyncValidation` with debounce support
9. **Event handlers** — `handleFieldChange`, `handleDebouncedFieldChange`, `handleFieldInput`, `handleFieldBlur`, `handleSubmit`, `handleNext`, `handleBack`, `handleGoTo`
10. **Ref API** — `useImperativeHandle` exposing `submit`, `validate`, `reset`, `getValues`, `isDirty`, `setFieldValue`, `setFieldError`, `setErrors`
11. **Field rendering** — `renderField(field)` dispatches to correct HubSpot component by `type`, with plugin/CRM component support
12. **Layout rendering** — `renderFieldSubset`, `renderFieldLayout` dispatches to four modes + sections + field group dividers
13. **Sections rendering** — `renderSections` wraps field groups in `Accordion` components
14. **Buttons rendering** — multi-step (Back/Next/Submit) or single-step layout, hidden in readOnly mode
15. **Main render** — Form wrapper → Flex column → StepIndicator → ReadOnly Alert → Alerts → Fields → Buttons

### Controlled vs Uncontrolled Pattern

Same pattern as DataTable:

```
prop: externalValue        ← controlled (from parent)
state: internalValue       ← uncontrolled (internal)
resolved = external != null ? external : internal
```

This applies to: `values`/`internalValues`, `step`/`internalStep`, `loading`/`internalLoading`

### Field Type → Component Mapping

| Field `type` | HubSpot Component |
|---|---|
| `text`, `password` | `Input` |
| `textarea` | `TextArea` |
| `number` | `NumberInput` |
| `stepper` | `StepperInput` |
| `currency` | `CurrencyInput` |
| `date` | `DateInput` |
| `time` | `TimeInput` |
| `datetime` | `DateInput` + `TimeInput` in Flex row |
| `select` | `Select` |
| `multiselect` | `MultiSelect` |
| `toggle` | `Toggle` |
| `checkbox` | `Checkbox` |
| `checkboxGroup` | `ToggleGroup toggleType="checkboxList"` |
| `radioGroup` | `ToggleGroup toggleType="radioButtonList"` |
| `display` | Custom render (no form value) |
| `repeater` | Sub-field rows with add/remove |
| `crmPropertyList` | `CrmPropertyList` from `@hubspot/ui-extensions/crm` |
| `crmAssociationPropertyList` | `CrmAssociationPropertyList` from `@hubspot/ui-extensions/crm` |
| Custom types | Via `fieldTypes` plugin registry |

### Validation Engine

Built-in validators run in order, first failure wins:

1. **Required** — empty check (supports `required` as function) → `"{label} is required"`
2. **Pattern** — regex test → `patternMessage` or `"Invalid format"`
3. **Min/Max length** — string length check
4. **Min/Max value** — numeric range check
5. **Custom sync** — `validate(value, allValues)` returning `true | string`
6. **Custom async** — `validate` returning `Promise<true | string>` (runs after sync passes, with optional `validateDebounce`)

Custom field types can provide `isEmpty` for custom empty checks.

Validation timing: `validateOnChange` (onInput), `validateOnBlur` (default + async trigger), `validateOnSubmit` (always, waits for pending async)

### Dependent Properties

Fields with `dependsOn` pointing to a parent field are grouped in a `Tile` container with a "Dependent properties" header and optional info tooltip. This matches HubSpot's native conditional field pattern.

### Multi-Step

When `steps` prop is provided: `StepIndicator` at top, only current step's fields shown, Back/Next navigation with per-step validation, Submit on last step.

## Code Conventions

- **Single file**: Keep FormBuilder in one file. Don't split into sub-components.
- **Section banners**: Use `// ---------------------------------------------------------------------------` banners to separate logical sections.
- **Inline comments on props**: Each prop gets a short `// description` comment on the same line.
- **No external dependencies**: Only `react`, `@hubspot/ui-extensions`, and `@hubspot/ui-extensions/crm`. No lodash, no utility libraries.
- **Peer deps, not bundled**: React and @hubspot/ui-extensions (including /crm subpath) are always externals.
- **`"files": ["dist", "index.d.ts", "README.md"]`** in package.json controls what ships to npm.

## UI Conventions

- All components from `@hubspot/ui-extensions` and `@hubspot/ui-extensions/crm` — no HTML elements, no CSS.
- Form fields in `Flex direction="column" gap="sm"` (FRM-06).
- Layout uses four modes: `layout` prop (explicit rows), `columnWidth` (AutoGrid responsive), `columns` (Flex+Box grid with colSpan), legacy (half-width pairing).
- Multi-column grid rows use `Flex direction="row"` with `Box flex={colSpan}` wrappers; partial rows get an empty `Box` spacer.
- AutoGrid mode uses `<AutoGrid columnWidth={n} flexible>` for responsive column collapse.
- Dependent properties use `Tile` with demibold `Text` header and `Icon name="info"` tooltip.
- One primary button per form (BTN-01). Submit at bottom (FRM-03).
- `LoadingButton` for submit to prevent double-submit (FRM-05).
