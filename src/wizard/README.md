# Wizard (hs-uix/experimental)

Orchestrated multi-step flows for HubSpot UI Extensions — plus the "getting started" checklist card. `Wizard` steps render **arbitrary content** (tables, CRM pickers, review summaries — anything), which makes it the right tool when FormBuilder's form-only multi-step mode isn't enough. The Wizard owns the orchestration: a shared values bag, validate-gated Next, linear step reachability with success markers, a side step-nav (vertical) or native StepIndicator (horizontal), and a Back/Next/Finish footer. `OnboardingChecklist` is the companion setup tracker: a ProgressBar headline over rows of done/pending tasks with inline action buttons.

## Quick Start

```jsx
import { Wizard } from "hs-uix/experimental";
import { Input, Flex, Text } from "@hubspot/ui-extensions";

<Wizard
  steps={[
    {
      id: "details",
      title: "Details",
      description: "Who is this for?",
      render: ({ values, setValues }) => (
        <Input
          name="email"
          label="Email"
          value={values.email || ""}
          onChange={(email) => setValues({ email })}
        />
      ),
      validate: ({ values }) => (values.email ? true : "Email is required."),
    },
    {
      id: "options",
      title: "Options",
      optional: true,
      render: ({ values, setValues }) => (
        <Flex direction="column" gap="xs">{/* anything */}</Flex>
      ),
    },
    {
      id: "review",
      title: "Review",
      render: ({ values }) => <Text>Sending to {values.email || "--"}</Text>,
    },
  ]}
  onComplete={(values) => createRecord(values)}
/>
```

```jsx
import { OnboardingChecklist } from "hs-uix/experimental";

<OnboardingChecklist
  title="Getting started"
  items={[
    { id: "connect", title: "Connect your calendar", done: true },
    {
      id: "import",
      title: "Import contacts",
      description: "CSV or CRM sync",
      done: false,
      action: { label: "Import", onClick: openImportPanel },
    },
  ]}
  onItemClick={(item) => openDetail(item.id)}
/>
```

## Features

- **Arbitrary step content** — each step's `render(ctx)` returns any node; the wizard is layout, navigation, and gating only.
- **Shared values bag** — `ctx.values` / `ctx.setValues` let steps accumulate data; `onComplete(values)` hands the finished bag back.
- **Validate gating** — a step's `validate(ctx)` returning a non-empty string blocks Next/Finish and renders the message as an inline error `Alert`.
- **Linear reachability** — future steps are disabled until every prior required step is completed; `optional` steps are skippable; `allowJumpAhead` opens everything.
- **Side step-nav** (vertical, default): `checkCircle` success markers for completed steps, filled circle for the current step, hollow circles for upcoming; reachable steps are clickable Links.
- **Native StepIndicator** (horizontal): `stepNames` + `currentStep` + click-to-navigate, with `stepIndicatorProps` pass-through.
- **Back / Next / Finish footer** — secondary Back (disabled on the first step), primary Next/Finish; replace it wholesale with `renderFooter`.
- **Controlled or uncontrolled** — `step` / `defaultStep` / `onStepChange`, by step id or index.
- **OnboardingChecklist** — native `ProgressBar` (done/total), success-marker rows, inline action buttons, optional Accordion collapse that defaults open while work remains.

## Review / summary step

A review step is just a step that renders the values bag. Pair it with `KeyValueList` from `hs-uix/common-components`:

```jsx
import { KeyValueList } from "hs-uix/common-components";

{
  id: "review",
  title: "Review",
  description: "Confirm before creating the record.",
  render: ({ values, goTo }) => (
    <Flex direction="column" gap="sm">
      <KeyValueList
        items={[
          { label: "Email", value: values.email },
          { label: "Plan", value: values.plan },
        ]}
      />
      <Link onClick={() => goTo("details")}>Edit details</Link>
    </Flex>
  ),
}
```

The Finish button on the last step runs that step's `validate` (if any) and then calls `onComplete(values)`.

## `<Wizard>` props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `steps` | `WizardStep[]` | `[]` | `{ id, title, description?, optional?, render?, validate? }`. Missing ids become `step-<index>`. |
| `step` | `string \| number` | — | Controlled current step (id or zero-based index). |
| `defaultStep` | `string \| number` | `0` | Initial step when uncontrolled. |
| `onStepChange` | `(stepId, stepIndex) => void` | — | Fires on every transition (Next, Back, nav click). |
| `onComplete` | `(values) => void` | — | Finish pressed on the last step and its validate passed. |
| `defaultValues` | `object` | `{}` | Initial contents of the shared values bag. |
| `onValuesChange` | `(values) => void` | — | Observer for every `setValues` call. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Vertical = side step-nav; horizontal = native StepIndicator above content. |
| `showStepNav` | `boolean` | `true` | Hide the nav entirely (footer still navigates). |
| `allowJumpAhead` | `boolean` | `false` | Let users click any future step without completing prior ones. |
| `showStepHeader` | `boolean` | `true` | Render the active step's title/description above its content. |
| `labels` | `WizardLabels` | — | `{ back, next, finish, optional, errorTitle }` overrides. |
| `renderFooter` | `(ctx) => node` | — | Replaces the footer; ctx adds `{ isFirst, isLast, error, labels }`. |
| `navFlex` / `contentFlex` | `number` | `1` / `3` | Flex ratios for the vertical layout columns. |
| `stepIndicatorProps` | `object` | — | Spread onto the native StepIndicator (e.g. `variant="compact"`). |

### Step context (`ctx`)

Passed to `render`, `validate`, and `renderFooter`:

| Key | Type | Notes |
|-----|------|-------|
| `stepId` | `string` | Active step id. |
| `stepIndex` | `number` | Zero-based index. |
| `goNext()` | `() => void` | Validates, then advances (or completes on the last step). |
| `goBack()` | `() => void` | Previous step — never gated. |
| `goTo(stepOrId)` | `(string \| number) => void` | No-op when the target isn't reachable. |
| `values` | `object` | Shared values bag. |
| `setValues(patch)` | `(object \| fn) => void` | Object patches shallow-merge; updater functions replace. |

### Gating rules

- **Back** is never gated; revisiting a completed step keeps its success marker.
- **Next/Finish** runs the active step's `validate(ctx)`. A non-empty string blocks and shows an error Alert; `true`/`undefined`/`false` pass. Validation is sync-only.
- A future step is clickable only when every step before it is completed or `optional` (linear), or when `allowJumpAhead` is on.
- Completion is recorded per step id and is not invalidated by later edits — re-validate in `onComplete` if steps can be undone retroactively.

## `<OnboardingChecklist>` props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `OnboardingChecklistItem[]` | `[]` | `{ id, title, description?, done, action? }`; `action` is `{ label, onClick, variant?, disabled? }`. |
| `title` | `ReactNode` | — | Card heading (Accordion title in collapsible mode). |
| `description` | `ReactNode` | — | Microcopy under the heading (non-collapsible mode only). |
| `progress` | `boolean` | `true` | Show the `ProgressBar` headline (`value=done`, `maxValue=total`). |
| `onItemClick` | `(item) => void` | — | Makes item titles clickable Links. |
| `collapsible` | `boolean` | `false` | Wrap in an Accordion; defaults open while items remain incomplete. |
| `defaultOpen` | `boolean` | data-driven | Override the collapsible default-open behavior. |
| `showCompletedActions` | `boolean` | `false` | Keep action buttons on done rows. |
| `labels` | `{ progress }` | — | `progress(done, total)` formats the bar's value description. |

Completion is data-driven: the host marks items `done`. The checklist renders state, it never owns it.
