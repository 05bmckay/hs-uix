# hs-uix

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](./LICENSE)

Production-ready UI components for [HubSpot UI Extensions](https://developers.hubspot.com/docs/platform/ui-extensions-overview). Built entirely on HubSpot's native primitives — no custom HTML, no CSS, no iframes.

## Components

| Component | Description | Docs |
|-----------|-------------|------|
| **DataTable** | Filterable, sortable, paginated table with auto-sized columns, inline editing, row grouping, and more | [Full documentation](./packages/datatable/README.md) |
| **FormBuilder** | Declarative, config-driven form with validation, multi-step wizards, and 20+ field types | [Full documentation](./packages/form/README.md) |

## Install

```bash
npm install hs-uix
```

## Quick Start

### DataTable

```jsx
import { DataTable } from "hs-uix/datatable";

const columns = [
  { field: "name", label: "Name", sortable: true },
  { field: "status", label: "Status" },
  { field: "amount", label: "Amount", sortable: true },
];

<DataTable data={deals} columns={columns} searchFields={["name"]} pageSize={10} />;
```

### FormBuilder

```jsx
import { FormBuilder } from "hs-uix/form";

const fields = [
  { name: "email", label: "Email", type: "text", required: true },
  { name: "role", label: "Role", type: "select", options: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ]},
];

<FormBuilder fields={fields} onSubmit={(values) => console.log(values)} />;
```

You can also import everything from the root:

```jsx
import { DataTable, FormBuilder } from "hs-uix";
```

## Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Monorepo Structure

```
hs-uix/
├── packages/
│   ├── datatable/       ← DataTable source + docs
│   └── form/            ← FormBuilder source + docs
├── src/                 ← unified package entry points
└── package.json
```

## License

MIT
