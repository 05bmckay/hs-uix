// ---------------------------------------------------------------------------
// Date range presets — matches HubSpot's native quick-date filter dropdown
// (as seen on the Deals board). Use as the `options` for a `select` filter
// on Kanban / DataTable so consumers don't have to retype the list.
//
//   import { HS_DATE_PRESETS } from "hs-uix/common-components";
//
//   filters={[
//     { name: "createDate", type: "select", placeholder: "Create date",
//       chipLabel: "Created", options: HS_DATE_PRESETS },
//   ]}
//
// The values are stable identifiers — it's up to the consumer to translate
// them into actual date bounds (via `filterFn` on the filter config or
// server-side in `onFilterChange`).
// ---------------------------------------------------------------------------

export const HS_DATE_PRESETS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This week", value: "this_week" },
  { label: "Last week", value: "last_week" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
  { label: "This quarter", value: "this_quarter" },
  { label: "Last quarter", value: "last_quarter" },
  { label: "This year", value: "this_year" },
  { label: "Last year", value: "last_year" },
];

// Stage-aware preset tuples for when a `dateRange` filter needs to be paired
// with direction-specific labels (e.g. Kanban's sortable field mode).
//   { asc: "Oldest", desc: "Most recent" } for chronological data.
export const HS_DATE_DIRECTION_LABELS = {
  asc: "Ascending",
  desc: "Descending",
};
