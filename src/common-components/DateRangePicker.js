// ═══════════════════════════════════════════════════════════════════════════
// DateRangePicker — HubSpot-style date filter value control.
//
// The UI mirrors HubSpot's CRM filter editor:
// - "is" renders a quick preset Select (Today, This week, Last 30 days...)
// - "is more than" renders NumberInput + rolling unit/direction Select
// - "is between" renders a start DateInput, "to", and an end DateInput
//
// `onChange` receives a structured value that preserves the selected operator.
// For compatibility, a plain `{ from, to }` value is treated as `InRange`.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import {
  DateInput,
  Flex,
  Link,
  NumberInput,
  Select,
  Text,
} from "@hubspot/ui-extensions";
import { HS_DATE_PRESETS } from "./datePresets.js";
import {
  DATE_FILTER_OPERATORS,
  DATE_RANGE_CUSTOM_VALUE,
  DATE_ROLLING_UNIT_OPTIONS,
  isValidDateRange,
  presetToRange,
} from "./dateRangePresets.js";

const h = React.createElement;

const IN_ROLLING = "InRollingDateRange";
const GREATER_ROLLING = "GreaterRolling";
const IN_RANGE = "InRange";

const EMPTY_RANGE = { from: null, to: null };

const keyOfDate = (v) => (v ? `${v.year}-${v.month}-${v.date}` : "");
const keyOfRange = (r) => `${keyOfDate(r?.from)}|${keyOfDate(r?.to)}`;

const isRangeLike = (value) =>
  value &&
  typeof value === "object" &&
  ("from" in value || "to" in value) &&
  !("operator" in value);

const normalizeValue = (value) => {
  if (isRangeLike(value)) {
    return { operator: IN_RANGE, from: value.from ?? null, to: value.to ?? null };
  }
  if (!value || typeof value !== "object") {
    return { operator: IN_ROLLING, preset: "today" };
  }
  const operator = value.operator || IN_ROLLING;
  if (operator === IN_RANGE) {
    return { operator, from: value.from ?? null, to: value.to ?? null };
  }
  if (operator === GREATER_ROLLING) {
    return {
      operator,
      amount: Number.isFinite(Number(value.amount)) ? Number(value.amount) : 1,
      unit: value.unit || "day",
      direction: value.direction || "backward",
    };
  }
  return { operator: IN_ROLLING, preset: value.preset || value.value || "today" };
};

const rangeFromValue = (value) => ({
  from: value?.from ?? null,
  to: value?.to ?? null,
});

const getPresetOptions = (presets, customPresetLabel) => {
  const presetList =
    presets === true ? HS_DATE_PRESETS : Array.isArray(presets) ? presets : null;
  if (!presetList) return null;
  return [
    ...presetList.map((p) => ({ label: p.label, value: p.value })),
    ...(presetList.some((p) => p.value === DATE_RANGE_CUSTOM_VALUE)
      ? []
      : [{ label: customPresetLabel, value: DATE_RANGE_CUSTOM_VALUE }]),
  ];
};

export const DateRangePicker = ({
  value,
  defaultValue,
  onChange,
  label,
  name = "date-range",
  operator,
  defaultOperator = IN_ROLLING,
  onOperatorChange,
  showOperatorSelect = true,
  operatorOptions = DATE_FILTER_OPERATORS,
  presets = true,
  rollingUnitOptions = DATE_ROLLING_UNIT_OPTIONS,
  direction = "row",
  clearable = false,
  min,
  max,
  fromLabel = "Start date",
  toLabel = "End date",
  format = "medium",
  presetPlaceholder = "Enter value",
  customPresetLabel = "Custom",
  clearLabel = "Clear",
  invalidRangeMessage = "Start date must be on or before end date",
  readOnly = false,
  gap,
}) => {
  const isControlled = value !== undefined;
  const controlledValue = normalizeValue(value);
  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(defaultValue ?? { operator: defaultOperator })
  );
  const current = normalizeValue(isControlled ? controlledValue : internalValue);
  const currentOperator = operator || current.operator || defaultOperator;
  const resolvedCurrent = normalizeValue({ ...current, operator: currentOperator });
  const [pending, setPending] = useState(null);
  const [lastPreset, setLastPreset] = useState({
    key: resolvedCurrent.preset || "",
    rangeKey: null,
  });

  const isColumn = direction === "column";
  const presetOptions = getPresetOptions(presets, customPresetLabel);
  const showClear =
    clearable &&
    !readOnly &&
    (resolvedCurrent.preset ||
      resolvedCurrent.amount ||
      resolvedCurrent.from ||
      resolvedCurrent.to ||
      pending);

  const emit = (next, meta = {}) => {
    const normalized = normalizeValue(next);
    if (!isControlled) setInternalValue(normalized);
    if (normalized.operator !== currentOperator) {
      onOperatorChange?.(normalized.operator);
    }
    onChange?.(normalized, {
      operator: normalized.operator,
      preset: normalized.operator === IN_ROLLING ? normalized.preset ?? null : null,
      ...meta,
    });
  };

  const handleOperatorChange = (nextOperator) => {
    setPending(null);
    if (nextOperator === IN_RANGE) {
      emit({ operator: IN_RANGE, ...EMPTY_RANGE }, { previousOperator: currentOperator });
    } else if (nextOperator === GREATER_ROLLING) {
      emit(
        { operator: GREATER_ROLLING, amount: 1, unit: "day", direction: "backward" },
        { previousOperator: currentOperator }
      );
    } else {
      emit({ operator: IN_ROLLING, preset: "today" }, { previousOperator: currentOperator });
    }
  };

  const handlePresetChange = (preset) => {
    if (!preset || preset === DATE_RANGE_CUSTOM_VALUE) {
      emit({ operator: IN_ROLLING, preset: DATE_RANGE_CUSTOM_VALUE });
      return;
    }
    const option =
      presets === true
        ? HS_DATE_PRESETS.find((p) => p.value === preset)
        : Array.isArray(presets)
          ? presets.find((p) => p.value === preset)
          : null;
    const range =
      option && typeof option.getRange === "function"
        ? option.getRange(new Date())
        : presetToRange(preset);
    setLastPreset({ key: preset, rangeKey: range ? keyOfRange(range) : null });
    emit({ operator: IN_ROLLING, preset }, { range });
  };

  const handleRollingUnitChange = (compound) => {
    const [unit, unitDirection] = String(compound || "day:backward").split(":");
    emit({
      operator: GREATER_ROLLING,
      amount: resolvedCurrent.amount || 1,
      unit,
      direction: unitDirection || "backward",
    });
  };

  const handleDateChange = (side, next) => {
    const displayRange = {
      ...rangeFromValue(resolvedCurrent),
      ...(pending ? { [pending.side]: pending.value } : {}),
    };
    const candidate = { ...displayRange, [side]: next ?? null };
    if (isValidDateRange(candidate)) {
      setPending(null);
      setLastPreset({ key: "", rangeKey: null });
      emit({ operator: IN_RANGE, ...candidate });
    } else {
      setPending({ side, value: next ?? null });
    }
  };

  const handleClear = () => {
    setPending(null);
    setLastPreset({ key: "", rangeKey: null });
    if (currentOperator === IN_RANGE) {
      emit({ operator: IN_RANGE, ...EMPTY_RANGE });
    } else if (currentOperator === GREATER_ROLLING) {
      emit({ operator: GREATER_ROLLING, amount: 1, unit: "day", direction: "backward" });
    } else {
      emit({ operator: IN_ROLLING, preset: "" });
    }
  };

  const operatorSelect = showOperatorSelect
    ? h(Select, {
        key: "operator",
        name: `${name}-operator`,
        options: operatorOptions,
        value: currentOperator,
        onChange: handleOperatorChange,
        readOnly,
      })
    : null;

  let valueInput = null;

  if (currentOperator === IN_RANGE) {
    const committed = rangeFromValue(resolvedCurrent);
    const display = {
      ...committed,
      ...(pending ? { [pending.side]: pending.value } : {}),
    };
    const invalidSide = pending ? pending.side : null;
    valueInput = [
      h(DateInput, {
        key: "from",
        name: `${name}-from`,
        label: fromLabel,
        format,
        value: display.from ?? null,
        onChange: (next) => handleDateChange("from", next),
        min,
        max,
        readOnly,
        error: invalidSide === "from",
        validationMessage: invalidSide === "from" ? invalidRangeMessage : undefined,
      }),
      isColumn ? null : h(Text, { key: "to" }, "to"),
      h(DateInput, {
        key: "toDate",
        name: `${name}-to`,
        label: toLabel,
        format,
        value: display.to ?? null,
        onChange: (next) => handleDateChange("to", next),
        min,
        max,
        readOnly,
        error: invalidSide === "to",
        validationMessage: invalidSide === "to" ? invalidRangeMessage : undefined,
      }),
    ];
  } else if (currentOperator === GREATER_ROLLING) {
    const compound = `${resolvedCurrent.unit || "day"}:${resolvedCurrent.direction || "backward"}`;
    valueInput = [
      h(NumberInput, {
        key: "amount",
        name: `${name}-amount`,
        label: "",
        min: 0,
        value: resolvedCurrent.amount ?? 1,
        onChange: (amount) =>
          emit({
            operator: GREATER_ROLLING,
            amount: Number.isFinite(Number(amount)) ? Number(amount) : 0,
            unit: resolvedCurrent.unit || "day",
            direction: resolvedCurrent.direction || "backward",
          }),
        readOnly,
      }),
      h(Select, {
        key: "unit",
        name: `${name}-rolling-unit`,
        options: rollingUnitOptions,
        value: compound,
        onChange: handleRollingUnitChange,
        readOnly,
      }),
    ];
  } else {
    const range = presetToRange(resolvedCurrent.preset);
    const presetValue =
      resolvedCurrent.preset ||
      (lastPreset.rangeKey && range && lastPreset.rangeKey === keyOfRange(range)
        ? lastPreset.key
        : "");
    valueInput = h(Select, {
      key: "preset",
      name: `${name}-preset`,
      placeholder: presetPlaceholder,
      options: presetOptions || [],
      value: presetValue,
      onChange: handlePresetChange,
      readOnly,
    });
  }

  const children = [
    operatorSelect,
    ...(Array.isArray(valueInput) ? valueInput : [valueInput]),
    showClear ? h(Link, { key: "clear", onClick: handleClear }, clearLabel) : null,
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
