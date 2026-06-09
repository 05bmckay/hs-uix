// ═══════════════════════════════════════════════════════════════════════════
// DateRangePicker — a standalone from/to date-range control.
//
// HubSpot ships a single-date DateInput only. The from/to pair (plus the
// quick-preset dropdown) already existed in this repo, but buried inside
// CollectionFilterControl's `dateRange` branch where it couldn't be reused
// outside a collection toolbar. This promotes it to a first-class control
// whose value is the SAME `{ from, to }` shape (HubSpot DateInput value
// objects, month 0-indexed) consumed by the `dateRange` filters in
// DataTable / Kanban / Feed / Calendar — so a DateRangePicker's onChange
// payload plugs straight into those filter pipelines (src/utils/query.js).
//
// Validation contract: `onChange` ONLY ever fires with valid ranges
// (from <= to, or either side null). When an edit would make from > to, the
// invalid half is held in local state — shown in the input with an error
// message — and onChange is NOT called until the user fixes either side.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { DateInput, Flex, Link, Select, Text } from "@hubspot/ui-extensions";
import { Icon } from "./Icon.js";
import { HS_DATE_PRESETS } from "./datePresets.js";
import {
  DATE_RANGE_CUSTOM_VALUE,
  isValidDateRange,
  presetToRange,
} from "./dateRangePresets.js";

const h = React.createElement;

const EMPTY_RANGE = { from: null, to: null };

const keyOfDate = (v) => (v ? `${v.year}-${v.month}-${v.date}` : "");
const keyOfRange = (r) => `${keyOfDate(r?.from)}|${keyOfDate(r?.to)}`;

/**
 * Standalone date-range control: [presets Select] [from DateInput] → [to
 * DateInput] [clear Link]. Controlled (value + onChange) or uncontrolled
 * (defaultValue).
 *
 * Props:
 * - value: { from, to } of HubSpot date objects ({ year, month, date },
 *   month 0-indexed) — controlled value. Either side may be null (open range).
 * - defaultValue: initial range for uncontrolled usage.
 * - onChange: (range, meta) => void. Fires ONLY with valid ranges
 *   (from <= to or a side null). meta = { preset } where preset is the preset
 *   key when the change came from the preset Select, otherwise null.
 * - label: optional group label rendered above the control.
 * - name: base for the underlying input names (`${name}-from`, `${name}-to`,
 *   `${name}-preset`). Default "date-range".
 * - presets: true (default) renders a Select of HS_DATE_PRESETS; false hides
 *   it; or pass a custom array of { label, value, getRange? } — `value` is a
 *   preset key understood by presetToRange, or supply getRange(now) =>
 *   { from, to } for fully custom presets. Picking dates manually flips the
 *   Select to "Custom".
 * - direction: "row" (default) | "column" layout. Row mode uses placeholders
 *   on the date inputs; column mode uses labels.
 * - clearable: show a Clear link when the range (or a held invalid half) is
 *   non-empty. Clearing commits { from: null, to: null }.
 * - min / max: passed through to both DateInputs.
 * - fromLabel / toLabel: text for the date inputs (default "From" / "To").
 * - format: DateInput display format (default "medium").
 * - presetPlaceholder: placeholder for the preset Select (default
 *   "Date range").
 * - customPresetLabel: label for the appended "Custom" option (default
 *   "Custom").
 * - clearLabel: text for the clear Link (default "Clear").
 * - invalidRangeMessage: validation message shown on the held invalid input.
 * - readOnly: pass-through to all inner controls.
 * - gap: Flex gap between controls (default "xs" in row mode, "sm" in
 *   column mode).
 */
export const DateRangePicker = ({
  value,
  defaultValue,
  onChange,
  label,
  name = "date-range",
  presets = true,
  direction = "row",
  clearable = false,
  min,
  max,
  fromLabel = "From",
  toLabel = "To",
  format = "medium",
  presetPlaceholder = "Date range",
  customPresetLabel = "Custom",
  clearLabel = "Clear",
  invalidRangeMessage = "Start date must be on or before end date",
  readOnly = false,
  gap,
}) => {
  const isControlled = value !== undefined;
  const [internalRange, setInternalRange] = useState(
    () => defaultValue ?? EMPTY_RANGE
  );
  // The invalid half of an in-progress edit: { side: "from"|"to", value }.
  // Held locally (never surfaced through onChange) until the range is valid.
  const [pending, setPending] = useState(null);
  // The last preset the user picked and the range it produced. The DISPLAYED
  // preset is derived from this + the committed range, so external (controlled)
  // value changes automatically flip the Select to "Custom" / placeholder.
  const [lastPreset, setLastPreset] = useState({ key: "", rangeKey: null });

  const committed = (isControlled ? value : internalRange) || EMPTY_RANGE;
  const display = {
    from: committed.from ?? null,
    to: committed.to ?? null,
    ...(pending ? { [pending.side]: pending.value } : {}),
  };
  const hasAnyValue = Boolean(display.from || display.to);

  const presetList =
    presets === true ? HS_DATE_PRESETS : Array.isArray(presets) ? presets : null;
  const presetOptions = presetList
    ? [
        ...presetList.map((p) => ({ label: p.label, value: p.value })),
        ...(presetList.some((p) => p.value === DATE_RANGE_CUSTOM_VALUE)
          ? []
          : [{ label: customPresetLabel, value: DATE_RANGE_CUSTOM_VALUE }]),
      ]
    : null;

  // Derived preset display: empty when no dates, the picked preset while the
  // committed range still matches what it produced, otherwise "custom".
  let presetValue = "";
  if (pending) {
    presetValue = DATE_RANGE_CUSTOM_VALUE;
  } else if (committed.from || committed.to) {
    presetValue =
      lastPreset.key && lastPreset.rangeKey === keyOfRange(committed)
        ? lastPreset.key
        : DATE_RANGE_CUSTOM_VALUE;
  }

  const commit = (next, presetKey) => {
    if (!isControlled) setInternalRange(next);
    setLastPreset(
      presetKey
        ? { key: presetKey, rangeKey: keyOfRange(next) }
        : { key: "", rangeKey: null }
    );
    onChange?.(next, { preset: presetKey ?? null });
  };

  const handlePresetChange = (key) => {
    if (!key) return;
    if (key === DATE_RANGE_CUSTOM_VALUE) {
      // "Custom" is a display state, not a range — keep the current dates.
      setLastPreset({ key: "", rangeKey: null });
      return;
    }
    const option = presetList?.find((p) => p.value === key);
    const range =
      option && typeof option.getRange === "function"
        ? option.getRange(new Date())
        : presetToRange(key);
    if (!range) return; // unknown key with no getRange — ignore
    setPending(null);
    commit({ from: range.from ?? null, to: range.to ?? null }, key);
  };

  const handleDateChange = (side, next) => {
    const candidate = { ...display, [side]: next ?? null };
    if (isValidDateRange(candidate)) {
      setPending(null);
      commit(candidate, null);
    } else {
      // from > to: hold the edited half locally, don't fire onChange.
      setPending({ side, value: next ?? null });
    }
  };

  const handleClear = () => {
    setPending(null);
    commit({ ...EMPTY_RANGE }, null);
  };

  const isColumn = direction === "column";
  const invalidSide = pending ? pending.side : null;

  const dateInput = (side, text) =>
    h(DateInput, {
      key: side,
      name: `${name}-${side}`,
      format,
      value: display[side] ?? null,
      onChange: (next) => handleDateChange(side, next),
      min,
      max,
      readOnly,
      error: invalidSide === side,
      validationMessage: invalidSide === side ? invalidRangeMessage : undefined,
      ...(isColumn ? { label: text } : { placeholder: text }),
    });

  const children = [
    presetOptions
      ? h(Select, {
          key: "preset",
          name: `${name}-preset`,
          placeholder: presetPlaceholder,
          options: presetOptions,
          value: presetValue,
          onChange: handlePresetChange,
          readOnly,
        })
      : null,
    dateInput("from", fromLabel),
    isColumn ? null : h(Icon, { key: "arrow", name: "right", size: "sm" }),
    dateInput("to", toLabel),
    clearable && hasAnyValue && !readOnly
      ? h(Link, { key: "clear", onClick: handleClear }, clearLabel)
      : null,
  ];

  const control = h(
    Flex,
    {
      direction: isColumn ? "column" : "row",
      align: isColumn ? "stretch" : "center",
      gap: gap ?? (isColumn ? "sm" : "xs"),
      wrap: isColumn ? undefined : "wrap",
    },
    ...children
  );

  if (!label) return control;
  return h(
    Flex,
    { direction: "column", gap: "xs" },
    h(Text, { format: { fontWeight: "demibold" } }, label),
    control
  );
};
