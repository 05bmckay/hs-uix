import React from "react";
import { StatusTag } from "@hubspot/ui-extensions";
import { getAutoStatusTagVariant, getAutoTagDisplayValue } from "../utils/tagVariants.js";

export const AutoStatusTag = ({
  value,
  status,
  children,
  variant,
  overrides,
  fallback,
  ...props
}) => {
  const resolvedValue = value ?? status ?? children;
  const displayValue = children ?? getAutoTagDisplayValue(resolvedValue);
  const resolvedVariant =
    variant ||
    getAutoStatusTagVariant(resolvedValue, {
      overrides,
      fallback,
    });

  return React.createElement(
    StatusTag,
    { variant: resolvedVariant, ...props },
    displayValue
  );
};
