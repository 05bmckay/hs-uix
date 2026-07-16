# Experimental graduation audit

Date: 2026-07-16

Scope: `Wizard` / `OnboardingChecklist`, Skeleton loaders, and DataTable row expansion.

## Decision summary

| Feature | Current access | Decision | Primary reason |
|---|---|---|---|
| Wizard / OnboardingChecklist | `hs-uix/experimental` | **Defer** | State helpers are tested, but component behavior, action semantics, and HubSpot-host rendering are not validated sufficiently for a stable contract. |
| Skeleton loaders | `hs-uix/experimental` | **Defer** | Pure SVG/inference logic is tested, but stable API/types/docs and host layout/accessibility evidence are incomplete. |
| DataTable row expansion | Stable runtime plus experimental typing/alias | **Defer** | Runtime, stable declarations, documentation, and accessibility behavior disagree; interaction and host table layout need validation. |

No API is graduated or renamed by this audit.

## Shared graduation gate

A feature can graduate only after:

1. public API review covers naming, props, controlled/uncontrolled behavior, accessibility, and compatibility;
2. runtime exports, package subpaths, tsup entries, root exports, and hand-written declarations agree;
3. stable public examples and prop reference documentation exist;
4. focused component tests cover callbacks, controlled state, empty/error paths, and interaction behavior;
5. the feature is manually validated in representative HubSpot UI Extension hosts and constrained layouts; and
6. experimental imports have a documented compatibility and removal window.

## Wizard and OnboardingChecklist

### Current strengths

- `wizardState.js` has 31 pure state-machine tests.
- `src/wizard/index.d.ts` and `src/wizard/README.md` define a substantial public contract.
- Both components compose HubSpot primitives plus the library Icon and SectionHeader wrappers.

### Graduation blockers

- Component rendering and callbacks are not tested: navigation, validation alerts, empty steps, completion, checklist actions, progress, and Accordion behavior remain uncovered.
- Vertical step titles and checklist rows use action-only `Link` instances without `href`; action semantics and keyboard behavior need correction or explicit host validation.
- Collapsible checklist mode can replace a non-string checklist title with `"Getting started"` and omit the checklist-level description despite accepting `ReactNode` content; item descriptions still render inside the Accordion.
- Completion remains recorded after revisiting/editing, and validation is synchronous only. These may be valid constraints, but must be explicitly accepted as stable behavior.
- `StepIndicator`, `ProgressBar`, `Accordion`, and layout props have not been smoke-tested in representative HubSpot extension hosts.
- There is no `hs-uix/wizard` package export, top-level `wizard.d.ts`, tsup entry, or stable root export.

### Migration policy

When the blockers are resolved:

1. add a dedicated `hs-uix/wizard` subpath, tsup entry, and `wizard.d.ts` shim;
2. root-export both components and their public types;
3. keep identical re-exports from `hs-uix/experimental` for at least one minor release;
4. mark experimental imports as compatibility aliases and remove them only in a later major release; and
5. preserve component and prop names during graduation unless a separately reviewed breaking change is approved.

## Skeleton loaders

### Current strengths

- SVG generation, width/shape behavior, inference, wrapper mode, and composite selection have focused unit coverage.
- Runtime output uses HubSpot `Image` and `Flex`, avoiding custom HTML/CSS.
- Static and wrapper APIs are already implemented.

### Graduation blockers

- Stable `hs-uix/common-components` and root runtime/type barrels do not expose the Skeleton components.
- Stable common-component docs do not include usage, props, accessibility guidance, or compatibility notes.
- Host validation is missing for SVG data URIs, intrinsic dimensions, Flex overflow, constrained cards/tables, and repeated image announcements.
- Child inference depends on function/display names and selected props; wrappers or transformed names may silently fall back to text placeholders.
- Experimental `SkeletonProps` includes an open `[imageProp: string]: unknown` signature, which is too broad for a stable contract.
- The desired stable low-level surface is unresolved: component helpers are broadly useful, while `makeSkeletonDataUri` and `SKELETON_WIDTH_TOKENS` may remain experimental.

### Migration policy

When the blockers are resolved:

1. graduate `Skeleton`, `SkeletonText`, `SkeletonBox`, `SkeletonCircle`, and `SkeletonTable` through `hs-uix/common-components` and the root barrel;
2. keep `makeSkeletonDataUri` and `SKELETON_WIDTH_TOKENS` experimental unless direct public demand justifies them;
3. replace the open prop index signature with explicitly supported Image-related props;
4. keep experimental compatibility re-exports for at least one minor release; and
5. remove compatibility aliases only in a later major release.

A separate `hs-uix/skeleton` subpath is not recommended.

## DataTable row expansion

### Current strengths

- Expansion state transformations are isolated in `rowExpansion.js` and covered by 21 tests.
- The existing `DataTable` runtime already supports controlled/uncontrolled expanded IDs, icon/row activation, and accordion mode.
- No separate component implementation is required.

### Graduation blockers

- Stable `DataTableProps` and the stable README omit all six expansion props: `renderExpandedRow`, `expandedRowIds`, `defaultExpandedRowIds`, `onExpandedRowsChange`, `expandOn`, and `expandSingle`.
- `ExperimentalDataTable` aliases the same stable runtime, so the current maturity boundary exists only in types/docs and is easy to misunderstand.
- No component tests cover rendered toggles, callbacks, controlled mode, grouping, selection, editing, actions, pagination, or calculated column spans.
- Accessibility evidence is incomplete: expanded state and detail relationships are not expressed, and `expandOn="row"` makes table content implicitly interactive while potentially conflicting with links, selection, actions, and editing.
- Host validation is missing for `TableCell colSpan`, selection/action/expand columns, numeric widths, narrow cards, and large detail content.
- Unsupported `expandOn` values can enable expansion without a visible toggle.

### Migration policy

When the blockers are resolved:

1. add the six props to stable `DataTableProps` and the stable DataTable README;
2. add component-level interaction/accessibility tests and host-layout smoke coverage;
3. keep `ExperimentalDataTable` as a deprecated alias of the identical stable `DataTable` for at least one minor release;
4. document migration as an import-only change with no prop changes; and
5. remove the alias only in a later major release.

Do not introduce a second DataTable implementation or a new package subpath.

## Recommended sequence

1. Fix Wizard/Onboarding action semantics and component tests before considering a `hs-uix/wizard` subpath.
2. Stabilize DataTable row expansion next because its runtime already ships and the current types/docs mismatch is the most confusing public state.
3. Validate Skeleton in real host layouts, narrow its props, and then graduate the five component helpers through common-components.
