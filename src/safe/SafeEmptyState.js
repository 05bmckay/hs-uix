// ═══════════════════════════════════════════════════════════════════════════
// SafeEmptyState — drop-in for the native <EmptyState> that repairs bad
// `imageName` props.
//
// Unlike Icon's silent drop, an invalid imageName THROWS ("<name> is not a
// valid option for imageName") and aborts the whole render. SafeEmptyState
// swaps a bad value for a known alias when one exists, otherwise the
// "components" illustration, and warns once either way. A null/undefined
// imageName passes through untouched — the component has its own default.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { EmptyState } from "@hubspot/ui-extensions";
import { EMPTY_STATE_IMAGES, EMPTY_STATE_IMAGE_ALIASES } from "./catalogs.js";
import { warnOnce } from "./warnings.js";

export const SafeEmptyState = (props) => {
  const { imageName, ...rest } = props || {};
  if (imageName == null || EMPTY_STATE_IMAGES.has(imageName)) {
    return React.createElement(EmptyState, { imageName, ...rest });
  }
  const alias = EMPTY_STATE_IMAGE_ALIASES[imageName];
  const fallback = alias && EMPTY_STATE_IMAGES.has(alias) ? alias : "components";
  warnOnce(
    `emptystate-image-${imageName}`,
    `[hs-uix/safe] EmptyState imageName "${imageName}" is not valid — using "${fallback}". See EMPTY_STATE_IMAGES for the valid list.`
  );
  return React.createElement(EmptyState, { imageName: fallback, ...rest });
};
SafeEmptyState.displayName = "SafeEmptyState";
