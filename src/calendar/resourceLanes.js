// ═══════════════════════════════════════════════════════════════════════════
// Resource-lane partitioning — pure, dependency-light, unit-testable.
//
// The Calendar's "resource" view plots rows of resources (owners / rooms /
// teams) against the days of the focused week. This module owns the data side:
// resolving each event's resource id (a key on the record or an accessor fn)
// and partitioning events into ORDERED lanes — declared resources first (in the
// order given), then derived lanes for ids that appear in the data but were
// never declared (shown honestly rather than mislabeled "Unassigned"), then a
// trailing Unassigned lane for events with NO resource id at all.
//
// Ids are matched by String(id) so the CRM's habit of returning the same owner
// id as a number in one API and a string in another never splits a lane.
// ═══════════════════════════════════════════════════════════════════════════

import { startOfDay, endOfDay } from "./dateUtils.js";

/**
 * Resolve a resource id from a record via a field spec (a key string or an
 * accessor function). `null` / `undefined` / `""` normalize to null
 * (= unassigned); `0` is a valid id and passes through.
 */
export const resolveResourceId = (record, spec) => {
  if (record == null || spec == null) return null;
  const value = typeof spec === "function" ? spec(record) : record[spec];
  if (value == null || value === "") return null;
  return value;
};

/**
 * Partition `events` into ordered resource lanes.
 *
 * Options:
 * - `resources`: declared lanes, in display order. Each is `{ id, label? }` or
 *   a bare id. Declared lanes always render, even with zero events.
 * - `resourceLabels`: `{ [id]: label }` lookup used when a resource declares no
 *   label (and for derived lanes). Falls back to `String(id)`.
 * - `getId`: `(event) => id | null` — how to read an event's resource id. The
 *   Calendar passes a resolver over the RAW record via `resolveResourceId`.
 * - `showUnassignedLane` (default true): append a trailing lane for events with
 *   no resource id. When false those events are omitted from the view.
 * - `unassignedLabel` (default "Unassigned").
 *
 * Returns `[{ id, key, label, events, unassigned, declared }]`. Ids found in
 * the data but not declared get a derived lane appended after the declared
 * ones, in first-seen order. The unassigned lane (id null, key "__unassigned__")
 * is appended last and only when it actually has events.
 */
export const buildResourceLanes = (events, options = {}) => {
  const {
    resources,
    resourceLabels,
    getId,
    showUnassignedLane = true,
    unassignedLabel = "Unassigned",
  } = options;

  const labelFor = (id) => {
    if (resourceLabels && resourceLabels[id] != null) return resourceLabels[id];
    return String(id);
  };

  const lanes = [];
  const byKey = new Map();
  const addLane = (id, label, declared) => {
    const key = String(id);
    if (byKey.has(key)) return byKey.get(key);
    const lane = { id, key, label, events: [], unassigned: false, declared };
    byKey.set(key, lane);
    lanes.push(lane);
    return lane;
  };

  (resources || []).forEach((resource) => {
    if (resource == null) return;
    if (typeof resource === "object") {
      addLane(resource.id, resource.label != null ? resource.label : labelFor(resource.id), true);
    } else {
      addLane(resource, labelFor(resource), true);
    }
  });

  const unassigned = {
    id: null,
    key: "__unassigned__",
    label: unassignedLabel,
    events: [],
    unassigned: true,
    declared: false,
  };

  (events || []).forEach((event) => {
    const id = getId ? getId(event) : null;
    if (id == null || id === "") {
      unassigned.events.push(event);
      return;
    }
    const lane = byKey.get(String(id)) || addLane(id, labelFor(id), false);
    lane.events.push(event);
  });

  if (showUnassignedLane && unassigned.events.length > 0) lanes.push(unassigned);
  return lanes;
};

/**
 * Events (normalized: `{ start: Date|null, end: Date|null }`) whose interval
 * intersects `[rangeStart, rangeEnd]`. Events with no start never match.
 */
export const eventsIntersectingRange = (events, rangeStart, rangeEnd) => {
  const rs = rangeStart.getTime();
  const re = rangeEnd.getTime();
  return (events || []).filter((event) => {
    if (!event || !event.start) return false;
    const es = event.start.getTime();
    const ee = (event.end || event.start).getTime();
    return es <= re && ee >= rs;
  });
};

/**
 * A lane's events for one day cell: interval-intersects the day (so multi-day
 * events appear in every day they span), sorted by start time.
 */
export const laneEventsForDay = (events, day) =>
  eventsIntersectingRange(events, startOfDay(day), endOfDay(day)).sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
