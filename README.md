# hs-uix

[![@hs-uix/datatable](https://img.shields.io/npm/v/@hs-uix/datatable?label=%40hs-uix%2Fdatatable)](https://www.npmjs.com/package/@hs-uix/datatable)
[![@hs-uix/form](https://img.shields.io/npm/v/@hs-uix/form?label=%40hs-uix%2Fform)](https://www.npmjs.com/package/@hs-uix/form)
[![license](https://img.shields.io/npm/l/@hs-uix/datatable)](./LICENSE)

Production-ready UI components for [HubSpot UI Extensions](https://developers.hubspot.com/docs/platform/ui-extensions-overview). Built entirely on HubSpot's native primitives — no custom HTML, no CSS, no iframes.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@hs-uix/datatable`](./packages/datatable) | [![npm](https://img.shields.io/npm/v/@hs-uix/datatable)](https://www.npmjs.com/package/@hs-uix/datatable) | Filterable, sortable, paginated DataTable with auto-sized columns, inline editing, row grouping, and more |
| [`@hs-uix/form`](./packages/form) | [![npm](https://img.shields.io/npm/v/@hs-uix/form)](https://www.npmjs.com/package/@hs-uix/form) | Declarative, config-driven FormBuilder with validation, multi-step wizards, and 20+ field types |

## Install

```bash
npm install @hs-uix/datatable
npm install @hs-uix/form
```

## Quick Start

### DataTable

```jsx
import { DataTable } from "@hs-uix/datatable";

const columns = [
  { field: "name", label: "Name", sortable: true },
  { field: "status", label: "Status" },
  { field: "amount", label: "Amount", sortable: true },
];

<DataTable data={deals} columns={columns} searchFields={["name"]} pageSize={10} />;
```

### FormBuilder

```jsx
import { FormBuilder } from "@hs-uix/form";

const fields = [
  { name: "email", label: "Email", type: "text", required: true },
  { name: "role", label: "Role", type: "select", options: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ]},
];

<FormBuilder fields={fields} onSubmit={(values) => console.log(values)} />;
```

## Local Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Watch mode
npm run dev
```

## Monorepo Structure

```
hs-uix/
├── packages/
│   ├── datatable/       ← @hs-uix/datatable
│   └── form/            ← @hs-uix/form
└── package.json         ← npm workspaces root
```

## License

MIT
