import type { ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export type CalendarView = "month" | "week" | "day" | "agenda" | "resource";
export type CalendarOverlayMode = "popover" | "modal" | "panel" | "none";
export type CalendarFilterType = "select" | "multiselect" | "dateRange";

/** Any date shape the calendar can coerce: Date, epoch ms, ISO string, or a
 * HubSpot DateInput value object ({ year, month, date } with 0-indexed month). */
export type CalendarDateInput =
  | Date
  | number
  | string
  | { year: number; month: number; date: number; hour?: number; minute?: number };

export interface CalendarOption<T = string> {
  label: string;
  value: T;
}

export interface CalendarFilterConfig<Event = Record<string, unknown>> {
  name: string;
  type?: CalendarFilterType;
  placeholder?: string;
  /** Prefix used in the active-filter chip. Defaults to `placeholder` or `name`. */
  chipLabel?: string;
  options?: CalendarOption[];
  filterFn?: (event: Event, value: unknown) => boolean;
}

export type CalendarHref =
  | string
  | { url: string; external?: boolean };

/** Maps fields on each event object to the roles the calendar understands. Each
 * entry is either a key on the event object or an accessor function. */
export interface CalendarEventFields<Event = Record<string, unknown>> {
  id?: string | ((event: Event) => string | number);
  start?: string | ((event: Event) => CalendarDateInput | null | undefined);
  end?: string | ((event: Event) => CalendarDateInput | null | undefined);
  title?: string | ((event: Event) => ReactNode);
  subtitle?: string | ((event: Event) => ReactNode);
  /** A Tag/StatusTag variant: "default" | "info" | "success" | "warning" | "error". */
  color?: string | ((event: Event) => string);
  href?: CalendarHref | ((event: Event) => CalendarHref | null | undefined);
}

/** The normalized event passed to render callbacks. */
export interface CalendarNormalizedEvent<Event = Record<string, unknown>> {
  key: string;
  id: string | number | undefined;
  start: Date | null;
  end: Date | null;
  /** The UN-converted start instant from your data (no timezone-layer wall-clock
   * conversion). Reschedule math runs on this, so emitted dates stay in your
   * data's time domain. */
  sourceStart: Date | null;
  /** The UN-converted end instant (mirrors `sourceStart` when the event has no end). */
  sourceEnd: Date | null;
  title: ReactNode;
  subtitle: ReactNode;
  color: string | undefined;
  href: { url: string; external: boolean } | null;
  raw: Event;
}

// ---------------------------------------------------------------------------
// Resource / lane view
// ---------------------------------------------------------------------------

/** A declared resource lane: `{ id, label? }`, or a bare id. Declared lanes
 * always render (in order), even with zero events. */
export type CalendarResource =
  | string
  | number
  | { id: string | number; label?: ReactNode };

/** How to read an event's resource id: a key on the raw event, or an accessor.
 * `null` / `undefined` / `""` mean unassigned. Ids are matched by `String(id)`. */
export type CalendarResourceField<Event = Record<string, unknown>> =
  | string
  | ((event: Event) => string | number | null | undefined);

// ---------------------------------------------------------------------------
// Drag-free reschedule
// ---------------------------------------------------------------------------

/** A relative shift. Days/weeks are CALENDAR shifts (wall-clock time-of-day
 * preserved on both endpoints, DST-safe); hours/minutes are exact clock
 * durations. */
export interface CalendarRescheduleShift {
  days?: number;
  weeks?: number;
  hours?: number;
  minutes?: number;
}

/** One reschedule affordance: a labeled relative shift, a labeled accessor
 * returning the new start (any `CalendarDateInput` shape), or a bare accessor
 * (labeled from `fn.name`, falling back to "Reschedule"). */
export type CalendarRescheduleOption<Event = Record<string, unknown>> =
  | {
      label: string;
      shift:
        | CalendarRescheduleShift
        | ((event: CalendarNormalizedEvent<Event>) => CalendarDateInput | null | undefined);
    }
  | {
      label: string;
      getStart: (event: CalendarNormalizedEvent<Event>) => CalendarDateInput | null | undefined;
    }
  | ((event: CalendarNormalizedEvent<Event>) => CalendarDateInput | null | undefined);

/** The new range emitted by `onEventReschedule` — BOTH endpoints shifted, the
 * event's duration/shape preserved (DST-safe). */
export interface CalendarRescheduleRange {
  start: Date;
  end: Date;
}

export interface CalendarRange {
  start: Date;
  end: Date;
  view: CalendarView;
}

/** A timezone option for the built-in selector: an IANA id, or an id with an
 * explicit label (otherwise a DST-aware "UTC −05:00 Central Time" is computed). */
export type CalendarTimeZoneOption = string | { value: string; label?: string };

export interface CalendarToolbarApi {
  title: string;
  view: CalendarView;
  views: CalendarView[];
  focusedDate: Date;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  /** Active IANA timezone (undefined when the tz layer is disabled). */
  timeZone?: string;
  onTimeZoneChange: (tz: string) => void;
  /** Selector options ({ value, label }), or null when `showTimeZoneSelect` is off. */
  timeZoneOptions: { value: string; label: string }[] | null;
}

export interface CalendarLabels {
  today?: string;
  previous?: string;
  next?: string;
  search?: string;
  clearAll?: string;
  more?: (count: number) => string;
  noEventsTitle?: string;
  noEventsMessage?: string;
  loading?: string;
  errorTitle?: string;
  errorMessage?: string;
  open?: string;
  allDay?: string;
  reschedule?: string;
  pickDate?: string;
  unassigned?: string;
  resource?: string;
}

export interface CalendarProps<Event = Record<string, unknown>> {
  /** Event objects. The calendar is presentational — the caller owns fetching. */
  events: Event[];
  /** Maps event fields to calendar roles (start/end/title/color/href/…). */
  eventFields?: CalendarEventFields<Event>;

  // View control
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** Which views to expose in the switcher. Defaults to all (month, week, day, agenda). */
  views?: CalendarView[];

  // Date control
  focusedDate?: CalendarDateInput;
  defaultFocusedDate?: CalendarDateInput;
  onNavigate?: (date: Date, ctx: { view: CalendarView }) => void;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  hideWeekends?: boolean;
  /** Max chips per day cell in month view before collapsing to "N more". */
  maxEventsPerDay?: number;
  /**
   * Month-cell event token style. `"statusTag"` (default) renders a colored dot +
   * text matching the week/day grid; `"tag"` renders a bordered pill. Both
   * truncate and hold a fixed height as columns narrow.
   */
  monthEventStyle?: "statusTag" | "tag";
  /**
   * Max characters for a month-cell event label before it's truncated with "…".
   * Defaults to a per-style budget derived from the column width. Labels are
   * truncated up front (not just via the tag's native TruncateString) so every
   * token truncates consistently regardless of the table's column-sizing timing.
   */
  monthEventMaxChars?: number;

  // Time grid (week / day views)
  /** First hour row in week/day view (0–23). Default 8. */
  dayStartHour?: number;
  /** Last hour row in week/day view (0–23). Default 20. */
  dayEndHour?: number;

  // Resource / lane view — rows = resources, columns = the focused week's days.
  // The "resource" view only joins the view switcher when `resources` or
  // `resourceField` is provided.
  /** Declared lanes, in display order. Always render, even when empty. */
  resources?: CalendarResource[];
  /** How to read an event's resource id (key on the raw event, or accessor).
   * Ids found in the data but never declared get appended derived lanes. */
  resourceField?: CalendarResourceField<Event>;
  /** `{ [id]: label }` lookup for resources declared without a label and for
   * derived lanes. Falls back to `String(id)`. */
  resourceLabels?: Record<string, ReactNode>;
  /** Append a trailing "Unassigned" lane for events with no resource id
   * (rendered only when non-empty). When false those events are omitted from
   * the resource view. Default `true`. */
  showUnassignedLane?: boolean;

  // Drag-free reschedule — adds preset buttons + a "Pick date" DateInput to the
  // default event-detail overlay. `true` = "+1 hour" / "+1 day" / "Next week".
  // The Calendar EMITS the shifted range and never mutates its own events.
  rescheduleOptions?: true | CalendarRescheduleOption<Event>[];
  /** Fires when a reschedule affordance is used. `range` has BOTH endpoints
   * shifted (duration preserved, DST-safe), computed from the event's original
   * (`sourceStart`/`sourceEnd`) instants. Persist it and pass updated `events`
   * back in — the Calendar will not move the event on its own. */
  onEventReschedule?: (
    raw: Event,
    range: CalendarRescheduleRange,
    event: CalendarNormalizedEvent<Event>
  ) => void;

  // Timezone — OFF by default: with none of these props set, events render exactly
  // as provided (no conversion, browser-local). Opt in via `timeZone`,
  // `defaultTimeZone`, or `showTimeZoneSelect` and all times, grid placement, and
  // day-grouping resolve in the chosen IANA zone (DST-correct).
  /** Controlled IANA timezone, e.g. "America/Chicago". Pair with `onTimeZoneChange`.
   * Engaging the tz layer at all is opt-in; unset = events render as-sent. */
  timeZone?: string;
  /** Initial (uncontrolled) IANA timezone. Only applies once the tz layer is
   * engaged; the layer itself defaults to `"UTC"` when opted in without this. */
  defaultTimeZone?: string;
  /** Fires when the timezone changes (via the built-in selector or prop). */
  onTimeZoneChange?: (timeZone: string) => void;
  /** Show the built-in timezone dropdown in the toolbar. Default `false`. Enabling
   * it opts into the timezone layer (which starts at UTC). */
  showTimeZoneSelect?: boolean;
  /** Override the selector's zone list. IANA ids, or `{ value, label }` to supply
   * a custom label (otherwise a DST-aware label is computed). */
  timeZoneOptions?: CalendarTimeZoneOption[];

  // Filter / search (reuses the DataTable/Kanban query pipeline)
  filters?: CalendarFilterConfig<Event>[];
  /** Top-level keys on each raw event to search. REQUIRED for `showSearch` to do
   * anything — with no `searchFields` the search box matches nothing. */
  searchFields?: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterValues?: Record<string, unknown>;
  onFilterChange?: (values: Record<string, unknown>) => void;
  fuzzySearch?: boolean;
  /** Show the search box. Pair with `searchFields` (search is a no-op without it). */
  showSearch?: boolean;
  /** Flex weight for the toolbar's left search/filter column. Default 3 (60% with default right flex 2). */
  toolbarLeftFlex?: number;
  /** Flex weight for the toolbar's right nav/view controls. Default 2 (40% with default left flex 3). */
  toolbarRightFlex?: number;

  // Server-side
  serverSide?: boolean;
  loading?: boolean;
  error?: string | boolean;
  /** Fires on mount and whenever the visible range changes — fetch here. */
  onRangeChange?: (range: CalendarRange) => void;

  // Event interactivity
  /** How an event opens. Default "popover" (experimental). */
  overlayMode?: CalendarOverlayMode;
  /** Override the overlay body for an event. */
  renderEventDetail?: (event: CalendarNormalizedEvent<Event>) => ReactNode;
  /** Always fires on event click, regardless of overlay mode. */
  onEventClick?: (raw: Event, event: CalendarNormalizedEvent<Event>) => void;

  // Render overrides
  renderToolbar?: (api: CalendarToolbarApi) => ReactNode;
  renderDayCell?: (day: Date, events: CalendarNormalizedEvent<Event>[]) => ReactNode;
  /** Replace the empty state in the agenda view when the visible range has no
   * events. The month / week / day grids always render their grid, so this does
   * not apply there. */
  renderEmptyState?: (ctx: Record<string, never>) => ReactNode;
  renderLoadingState?: (ctx: Record<string, never>) => ReactNode;
  renderErrorState?: (ctx: { error: string | boolean }) => ReactNode;

  labels?: CalendarLabels;
}

export declare function Calendar<Event = Record<string, unknown>>(
  props: CalendarProps<Event>
): ReactElement | null;
