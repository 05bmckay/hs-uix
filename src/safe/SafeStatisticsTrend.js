// ═══════════════════════════════════════════════════════════════════════════
// SafeStatisticsTrend — drop-in for the native <StatisticsTrend> that
// aliases bad `direction` props.
//
// `direction` accepts "increase" | "decrease" only, but "increasing" /
// "decreasing" (and the occasional "up"/"down") are stubbornly common.
// Alias with a one-time warn so renders don't surface "not a valid option";
// a non-string direction (including undefined) passes through untouched.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { StatisticsTrend } from "@hubspot/ui-extensions";
import { TREND_DIRECTIONS, TREND_DIRECTION_ALIASES } from "./catalogs.js";
import { warnOnce } from "./warnings.js";

export const SafeStatisticsTrend = (props) => {
  const { direction, ...rest } = props || {};
  if (typeof direction !== "string" || TREND_DIRECTIONS.has(direction)) {
    return React.createElement(StatisticsTrend, { direction, ...rest });
  }
  const alias = TREND_DIRECTION_ALIASES[direction];
  if (alias && TREND_DIRECTIONS.has(alias)) {
    warnOnce(
      `trend-alias-${direction}`,
      `[hs-uix/safe] StatisticsTrend direction "${direction}" → "${alias}". Valid values: increase, decrease.`
    );
    return React.createElement(StatisticsTrend, { direction: alias, ...rest });
  }
  warnOnce(
    `trend-invalid-${direction}`,
    `[hs-uix/safe] StatisticsTrend direction "${direction}" is not valid — defaulting to "increase".`
  );
  return React.createElement(StatisticsTrend, { ...rest, direction: "increase" });
};
SafeStatisticsTrend.displayName = "SafeStatisticsTrend";
