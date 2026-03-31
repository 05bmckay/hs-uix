import React, { useState, useCallback } from "react";
import {
  Flex,
  Heading,
  TableRow,
  TableCell,
  TableHeader,
  Text,
  StatusTag,
  Tag,
  Divider,
  hubspot,
} from "@hubspot/ui-extensions";
import { DataTable } from "./components/DataTable.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// Sample data
// ═══════════════════════════════════════════════════════════════════════════

const SAMPLE_DATA = [
  { id: 1, name: "Acme Corp", contact: "Jane Smith", status: "active", category: "enterprise", amount: 125000, date: "2026-01-15", priority: true },
  { id: 2, name: "Globex Inc", contact: "Bob Johnson", status: "active", category: "mid-market", amount: 67000, date: "2026-02-03", priority: false },
  { id: 3, name: "Initech", contact: "Michael Bolton", status: "churned", category: "smb", amount: 12000, date: "2025-11-20", priority: false },
  { id: 4, name: "Umbrella Corp", contact: "Alice Wesker", status: "at-risk", category: "enterprise", amount: 230000, date: "2026-03-01", priority: true },
  { id: 5, name: "Stark Industries", contact: "Pepper Potts", status: "active", category: "enterprise", amount: 450000, date: "2026-01-28", priority: false },
  { id: 6, name: "Wayne Enterprises", contact: "Lucius Fox", status: "active", category: "enterprise", amount: 380000, date: "2025-12-15", priority: true },
  { id: 7, name: "Wonka Industries", contact: "Charlie Bucket", status: "at-risk", category: "mid-market", amount: 42000, date: "2026-02-14", priority: false },
  { id: 8, name: "Cyberdyne Systems", contact: "Miles Dyson", status: "churned", category: "mid-market", amount: 89000, date: "2025-10-05", priority: false },
  { id: 9, name: "Soylent Corp", contact: "Sol Roth", status: "active", category: "smb", amount: 18000, date: "2026-03-10", priority: false },
  { id: 10, name: "Tyrell Corp", contact: "Eldon Tyrell", status: "active", category: "enterprise", amount: 520000, date: "2026-01-05", priority: true },
  { id: 11, name: "Pied Piper", contact: "Richard Hendricks", status: "active", category: "smb", amount: 28000, date: "2026-02-22", priority: false },
  { id: 12, name: "Hooli", contact: "Gavin Belson", status: "at-risk", category: "enterprise", amount: 175000, date: "2025-12-30", priority: true },
];

// ═══════════════════════════════════════════════════════════════════════════
// Status helpers
// ═══════════════════════════════════════════════════════════════════════════

const STATUS_COLORS = {
  active: "success",
  "at-risk": "warning",
  churned: "danger",
};

const STATUS_LABELS = {
  active: "Active",
  "at-risk": "At Risk",
  churned: "Churned",
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

// ═══════════════════════════════════════════════════════════════════════════
// Demo 1: Full-featured (filters, sort, pagination, footer)
// ═══════════════════════════════════════════════════════════════════════════

const FULL_COLUMNS = [
  {
    field: "name", label: "Company", sortable: true,
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>
  },
  {
    field: "contact", label: "Contact", sortable: true,
    renderCell: (val) => val
  },
  {
    field: "status", label: "Status", sortable: true,
    renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{STATUS_LABELS[val]}</StatusTag>
  },
  {
    field: "category", label: "Segment", sortable: true,
    renderCell: (val) => <Tag variant="default">{val}</Tag>
  },
  {
    field: "amount", label: "Amount", sortable: true, align: "right",
    renderCell: (val) => formatCurrency(val)
  },
  {
    field: "date", label: "Close Date", sortable: true,
    renderCell: (val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  },
];

const FULL_FILTERS = [
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
    name: "category",
    type: "select",
    placeholder: "All segments",
    options: [
      { label: "Enterprise", value: "enterprise" },
      { label: "Mid-Market", value: "mid-market" },
      { label: "SMB", value: "smb" },
    ],
  },
  {
    name: "date",
    type: "dateRange",
    placeholder: "Close date",
  },
];

const FullFeaturedDemo = () => (
  <Flex direction="column" gap="sm">
    <Heading>Full-Featured DataTable</Heading>
    <Text variant="microcopy">
      Search, filter, sort, paginate, footer summary. No explicit widths — auto-width sizes columns from content.
    </Text>
    <DataTable
      data={SAMPLE_DATA}
      columns={FULL_COLUMNS}
      renderRow={(row) => (
        <TableRow key={row.id}>
          <TableCell><Text format={{ fontWeight: "demibold" }}>{row.name}</Text></TableCell>
          <TableCell>{row.contact}</TableCell>
          <TableCell><StatusTag variant={STATUS_COLORS[row.status]}>{STATUS_LABELS[row.status]}</StatusTag></TableCell>
          <TableCell><Tag variant="default">{row.category}</Tag></TableCell>
          <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
          <TableCell>{new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
        </TableRow>
      )}
      searchFields={["name", "contact"]}
      searchPlaceholder="Search companies or contacts..."
      filters={FULL_FILTERS}
      pageSize={5}
      defaultSort={{ amount: "descending" }}
      footer={(filteredData) => (
        <TableRow>
          <TableHeader>Total</TableHeader>
          <TableHeader></TableHeader>
          <TableHeader></TableHeader>
          <TableHeader></TableHeader>
          <TableHeader align="right">
            {formatCurrency(filteredData.reduce((sum, r) => sum + r.amount, 0))}
          </TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      )}
    />
  </Flex>
);

// ═══════════════════════════════════════════════════════════════════════════
// Demo 2: Selectable rows
// ═══════════════════════════════════════════════════════════════════════════

const SELECT_COLUMNS = [
  {
    field: "name", label: "Company", sortable: true,
    renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>
  },
  {
    field: "contact", label: "Contact",
    renderCell: (val) => val
  },
  {
    field: "status", label: "Status",
    renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{STATUS_LABELS[val]}</StatusTag>
  },
  {
    field: "amount", label: "Amount", sortable: true, align: "right",
    renderCell: (val) => formatCurrency(val)
  },
];

const SelectableDemo = () => {
  const [selected, setSelected] = useState([]);

  return (
    <Flex direction="column" gap="sm">
      <Heading>Row Selection</Heading>
      <Text variant="microcopy">
        Select individual rows or use the header checkbox to select all.
        {selected.length > 0 && ` (${selected.length} selected)`}
      </Text>
      <DataTable
        data={SAMPLE_DATA}
        columns={SELECT_COLUMNS}
        selectable={true}
        rowIdField="id"
        onSelectionChange={setSelected}
        searchFields={["name"]}
        pageSize={5}
      />
    </Flex>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Demo 3: Inline editing
// ═══════════════════════════════════════════════════════════════════════════

const EditableDemo = () => {
  const [data, setData] = useState(SAMPLE_DATA);

  const handleEdit = useCallback((row, field, newValue) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, [field]: newValue } : r))
    );
  }, []);

  const editColumns = [
    {
      field: "name", label: "Company", sortable: true,
      editable: true, editType: "text",
      editValidate: (val) => {
        if (!val || val.trim() === "") return "Company name is required";
        if (val.length < 2) return "Must be at least 2 characters";
        return true;
      },
      renderCell: (val) => <Text format={{ fontWeight: "demibold" }}>{val}</Text>
    },
    {
      field: "contact", label: "Contact",
      editable: true, editType: "text",
      renderCell: (val) => val
    },
    {
      field: "status", label: "Status",
      editable: true, editType: "select",
      editOptions: [
        { label: "Active", value: "active" },
        { label: "At Risk", value: "at-risk" },
        { label: "Churned", value: "churned" },
      ],
      renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{STATUS_LABELS[val]}</StatusTag>
    },
    {
      field: "amount", label: "Amount", sortable: true, align: "right",
      editable: true, editType: "currency",
      editValidate: (val) => {
        if (val === null || val === undefined || val === "") return "Amount is required";
        if (Number(val) < 0) return "Amount cannot be negative";
        if (Number(val) > 1000000) return "Amount cannot exceed $1,000,000";
        return true;
      },
      renderCell: (val) => formatCurrency(val)
    },
    {
      field: "priority", label: "Priority",
      editable: true, editType: "select",
      renderCell: (val) => val ? <Tag variant="success">Yes</Tag> : <Tag variant="danger">No</Tag>
    },
  ];

  return (
    <Flex direction="column" gap="sm">
      <Heading>Inline Editing</Heading>
      <Text variant="microcopy">
        Click any highlighted cell to edit. Text/number fields show Save/Cancel. Dropdowns and toggles commit instantly.
      </Text>
      <DataTable
        data={data}
        columns={editColumns}
        rowIdField="id"
        onRowEdit={handleEdit}
        searchFields={["name", "contact"]}
        pageSize={6}
      />
    </Flex>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Demo 3b: Inline editing (always-visible inputs)
// ═══════════════════════════════════════════════════════════════════════════

const InlineEditDemo = () => {
  const [data, setData] = useState(SAMPLE_DATA);

  const handleEdit = useCallback((row, field, newValue) => {
    setData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, [field]: newValue } : r))
    );
  }, []);

  const inlineColumns = [
    {
      field: "name", label: "Company",
      editable: true, editType: "text",
      renderCell: (val) => val
    },
    {
      field: "contact", label: "Contact",
      editable: true, editType: "text",
      renderCell: (val) => val
    },
    {
      field: "status", label: "Status",
      editable: true, editType: "select",
      editOptions: [
        { label: "Active", value: "active" },
        { label: "At Risk", value: "at-risk" },
        { label: "Churned", value: "churned" },
      ],
      renderCell: (val) => val
    },
    {
      field: "amount", label: "Amount", align: "right",
      editable: true, editType: "currency",
      renderCell: (val) => formatCurrency(val)
    },
    {
      field: "priority", label: "Priority",
      editable: true, editType: "checkbox",
      renderCell: (val) => val ? "Yes" : "No"
    },
  ];

  return (
    <Flex direction="column" gap="sm">
      <Heading>Inline Edit Mode</Heading>
      <Text variant="microcopy">
        All editable cells always show their input controls. Changes fire immediately.
      </Text>
      <DataTable
        data={data}
        columns={inlineColumns}
        rowIdField="id"
        editMode="inline"
        onRowEdit={handleEdit}
        pageSize={5}
      />
    </Flex>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Demo 4: Grouped rows
// ═══════════════════════════════════════════════════════════════════════════

const GROUP_COLUMNS = [
  {
    field: "name", label: "Company",
    renderCell: (val) => val
  },
  { field: "contact", label: "Contact", renderCell: (val) => val },
  {
    field: "status", label: "Status",
    renderCell: (val) => <StatusTag variant={STATUS_COLORS[val]}>{STATUS_LABELS[val]}</StatusTag>
  },
  {
    field: "amount", label: "Amount", align: "right",
    renderCell: (val) => formatCurrency(val)
  },
];

const GroupedDemo = () => (
  <Flex direction="column" gap="sm">
    <Heading>Row Grouping</Heading>
    <Text variant="microcopy">
      Collapsible groups with aggregated totals. Click a group to expand/collapse.
    </Text>
    <DataTable
      data={SAMPLE_DATA}
      columns={GROUP_COLUMNS}
      groupBy={{
        field: "category",
        label: (value, rows) => `${value.charAt(0).toUpperCase() + value.slice(1)} (${rows.length})`,
        sort: "asc",
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
  </Flex>
);

// ═══════════════════════════════════════════════════════════════════════════
// Main entry
// ═══════════════════════════════════════════════════════════════════════════

hubspot.extend(() => <DataTableDemoCard />);

const DataTableDemoCard = () => (
  <Flex direction="column" gap="lg">
    <FullFeaturedDemo />
    <Divider />
    <SelectableDemo />
    <Divider />
    <EditableDemo />
    <Divider />
    <InlineEditDemo />
    <Divider />
    <GroupedDemo />
  </Flex>
);
