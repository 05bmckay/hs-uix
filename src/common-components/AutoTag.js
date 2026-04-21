import React from "react";
import { Tag } from "@hubspot/ui-extensions";
import { getAutoTagDisplayValue, getAutoTagVariant } from "../utils/tagVariants.js";

export const AutoTag = ({
  value,
  tag,
  children,
  variant,
  overrides,
  fallback,
  ...props
}) => {
  const resolvedValue = value ?? tag ?? children;
  const displayValue = children ?? getAutoTagDisplayValue(resolvedValue);
  const resolvedVariant =
    variant ||
    getAutoTagVariant(resolvedValue, {
      overrides,
      fallback,
    });

  return React.createElement(
    Tag,
    { variant: resolvedVariant, ...props },
    displayValue
  );
};
