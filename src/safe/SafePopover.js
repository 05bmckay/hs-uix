// ═══════════════════════════════════════════════════════════════════════════
// SafePopover — the experimental <Popover> with sane default padding.
//
// The experimental Popover renders its children flush with no internal
// padding, which looks cramped next to the documented overlays (Modal/Panel)
// that ship with their own spacing. SafePopover wraps children in a compact
// <Tile> so callers don't have to remember the workaround. If the caller
// already nests content in a Tile, it still works — the inner Tile becomes a
// content block inside the padded shell.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { Tile } from "@hubspot/ui-extensions";
import { Popover } from "@hubspot/ui-extensions/experimental";

export const SafePopover = (props) => {
  const { children, ...rest } = props || {};
  return React.createElement(
    Popover,
    rest,
    React.createElement(Tile, { compact: true }, children)
  );
};
SafePopover.displayName = "SafePopover";
