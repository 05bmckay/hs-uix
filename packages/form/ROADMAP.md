# @hs-uix/form — Roadmap

> Feature requests validated against real CRM card audits (April 2025):
> Sola Salons (VagaroInviteFormPanel, Deal modals, Vagaro Pro Invite),
> React Swag Card (OrderTabContent, address verification, cart+form),
> UI Extensions Standards (forms.md)

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

## v0.2.0 — Sections & Layout (shipped)

### Sections (Accordion Grouping)

> **Source:** VagaroInviteFormPanel (5 accordion sections, 944 lines), Swag Card (3 visual sections)

Group fields into labeled, collapsible sections within a single view. This is the #1 blocker for adopting FormBuilder in complex forms — VagaroInviteFormPanel alone could drop from 944 to ~400 lines.

```jsx
<FormBuilder
  fields={fields}
  sections={[
    { id: "basic", label: "Basic Info", fields: ["firstName", "lastName", "email", "phone"], defaultOpen: true },
    { id: "social", label: "Social Links", fields: ["facebook", "instagram", "twitter"], defaultOpen: false },
    { id: "hours", label: "Business Hours", fields: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
  ]}
  onSubmit={handleSubmit}
/>
```

**Behavior:**
- Each section renders in a collapsible container (Accordion or Section — TBD)
- `defaultOpen` controls initial expand state
- Fields not listed in any section render after all sections
- Layout props (`columns`, `columnWidth`, `layout`) apply within each section independently
- Sections are independent of `steps` — a step can contain multiple sections

### Field groups with Dividers

> **Source:** Original roadmap, validated by Swag Card pattern (Recipient / Address / Notes visual separators)

Lightweight alternative to sections — group related fields with a Divider + optional group label. Non-collapsible.

```jsx
fields={[
  { name: "name", type: "text", label: "Name", group: "Contact Info" },
  { name: "email", type: "text", label: "Email", group: "Contact Info" },
  // Divider auto-inserted between groups
  { name: "company", type: "text", label: "Company", group: "Company Info" },
]}
```

### Computed display fields

> **Source:** Swag Card (Google Maps preview URL dynamically computed from address fields)

Read-only reactive elements that update based on other field values — preview links, calculated totals, formatted summaries.

```jsx
{
  name: "mapPreview",
  type: "display", // no value, no validation, render-only
  render: ({ allValues }) => {
    const url = buildMapsUrl(allValues.address, allValues.city, allValues.zip);
    return url ? <Link href={url}>Preview in Google Maps</Link> : null;
  },
}
```

**Behavior:**
- `type: "display"` fields have no form value, no validation, no label (unless specified)
- Re-render when any dependency value changes
- Work with all layout modes (columns, sections, etc.)
- Not included in `onSubmit` values

### Form-level read-only mode

> **Source:** VagaroInviteFormPanel (premium account lock with warning Alert)

```jsx
<FormBuilder
  fields={fields}
  readOnly={isPremiumAccount}
  readOnlyMessage="This is a premium Vagaro account. Editing is disabled."
  onSubmit={handleSubmit}
/>
```

**Behavior:**
- Sets `readOnly` on all fields (merged with per-field readOnly)
- Hides submit/cancel buttons
- Shows `Alert variant="warning"` with the message (if provided)
- Ref API still works (`getValues`, `isDirty`, etc.)

---

## v0.3.0 — Validation & Submit Lifecycle (shipped)

### Async validation

> **Source:** Swag Card (address verification via serverless "addresscorrector"), original roadmap

`validate` can return a Promise. Field shows loading indicator while async validation runs.

```jsx
{
  name: "email",
  type: "text",
  label: "Email",
  validate: async (value, allValues) => {
    const exists = await checkEmailExists(value);
    return exists ? "Email already in use" : true;
  },
  validateDebounce: 500, // debounce async validation (ms)
}
```

**Behavior:**
- Async validators run after sync validators pass
- Field shows a loading indicator while in-flight
- Debounce prevents excessive calls during typing
- Submit waits for all pending async validations to resolve
- `validateOnBlur` is the natural trigger (not every keystroke)

### Field-level loading

Spinner on individual fields while fetching options.

```jsx
{ name: "assignee", type: "select", label: "Assignee",
  loading: true, options: teamMembers }
```

### Value transform on submit

> **Source:** VagaroInviteFormPanel (~90 lines of payload building: business hours JSON, social URL serialization, image dedup)

Transform flat form values before submission — serialize arrays to JSON, combine fields, format timestamps.

```jsx
<FormBuilder
  fields={fields}
  transformValues={(values) => ({
    ...values,
    fullName: `${values.firstName} ${values.lastName}`.trim(),
    businessHours: JSON.stringify(buildHoursArray(values)),
  })}
  onSubmit={(transformedValues, { reset, rawValues }) => {
    await serverless("save", { parameters: transformedValues });
  }}
/>
```

### onSubmitSuccess / onSubmitError

> **Source:** Swag Card (tab switch + history refresh post-submit), Sola (actions.addAlert), original roadmap

Post-submit lifecycle callbacks.

```jsx
<FormBuilder
  onSubmit={saveRecord}
  onSubmitSuccess={(result, { reset, values }) => {
    actions.addAlert({ type: "success", message: "Saved!" });
    actions.closePanel();
  }}
  onSubmitError={(err, { values }) => {
    actions.addAlert({ type: "danger", message: err.message });
  }}
/>
```

**Behavior:**
- `onSubmit` return value is passed to `onSubmitSuccess`
- If `onSubmit` throws, error is passed to `onSubmitError`
- Auto-resets form on success if `resetOnSuccess={true}`
- Loading state managed automatically across the full lifecycle

### Confirmation before submit

> **Source:** Swag Card (OrderConfirmationModal with summary before final submission)

Intercept submit for a review/confirmation step before final submission.

```jsx
<FormBuilder
  fields={fields}
  onBeforeSubmit={(values) => {
    // Return false to cancel, true to proceed, or Promise<boolean>
    return new Promise((resolve) => {
      setShowConfirmModal(true);
      confirmRef.current = resolve;
    });
  }}
  onSubmit={handleSubmit}
/>
```

**Alternative — built-in confirm:**
```jsx
<FormBuilder
  confirmSubmit={{
    title: "Confirm Order",
    message: (values) => `Send ${values.items.length} items to ${values.name}?`,
    confirmLabel: "Confirm & Send",
    cancelLabel: "Go Back",
  }}
/>
```

### Warn on dirty close

Confirmation when navigating away from unsaved changes.

---

## v0.4.0 — Field Intelligence (shipped)

### Field-level side effects (cross-field updates)

> **Source:** Swag Card (address correction updates city/state/zip from zip lookup)

Change handlers on field definitions that can update *other* fields.

```jsx
{
  name: "zip",
  type: "text",
  label: "ZIP Code",
  onFieldChange: async (value, allValues, { setFieldValue }) => {
    if (value.length === 5) {
      const geo = await lookupZip(value);
      setFieldValue("city", geo.city);
      setFieldValue("state", geo.state);
    }
  },
}
```

**Behavior:**
- Receives helpers object with `setFieldValue`, `setFieldError`
- Runs after the field's own value is updated
- Does not trigger validation on the fields it sets (avoid loops)

### Repeater fields

> **Source:** VagaroInviteFormPanel (image URL gallery), original roadmap

Add/remove rows for dynamic lists.

```jsx
{ name: "phones", type: "repeater", label: "Phone Numbers",
  fields: [
    { name: "number", type: "text", label: "Number" },
    { name: "type", type: "select", label: "Type", options: PHONE_TYPES },
  ],
  min: 1, max: 5 }
```

### Conditional required

> **Source:** VagaroInviteFormPanel (business type required only when certain conditions met)

`required` as a function of current values.

```jsx
{ name: "businessType", type: "multiselect", label: "Business Type",
  required: (values) => values.accountType === "business" }
```

### Custom field types (plugin system)

> **Source:** General extensibility need — image galleries, business hours grids, social handle inputs

Register custom renderers that get full FormBuilder integration (label, error display, description, layout).

```jsx
<FormBuilder
  fieldTypes={{
    imageGallery: {
      render: ({ value, onChange, error, field }) => (
        <ImageGalleryInput urls={value} onUpdate={onChange} error={error} />
      ),
      getEmptyValue: () => [],
      isEmpty: (v) => v.length === 0,
    },
  }}
  fields={[
    { name: "photos", type: "imageGallery", label: "Photos", required: true },
  ]}
/>
```

---

## v0.5.0 — CRM Integration (shipped)

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

## Backlog (shipped)

| Feature | Source | Resolution |
|---------|--------|------------|
| Debounced search fields | HelpTagPanel, Quick Links | ✅ `debounce` prop on field definitions — delays onChange callback |
| CrmPropertyList bridge | Deal edit panels | ✅ `type: "crmPropertyList"` and `type: "crmAssociationPropertyList"` — hands-off native HubSpot CRM components, no form value/validation |
| Inline editing mode | UI Standards forms.md | Already supported via `variant: "transparent"` on Select fields + `fieldProps` passthrough — a DataTable concern, not FormBuilder |

---

## Already Supported (No Changes Needed)

Patterns found in the CRM card audit that FormBuilder already handles:

| Pattern | How It's Supported |
|---------|-------------------|
| Panel/Modal integration | `submitPosition="none"` + ref API for external button control |
| Per-field readOnly | `readOnly` on field definition |
| Conditional field visibility | `visible: (values) => boolean` |
| Dynamic options | `options: (values) => OptionType[]` |
| Custom field rendering | `render` escape hatch |
| Loading state on submit | `loading` prop + `LoadingButton` |
| Form-level error/success | `error` and `success` props |
| Multi-column layout | `columns`, `columnWidth`, `layout` props |
| Dependent field grouping | `dependsOn` with Tile wrapper |

---

## CRM Card Audit — Adoption Impact

| Project | Current Lines | With FormBuilder | Savings | Key Blockers |
|---------|--------------|-----------------|---------|--------------|
| VagaroInviteFormPanel | ~944 | ~400 | ~55% | Sections, value transform |
| Vagaro Pro Invite Dev | ~500 | ~250 | ~50% | Sections, conditional fields |
| Deal Close Modal | ~60 | ~25 | ~58% | None (ready today) |
| Deal Edit Modals (3x) | ~140 | ~60 | ~57% | None (ready today) |
| Swag Card OrderTab | ~294 | ~120 | ~59% | Sections, async validation |

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
| `"display"` | Custom render | Shipped — v0.2.0 |
| `"repeater"` | Sub-field rows | Shipped — v0.4.0 |

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
| `columns` | `number` | `1` | Grid columns |
| `columnWidth` | `number` | — | AutoGrid responsive layout |
| `layout` | `FormBuilderLayout` | — | Explicit row layout |
| `gap` | `string` | `"sm"` | Field gap |
| `showRequiredIndicator` | `boolean` | `true` | Show * on required |
| `noFormWrapper` | `boolean` | `false` | Skip Form element |
| `error` | `string \| boolean` | — | Form-level error |
| `success` | `string` | — | Form-level success |

### Planned Props

| Prop | Type | Version | Description |
|---|---|---|---|
| `sections` | `FormBuilderSection[]` | v0.2.0 ✅ | Accordion field grouping |
| `readOnly` | `boolean` | v0.2.0 ✅ | Lock all fields |
| `readOnlyMessage` | `string` | v0.2.0 ✅ | Warning alert in read-only mode |
| `transformValues` | `(values) => values` | v0.3.0 ✅ | Reshape values before submit |
| `onBeforeSubmit` | `(values) => boolean \| Promise` | v0.3.0 ✅ | Intercept submit for confirmation |
| `onSubmitSuccess` | `(result, helpers) => void` | v0.3.0 ✅ | Post-submit success callback |
| `onSubmitError` | `(error, helpers) => void` | v0.3.0 ✅ | Post-submit error callback |
| `resetOnSuccess` | `boolean` | v0.3.0 ✅ | Auto-reset after success |
| `confirmSubmit` | `ConfirmSubmitConfig` | Backlog | Built-in confirm modal (requires Dialog) |
| `fieldTypes` | `Record<string, FieldTypePlugin>` | v0.4.0 ✅ | Custom field type registry |
| `autoSave` | `AutoSaveConfig` | v0.5.0 ✅ | Debounced auto-save |

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
