# @hs-uix/form

Declarative, config-driven FormBuilder for HubSpot UI Extensions. Define fields as data, get a complete form with validation, layout, multi-step wizards, and full HubSpot component integration.

```bash
npm install @hs-uix/form
```

## Quick Start

```jsx
import { FormBuilder } from "@hs-uix/form";

const fields = [
  { name: "firstName", type: "text", label: "First name", required: true },
  { name: "lastName", type: "text", label: "Last name", required: true },
  { name: "email", type: "text", label: "Email", pattern: /^[^\s@]+@[^\s@]+$/, patternMessage: "Enter a valid email" },
];

<FormBuilder
  columns={2}
  fields={fields}
  onSubmit={(values) => console.log(values)}
/>
```

## Field Types

Every field maps to a native HubSpot UI Extension component with full prop support:

| `type` | Component | Key Props |
|---|---|---|
| `text` | `Input` | `placeholder`, `onInput`, `onBlur` |
| `password` | `Input type="password"` | Same as text |
| `textarea` | `TextArea` | `rows`, `cols`, `resize`, `maxLength` |
| `number` | `NumberInput` | `min`, `max`, `precision`, `formatStyle` |
| `stepper` | `StepperInput` | `min`, `max`, `stepSize`, `precision`, `formatStyle`, `minValueReachedTooltip`, `maxValueReachedTooltip` |
| `currency` | `CurrencyInput` | `currency` (ISO 4217), `min`, `max`, `precision` |
| `date` | `DateInput` | `format`, `min`, `max`, `timezone`, `clearButtonLabel`, `todayButtonLabel`, `minValidationMessage`, `maxValidationMessage` |
| `time` | `TimeInput` | `interval`, `min`, `max`, `timezone` |
| `datetime` | `DateInput` + `TimeInput` | Composite — all date and time props apply |
| `select` | `Select` | `options`, `variant` (`"input"` or `"transparent"`) |
| `multiselect` | `MultiSelect` | `options` |
| `toggle` | `Toggle` | `size`, `labelDisplay`, `textChecked`, `textUnchecked` |
| `checkbox` | `Checkbox` | `inline`, `variant` |
| `checkboxGroup` | `ToggleGroup checkboxList` | `options`, `inline`, `variant` |
| `radioGroup` | `ToggleGroup radioButtonList` | `options`, `inline`, `variant` |
| `display` | Custom render | Render-only, no form value or validation |
| `repeater` | Sub-field rows | `fields`, `min`, `max` — add/remove dynamic rows |
| `crmPropertyList` | `CrmPropertyList` | `properties`, `direction` — native HubSpot inline editing |
| `crmAssociationPropertyList` | `CrmAssociationPropertyList` | `objectTypeId`, `properties`, `filters`, `sort` |

All field types share these common props: `description`, `placeholder`, `tooltip`, `required`, `readOnly`, `defaultValue`, `fieldProps` (pass-through).

## Layout

FormBuilder provides four layout modes. HubSpot rarely uses full-width inputs — use `columns` or `columnWidth` to match the platform's standard.

### Fixed Columns

Set a column count. Fields flow left-to-right, top-to-bottom.

```jsx
<FormBuilder columns={2} fields={fields} />
```

Use `colSpan` on individual fields to span multiple columns:

```jsx
const fields = [
  { name: "firstName", type: "text", label: "First name" },           // 1 column
  { name: "lastName", type: "text", label: "Last name" },             // 1 column
  { name: "bio", type: "textarea", label: "Bio", colSpan: 2 },       // full width
  { name: "city", type: "text", label: "City" },                      // 1 column
  { name: "state", type: "select", label: "State", options: STATES }, // 1 column
];

<FormBuilder columns={2} fields={fields} />
```

Partial rows get empty space (fields don't stretch to fill).

### Responsive (AutoGrid)

Set `columnWidth` in pixels. Columns collapse automatically on narrow screens using HubSpot's `AutoGrid` component.

```jsx
<FormBuilder columnWidth={200} fields={fields} />
```

With `columnWidth={200}`, a 400px card shows 2 columns; a 600px page shows 3.

### Explicit Layout

Define exact row structure with the `layout` prop. Each inner array is a row.

```jsx
<FormBuilder
  layout={[
    ["firstName", "lastName"],           // 2 equal columns
    ["email"],                           // full width
    ["city", "state", "zip"],            // 3 columns this row
  ]}
  fields={fields}
/>
```

Weighted columns use object entries:

```jsx
<FormBuilder
  layout={[
    [{ field: "address", flex: 2 }, { field: "apt", flex: 1 }],  // 2:1 ratio
  ]}
  fields={fields}
/>
```

Fields not listed in `layout` are appended full-width at the end, so you never accidentally lose a field.

### Legacy (default)

When no layout props are set (`columns` defaults to 1), consecutive fields with `width: "half"` are paired side-by-side. This preserves backward compatibility.

### Layout Priority

`layout` > `columnWidth` > `columns` > legacy

## Validation

Built-in validators run in order, first failure wins:

```jsx
{
  name: "email",
  type: "text",
  label: "Email",
  required: true,                                    // 1. Required check
  pattern: /^[^\s@]+@[^\s@]+$/,                     // 2. Regex pattern
  patternMessage: "Enter a valid email",
  minLength: 5,                                      // 3. String length
  maxLength: 100,
  validate: (value, allValues) => {                  // 4. Custom function
    if (value === allValues.confirmEmail) return true;
    return "Emails must match";
  },
}
```

### Validation Timing

| Prop | Default | When |
|---|---|---|
| `validateOnChange` | `false` | Every keystroke (onInput) |
| `validateOnBlur` | `true` | Field loses focus |
| `validateOnSubmit` | `true` | Submit attempt |

### Date/Time Validation Messages

DateInput supports custom messages for out-of-range dates:

```jsx
{
  name: "startDate",
  type: "date",
  label: "Start date",
  min: { year: 2024, month: 1, date: 1 },
  max: { year: 2025, month: 12, date: 31 },
  minValidationMessage: "Date must be in 2024 or later",
  maxValidationMessage: "Date must be before 2026",
}
```

## Controlled vs Uncontrolled

**Uncontrolled (default):** FormBuilder manages its own state.

```jsx
<FormBuilder
  fields={fields}
  initialValues={{ firstName: "John" }}
  onSubmit={(values) => save(values)}
/>
```

**Controlled:** Parent owns the values.

```jsx
const [values, setValues] = useState({});

<FormBuilder
  fields={fields}
  values={values}
  onChange={setValues}
  onSubmit={(values) => save(values)}
/>
```

## Conditional Visibility

Fields can show/hide based on other field values:

```jsx
const fields = [
  { name: "hasCompany", type: "toggle", label: "Has company?" },
  {
    name: "companyName",
    type: "text",
    label: "Company name",
    visible: (values) => values.hasCompany === true,
  },
];
```

## Dependent Properties

Fields with `dependsOn` are grouped in a HubSpot Tile container below their parent:

```jsx
const fields = [
  { name: "dealType", type: "select", label: "Deal type", options: DEAL_TYPES },
  {
    name: "contractLength",
    type: "number",
    label: "Contract length (months)",
    dependsOn: "dealType",
    dependsOnLabel: "Contract details",
    dependsOnMessage: (parentLabel) => `These properties depend on ${parentLabel}`,
    visible: (values) => values.dealType === "recurring",
  },
];
```

## Cascading Options

Options can be a function that receives all form values:

```jsx
const fields = [
  { name: "category", type: "select", label: "Category", options: CATEGORIES },
  {
    name: "subCategory",
    type: "select",
    label: "Sub-category",
    options: (values) => SUB_CATEGORIES[values.category] || [],
  },
];
```

## Multi-Step Wizard

Enable with the `steps` prop:

```jsx
<FormBuilder
  fields={allFields}
  steps={[
    { title: "Contact Info", fields: ["firstName", "lastName", "email"] },
    { title: "Company", fields: ["company", "role"] },
    { title: "Review", render: ({ values, goBack }) => (
      <ReviewPanel values={values} onEdit={goBack} />
    )},
  ]}
  showStepIndicator={true}
  validateStepOnNext={true}
  onSubmit={handleSubmit}
/>
```

Each step can have per-step validation:

```jsx
{
  title: "Passwords",
  fields: ["password", "confirmPassword"],
  validate: (values) => {
    if (values.password !== values.confirmPassword) {
      return { confirmPassword: "Passwords must match" };
    }
    return true;
  },
}
```

## Ref API

Access form methods imperatively:

```jsx
const formRef = useRef();

<FormBuilder ref={formRef} fields={fields} onSubmit={save} />

// Later:
formRef.current.submit();                              // trigger validation + submit
formRef.current.validate();                            // { valid: boolean, errors: {} }
formRef.current.reset();                               // reset to initial values
formRef.current.getValues();                           // current form values
formRef.current.isDirty();                             // true if values changed
formRef.current.setFieldValue("email", "new@test.com"); // programmatic update
formRef.current.setFieldError("email", "Taken");        // programmatic error
```

## Display Options

### Boolean Fields

```jsx
// Toggle with custom ON/OFF text
{ name: "active", type: "toggle", label: "Status", size: "md", textChecked: "Active", textUnchecked: "Inactive" }

// Toggle sizes: "xs", "sm", "md"
// Label positions: "inline", "top", "hidden"
{ name: "notify", type: "toggle", label: "Notifications", size: "sm", labelDisplay: "inline" }

// Small checkbox
{ name: "agree", type: "checkbox", label: "I agree to terms", variant: "small" }

// Inline checkbox group
{ name: "colors", type: "checkboxGroup", label: "Colors", options: COLORS, inline: true }

// Radio group with small variant
{ name: "size", type: "radioGroup", label: "Size", options: SIZES, inline: true, variant: "small" }
```

### Date & Time

```jsx
// Date formats: "short", "long", "medium", "standard", "YYYY-MM-DD", "L", "LL", "ll"
{ name: "dob", type: "date", label: "Date of birth", format: "long" }

// Timezone: "userTz" (default) or "portalTz"
{ name: "deadline", type: "date", label: "Deadline", timezone: "portalTz" }

// Time interval (minutes between dropdown options)
{ name: "meetingTime", type: "time", label: "Meeting time", interval: 15 }

// Full datetime with all options
{ name: "eventStart", type: "datetime", label: "Event start", format: "medium", timezone: "portalTz", interval: 30 }
```

### Number & Currency

```jsx
// Percentage display
{ name: "rate", type: "number", label: "Tax rate", formatStyle: "percentage", precision: 2 }

// Stepper with boundary tooltips
{ name: "quantity", type: "stepper", label: "Qty", min: 1, max: 99, stepSize: 1,
  minValueReachedTooltip: "Minimum 1 item", maxValueReachedTooltip: "Maximum 99 items" }

// Currency (ISO 4217 code)
{ name: "price", type: "currency", label: "Price", currency: "EUR", precision: 2 }
```

### Select

```jsx
// Standard dropdown
{ name: "country", type: "select", label: "Country", options: COUNTRIES }

// Transparent (hyperlink-style) dropdown
{ name: "status", type: "select", label: "Status", options: STATUSES, variant: "transparent" }
```

## Buttons

```jsx
<FormBuilder
  fields={fields}
  onSubmit={save}
  submitLabel="Save record"
  submitVariant="primary"
  showCancel={true}
  cancelLabel="Discard"
  onCancel={() => actions.closeOverlay()}
  loading={isSaving}        // controlled loading state
  disabled={!canEdit}       // disables entire form
  submitPosition="bottom"   // "bottom" | "none"
/>
```

Use `submitPosition="none"` with the ref API for custom button placement.

## Form-Level Alerts

```jsx
<FormBuilder
  fields={fields}
  onSubmit={save}
  error="Something went wrong. Please try again."
  success="Record saved successfully!"
/>
```

## Dirty Tracking

```jsx
<FormBuilder
  fields={fields}
  onSubmit={save}
  onDirtyChange={(isDirty) => {
    // e.g., show unsaved changes warning
  }}
/>
```

## Custom Render Escape Hatch

For fields that need custom rendering:

```jsx
{
  name: "rating",
  type: "text",  // type is required but ignored when render is set
  label: "Rating",
  render: ({ value, onChange, error, allValues }) => (
    <MyCustomRatingWidget value={value} onChange={onChange} hasError={error} />
  ),
}
```

## fieldProps Pass-Through

For any HubSpot component prop not exposed as a first-class field config, use `fieldProps`:

```jsx
{
  name: "search",
  type: "text",
  label: "Search",
  fieldProps: { testId: "search-input", onFocus: () => trackEvent("search_focused") },
}
```

## Sections (Accordion Grouping)

Group fields into collapsible accordion sections:

```jsx
<FormBuilder
  fields={fields}
  sections={[
    { id: "basic", label: "Basic Info", fields: ["firstName", "lastName", "email"], defaultOpen: true },
    { id: "social", label: "Social Links", fields: ["facebook", "instagram"], defaultOpen: false, info: "Optional links" },
  ]}
  onSubmit={handleSubmit}
/>
```

Fields not listed in any section render after all sections. Layout props (`columns`, `columnWidth`) apply within each section independently. Sections can be combined with multi-step forms.

## Field Groups (Dividers)

Lightweight non-collapsible grouping with auto-inserted dividers:

```jsx
const fields = [
  { name: "name", type: "text", label: "Name", group: "Contact Info" },
  { name: "email", type: "text", label: "Email", group: "Contact Info" },
  // Divider + label auto-inserted here
  { name: "company", type: "text", label: "Company", group: "Company Info" },
];
```

## Display Fields

Render-only fields with no form value, no validation, and not included in submit values:

```jsx
{
  name: "mapPreview",
  type: "display",
  render: ({ allValues }) => {
    const url = buildMapsUrl(allValues.address, allValues.city, allValues.zip);
    return url ? <Link href={url}>Preview in Google Maps</Link> : null;
  },
}
```

## Read-Only Mode

Lock the entire form with an optional warning message:

```jsx
<FormBuilder
  fields={fields}
  readOnly={isPremiumAccount}
  readOnlyMessage="This is a premium account. Editing is disabled."
  onSubmit={handleSubmit}
/>
```

Sets all fields to `readOnly`, hides submit/cancel buttons, and shows a warning Alert. The ref API still works.

## Async Validation

`validate` can return a Promise. The field shows a loading indicator while validation runs:

```jsx
{
  name: "email",
  type: "text",
  label: "Email",
  validate: async (value) => {
    const exists = await checkEmailExists(value);
    return exists ? "Email already in use" : true;
  },
  validateDebounce: 500, // debounce async calls (ms)
}
```

Async validators run after sync validators pass. Submit waits for all pending async validations.

## Conditional Required

`required` can be a function:

```jsx
{ name: "businessType", type: "multiselect", label: "Business Type",
  required: (values) => values.accountType === "business" }
```

## Submit Lifecycle

### Transform Values

Reshape values before submission:

```jsx
<FormBuilder
  fields={fields}
  transformValues={(values) => ({
    ...values,
    fullName: `${values.firstName} ${values.lastName}`.trim(),
  })}
  onSubmit={(transformedValues, { reset, rawValues }) => {
    await serverless("save", { parameters: transformedValues });
  }}
/>
```

### Success / Error Callbacks

```jsx
<FormBuilder
  onSubmit={saveRecord}
  onSubmitSuccess={(result, { reset, values }) => {
    actions.addAlert({ type: "success", message: "Saved!" });
  }}
  onSubmitError={(err, { values }) => {
    actions.addAlert({ type: "danger", message: err.message });
  }}
  resetOnSuccess={true}
/>
```

### Confirmation Before Submit

Intercept submit for review/confirmation:

```jsx
<FormBuilder
  onBeforeSubmit={async (values) => {
    return await showConfirmDialog(); // false cancels, true proceeds
  }}
  onSubmit={handleSubmit}
/>
```

## Field-Level Side Effects

Change handlers on field definitions that can update other fields:

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

## Repeater Fields

Add/remove rows for dynamic lists:

```jsx
{ name: "phones", type: "repeater", label: "Phone Numbers",
  fields: [
    { name: "number", type: "text", label: "Number" },
    { name: "type", type: "select", label: "Type", options: PHONE_TYPES },
  ],
  min: 1, max: 5 }
```

## Custom Field Types

Register custom renderers with full FormBuilder integration:

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

Plugin renderers must use HubSpot components (`@hubspot/ui-extensions`).

## CRM Data Components

Embed native HubSpot CRM components directly in forms. These are hands-off -- HubSpot handles inline editing and auto-saving. No form value, no validation.

```jsx
// Current record's properties
{ name: "contactInfo", type: "crmPropertyList",
  properties: ["lastname", "email", "phone"],
  direction: "row" }

// Associated record's properties
{ name: "companyInfo", type: "crmAssociationPropertyList",
  objectTypeId: "0-2",
  properties: ["name", "domain", "city"] }
```

Works well in multi-step wizards where some steps capture new data via form fields and others display/edit existing CRM properties.

## CRM Prefill

Map CRM property values to form initial values:

```jsx
import { FormBuilder, useFormPrefill } from "@hs-uix/form";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";

const { properties } = useCrmProperties(["firstname", "lastname", "email"]);
const initialValues = useFormPrefill(properties, {
  firstName: "firstname",
  lastName: "lastname",
  email: "email",
});

<FormBuilder fields={fields} initialValues={initialValues} onSubmit={save} />
```

## Auto-Save

Debounced auto-save on field changes:

```jsx
<FormBuilder
  fields={fields}
  autoSave={{ debounce: 1000, onAutoSave: saveDraft }}
  onSubmit={save}
/>
```

Only fires when the form is dirty. Debounce defaults to 1000ms.

## Debounced Fields

Delay onChange for search-as-you-type fields:

```jsx
{ name: "search", type: "text", label: "Search", debounce: 300 }
```

## Server-Side Validation

Map API error responses to field errors via the ref API:

```jsx
try {
  await saveRecord(values);
} catch (err) {
  formRef.current.setErrors(err.errors);
  // err.errors = { email: "Already exists", phone: "Invalid format" }
}
```

## Props Reference

### FormBuilder Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `FormBuilderField[]` | required | Field definitions |
| `onSubmit` | `(values, { reset }) => void \| Promise` | required | Called on valid submit |
| `initialValues` | `Record<string, unknown>` | `{}` | Starting values (uncontrolled) |
| `values` | `Record<string, unknown>` | - | Controlled values |
| `onChange` | `(values) => void` | - | Change callback (controlled) |
| `onFieldChange` | `(name, value, allValues) => void` | - | Per-field change |
| `validateOnChange` | `boolean` | `false` | Validate on keystroke |
| `validateOnBlur` | `boolean` | `true` | Validate on blur |
| `validateOnSubmit` | `boolean` | `true` | Validate all before submit |
| `onValidationChange` | `(errors) => void` | - | Validation state callback |
| `steps` | `FormBuilderStep[]` | - | Enables multi-step mode |
| `step` | `number` | - | Controlled step (0-based) |
| `onStepChange` | `(step) => void` | - | Step change callback |
| `showStepIndicator` | `boolean` | `true` | Show StepIndicator |
| `validateStepOnNext` | `boolean` | `true` | Validate before Next |
| `submitLabel` | `string` | `"Submit"` | Submit button text |
| `submitVariant` | `"primary" \| "secondary"` | `"primary"` | Button variant |
| `showCancel` | `boolean` | `false` | Show cancel button |
| `cancelLabel` | `string` | `"Cancel"` | Cancel text |
| `onCancel` | `() => void` | - | Cancel callback |
| `submitPosition` | `"bottom" \| "none"` | `"bottom"` | Button placement |
| `loading` | `boolean` | - | Controlled loading state |
| `disabled` | `boolean` | `false` | Disable entire form |
| `columns` | `number` | `1` | Fixed column count (Flex+Box grid) |
| `columnWidth` | `number` | - | AutoGrid responsive column width (px) |
| `layout` | `FormBuilderLayout` | - | Explicit row layout |
| `gap` | `string` | `"sm"` | Spacing between fields |
| `showRequiredIndicator` | `boolean` | `true` | Show * on required fields |
| `noFormWrapper` | `boolean` | `false` | Skip `<Form>` wrapper |
| `autoComplete` | `string` | - | Form autoComplete attribute |
| `sections` | `FormBuilderSection[]` | - | Accordion field grouping |
| `fieldTypes` | `Record<string, FieldTypePlugin>` | - | Custom field type registry |
| `readOnly` | `boolean` | `false` | Lock all fields |
| `readOnlyMessage` | `string` | - | Warning alert in read-only mode |
| `error` | `string \| boolean` | - | Form-level error alert |
| `success` | `string` | - | Form-level success alert |
| `transformValues` | `(values) => values` | - | Reshape values before submit |
| `onBeforeSubmit` | `(values) => boolean \| Promise` | - | Intercept submit |
| `onSubmitSuccess` | `(result, helpers) => void` | - | Post-submit success |
| `onSubmitError` | `(error, helpers) => void` | - | Post-submit error |
| `resetOnSuccess` | `boolean` | `false` | Auto-reset after success |
| `autoSave` | `{ debounce?, onAutoSave }` | - | Debounced auto-save |
| `onDirtyChange` | `(isDirty) => void` | - | Dirty state callback |
| `ref` | `Ref<FormBuilderRef>` | - | Imperative ref |

### Field Props

| Prop | Type | Applies To | Description |
|---|---|---|---|
| `name` | `string` | All | Unique field identifier |
| `type` | `FormBuilderFieldType` | All | Field type |
| `label` | `string` | All | Field label |
| `description` | `string` | All | Helper text |
| `placeholder` | `string` | Most | Placeholder text |
| `tooltip` | `string` | Most | Tooltip next to label |
| `required` | `boolean \| (values) => boolean` | All | Required validation (supports conditional) |
| `readOnly` | `boolean` | All | Prevent editing |
| `defaultValue` | `unknown` | All | Default value |
| `colSpan` | `number` | All | Columns to span (with `columns` prop) |
| `width` | `"full" \| "half"` | All | Legacy layout (when no `columns` set) |
| `visible` | `(values) => boolean` | All | Conditional visibility |
| `dependsOn` | `string` | All | Parent field name for grouping |
| `validate` | `(value, allValues) => true \| string \| Promise` | All | Custom validation (sync or async) |
| `validateDebounce` | `number` | All | Debounce async validation (ms) |
| `debounce` | `number` | All | Debounce onChange callback (ms) |
| `loading` | `boolean` | All | Field-level loading indicator |
| `group` | `string` | All | Divider-based field grouping |
| `onFieldChange` | `(value, allValues, helpers) => void` | All | Cross-field side effects |
| `fields` | `FormBuilderField[]` | repeater | Sub-field definitions |
| `pattern` | `RegExp` | text, textarea, password | Regex validation |
| `patternMessage` | `string` | text, textarea, password | Custom pattern error |
| `minLength` / `maxLength` | `number` | text, textarea | String length limits |
| `min` / `max` | `number \| DateValue \| TimeValue` | number, stepper, currency, date, time | Range limits |
| `minValidationMessage` / `maxValidationMessage` | `string` | date | Custom range error text |
| `options` | `Option[] \| (values) => Option[]` | select, multiselect, checkboxGroup, radioGroup | Dropdown/toggle options |
| `variant` | `string` | select, checkbox, checkboxGroup, radioGroup | Visual style |
| `inline` | `boolean` | checkbox, checkboxGroup, radioGroup | Horizontal layout |
| `currency` | `string` | currency | ISO 4217 code |
| `precision` | `number` | number, stepper, currency | Decimal places |
| `formatStyle` | `"decimal" \| "percentage"` | number, stepper | Number format |
| `stepSize` | `number` | stepper | Increment amount |
| `minValueReachedTooltip` / `maxValueReachedTooltip` | `string` | stepper | Boundary feedback |
| `rows` / `cols` | `number` | textarea | Visible dimensions |
| `resize` | `"vertical" \| "horizontal" \| "both" \| "none"` | textarea | Resize behavior |
| `size` | `"xs" \| "sm" \| "md"` | toggle | Toggle size |
| `labelDisplay` | `"inline" \| "top" \| "hidden"` | toggle | Label position |
| `textChecked` / `textUnchecked` | `string` | toggle | Custom ON/OFF text |
| `format` | `string` | date, datetime | Date display format |
| `timezone` | `"userTz" \| "portalTz"` | date, time, datetime | Timezone context |
| `interval` | `number` | time, datetime | Minutes between time options |
| `clearButtonLabel` / `todayButtonLabel` | `string` | date, datetime | Date picker button labels |
| `render` | `(props) => ReactNode` | All | Custom render escape hatch |
| `fieldProps` | `Record<string, unknown>` | All | Pass-through to HubSpot component |

### Ref API

| Method | Returns | Description |
|---|---|---|
| `submit()` | `Promise<void>` | Trigger validation + submit |
| `validate()` | `{ valid, errors }` | Validate all visible fields |
| `reset()` | `void` | Reset to initial values |
| `getValues()` | `Record<string, unknown>` | Current form values |
| `isDirty()` | `boolean` | Whether values differ from initial |
| `setFieldValue(name, value)` | `void` | Set a field value programmatically |
| `setFieldError(name, message)` | `void` | Set a field error programmatically |
| `setErrors(errors)` | `void` | Batch set field errors (server-side validation) |

## Peer Dependencies

- `react` >= 18.0.0
- `@hubspot/ui-extensions` >= 0.12.0
