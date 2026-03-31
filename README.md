# HubSpot DataTable

A feature-rich, reusable table component for HubSpot UI Extensions. Drop it into any CRM card and get filtering, sorting, pagination, row grouping, row selection, and inline editing — all built with native `@hubspot/ui-extensions` components.

## Features

- **Search** — Full-text search across any fields
- **Filters** — Select, multi-select, and date range filters with chips
- **Sorting** — Click-to-sort with three-state cycle (none → ascending → descending → none)
- **Pagination** — Client-side or server-side with configurable page size
- **Row Grouping** — Group rows by any field with custom labels
- **Row Selection** — Checkbox column with select-all
- **Inline Editing** — Click-to-edit cells with 10 input types
- **Footer Rows** — Summary/total rows from filtered data
- **Server-Side Mode** — Callbacks for search, filter, sort, and page changes
- **Empty State** — Built-in empty state when no results match

## Installation

Copy `DataTable.jsx` into your HubSpot project's components directory:

```
src/app/cards/components/DataTable.jsx
```

Import it in your card:

```jsx
import { DataTable } from "./components/DataTable.jsx";
```

No additional dependencies — only uses `@hubspot/ui-extensions`.

## Quick Start

```jsx
const COLUMNS = [
  { field: "name", label: "Name", sortable: true },
  { field: "email", label: "Email" },
  { field: "status", label: "Status", sortable: true },
];

<DataTable
  data={records}
  columns={COLUMNS}
  renderRow={(row) => (
    <TableRow key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.status}</TableCell>
    </TableRow>
  )}
  searchFields={["name", "email"]}
  pageSize={10}
/>
```

## Usage Guide

### Basic Table with Filters

```jsx
const FILTERS = [
  {
    name: "status",
    type: "select",
    placeholder: "All statuses",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    name: "category",
    type: "multiselect",
    placeholder: "All categories",
    options: [
      { label: "Enterprise", value: "enterprise" },
      { label: "SMB", value: "smb" },
    ],
  },
  {
    name: "date",
    type: "dateRange",
    placeholder: "Date range",
  },
];

<DataTable
  data={records}
  columns={COLUMNS}
  renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
  searchFields={["name", "email"]}
  filters={FILTERS}
  pageSize={10}
  defaultSort={{ name: "ascending" }}
/>
```

### Row Selection

Add checkboxes with a select-all header. When using `selectable`, define `renderCell` on each column instead of `renderRow`.

```jsx
const COLUMNS = [
  { field: "name", label: "Name", renderCell: (val) => val },
  { field: "email", label: "Email", renderCell: (val) => val },
];

<DataTable
  data={records}
  columns={COLUMNS}
  selectable={true}
  rowIdField="id"
  onSelectionChange={(selectedIds) => {
    console.log("Selected:", selectedIds);
  }}
  pageSize={10}
/>
```

### Inline Editing

Make any column editable. Columns define the edit input type, and the parent handles persistence via `onRowEdit`.

```jsx
const COLUMNS = [
  {
    field: "name",
    label: "Name",
    editable: true,
    editType: "text",
    renderCell: (val) => val,
  },
  {
    field: "status",
    label: "Status",
    editable: true,
    editType: "select",
    editOptions: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    renderCell: (val) => <StatusTag variant="success">{val}</StatusTag>,
  },
  {
    field: "amount",
    label: "Amount",
    editable: true,
    editType: "number",
    renderCell: (val) => `$${val.toLocaleString()}`,
  },
  {
    field: "priority",
    label: "Priority",
    editable: true,
    editType: "toggle",
    renderCell: (val) => (val ? "Yes" : "No"),
  },
];

<DataTable
  data={records}
  columns={COLUMNS}
  rowIdField="id"
  onRowEdit={(row, field, newValue) => {
    // Persist the change
    updateRecord(row.id, { [field]: newValue });
  }}
/>
```

**Supported `editType` values:**

| editType | Component | Commit Behavior |
|---|---|---|
| `text` | Input | Save/Cancel buttons |
| `textarea` | TextArea | Save/Cancel buttons |
| `number` | NumberInput | Save/Cancel buttons |
| `currency` | CurrencyInput | Save/Cancel buttons |
| `stepper` | StepperInput | Save/Cancel buttons |
| `select` | Select | Instant on change |
| `multiselect` | MultiSelect | Instant on change |
| `date` | DateInput | Instant on change |
| `toggle` | Toggle | Instant on change |
| `checkbox` | Checkbox | Instant on change |

Use `editProps` to pass additional props to the edit component (e.g., `{ currencyCode: "EUR" }` for CurrencyInput).

### Row Grouping

```jsx
<DataTable
  data={records}
  columns={COLUMNS}
  renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
  groupBy={{
    field: "category",
    label: (value, rows) => `${value} (${rows.length})`,
    sort: "asc",
  }}
/>
```

### Server-Side Mode

Let the parent manage data fetching. The component renders UI controls and calls back on every interaction.

```jsx
<DataTable
  serverSide={true}
  data={currentPageRows}
  totalCount={totalRecords}
  columns={COLUMNS}
  renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
  searchFields={["name"]}
  filters={FILTERS}
  pageSize={25}
  page={currentPage}
  onSearchChange={(term) => refetch({ search: term, page: 1 })}
  onFilterChange={(filters) => refetch({ filters, page: 1 })}
  onSortChange={(field, direction) => refetch({ sort: field, dir: direction })}
  onPageChange={(page) => refetch({ page })}
/>
```

### Footer Rows

```jsx
<DataTable
  data={records}
  columns={COLUMNS}
  renderRow={(row) => <TableRow key={row.id}>...</TableRow>}
  footer={(filteredData) => (
    <TableRow>
      <TableHeader>Total</TableHeader>
      <TableHeader align="right">
        {filteredData.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
      </TableHeader>
    </TableRow>
  )}
/>
```

### Custom Filter Functions

Override the default filter logic for any filter:

```jsx
const FILTERS = [
  {
    name: "amount",
    type: "select",
    placeholder: "Deal size",
    options: [
      { label: "Under $50K", value: "small" },
      { label: "$50K - $200K", value: "medium" },
      { label: "Over $200K", value: "large" },
    ],
    filterFn: (row, value) => {
      if (value === "small") return row.amount < 50000;
      if (value === "medium") return row.amount >= 50000 && row.amount <= 200000;
      return row.amount > 200000;
    },
  },
];
```

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | Array | *required* | Array of row objects |
| `columns` | Array | *required* | Column definitions (see below) |
| `renderRow` | `(row) => ReactNode` | — | Renders a full `<TableRow>`. Used when `selectable` and `editable` are not active. |
| `searchFields` | string[] | `[]` | Fields to search across |
| `searchPlaceholder` | string | `"Search..."` | Placeholder text for search input |
| `filters` | Array | `[]` | Filter configurations (see below) |
| `pageSize` | number | `10` | Rows per page |
| `defaultSort` | object | `{}` | Initial sort state, e.g. `{ name: "ascending" }` |
| `groupBy` | object | — | Grouping config: `{ field, label?, sort? }` |
| `footer` | `(filteredData) => ReactNode` | — | Footer row renderer |
| `emptyTitle` | string | `"No results found"` | Empty state heading |
| `emptyMessage` | string | `"No records match..."` | Empty state body |
| `selectable` | boolean | `false` | Enable row selection checkboxes |
| `rowIdField` | string | `"id"` | Field name for unique row identifier |
| `onSelectionChange` | `(ids[]) => void` | — | Called when selection changes |
| `onRowEdit` | `(row, field, newValue) => void` | — | Called when a cell edit is committed |
| `serverSide` | boolean | `false` | Enable server-side mode |
| `totalCount` | number | — | Total record count (server-side) |
| `page` | number | — | Current page (server-side, controlled) |
| `onSearchChange` | `(term) => void` | — | Search callback (server-side) |
| `onFilterChange` | `(filterValues) => void` | — | Filter callback (server-side) |
| `onSortChange` | `(field, direction) => void` | — | Sort callback (server-side) |
| `onPageChange` | `(page) => void` | — | Page callback (server-side) |

### Column Definition

| Property | Type | Description |
|---|---|---|
| `field` | string | Key in the row object |
| `label` | string | Column header text |
| `sortable` | boolean | Enable sorting on this column |
| `width` | `"min"` \| `"max"` \| `"auto"` \| number | Column width |
| `align` | `"left"` \| `"center"` \| `"right"` | Text alignment |
| `renderCell` | `(value, row) => ReactNode` | Custom cell content renderer |
| `editable` | boolean | Enable inline editing for this column |
| `editType` | string | Input type (see supported types above) |
| `editOptions` | Array | Options for select/multiselect edit types |
| `editProps` | object | Additional props passed to the edit input component |

### Filter Definition

| Property | Type | Description |
|---|---|---|
| `name` | string | Field name to filter on |
| `type` | `"select"` \| `"multiselect"` \| `"dateRange"` | Filter type |
| `placeholder` | string | Placeholder/label text |
| `options` | `{ label, value }[]` | Options for select/multiselect |
| `chipLabel` | string | Label prefix for filter chips |
| `filterFn` | `(row, value) => boolean` | Custom filter function |

## Demo

This repo includes a demo card at `src/app/cards/DataTableDemo.jsx` that showcases all features. To run it:

1. Clone this repo
2. `cd src/app/cards && npm install`
3. Connect to your HubSpot account: `hs init`
4. `hs project upload` then `hs project deploy`
5. Navigate to any Contact, Company, or Deal record to see the "DataTable Demo" tab

## License

MIT
