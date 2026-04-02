# @hs-uix/form — Roadmap

## v0.1.0 — Core (shipped)

- 16 field types mapping to HubSpot components
- Controlled/uncontrolled state management
- Validation engine (required, pattern, minLength/maxLength, min/max, custom)
- Validation timing (onInput, onBlur, onSubmit)
- Multi-step wizard with StepIndicator + per-step validation
- Ref API (submit, validate, reset, getValues, isDirty, setFieldValue, setFieldError)
- Dirty tracking
- Conditional visibility (`visible` predicate)
- Dependent properties (Tile grouping with demibold header + info tooltip)
- Cascading options (`options` as function)
- Half-width layout (`width: "half"`)
- Custom render escape hatch
- Configurable Form wrapper (`noFormWrapper`)
- Loading state with LoadingButton
- TypeScript definitions

---

## v0.1.1 — QA & Bug Fixes

Test the deployed demo against real HubSpot and fix issues:

- [ ] Verify all 16 field types render correctly
- [ ] Test validation timing — blur fires, submit blocks, validateOnChange works
- [ ] Test multi-step — StepIndicator renders, per-step validation blocks Next, Back preserves values
- [ ] Test dependent properties — Tile appears/disappears, tooltip renders, multiple dependents group
- [ ] Test cascading options — sub-category updates when parent changes
- [ ] Test ref API — external submit validates, reset clears, isDirty tracks
- [ ] Test half-width pairing — side-by-side rendering, odd count graceful
- [ ] Test controlled mode — bidirectional values + onChange
- [ ] Test edge cases — empty fields array, single field, all hidden, step with no visible fields
- [ ] Fix HubSpot component prop mismatches (readOnly vs readonly, event signatures, etc.)

---

## v0.2.0 — Polish

### Field groups with Dividers

Group related fields with a Divider + optional group label.

```jsx
fields={[
  { name: "name", type: "text", label: "Name", group: "Contact Info" },
  { name: "email", type: "text", label: "Email", group: "Contact Info" },
  // Divider auto-inserted between groups
  { name: "company", type: "text", label: "Company", group: "Company Info" },
]}
```

### Repeater fields

Add/remove rows for dynamic lists.

```jsx
{ name: "phones", type: "repeater", label: "Phone Numbers",
  fields: [
    { name: "number", type: "text", label: "Number" },
    { name: "type", type: "select", label: "Type", options: PHONE_TYPES },
  ],
  min: 1, max: 5 }
```

### Async validation

`validate` can return a Promise.

```jsx
{ name: "email", validate: async (v) => {
  const exists = await checkEmailExists(v);
  return exists ? "Email already in use" : true;
}}
```

### Field-level loading

Spinner on individual fields while fetching options.

```jsx
{ name: "assignee", type: "select", label: "Assignee",
  loading: true, options: teamMembers }
```

### onSubmitSuccess / onSubmitError

Post-submit UX callbacks.

```jsx
<FormBuilder
  onSubmit={saveRecord}
  onSubmitSuccess={() => actions.addAlert({ type: "success", message: "Saved!" })}
  onSubmitError={(err) => actions.addAlert({ type: "danger", message: err.message })}
/>
```

### Warn on dirty close

Confirmation when navigating away from unsaved changes.

---

## v0.3.0 — CRM Integration

### Server-side validation mapping

Map API error responses to field errors.

```jsx
try { await saveRecord(values); }
catch (err) { formRef.current.setErrors(err.errors); }
```

### Prefill from CRM properties

Helper to map property values to form values.

```jsx
import { useFormPrefill } from "@hs-uix/form";
const initialValues = useFormPrefill(properties, {
  firstName: "firstname",
  lastName: "lastname",
});
```

### Schema from HubSpot properties

Generate field definitions from CRM property definitions.

```jsx
import { fieldsFromProperties } from "@hs-uix/form";
const fields = fieldsFromProperties(propertyDefs, {
  include: ["firstname", "lastname", "email", "lifecyclestage"],
});
```

### Autosave

Debounced auto-save on change.

```jsx
<FormBuilder autoSave={{ debounce: 1000, onAutoSave: saveDraft }} />
```

---

## v0.4.0 — Docs & README

- [ ] Full README.md with examples (quick start, field types, validation, multi-step, ref API, panel integration)

---

## Field Type Reference

| `type` | HubSpot Component | Notes |
|---|---|---|
| `"text"` | `Input` | Default type |
| `"password"` | `Input type="password"` | |
| `"textarea"` | `TextArea` | |
| `"number"` | `NumberInput` | |
| `"stepper"` | `StepperInput` | |
| `"currency"` | `CurrencyInput` | Requires `currency` prop |
| `"date"` | `DateInput` | |
| `"time"` | `TimeInput` | |
| `"datetime"` | `DateInput` + `TimeInput` in Flex | Composite field |
| `"select"` | `Select` | Requires `options` |
| `"multiselect"` | `MultiSelect` | Requires `options` |
| `"toggle"` | `Toggle` | Boolean |
| `"checkbox"` | `Checkbox` | Boolean |
| `"checkboxGroup"` | `ToggleGroup checkboxList` | Requires `options` |
| `"radioGroup"` | `ToggleGroup radioButtonList` | Requires `options` |

---

## Props

### Core

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `FormBuilderField[]` | required | Field definitions |
| `onSubmit` | `(values, { reset }) => void` | required | Called on valid submit |
| `initialValues` | `Record<string, unknown>` | `{}` | Starting values |
| `values` | `Record<string, unknown>` | — | Controlled values |
| `onChange` | `(values) => void` | — | Change callback |
| `onFieldChange` | `(name, value, allValues) => void` | — | Per-field change |

### Validation

| Prop | Type | Default | Description |
|---|---|---|---|
| `validateOnChange` | `boolean` | `false` | Validate on keystroke |
| `validateOnBlur` | `boolean` | `true` | Validate on blur |
| `validateOnSubmit` | `boolean` | `true` | Validate all before submit |
| `onValidationChange` | `(errors) => void` | — | Validation state callback |

### Multi-Step

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `FormBuilderStep[]` | — | Enables multi-step mode |
| `step` | `number` | — | Controlled step |
| `onStepChange` | `(step) => void` | — | Step change callback |
| `showStepIndicator` | `boolean` | `true` | Show StepIndicator |
| `validateStepOnNext` | `boolean` | `true` | Validate before Next |

### Buttons

| Prop | Type | Default | Description |
|---|---|---|---|
| `submitLabel` | `string` | `"Submit"` | Submit button text |
| `submitVariant` | `"primary" \| "secondary"` | `"primary"` | Button variant |
| `showCancel` | `boolean` | `false` | Show cancel button |
| `cancelLabel` | `string` | `"Cancel"` | Cancel text |
| `onCancel` | `() => void` | — | Cancel callback |
| `submitPosition` | `"bottom" \| "none"` | `"bottom"` | Submit placement |
| `loading` | `boolean` | — | Controlled loading |
| `disabled` | `boolean` | `false` | Disable form |

### Appearance

| Prop | Type | Default | Description |
|---|---|---|---|
| `gap` | `string` | `"sm"` | Field gap |
| `showRequiredIndicator` | `boolean` | `true` | Show * on required |
| `noFormWrapper` | `boolean` | `false` | Skip Form element |
| `error` | `string \| boolean` | — | Form-level error |
| `success` | `string` | — | Form-level success |

### Events

| Prop | Type | Default | Description |
|---|---|---|---|
| `onDirtyChange` | `(isDirty: boolean) => void` | — | Dirty state callback |

### Ref API

| Method | Returns | Description |
|---|---|---|
| `submit()` | `Promise<void>` | Triggers validation + onSubmit |
| `validate()` | `{ valid, errors }` | Validates all visible fields |
| `reset()` | `void` | Resets to initial values |
| `getValues()` | `Record<string, unknown>` | Current values |
| `isDirty()` | `boolean` | Dirty state |
| `setFieldValue(name, value)` | `void` | Programmatic update |
| `setFieldError(name, message)` | `void` | Programmatic error |
