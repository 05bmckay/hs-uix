# HubSpot DataTable

[![npm version](https://img.shields.io/npm/v/hubspot-datatable.svg)](https://www.npmjs.com/package/hubspot-datatable)
[![npm downloads](https://img.shields.io/npm/dm/hubspot-datatable.svg)](https://www.npmjs.com/package/hubspot-datatable)
[![license](https://img.shields.io/npm/l/hubspot-datatable.svg)](https://github.com/05bmckay/hubspot-datatable/blob/main/LICENSE)

A drop-in table component for HubSpot UI Extensions. Define your columns, pass your data, and you get search, filtering, sorting, pagination, inline editing, row grouping, and auto-sized columns out of the box.

![Full-Featured DataTable](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/fully-featured-table.png)

## Why DataTable?

If you've built tables with HubSpot's `Table`, `TableRow`, and `TableCell` primitives, you know the drill: wire up search, sorting, pagination, and filtering yourself, then spend an hour tweaking column widths that still look wrong. DataTable does all of that for you.

The column sizing alone is worth it. DataTable looks at your actual data (types, string lengths, unique values, whether a column has edit controls) and picks widths automatically. Booleans and dates get compact columns, text gets room, and editable columns are never too narrow for their inputs. You don't configure any widths unless you want to.

```jsx
const COLUMNS = [
  { field: "name", label: "Company", sortable: true, renderCell: (val) => val },
  { field: "status", label: "Status", renderCell: (val) => <StatusTag>{val}</StatusTag> },
  { field: "amount", label: "Amount", sortable: true, renderCell: (val) => formatCurrency(val) },
];

<DataTable data={deals} columns={COLUMNS} searchFields={["name"]} pageSize={10} />
```

That's a searchable, sortable, paginated table with auto-sized columns in 5 lines of config.

## Features

- Full-text search across any combination of fields, with optional fuzzy matching via Fuse.js
- Select, multi-select, and date range filters with configurable active badges and clear/reset controls
- Click-to-sort headers with three-state cycling (none, ascending, descending)
- Client-side or server-side pagination with configurable page size, visible page buttons, and First/Last navigation
- Collapsible row groups with per-column aggregation functions
- Row selection via checkboxes with client/server-aware "Select all" behavior and optional parent callback for dataset-level selection flows
- Selection action bar with selected count, select/deselect all, and custom bulk action buttons
- Per-row actions via `rowActions` (static array or dynamic function), with optional hide-on-selection behavior
- Two edit modes (discrete and inline/full-row) supporting 12 input types, with per-column validation and automatic boolean-to-select conversion
- Separate edit callbacks for committed values (`onRowEdit`) and live input (`onRowEditInput`)
- Auto-width column sizing based on data analysis, with manual overrides when you need them
- Optional text truncation helpers (`truncate: true` or `truncate: { maxLength }`)
- Customizable record label (`recordLabel`) that flows into row count, selection bar, loading, and empty states
- Configurable row count display with custom text formatting and bold option
- Configurable table appearance (`bordered`, `flush`, `scrollable`)
- Footer rows computed from filtered data
- Server-side mode with loading/error states, search debounce, controlled state, and a unified `onParamsChange` callback
- Built-in empty state when no results match

## Installation

```bash
npm install hubspot-datatable
```

Import it in your card:

```jsx
import { DataTable } from "hubspot-datatable";
```

Requires `@hubspot/ui-extensions` and `react` as peer dependencies (already present in any HubSpot UI Extensions project).
TypeScript declarations are bundled with this package (`index.d.ts`).

---

## Examples

### Basic table with search and sorting

Define your columns with `renderCell`, pass your data, and the table handles sizing, search, and sorting.

```jsx
import React from "react";
import { Flex, Text, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

const CONTACTS = [
  { id: 1, name: "Jane Smith", email: "jane@acme.com", role: "VP Sales" },
  { id: 2, name: "Bob Johnson", email: "bob@globex.com", role: "Engineer" },
  { id: 3, name: "Alice Wesker", email: "alice@umbrella.com", role: "CEO" },
];

const COLUMNS = [
  {
    field: "name",
    label: "Name",
    sortable: true,
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>,
  },
  { field: "email", label: "Email", sortable: true, renderCell: (val) => val },
  { field: "role", label: "Role", renderCell: (val) => val },
];

hubspot.extend(() => (
  <DataTable
    data={CONTACTS}
    columns={COLUMNS}
    searchFields={["name", "email"]}
    searchPlaceholder="Search contacts..."
    pageSize={10}
    defaultSort={{ name: "ascending" }}
  />
));
```

> You can also use `renderRow` for full row control instead of `renderCell`, but `renderCell` is required when using `selectable`, editable columns, or `groupBy`.

---

### Filters, sorting, and footer totals

![Active Filters](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/fully-featured-table-active-filters.png)

When more than 2 filters are defined, the first 2 appear inline and the rest are tucked behind a **Filters** button with a funnel icon. Active filters display as removable chips with a "Clear all" option by default. You can hide badges via `showFilterBadges={false}` and keep reset with `showClearFiltersButton={true}`. The footer receives the filtered data so totals stay accurate.

```jsx
import React from "react";
import { Text, StatusTag, Tag, TableRow, TableHeader, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

const DEALS = [
  { id: 1, company: "Acme Corp", status: "active", segment: "enterprise", amount: 125000, closeDate: "2026-01-15" },
  { id: 2, company: "Globex Inc", status: "active", segment: "mid-market", amount: 67000, closeDate: "2026-02-03" },
  { id: 3, company: "Initech", status: "churned", segment: "smb", amount: 12000, closeDate: "2025-11-20" },
  { id: 4, company: "Umbrella Corp", status: "at-risk", segment: "enterprise", amount: 230000, closeDate: "2026-03-01" },
];

const STATUS_COLORS = { active: "success", "at-risk": "warning", churned: "danger" };

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

const COLUMNS = [
  { field: "company", label: "Company", sortable: true,
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text> },
  { field: "status", label: "Status", sortable: true,
    renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{val}</StatusTag> },
  { field: "segment", label: "Segment", sortable: true,
    renderCell: (val) => <Tag variant="default">{val}</Tag> },
  { field: "amount", label: "Amount", sortable: true, align: "right",
    renderCell: (val) => formatCurrency(val) },
  { field: "closeDate", label: "Close Date", sortable: true,
    renderCell: (val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
];

const FILTERS = [
  {
    name: "status",
    type: "select",
    placeholder: "All statuses",
    options: [
      { label: "Active", value: "active" },
      { label: "At Risk", value: "at-risk" },
      { label: "Churned", value: "churned" },
    ],
  },
  {
    name: "segment",
    type: "select",
    placeholder: "All segments",
    options: [
      { label: "Enterprise", value: "enterprise" },
      { label: "Mid-Market", value: "mid-market" },
      { label: "SMB", value: "smb" },
    ],
  },
  {
    name: "closeDate",
    type: "dateRange",
    placeholder: "Close date",
  },
];

hubspot.extend(() => (
  <DataTable
    data={DEALS}
    columns={COLUMNS}
    searchFields={["company"]}
    searchPlaceholder="Search companies..."
    filters={FILTERS}
    pageSize={5}
    defaultSort={{ amount: "descending" }}
    footer={(filteredData) => (
      <TableRow>
        <TableHeader>Total</TableHeader>
        <TableHeader />
        <TableHeader />
        <TableHeader align="right">
          {formatCurrency(filteredData.reduce((sum, r) => sum + r.amount, 0))}
        </TableHeader>
        <TableHeader />
      </TableRow>
    )}
  />
));
```

Hide badges but keep reset:

```jsx
<DataTable
  data={DEALS}
  columns={COLUMNS}
  filters={FILTERS}
  showFilterBadges={false}
  showClearFiltersButton={true}
/>
```

#### Custom filter functions

Override the default filter logic for any filter. This is useful for range-based filters or computed values:

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

---

### Row selection with bulk actions

![Row Selection with Action Bar and Per-Row Actions](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/action-bar-per-row-actions.png)

Add checkboxes with a select-all header (selects current page). When rows are selected, a compact action bar appears above the table showing the selected count, a "Select all" button, "Deselect all", and any custom action buttons you define.

- Client-side mode: action-bar "Select all" selects all matching rows across pages.
- Server-side mode: action-bar "Select all" selects current page rows for visual feedback and optionally fires `onSelectAllRequest` so the parent can trigger a true dataset-level select-all flow.
- Uncontrolled selection memory persists across pages and resets on search/filter/sort changes by default. Use `selectionResetKey` to force a reset when dataset identity changes.

Requires `renderCell` on each column.

```jsx
import React, { useState, useMemo } from "react";
import { Flex, Heading, Text, StatusTag, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

hubspot.extend(() => <SelectableTable />);

function SelectableTable() {
  const [selected, setSelected] = useState([]);

  const selectionActions = useMemo(() => [
    { label: "Edit", icon: "edit", onClick: (ids) => console.log("Edit", ids) },
    { label: "Delete", icon: "delete", onClick: (ids) => console.log("Delete", ids) },
    { label: "Export", icon: "dataExport", onClick: (ids) => console.log("Export", ids) },
  ], []);

  const columns = [
    { field: "name", label: "Company", sortable: true,
      renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text> },
    { field: "contact", label: "Contact", renderCell: (val) => val },
    { field: "status", label: "Status",
      renderCell: (val) => <StatusTag variant={val === "active" ? "success" : "warning"}>{val}</StatusTag> },
  ];

  return (
    <Flex direction="column" gap="sm">
      <Heading>Companies</Heading>
      <DataTable
        data={COMPANIES}
        columns={columns}
        selectable={true}
        rowIdField="id"
        recordLabel={{ singular: "Company", plural: "Companies" }}
        onSelectionChange={setSelected}
        selectionActions={selectionActions}
        searchFields={["name", "contact"]}
        pageSize={10}
      />
    </Flex>
  );
}
```

Each action in `selectionActions` receives the array of selected row IDs when clicked. You can optionally set `icon` (any HubSpot Icon name) and `variant` (Button variant) on each action.

Server-side selection example:

```jsx
<DataTable
  serverSide={true}
  data={pageRows}
  totalCount={totalCount}
  columns={columns}
  selectable={true}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
  onSelectAllRequest={({ selectedIds, pageIds, totalCount }) => {
    // Keep page-level visual selection in sync, then trigger dataset-level selection flow
    requestSelectAllMatchingRows({ selectedIds, pageIds, totalCount });
  }}
  selectionResetKey={`${query.search}|${JSON.stringify(query.filters)}|${query.sort?.field || ""}:${query.sort?.direction || ""}`}
/>
```

---

### Row actions and full-row "Edit/Done" flow

![Full-Row Editing](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/full-row-editing.png)

Use `rowActions` to append an actions column on the right. You can pass a static action list or a row-aware function.

```jsx
function DealsTable() {
  const [rows, setRows] = useState(DEALS);
  const [drafts, setDrafts] = useState({});
  const [editingRowId, setEditingRowId] = useState(null);

  const handleCommittedEdit = useCallback((row, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [row.id]: { ...(prev[row.id] || row), [field]: value },
    }));
  }, []);

  const saveRow = useCallback((rowId) => {
    const draft = drafts[rowId];
    if (!draft) return;
    setRows((prev) => prev.map((r) => (r.id === rowId ? draft : r)));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
    setEditingRowId(null);
  }, [drafts]);

  return (
    <DataTable
      data={rows.map((r) => drafts[r.id] || r)}
      columns={columns}
      rowIdField="id"
      editingRowId={editingRowId}
      hideRowActionsWhenSelectionActive={true}
      onRowEdit={handleCommittedEdit}
      rowActions={(row) => editingRowId === row.id
        ? [{ label: "Done", icon: "success", onClick: () => saveRow(row.id) }]
        : [{ label: "Edit", icon: "edit", onClick: () => setEditingRowId(row.id) }]}
    />
  );
}
```

This pattern keeps edits local while the row is in edit mode and only persists to your real data source when the user clicks **Done**.

If you also enable row selection, set `hideRowActionsWhenSelectionActive={true}` to hide per-row actions while the selected-row action bar is visible.

---

### Text truncation

Use column-level `truncate` when you want safer defaults for long text fields.

```jsx
const columns = [
  { field: "company", label: "Company", renderCell: (val) => val },
  { field: "notes", label: "Notes", truncate: true, renderCell: (val) => val },
  { field: "summary", label: "Summary", truncate: { maxLength: 120 }, renderCell: (val) => val },
];
```

- `truncate: true` uses single-line truncation with full text in tooltip.
- `truncate: { maxLength }` truncates by character count with `...` and tooltip.
- Truncation is skipped while a cell is actively being edited.

---

### Scrollable wide tables

![Scrollable Wide Table](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/scrollable-wide-table.png)

When you have many columns, set `scrollable={true}` to allow horizontal overflow instead of squishing columns. Columns without explicit widths fall back to `"min"` width, keeping each column compact and letting the table scroll.

```jsx
<DataTable
  data={data}
  columns={manyColumns}
  scrollable={true}
  pageSize={10}
/>
```

---

### Inline editing — discrete mode

![Discrete Editing - Select](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/inline-editing-discreet.png)
![Discrete Editing - Text](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/inline-editing-discreet2.png)

In discrete mode (the default), editable cells appear as dark links. Click to open the input. The cell reverts to display when you click away, keeping the last committed value. Select/date/toggle-type inputs commit and close instantly on change. Text-like inputs commit via HubSpot `onChange` (typically blur/submit), and can stream live input through `onRowEditInput`.

```jsx
import React, { useState, useCallback } from "react";
import { Text, StatusTag, Tag, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

const STATUS_COLORS = { active: "success", "at-risk": "warning", churned: "danger" };
const STATUS_LABELS = { active: "Active", "at-risk": "At Risk", churned: "Churned" };

hubspot.extend(() => <EditableTable />);

function EditableTable() {
  const [data, setData] = useState(DEALS);

  const handleEdit = useCallback((row, field, newValue) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, [field]: newValue } : r))
    );
  }, []);

  const columns = [
    {
      field: "company", label: "Company", sortable: true,
      editable: true, editType: "text",
      renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>,
    },
    {
      field: "status", label: "Status",
      editable: true, editType: "select",
      editOptions: [
        { label: "Active", value: "active" },
        { label: "At Risk", value: "at-risk" },
        { label: "Churned", value: "churned" },
      ],
      renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{STATUS_LABELS[val]}</StatusTag>,
    },
    {
      field: "amount", label: "Amount", align: "right",
      editable: true, editType: "currency",
      renderCell: (val) => formatCurrency(val),
    },
    {
      field: "priority", label: "Priority",
      editable: true, editType: "checkbox",
      renderCell: (val) => val ? <Tag variant="default">Yes</Tag> : <Text variant="microcopy">No</Text>,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowIdField="id"
      onRowEdit={handleEdit}
      searchFields={["company"]}
      pageSize={10}
    />
  );
}
```

> `align` is automatically stripped from cells and headers when input controls are visible, since HubSpot input components don't respect the parent cell's text alignment. You can still set `align` on editable columns and it applies correctly in the display view.

---

### Inline editing — inline mode

![Inline Edit Mode](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/inline-editing-regular.png)

In inline mode, all editable cells always show their input controls. This mode is also used for full-row editing when `editingRowId` is set. Set `editMode="inline"` to enable always-visible inputs.

```jsx
<DataTable
  data={data}
  columns={columns}
  rowIdField="id"
  editMode="inline"
  onRowEdit={handleEdit}
  pageSize={5}
/>
```

**Supported `editType` values:**

| editType | Component | Commit Behavior |
|---|---|---|
| `text` | Input | Commit on `onChange` (HubSpot: usually blur/submit); optional live input via `onRowEditInput` |
| `textarea` | TextArea | Commit on `onChange` (HubSpot: usually blur/submit); optional live input via `onRowEditInput` |
| `number` | NumberInput | Commit on `onChange` (HubSpot: usually blur/submit); optional live input via `onRowEditInput` |
| `currency` | CurrencyInput | Commit on `onChange` (HubSpot: usually blur/submit); optional live input via `onRowEditInput` |
| `stepper` | StepperInput | Commit on `onChange` (HubSpot: usually blur/submit); optional live input via `onRowEditInput` |
| `select` | Select | Instant on change |
| `multiselect` | MultiSelect | Instant on change |
| `date` | DateInput | Instant on change |
| `time` | TimeInput | Instant on change |
| `datetime` | DateInput + TimeInput | Emits `{ date, time }` updates as either control changes |
| `toggle` | Toggle | Instant on change |
| `checkbox` | Checkbox | Instant on change |

Use `editProps` to pass additional props to the edit component (e.g., `{ currencyCode: "EUR" }` for `CurrencyInput` or `timeProps` for datetime time input options).

---

### Row grouping with aggregations

![Row Grouping](https://raw.githubusercontent.com/05bmckay/hubspot-datatable/main/assets/row-grouping.png)

Groups are collapsible. Click a group header to expand or collapse it. You can define aggregation functions per column, and groups start expanded by default.

```jsx
import React from "react";
import { Text, StatusTag, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

const STATUS_COLORS = { active: "success", "at-risk": "warning", churned: "danger" };

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

const COLUMNS = [
  { field: "company", label: "Company", renderCell: (val) => val },
  { field: "contact", label: "Contact", renderCell: (val) => val },
  { field: "status", label: "Status",
    renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{val}</StatusTag> },
  { field: "amount", label: "Amount", align: "right",
    renderCell: (val) => formatCurrency(val) },
];

hubspot.extend(() => (
  <DataTable
    data={DEALS}
    columns={COLUMNS}
    groupBy={{
      field: "segment",
      label: (value, rows) => `${value.charAt(0).toUpperCase() + value.slice(1)} (${rows.length})`,
      sort: "asc",
      defaultExpanded: true,
      aggregations: {
        amount: (rows) => formatCurrency(rows.reduce((sum, r) => sum + r.amount, 0)),
        status: (rows) => {
          const active = rows.filter((r) => r.status === "active").length;
          return <Text variant="microcopy">{active} of {rows.length} active</Text>;
        },
      },
    }}
    pageSize={30}
  />
));
```

You can also provide static values per group instead of aggregation functions:

```jsx
groupBy={{
  field: "region",
  label: (value) => value,
  groupValues: {
    "North America": { revenue: "$2.1M" },
    "Europe": { revenue: "$1.4M" },
  },
}}
```

---

### Auto-width

On by default. DataTable scans up to 50 rows and picks widths based on what's in each column. Disable with `autoWidth={false}` if you want full manual control.

The heuristics:

| Data Pattern | Header Width | Cell Width |
|---|---|---|
| Booleans (`true`/`false`) | `min` | `min` |
| Dates (ISO format) | `min` | `auto` |
| Numbers | `auto` | `auto` |
| Small enums (5 or fewer unique values, 15 chars or less) | `min` | `auto` |
| Text | `auto` | `auto` |

A few things to know:
- Editable columns (except checkbox/toggle) never get `min` headers, since input components need room.
- `align` is stripped from headers and cells when input controls are showing, because HubSpot inputs ignore parent text alignment.
- In discrete edit mode, the active cell switches to `auto` width while the input is open.

Manual overrides always take priority. You can set `width` (applies to header and cells) and `cellWidth` (cells only):

```jsx
// Header and cells both use "max"
{ field: "name", label: "Name", width: "max" }

// Header tight around label, cells expand to show full values
{ field: "name", label: "Name", width: "min", cellWidth: "max" }

// Disable auto-width for a specific column
{ field: "notes", label: "Notes", width: "auto", cellWidth: "auto" }
```

---

### Row count customization

Use `rowCountText` when you want full control over the row count label.

```jsx
<DataTable
  data={products}
  columns={columns}
  pageSize={25}
  rowCountText={(shownOnPage, totalMatching) =>
    `Showing ${shownOnPage} of ${totalMatching} products`
  }
/>
```

`rowCountText` callback args:

- `shownOnPage`: number of data rows on the current page
- `totalMatching`: total rows matching the current query/filter state

In server-side mode, `totalMatching` maps to `totalCount` (or `data.length` if `totalCount` is not provided).

---

### Server-side mode

If your data comes from an API or you have too many records to load at once, turn on `serverSide={true}`. DataTable still renders all the UI (search box, filter dropdowns, sort headers, pagination buttons), but it skips client-side processing and fires callbacks instead. You handle the fetching.

You pass `data` with just the current page of results, and `totalCount` with the total number of records so pagination works (e.g., "Showing 1-25 of 247"). Wire up callbacks to re-fetch whenever the user interacts with the table. You can use individual callbacks or the unified `onParamsChange` for less boilerplate.

```jsx
import React, { useState, useEffect, useCallback } from "react";
import { Text, StatusTag, hubspot } from "@hubspot/ui-extensions";
import { DataTable } from "hubspot-datatable";

const COLUMNS = [
  { field: "name", label: "Company", sortable: true,
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text> },
  { field: "email", label: "Email", sortable: true, renderCell: (val) => val },
  { field: "status", label: "Status", sortable: true,
    renderCell: (val) => <StatusTag variant={val === "active" ? "success" : "warning"}>{val}</StatusTag> },
  { field: "createdAt", label: "Created", sortable: true,
    renderCell: (val) => new Date(val).toLocaleDateString() },
];

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
];

hubspot.extend(({ runServerlessFunction }) => (
  <ServerSideTable runServerlessFunction={runServerlessFunction} />
));

function ServerSideTable({ runServerlessFunction }) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, pageSize: 25 });

  const fetchData = useCallback(async (nextParams) => {
    const merged = { ...params, ...nextParams };
    setParams(merged);
    setLoading(true);
    setError(null);

    try {
      const result = await runServerlessFunction({
        name: "fetchContacts",
        parameters: merged,
      });
      setData(result.records);
      setTotalCount(result.total);
    } catch (err) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [params, runServerlessFunction]);

  // Initial load
  useEffect(() => { fetchData({ page: 1, pageSize: 25 }); }, []);

  return (
    <DataTable
      serverSide={true}
      loading={loading}
      error={error}
      data={data}
      totalCount={totalCount}
      columns={COLUMNS}
      searchFields={["name", "email"]}
      searchPlaceholder="Search contacts..."
      filters={FILTERS}
      pageSize={25}
      page={params.page}
      searchDebounce={300}
      onParamsChange={(p) => fetchData(p)}
    />
  );
}
```

#### What each callback receives

| Callback | Arguments | When it fires |
|---|---|---|
| `onSearchChange` | `(searchTerm: string)` | User types in the search box (debounced if `searchDebounce` is set) |
| `onFilterChange` | `(filterValues: object)` | User selects/clears a filter. Object shape: `{ status: "active", category: ["a", "b"] }` |
| `onSortChange` | `(field: string, direction: "ascending" \| "descending" \| "none")` | User clicks a sortable column header. `"none"` means sort was cleared. |
| `onPageChange` | `(page: number)` | User clicks a pagination button |
| `onParamsChange` | `({ search, filters, sort, page })` | Fires on any of the above changes. `sort` is `{ field, direction }` or `null`. |
| `onSelectAllRequest` | `({ selectedIds, pageIds, totalCount })` | Server-side only: user clicks selection-bar "Select all". |

#### Key differences from client-side mode

| Behavior | Client-side (default) | Server-side (`serverSide={true}`) |
|---|---|---|
| Filtering | DataTable filters `data` in memory | Skipped, you filter on the server |
| Sorting | DataTable sorts in memory | Skipped, you sort on the server |
| Pagination | DataTable slices the full array | DataTable renders controls, you fetch the right page |
| `data` prop | Full dataset | Current page only |
| `totalCount` prop | Not needed (computed from data) | Required for pagination to work |
| Search | DataTable searches `searchFields` in memory | Skipped, `onSearchChange` fires and you query the server |
| Selection action-bar "Select all" | Selects all matching rows in-memory | Selects current page rows + optional `onSelectAllRequest` callback for dataset-level selection |
| Footer | `footer` receives all filtered rows | `footer` receives current `data` (the current page) |
| Grouping | Works on full in-memory dataset | Works on whatever `data` contains (current page) |

#### Tips

- Reset to page 1 when search, filters, or sort change, otherwise the user can land on an empty page.
- Use `searchDebounce={300}` to avoid firing a request on every keystroke. The search input updates immediately for responsive UI, but the callback is delayed.
- Use `onParamsChange` instead of wiring up 4 individual callbacks — it receives a single object with all current state on every change.
- Set `loading={true}` while fetching and `error={errorMessage}` on failure. DataTable shows a `LoadingSpinner` or `ErrorState` in place of the table automatically.
- Use `searchValue`, `filterValues`, and `sort` props to externally control the table state (e.g., deep-linking to a pre-filtered view or resetting after an action). `sort` accepts `{ field, direction }` or `{ [field]: direction }`.
- Use `selectedIds` (controlled selection) to persist selection memory across page fetches.
- Use `selectionResetKey` to clear uncontrolled selection when dataset identity changes (for example, when switching tabs or query scopes).

---

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | Array | *required* | Array of row objects |
| `columns` | Array | *required* | Column definitions (see below) |
| `renderRow` | `(row) => ReactNode` | — | Renders a full `<TableRow>`. Omit to use column-based rendering via `renderCell`. |
| `searchFields` | string[] | `[]` | Fields to search across |
| `fuzzySearch` | boolean | `false` | Enable fuzzy matching via Fuse.js |
| `fuzzyOptions` | object | — | Custom Fuse.js options (threshold, distance, etc.) |
| `searchPlaceholder` | string | `"Search..."` | Placeholder text for search input |
| `filters` | Array | `[]` | Filter configurations (see below) |
| `showFilterBadges` | boolean | `true` | Show active filter chips/badges below the filter controls |
| `showClearFiltersButton` | boolean | `true` | Show "Clear all" filters reset button when filters are active |
| `pageSize` | number | `10` | Rows per page |
| `maxVisiblePageButtons` | number | — | Max page number buttons to display |
| `showButtonLabels` | boolean | `true` | Show First/Prev/Next/Last text labels |
| `showFirstLastButtons` | boolean | auto | Show First/Last page buttons (auto-enabled when > 5 pages) |
| `showRowCount` | boolean | `true` | Show "X records" / "X of Y records" text |
| `rowCountBold` | boolean | `false` | Bold the row count text |
| `rowCountText` | `(shownOnPage, totalMatching) => string` | — | Custom row count formatter. `shownOnPage` is current-page row count; `totalMatching` is total rows matching current query/filter state. |
| `bordered` | boolean | `true` | Show table borders |
| `flush` | boolean | `true` | Remove bottom margin |
| `scrollable` | boolean | `false` | Use `"min"` fallback widths for unspecified columns to allow horizontal scrolling instead of column squish |
| `defaultSort` | object | `{}` | Initial sort state, e.g. `{ name: "ascending" }` |
| `groupBy` | object | — | Grouping config (see below) |
| `footer` | `(filteredData) => ReactNode` | — | Footer row renderer |
| `emptyTitle` | string | `"No results found"` | Empty state heading |
| `emptyMessage` | string | `"No {pluralLabel} match..."` | Empty state body. Uses `recordLabel` plural by default. |
| `recordLabel` | `{ singular, plural }` | `{ singular: "record", plural: "records" }` | Entity name used in row count, selection bar, loading, and empty states. Automatically lowercased. |
| `selectable` | boolean | `false` | Enable row selection checkboxes |
| `rowIdField` | string | `"id"` | Field name for unique row identifier |
| `selectedIds` | Array | — | Controlled selection — array of row IDs. When provided, overrides internal selection state. |
| `onSelectionChange` | `(ids[]) => void` | — | Called when selection changes |
| `onSelectAllRequest` | `({ selectedIds, pageIds, totalCount }) => void` | — | Server-side only. Fired when action-bar "Select all" is clicked. |
| `selectionActions` | Array | `[]` | Bulk action buttons: `[{ label, onClick(ids[]), icon?, variant? }]` |
| `selectionResetKey` | string \| number \| object | — | Optional reset key for uncontrolled selection memory. When it changes, selection clears. |
| `resetSelectionOnQueryChange` | boolean | `true` | Whether uncontrolled selection resets when search/filter/sort changes |
| `rowActions` | Array \| `(row) => actions[]` | — | Per-row action buttons shown in a right-side actions column |
| `hideRowActionsWhenSelectionActive` | boolean | `false` | Hide per-row action column while selected-row action bar is visible |
| `editMode` | `"discrete"` \| `"inline"` | `"discrete"` | Edit mode: click-to-edit or always-visible inputs |
| `editingRowId` | string \| number | — | Full-row edit mode. When set, editable cells for that row render inline controls. |
| `onRowEdit` | `(row, field, newValue) => void` | — | Called when an edit value is committed |
| `onRowEditInput` | `(row, field, inputValue) => void` | — | Optional live input callback (validation/drafts) for text-like edit controls |
| `autoWidth` | boolean | `true` | Auto-compute column widths from content analysis |
| `serverSide` | boolean | `false` | Enable server-side mode |
| `loading` | boolean | `false` | Show a loading spinner in place of the table |
| `error` | string \| boolean | — | Show an error state. String value is used as the title. |
| `totalCount` | number | — | Total record count (server-side) |
| `page` | number | — | Current page (server-side, controlled) |
| `searchValue` | string | — | Controlled search term (server-side) |
| `filterValues` | object | — | Controlled filter values (server-side) |
| `sort` | object | — | Controlled sort state. Accepts `{ field, direction }` or `{ [field]: "ascending" \| "descending" \| "none" }`. |
| `searchDebounce` | number | `0` | Milliseconds to debounce `onSearchChange` callback |
| `resetPageOnChange` | boolean | `true` | Auto-reset to page 1 on search, filter, or sort changes |
| `onSearchChange` | `(term) => void` | — | Search callback (server-side) |
| `onFilterChange` | `(filterValues) => void` | — | Filter callback (server-side) |
| `onSortChange` | `(field, "ascending" \| "descending" \| "none") => void` | — | Sort callback (server-side). `"none"` indicates cleared sort. |
| `onPageChange` | `(page) => void` | — | Page callback (server-side) |
| `onParamsChange` | `({ search, filters, sort, page }) => void` | — | Unified callback fired on any interaction change |

### Column Definition

| Property | Type | Description |
|---|---|---|
| `field` | string | Key in the row object |
| `label` | string | Column header text |
| `sortable` | boolean | Enable sorting on this column |
| `width` | `"min"` \| `"max"` \| `"auto"` \| `number` | Column width (header + cell fallback). Numeric value is treated as fixed width in pixels. |
| `cellWidth` | `"min"` \| `"max"` \| `"auto"` | Cell-only width override (numeric values are not supported) |
| `align` | `"left"` \| `"center"` \| `"right"` | Text alignment (auto-stripped when inputs are visible) |
| `renderCell` | `(value, row) => ReactNode` | Custom cell content renderer |
| `truncate` | `true` \| `{ maxLength?: number }` | Optional text truncation helper with tooltip |
| `editable` | boolean | Enable inline editing for this column |
| `editType` | string | Input type (see supported types above) |
| `editOptions` | Array | Options for select/multiselect edit types. Auto-generates Yes/No options for boolean fields if omitted. |
| `editValidate` | `(value, row) => true \| string` | Validation function. Return `true` if valid, or an error message string. Invalid values block the edit from committing. |
| `editProps` | object | Additional props passed to the edit input component |

### GroupBy Definition

| Property | Type | Description |
|---|---|---|
| `field` | string | Field to group rows by |
| `label` | `(value, rows) => string` | Custom group header label |
| `sort` | `"asc"` \| `"desc"` \| `(a, b) => number` | Group sort order |
| `defaultExpanded` | boolean | Whether groups start expanded (default `true`) |
| `aggregations` | `{ [field]: (rows, groupKey) => ReactNode }` | Per-column aggregation functions for group headers |
| `groupValues` | `{ [groupKey]: { [field]: ReactNode } }` | Static values per group per column |

### Filter Definition

| Property | Type | Description |
|---|---|---|
| `name` | string | Field name to filter on |
| `type` | `"select"` \| `"multiselect"` \| `"dateRange"` | Filter type |
| `placeholder` | string | Placeholder/label text |
| `options` | `{ label, value }[]` | Options for select/multiselect |
| `chipLabel` | string | Label prefix for filter chips |
| `filterFn` | `(row, value) => boolean` | Custom filter function |

### Input Validation

Add an `editValidate` function to any editable column. It receives the current value and the full row, and should return `true` if valid or an error message string. Invalid values show inline errors and are blocked from committing.

If you need live draft handling (for example, optimistic form state or custom keystroke-level validation), use `onRowEditInput` alongside `onRowEdit`.

```jsx
const columns = [
  {
    field: "name",
    label: "Company",
    editable: true,
    editType: "text",
    editValidate: (value, row) => {
      if (!value || value.trim() === "") return "Company name is required";
      if (value.length < 2) return "Must be at least 2 characters";
      return true;
    },
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>,
  },
  {
    field: "amount",
    label: "Amount",
    editable: true,
    editType: "currency",
    editValidate: (value, row) => {
      if (value === null || value === undefined) return "Amount is required";
      if (Number(value) < 0) return "Amount cannot be negative";
      if (Number(value) > 1000000) return "Cannot exceed $1,000,000";
      return true;
    },
    renderCell: (val) => formatCurrency(val),
  },
];
```

Validation works in both edit modes. In discrete mode, errors display inline as the user types (via `onInput`). The edit is blocked from committing until the value passes validation, and while a validation error is active the input can't be dismissed via blur. The user has to fix the value before they can leave the cell. In inline mode, each cell tracks its own validation state independently and invalid values are blocked from firing `onRowEdit`.

---

## Limitations

These come from HubSpot UI Extensions itself, not DataTable:

| Limitation | Details |
|---|---|
| No sticky headers | HubSpot's `Table` component doesn't support sticky/fixed headers. Long tables scroll the headers out of view. Use `pageSize` to keep tables short. |
| No column resizing | Users cannot drag to resize columns. Widths are fixed to `"min"`, `"max"`, or `"auto"`. |
| No drag-and-drop | No row reordering or column reordering via drag-and-drop. |
| No virtual scrolling | All visible rows are rendered to the DOM. For large datasets (500+ rows), use server-side mode with pagination. |
| No pixel widths | `TableCell` `width` only accepts `"min"`, `"max"`, or `"auto"`. Numeric pixel values are silently ignored by HubSpot. |
| Input alignment | HubSpot input components (Input, NumberInput, CurrencyInput, etc.) ignore parent `text-align` CSS. DataTable strips `align` when inputs are visible so headers and cells stay consistent. |
| No multi-column sort | Only one column can be sorted at a time. |
| No row expansion | No expand/collapse for individual row detail views. Row grouping works, but per-row expansion does not. |
| No export | No built-in CSV/Excel export. You'd need to implement this in a serverless function. |
| Validation on select/toggle/checkbox | `editValidate` only shows error UI on text-based inputs (text, number, currency, textarea, stepper). Select, toggle, and checkbox commit immediately and don't show `validationMessage`. |

---

## Roadmap

Planned for future releases:

- Column visibility toggle so users can show/hide columns
- Expandable rows with detail content below each row
- Click-to-copy on individual cell values
- Conditional formatting to color-code cells based on value rules
- Per-column filter dropdowns in the header row
- Keyboard navigation (Tab between editable cells, Enter to commit, Escape to cancel)
- Async validation via `editValidate` returning a Promise
- Multi-column sort with priority ordering

---

## Demo

A standalone demo app showcasing all features is available in a separate repo: [hubspot-datatable-demo](https://github.com/05bmckay/hubspot-datatable-demo)

It includes examples of:

1. Full-featured table with search, filters, sorting, pagination, footer totals, fuzzy search, record labels, and auto-width
2. Row selection with bulk action bar, per-row action buttons, text truncation, and record labels
3. Full-row editing with Edit/Done toggle via row actions, time and datetime inputs, and validation
4. Scrollable wide table with many columns and single-line truncation

## License

MIT
