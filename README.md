# hs-uix

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](./LICENSE)

The component layer HubSpot UI Extensions are missing.

Build sophisticated CRM experiences without rebuilding search, filtering, pagination, validation, loading states, and edge-case handling for every extension. hs-uix packages those recurring patterns into production-ready tables, forms, boards, feeds, calendars, filters, and shared controls.

![DataTable, FormBuilder, Kanban, Feed, Calendar, and FilterBuilder running inside HubSpot](https://raw.githubusercontent.com/05bmckay/hs-uix/main/docs/assets/hs-uix-gallery.jpg)

## Why hs-uix?

HubSpot gives UI Extensions a strong primitive set. hs-uix turns those primitives into complete product surfaces:

- **Ship the whole workflow** — search, filter, sort, pagination, validation, empty states, loading states, and i18n are already designed together.
- **Keep the native experience** — the output is composed entirely from `@hubspot/ui-extensions` components.
- **Reuse one data model** — DataTable, Kanban, Feed, and Calendar share familiar configuration patterns.
- **Stay resilient** — optional safe wrappers repair common invalid props and prevent a bad collection value from blanking an extension.
- **Escape when you need to** — declarative defaults cover the common path; render callbacks cover the last mile.

## See the components

| DataTable | FormBuilder |
| --- | --- |
| [![DataTable with search, filters, sorting, totals, and pagination](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/datatable/assets/showcase-table.jpg)](./src/datatable/README.md) | [![Read-only FormBuilder with one explicitly editable field](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/form/assets/showcase-form.jpg)](./src/form/README.md) |
| **Kanban** | **Feed** |
| [![Stage-based Kanban board](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/kanban/assets/showcase-kanban.jpg)](./src/kanban/README.md) | [![Searchable CRM activity Feed](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/feed/assets/showcase-feed.jpg)](./src/feed/README.md) |
| **Calendar** | **FilterBuilder** |
| [![Month Calendar with CRM events](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/calendar/assets/showcase-calendar.jpg)](./src/calendar/README.md) | [![Nested AND OR FilterBuilder](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/filter/assets/showcase-filter-builder.jpg)](./src/filter/README.md) |
| **Wizard + checklist** | **Common components** |
| [![Multi-step Wizard and onboarding checklist](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/wizard/assets/showcase-wizard-checklist.jpg)](./src/wizard/README.md) | [![A deal summary composed from common components](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/common-components/assets/showcase-overview.jpg)](./src/common-components/README.md) |

## Install

```bash
npm install hs-uix
```

`react >= 18` and `@hubspot/ui-extensions >= 0.14` are peer dependencies and are normally already present in a HubSpot UI Extensions project.

## Start in 60 seconds

```jsx
import React from "react";
import { hubspot, StatusTag } from "@hubspot/ui-extensions";
import { DataTable } from "hs-uix/datatable";
import { formatCurrency } from "hs-uix/utils";

const columns = [
  { field: "company", label: "Company", sortable: true },
  { field: "owner", label: "Owner", sortable: true },
  {
    field: "stage",
    label: "Stage",
    sortable: true,
    renderCell: (value) => <StatusTag>{value}</StatusTag>,
  },
  {
    field: "amount",
    label: "Amount",
    sortable: true,
    align: "right",
    renderCell: (value) => formatCurrency(value),
  },
];

const rows = [
  {
    id: "1",
    company: "Acme Corp",
    owner: "Sam Patel",
    stage: "Qualified",
    amount: 125000,
  },
];

hubspot.extend(() => (
  <DataTable
    data={rows}
    columns={columns}
    searchFields={["company", "owner", "stage"]}
    pageSize={5}
    showRowCount
  />
));
```

## Pick the right surface

| Surface | Reach for it when… | Import |
| --- | --- | --- |
| [DataTable](./src/datatable/README.md) | Users need to scan, compare, filter, edit, or bulk-select records. | `hs-uix/datatable` |
| [FormBuilder](./src/form/README.md) | A form schema should own layout, validation, dependencies, steps, and submission. | `hs-uix/form` |
| [Kanban](./src/kanban/README.md) | Stage and movement matter more than dense comparison. | `hs-uix/kanban` |
| [Feed](./src/feed/README.md) | Time and narrative matter: activity, audit logs, notes, and events. | `hs-uix/feed` |
| [Calendar](./src/calendar/README.md) | Records belong on a month, week, day, agenda, or resource schedule. | `hs-uix/calendar` |
| [FilterBuilder](./src/filter/README.md) | Users need nested CRM-style `AND` / `OR` conditions. | `hs-uix/filter` |
| [Wizard](./src/wizard/README.md) | A multi-step process contains arbitrary UI, not only form fields. | `hs-uix/experimental` |
| [Common components](./src/common-components/README.md) | You need native summaries, record pickers, tags, icons, filters, and display helpers. | `hs-uix/common-components` |
| [Safe wrappers](./src/safe/README.md) | Runtime data or generated configs can contain invalid props. | `hs-uix/safe` |
| [Utilities](./src/utils/README.md) | You need formatting, options, query helpers, view adapters, or CRM search bindings. | `hs-uix/utils` |

## Import only what you use

```jsx
import { DataTable } from "hs-uix/datatable";
import { FormBuilder } from "hs-uix/form";
import { Kanban } from "hs-uix/kanban";
import { Feed } from "hs-uix/feed";
import { Calendar } from "hs-uix/calendar";
import { FilterBuilder } from "hs-uix/filter";

import {
  AutoStatusTag,
  AvatarStack,
  CollectionToolbar,
  CrmRecordPicker,
  DateRangePicker,
  Icon,
  KeyValueList,
  SectionHeader,
} from "hs-uix/common-components";

import {
  CrmDataTable,
  CrmKanban,
  deriveCardFieldsFromColumns,
  formatCurrency,
  formatDate,
} from "hs-uix/utils";

import {
  SafeDataTable,
  SafeEmptyState,
  SafeIcon,
} from "hs-uix/safe";
```

The root barrel is also available:

```jsx
import {
  Calendar,
  DataTable,
  Feed,
  FilterBuilder,
  FormBuilder,
  Kanban,
} from "hs-uix";
```

## One collection model, multiple views

DataTable and Kanban deliberately share vocabulary. You can project a table's columns into card fields and let users change views without rebuilding the data layer:

```jsx
import { DataTable } from "hs-uix/datatable";
import { Kanban } from "hs-uix/kanban";
import { deriveCardFieldsFromColumns } from "hs-uix/utils";

const cardFields = deriveCardFieldsFromColumns(columns);

return view === "table" ? (
  <DataTable data={deals} columns={columns} />
) : (
  <Kanban
    data={deals}
    stages={stages}
    groupBy="stage"
    cardFields={cardFields}
  />
);
```

## What is included

- Search, fuzzy search, filters, active-filter chips, sort, counts, and pagination
- Declarative and custom renderers for cells, cards, feed items, event details, and form fields
- Controlled and uncontrolled APIs for server-side and client-side data flows
- CRM-aware adapters without making the visual components CRM-only
- Loading, empty, error, validation, selection, and bulk-action states
- Hand-written type declarations for every public subpath
- ESM and CommonJS builds

## Platform constraints, handled honestly

hs-uix works within the UI Extensions runtime rather than pretending it is a browser DOM:

- Column widths use HubSpot-supported `"min"`, `"max"`, and `"auto"` values.
- Kanban stage changes use native controls because UI Extensions do not expose drag-and-drop.
- Calendar rescheduling emits the proposed dates for your app to persist.
- Inputs do not inherit text alignment from parent layout primitives.
- Components never depend on custom CSS.

Each component guide documents its remaining platform-specific limitations and escape hatches.

## Migrating from the old scoped packages

The old `@hs-uix/datatable` and `@hs-uix/form` packages are deprecated. Install the root package and change imports:

```diff
- import { DataTable } from "@hs-uix/datatable";
- import { FormBuilder } from "@hs-uix/form";
+ import { DataTable } from "hs-uix/datatable";
+ import { FormBuilder } from "hs-uix/form";
```

FormBuilder's deprecated `allValues` prop has been replaced by `values`.

## Development

```bash
npm install
npm test
npm run build
```

The source is JavaScript/JSX, the package is bundled with tsup, and public types are maintained as `.d.ts` declarations.

## License

[MIT](./LICENSE)
