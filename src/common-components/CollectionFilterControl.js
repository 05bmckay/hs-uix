import React from "react";
import {
  DateInput,
  Flex,
  MultiSelect,
  Select,
} from "@hubspot/ui-extensions";
import { Icon } from "./Icon.js";

const h = React.createElement;

const DEFAULT_LABELS = {
  all: "All",
  dateFrom: "From",
  dateTo: "To",
};

/**
 * Shared filter renderer for collection-like components.
 * Supports the common hs-uix filter vocabulary: select, multiselect, dateRange.
 */
export const CollectionFilterControl = ({
  filter,
  value,
  onChange,
  namePrefix = "collection-filter",
  labels: labelOverrides,
  selectVariant = "transparent",
  includeAll,
  allValue,
}) => {
  if (!filter) return null;

  const labels = { ...DEFAULT_LABELS, ...(labelOverrides || {}) };
  const type = filter.type || "select";
  const name = filter.name;
  const controlName = `${namePrefix}-${name}`;

  const handleChange = (next) => onChange?.(name, next);

  if (type === "multiselect") {
    return h(MultiSelect, {
      key: name,
      name: controlName,
      placeholder: filter.placeholder || filter.label || labels.all,
      value: Array.isArray(value) ? value : [],
      options: filter.options || [],
      onChange: handleChange,
    });
  }

  if (type === "dateRange") {
    const rangeValue = value || { from: null, to: null };
    return h(
      Flex,
      { key: name, direction: "row", align: "center", gap: "xs" },
      h(DateInput, {
        name: `${controlName}-from`,
        label: filter.fromLabel ?? labels.dateFrom,
        placeholder: filter.fromLabel ?? labels.dateFrom,
        format: "medium",
        value: rangeValue.from ?? null,
        onChange: (next) => handleChange({ ...rangeValue, from: next }),
      }),
      h(Icon, { name: "right", size: "sm" }),
      h(DateInput, {
        name: `${controlName}-to`,
        label: filter.toLabel ?? labels.dateTo,
        placeholder: filter.toLabel ?? labels.dateTo,
        format: "medium",
        value: rangeValue.to ?? null,
        onChange: (next) => handleChange({ ...rangeValue, to: next }),
      })
    );
  }

  const resolvedIncludeAll = includeAll ?? filter.includeAll ?? true;
  const resolvedAllValue = filter.emptyValue ?? allValue ?? filter.allValue ?? "";
  const allLabel = filter.allLabel ?? filter.placeholder ?? filter.label ?? labels.all;
  const options = resolvedIncludeAll
    ? [{ label: allLabel, value: resolvedAllValue }, ...(filter.options || [])]
    : (filter.options || []);

  return h(Select, {
    key: name,
    name: controlName,
    variant: selectVariant,
    placeholder: filter.placeholder || filter.label || labels.all,
    value: value ?? resolvedAllValue,
    options,
    onChange: handleChange,
  });
};
