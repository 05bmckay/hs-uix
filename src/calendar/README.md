# Calendar (hs-uix/calendar)

[![npm version](https://img.shields.io/npm/v/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![npm downloads](https://img.shields.io/npm/dm/hs-uix)](https://www.npmjs.com/package/hs-uix)
[![license](https://img.shields.io/npm/l/hs-uix)](https://github.com/05bmckay/hs-uix/blob/main/LICENSE)

[← All hs-uix components](../../README.md)

A presentational calendar surface for HubSpot UI Extensions. Hand it an array of records plus an `eventFields` map and it renders a **Month**, **Week**, **Day**, **Agenda**, or **Resource** view with a Today / ‹ › / view-switcher toolbar, optional search + filters, click-to-open event overlays (Popover, Modal, or Panel), and an optional drag-free **reschedule** affordance. Like Kanban and Feed, the calendar is data-driven and presentational — the caller owns fetching *and persisting*: even a reschedule only **emits** the new `{ start, end }`, it never mutates the events you passed in.

![A month Calendar with searchable, stage-colored CRM events](https://raw.githubusercontent.com/05bmckay/hs-uix/main/src/calendar/assets/showcase-calendar.jpg)

```jsx
import { Calendar } from "hs-uix/calendar";

<Calendar
  events={deals}
  eventFields={{ id: "id", start: "closeDate", title: "name", subtitle: "owner", color: "color" }}
  defaultView="month"
/>
```

## Why Calendar?

HubSpot UI Extensions give you primitives, not a calendar. Rolling your own means building a month matrix by hand, equal-width day columns out of a `Table` with numeric widths, an hour grid that can't use `rowspan`, "+N more" overflow popovers, a Today/prev/next toolbar, and date coercion for the half-dozen shapes a CRM property can arrive in — all while working around the platform's missing height/scroll primitives. Calendar does that for you and exposes a small, controlled-or-uncontrolled API.

It maps **your** records to calendar roles via `eventFields` (a key or an accessor per role), so you don't reshape your data:

```jsx
const fields = {
  id: "id",
  start: "closeDate",          // a key…
  end: (deal) => deal.dueDate, // …or an accessor
  title: "name",
  subtitle: "owner",
  color: "stageColor",         // a Tag variant: default|info|success|warning|error
  href: (deal) => `/deal/${deal.id}`,
};
```

## Features

- Five views behind a `Select` switcher: **Month** (7-column day grid), **Week** / **Day** (hour-row time grid), **Agenda** (day-grouped list), and **Resource** (rows = owners/rooms/teams × the focused week's days — only offered when `resources` / `resourceField` is provided)
- **Drag-free reschedule** (the platform has no drag-and-drop): `rescheduleOptions` adds preset buttons ("+1 hour", "+1 day", "Next week", custom shifts or accessors) plus a "Pick date" `DateInput` to the event-detail overlay; `onEventReschedule` emits the shifted `{ start, end }` with the event's duration preserved (DST-safe) — you persist, the Calendar never moves events itself
- Controlled or uncontrolled `view` and `focusedDate`, with `onViewChange` / `onNavigate`
- Date coercion for every shape a HubSpot field arrives in: `Date`, epoch ms (number **or** string), ISO string, or a `DateInput` value object (`{ year, month, date }`, 0-indexed month) — date-only strings are parsed as **local** midnight so events never land a day early
- Multi-day events render across each day they touch; timed events show their start time
- Month-cell overflow collapses to a **"+N more"** popover; cap per cell with `maxEventsPerDay`
- Time grid honors `dayStartHour` / `dayEndHour`, an all-day band, and multi-hour blocks that note "↑ cont. through …"
- Search + filters reuse the same config shape as DataTable / Kanban (`select`, `multiselect`, `dateRange`), with optional fuzzy matching
- Event overlays via the standard `overlay` trigger: `overlayMode` of `"popover"` (default, experimental), `"modal"`, `"panel"`, or `"none"`, plus a `renderEventDetail` escape hatch and an always-fires `onEventClick`
- **Timezone support (opt-in)** — off by default (events render exactly as sent); set `timeZone` or enable the built-in `showTimeZoneSelect` dropdown and every time, grid placement, and day-grouping resolves in the chosen IANA zone, DST-correct
- Server-side friendly: `onRangeChange` fires on mount and whenever the visible range changes, with `loading` / `error` states
- Render-override slots: `renderToolbar`, `renderDayCell`, `renderEmptyState`, `renderLoadingState`, `renderErrorState`
- Full i18n surface via `labels`

## Installation

```bash
npm install hs-uix
```

Import it in your card:

```jsx
import { Calendar } from "hs-uix/calendar";
```

Requires `@hubspot/ui-extensions` >= 0.14.0 and `react` >= 18.0.0 as peer dependencies (already present in any HubSpot UI Extensions project). TypeScript declarations are bundled with `hs-uix` (`calendar.d.ts`).

---

## Views

| View | What it shows | Navigation step |
|---|---|---|
| `month` | A 7-column day grid for the focused month (5–6 week rows). Each day stacks up to `maxEventsPerDay` event chips, then a "+N more" popover. | ± 1 month |
| `week` | An hour-row time grid for the focused week, plus an all-day band. | ± 1 week |
| `day` | The single-day hour schedule (the same grid as week, one wide column) with an all-day band and a "now" current-hour marker. | ± 1 day |
| `agenda` | The focused week's events grouped under day headers (time · title · owner rows). | ± 1 week |
| `resource` | Rows = resources (owners / rooms / teams), columns = the focused week's days. Each cell stacks the same chips as a month cell, with the same "+N more" overflow popover. **Only joins the switcher when `resources` or `resourceField` is provided.** | ± 1 week |

The view switcher is a `Select` (not `Tabs`) because the platform caches `Tabs` bodies and they won't re-render on data changes.

---

## Examples

### Deal close-date calendar

Deals plotted on their close date, colored by stage, with search + a stage filter and click-to-open popovers.

```jsx
const STAGE_COLOR = {
  "Closed won": "success",
  "Contract sent": "info",
  Negotiation: "warning",
  Discovery: "default",
  "Closed lost": "error",
};

<Calendar
  events={deals.map((d) => ({ ...d, color: STAGE_COLOR[d.stage] }))}
  eventFields={{ id: "id", start: "closeDate", title: "name", subtitle: "owner", color: "color" }}
  defaultView="month"
  showSearch
  searchFields={["name", "owner", "stage"]}
  filters={[
    {
      name: "stage",
      type: "multiselect",
      placeholder: "All stages",
      chipLabel: "Stage",
      options: Object.keys(STAGE_COLOR).map((s) => ({ label: s, value: s })),
    },
  ]}
  maxEventsPerDay={3}
  overlayMode="popover"
/>
```

### Week schedule (time grid)

A rep's week in an hour-row grid, Monday start, 8 AM–6 PM, opening a Panel per meeting.

```jsx
<Calendar
  events={meetings}
  eventFields={{ id: "id", start: "start", end: "end", title: "title", subtitle: "owner", color: "color" }}
  defaultView="week"
  views={["week", "day", "agenda"]}
  weekStartsOn={1}
  dayStartHour={8}
  dayEndHour={18}
  overlayMode="panel"
/>
```

### Resource lanes (owners / rooms / teams)

Rows = resources, columns = the focused week. `resourceField` (a key or accessor on **your** record) lanes each event; events whose id matches no declared resource get an appended derived lane (labeled from `resourceLabels` or the raw id), and events with **no** id land in a trailing "Unassigned" lane.

```jsx
<Calendar
  events={meetings}
  eventFields={{ id: "id", start: "start", end: "end", title: "title", color: "color" }}
  defaultView="resource"
  resources={[
    { id: "u1", label: "Ana Souza" },
    { id: "u2", label: "Ben Liu" },
    { id: "room-a", label: "Conference Room A" },
  ]}
  resourceField="ownerId"            // or (meeting) => meeting.owner?.id
  resourceLabels={{ "u3": "Cara Diaz" }} // labels for derived (undeclared) lanes
  showUnassignedLane                 // default true; false omits id-less events
  weekStartsOn={1}
  hideWeekends
/>
```

- Declared `resources` always render, in order, even with zero events — so a free room reads as *free*.
- Ids are matched by `String(id)`, so a numeric `7` and a string `"7"` are the same lane.
- The "Unassigned" lane renders only when it has events; relabel it via `labels.unassigned`.
- The view appears in the switcher **only** when `resources` or `resourceField` is provided.

### Drag-free reschedule

The platform has no drag-and-drop, so rescheduling is explicit: `rescheduleOptions` adds preset buttons and a "Pick date" `DateInput` to the event-detail overlay. The Calendar computes the new range — **both** endpoints shifted, duration preserved — and **emits** it. You persist and pass updated `events` back in; the Calendar never mutates its own events (the same presentational contract as Kanban).

```jsx
// true → "+1 hour" / "+1 day" / "Next week" + the date picker:
<Calendar
  events={tasks}
  eventFields={fields}
  rescheduleOptions
  onEventReschedule={async (raw, { start, end }, event) => {
    await patchTask(raw.id, { start, end }); // you persist…
    refetch();                               // …and feed updated events back in
  }}
/>

// Custom presets — relative shifts, or accessors returning the new start:
<Calendar
  events={tasks}
  eventFields={fields}
  overlayMode="panel" // roomier home for the picker than the experimental popover
  rescheduleOptions={[
    { label: "+30 min", shift: { minutes: 30 } },
    { label: "+2 days", shift: { days: 2 } },
    { label: "Next sprint", shift: (event) => nextSprintStart(event.raw) },
  ]}
  onEventReschedule={persistRange}
/>
```

DST semantics (tested against America/Chicago): day/week shifts are **calendar** shifts — a 9 AM meeting moved across the spring-forward weekend is still 9 AM, and a midnight-to-midnight all-day span stays anchored to midnight; hour/minute shifts are **exact clock durations** ("+1 hour" always moves the instant 60 real minutes). "Pick date…" keeps the event's original time-of-day. When the timezone layer is engaged, the math runs on your **original** instants (`event.sourceStart` / `sourceEnd`), not the converted display dates, so the emitted range stays in your data's time domain.

A custom `renderEventDetail` replaces the whole overlay body, reschedule section included — wire your own buttons there if you override it.

### Server-driven data

Fetch only the visible range. `onRangeChange` fires on mount and on every navigation / view change.

```jsx
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);

<Calendar
  events={events}
  eventFields={fields}
  serverSide
  loading={loading}
  onRangeChange={async ({ start, end, view }) => {
    setLoading(true);
    setEvents(await fetchEvents({ start, end }));
    setLoading(false);
  }}
/>
```

### Controlled view + date

```jsx
const [view, setView] = useState("month");
const [date, setDate] = useState(new Date());

<Calendar
  events={events}
  eventFields={fields}
  view={view}
  onViewChange={setView}
  focusedDate={date}
  onNavigate={(next) => setDate(next)}
/>
```

### Custom overlay body

Override what opens when an event is clicked (works for popover / modal / panel).

```jsx
<Calendar
  events={events}
  eventFields={fields}
  overlayMode="modal"
  renderEventDetail={(event) => (
    <Flex direction="column" gap="sm">
      <Text format={{ fontWeight: "demibold" }}>{event.title}</Text>
      <Link href={`/deal/${event.id}`}>Open deal</Link>
    </Flex>
  )}
  onEventClick={(raw, event) => track("event_opened", { id: event.id })}
/>
```

### Timezones

**Timezones are off by default** — the calendar renders each event exactly as the data provides it (no conversion), so you never have to think about zones unless you want to. To pin a specific zone — or let users switch — opt into the timezone layer. Every time, hour-grid placement, and day-grouping then resolves in the chosen IANA zone, DST-correct.

```jsx
// Built-in selector in the toolbar ("UTC −05:00 Central Time"); the layer starts at UTC:
<Calendar events={events} eventFields={fields} defaultView="week" showTimeZoneSelect />

// Or pin a zone with no selector:
<Calendar events={events} eventFields={fields} timeZone="America/New_York" />

// Controlled, with a custom zone list:
<Calendar
  events={events}
  eventFields={fields}
  showTimeZoneSelect
  timeZone={tz}
  onTimeZoneChange={setTz}
  timeZoneOptions={["UTC", "America/Chicago", "Europe/London", "Asia/Tokyo"]}
/>
```

How it works: each event instant is converted to a "wall-clock" `Date` in the active zone, so the existing local-time grid logic resolves in that zone with no other changes. Leave all the `timeZone*` props unset (and `showTimeZoneSelect` off) and the calendar does no conversion at all — events render as-sent in the viewer's local time.

---

## API Reference

### Calendar Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `events` | `Event[]` | — | Your records. The calendar is presentational; you own fetching. |
| `eventFields` | `CalendarEventFields` | sensible keys | Maps event fields to roles (`start` / `end` / `title` / `subtitle` / `color` / `href` / `id`). Each is a key or an accessor. |
| `view` | `CalendarView` | — | Controlled current view. |
| `defaultView` | `CalendarView` | `"month"` | Uncontrolled initial view. |
| `onViewChange` | `(view) => void` | — | Fires when the view changes. |
| `views` | `CalendarView[]` | all | Which views to expose in the switcher (month / week / day / agenda / resource — resource still requires `resources`/`resourceField`). |
| `focusedDate` | `CalendarDateInput` | — | Controlled focused date. |
| `defaultFocusedDate` | `CalendarDateInput` | today | Uncontrolled initial date. |
| `onNavigate` | `(date, { view }) => void` | — | Fires on prev / next / today. |
| `weekStartsOn` | `0 \| 1` | `0` | 0 = Sunday, 1 = Monday. |
| `hideWeekends` | `boolean` | `false` | Hide Sat/Sun in month + week views. |
| `maxEventsPerDay` | `number` | `3` | Chips per month cell before "+N more". |
| `monthEventStyle` | `"statusTag" \| "tag"` | `"statusTag"` | Month-cell event token: `statusTag` (colored dot + text, matches week/day) or `tag` (bordered pill). Both truncate and hold a fixed height as columns narrow. |
| `monthEventMaxChars` | `number` | per-style, from column width | Max characters for a month-cell label before "…". Labels are truncated up front so every token truncates consistently (the tag's native truncation measures unreliably while the table is still sizing columns). |
| `dayStartHour` | `number` | `8` | First hour row in week/day (0–23). |
| `dayEndHour` | `number` | `20` | Last hour row in week/day (0–23). |
| `resources` | `(id \| { id, label? })[]` | — | Declared resource lanes, in order. Always render, even when empty. Providing this (or `resourceField`) adds the `resource` view to the switcher. |
| `resourceField` | `string \| (event) => id` | — | How to read an event's resource id from your record. `null` / `""` ⇒ unassigned. Ids matched by `String(id)`; undeclared ids get appended derived lanes. |
| `resourceLabels` | `{ [id]: label }` | — | Labels for resources declared without one and for derived lanes. Falls back to `String(id)`. |
| `showUnassignedLane` | `boolean` | `true` | Trailing "Unassigned" lane for id-less events (rendered only when non-empty). `false` omits those events from the resource view. |
| `rescheduleOptions` | `true \| (option \| fn)[]` | — | Adds reschedule presets + a "Pick date" `DateInput` to the event overlay. `true` ⇒ "+1 hour" / "+1 day" / "Next week". Entries: `{ label, shift: { days?, weeks?, hours?, minutes? } }`, `{ label, shift: (event) => newStart }`, or a bare `(event) => newStart`. |
| `onEventReschedule` | `(raw, { start, end }, event) => void` | — | Fires when a reschedule affordance is used. Both endpoints shifted, duration preserved (DST-safe), computed from your original instants. **You persist** — the Calendar never mutates its events. |
| `timeZone` | `string` | — | Controlled IANA zone (e.g. `"America/Chicago"`). Setting it opts into the tz layer; all times/placement/grouping resolve here. |
| `defaultTimeZone` | `string` | — | Uncontrolled initial zone. Opts into the tz layer; the layer itself starts at `"UTC"` if engaged without this. |
| `onTimeZoneChange` | `(tz) => void` | — | Fires when the zone changes. |
| `showTimeZoneSelect` | `boolean` | `false` | Show the built-in zone dropdown. Opts into the tz layer (starts at UTC). Off ⇒ no tz layer, events render as-sent. |
| `timeZoneOptions` | `(string \| { value, label? })[]` | curated list | Override the selector's zones. |
| `filters` | `CalendarFilterConfig[]` | — | `select` / `multiselect` / `dateRange` filters (DataTable shape). |
| `searchFields` | `string[]` | — | Top-level keys searched by the search box. **Required** for `showSearch` to match anything. |
| `searchValue` / `onSearchChange` | `string` / `fn` | — | Controlled search. |
| `filterValues` / `onFilterChange` | `object` / `fn` | — | Controlled filter values. |
| `fuzzySearch` | `boolean` | `false` | Fuzzy match (Fuse.js) instead of substring. |
| `showSearch` | `boolean` | `false` | Show the search box (pair with `searchFields`). |
| `serverSide` | `boolean` | `false` | Treat data as server-provided. |
| `loading` | `boolean` | `false` | Render the loading state. |
| `error` | `string \| boolean` | `false` | Render the error state. |
| `onRangeChange` | `({ start, end, view }) => void` | — | Fires on mount + range change — fetch here. |
| `overlayMode` | `"popover" \| "modal" \| "panel" \| "none"` | `"popover"` | How an event opens. Popover is experimental. |
| `renderEventDetail` | `(event) => ReactNode` | — | Override the overlay body. |
| `onEventClick` | `(raw, event) => void` | — | Always fires on event click. |
| `renderToolbar` | `(api) => ReactNode` | — | Replace the toolbar. |
| `renderDayCell` | `(day, events) => ReactNode` | — | Replace a month day cell's body. |
| `renderLoadingState` / `renderErrorState` | `fn` | — | Replace those states. |
| `renderEmptyState` | `fn` | — | Replace the empty state in the **agenda** view (the month/week/day grids always render). |
| `labels` | `CalendarLabels` | English | i18n strings. |

### `eventFields`

| Role | Type | Notes |
|---|---|---|
| `id` | key \| `(event) => string \| number` | Stable id (used for React keys + overlay ids). |
| `start` | key \| accessor → `CalendarDateInput` | Required for an event to appear. |
| `end` | key \| accessor → `CalendarDateInput` | Optional; enables multi-day + duration. |
| `title` | key \| accessor → `ReactNode` | The event label. |
| `subtitle` | key \| accessor → `ReactNode` | Secondary text (e.g. owner). |
| `color` | key \| accessor → `string` | A Tag variant: `default` / `info` / `success` / `warning` / `error`. |
| `href` | `CalendarHref` \| accessor | `string` or `{ url, external? }`. |

`CalendarDateInput` = `Date` | epoch `number` | ISO/epoch `string` | `{ year, month, date, hour?, minute? }` (0-indexed `month`).

### Normalized event

Render callbacks (`renderEventDetail`, `onEventClick`, `renderDayCell`) receive the normalized event:

```ts
{ key, id, start: Date | null, end: Date | null, sourceStart, sourceEnd, title, subtitle, color, href, raw }
```

`raw` is your original record. `start` / `end` are the dates the calendar *displays* (wall-clock converted when the timezone layer is engaged); `sourceStart` / `sourceEnd` are your **original** instants, which is what the reschedule math runs on.

---

## Limitations

These come from HubSpot UI Extensions itself, not Calendar:

| Limitation | Details |
|---|---|
| No height / vertical scroll | Layout primitives have no `height` / `overflow`. Long lists expand the page; the month grid caps chips per cell (`maxEventsPerDay`) and overflows to a popover. |
| View switching is a `Select` | `Tabs` cache their body and don't re-render on data changes, so the switcher is a `Select`. |
| Time grid can't span rows | No `rowspan` / height control, so a multi-hour block repeats with a "↑ cont. through …" note rather than one tall block. |
| Equal day columns via numeric widths | Equal-width columns require a `Table` with equal **numeric** widths (content-sized `flex` columns come out uneven). |
| Popover is experimental | `overlayMode="popover"` uses `@hubspot/ui-extensions/experimental`. Use `"modal"` / `"panel"` if you need a stable overlay. |

---

## License

MIT
