# @hs-uix Roadmap

## Packages

| Package | Status | npm | Description |
|---|---|---|---|
| `@hs-uix/datatable` | v0.4.0 published | [npm](https://www.npmjs.com/package/@hs-uix/datatable) | Filterable, sortable, paginated tables |
| `@hs-uix/form` | v0.1.0 published | [npm](https://www.npmjs.com/package/@hs-uix/form) | Declarative config-driven forms |
| `@hs-uix/kanban` | planned | — | Drag-free kanban board |
| `@hs-uix/feed` | planned | — | Activity feed / timeline |

---

## @hs-uix/form

### v0.1.0 — Core (shipped)

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

### v0.1.1 — QA & Bug Fixes

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

### v0.2.0 — Polish

- [ ] **Field groups with Dividers** — group related fields with a Divider + optional group label
  ```jsx
  fields={[
    { name: "name", type: "text", label: "Name", group: "Contact Info" },
    { name: "email", type: "text", label: "Email", group: "Contact Info" },
    // Divider auto-inserted between groups
    { name: "company", type: "text", label: "Company", group: "Company Info" },
  ]}
  ```

- [ ] **Repeater fields** — add/remove rows for dynamic lists
  ```jsx
  { name: "phones", type: "repeater", label: "Phone Numbers",
    fields: [
      { name: "number", type: "text", label: "Number" },
      { name: "type", type: "select", label: "Type", options: PHONE_TYPES },
    ],
    min: 1, max: 5 }
  ```

- [ ] **Async validation** — `validate` returns a Promise
  ```jsx
  { name: "email", validate: async (v) => {
    const exists = await checkEmailExists(v);
    return exists ? "Email already in use" : true;
  }}
  ```

- [ ] **Field-level loading** — spinner on individual fields while fetching options
  ```jsx
  { name: "assignee", type: "select", label: "Assignee",
    loading: true, options: teamMembers }
  ```

- [ ] **onSubmitSuccess / onSubmitError** — post-submit UX callbacks
  ```jsx
  <FormBuilder
    onSubmit={saveRecord}
    onSubmitSuccess={() => actions.addAlert({ type: "success", message: "Saved!" })}
    onSubmitError={(err) => actions.addAlert({ type: "danger", message: err.message })}
  />
  ```

- [ ] **Warn on dirty close** — confirmation when navigating away from unsaved changes

### v0.3.0 — CRM Integration

- [ ] **Server-side validation mapping** — map API error responses to field errors
  ```jsx
  try { await saveRecord(values); }
  catch (err) { formRef.current.setErrors(err.errors); }
  ```

- [ ] **Prefill from CRM properties** — helper to map property values to form values
  ```jsx
  import { useFormPrefill } from "@hs-uix/form";
  const initialValues = useFormPrefill(properties, {
    firstName: "firstname",
    lastName: "lastname",
  });
  ```

- [ ] **Schema from HubSpot properties** — generate field definitions from CRM property definitions
  ```jsx
  import { fieldsFromProperties } from "@hs-uix/form";
  const fields = fieldsFromProperties(propertyDefs, {
    include: ["firstname", "lastname", "email", "lifecyclestage"],
  });
  ```

- [ ] **Autosave** — debounced auto-save on change
  ```jsx
  <FormBuilder autoSave={{ debounce: 1000, onAutoSave: saveDraft }} />
  ```

### v0.4.0 — Docs & README

- [ ] Full README.md with examples (quick start, field types, validation, multi-step, ref API, panel integration)
- [ ] Update DataTable README for @hs-uix/datatable rename
- [ ] Root monorepo README linking to each package

---

## @hs-uix/datatable

### v0.4.0 (current — shipped as @hs-uix/datatable)

Migrated from `hubspot-datatable`. Full feature set:
- Client-side and server-side modes
- Search (fuzzy with fuse.js)
- Filters (select, multiselect, dateRange)
- Sorting, pagination, grouping
- Row selection with bulk actions
- Inline editing (text, select, currency, datetime, toggle, checkbox)
- Auto-width column sizing
- Scrollable mode

### v0.5.0 — Planned

- [ ] Column resizing
- [ ] Column reordering
- [ ] Export to CSV
- [ ] Row expansion (detail row)

---

## @hs-uix/kanban — Planned

Drag-free kanban board for HubSpot UI Extensions (no drag-and-drop API available).

Likely approach:
- Columns rendered as vertical lists
- Move cards between columns via dropdown or button actions
- Column headers with counts and collapse
- Card customization via render props
- Filtering and search across cards

---

## @hs-uix/feed — Planned

Activity feed / timeline component for HubSpot UI Extensions.

Likely approach:
- Chronological list of activity items
- Configurable item rendering (icons, timestamps, descriptions)
- Infinite scroll / load more pagination
- Filtering by activity type
- Grouping by date (Today, Yesterday, Last Week, etc.)

---

## Infrastructure

### Monorepo

```
hs-ui/
├── package.json              ← npm workspaces root
├── packages/
│   ├── datatable/            ← @hs-uix/datatable
│   ├── form/                 ← @hs-uix/form
│   └── datatable-compat/     ← hubspot-datatable (deprecation bridge)
```

### Demo App (separate repo)

```
hs-ui-demos/
├── src/app/cards/
│   ├── DemoApp.jsx           ← Tabs: DataTable | FormBuilder | Kanban | Feed
│   └── package.json
```

### Publishing

```bash
# From monorepo root
cd packages/datatable && npm publish --access public --otp=CODE
cd packages/form && npm publish --access public --otp=CODE
```

### Local Dev

```bash
# Terminal 1 — watch all packages
cd ~/Desktop/hs-ui && npm run dev

# Terminal 2 — run demo
cd ~/Desktop/hs-ui-demos && hs project dev

# Link setup (one-time after npm install)
cd ~/Desktop/hs-ui/packages/datatable && npm link
cd ~/Desktop/hs-ui/packages/form && npm link
cd ~/Desktop/hs-ui-demos/src/app/cards && npm link @hs-uix/datatable @hs-uix/form
```
