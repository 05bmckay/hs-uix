// ════════════════════════════════════════════════════════════════════════════
// SafePopover — a popover-first overlay with a native Modal fallback.
//
// The experimental Popover renders its children flush with no internal
// padding, which looks cramped next to the documented overlays (Modal/Panel)
// that ship with their own spacing. SafePopover wraps Popover children in a
// compact <Tile> so callers don't have to remember the workaround.
//
// Popover was removed from @hubspot/ui-extensions/experimental in SDK 0.15.1.
// Importing the experimental module as a namespace keeps this file loadable in
// both SDK generations. When Popover is unavailable, the same overlay content
// is rendered in a stable Modal instead.
// ════════════════════════════════════════════════════════════════════════════

import React from "react";
import { Modal, ModalBody, Tile } from "@hubspot/ui-extensions";
import * as Experimental from "@hubspot/ui-extensions/experimental";

const Popover = Experimental.Popover;

export const SafePopover = (props) => {
  const {
    children,
    fallbackTitle = "Details",
    fallbackWidth = "small",
    placement,
    variant,
    showCloseButton,
    arrowSize,
    ...sharedProps
  } = props || {};

  if (Popover) {
    return React.createElement(
      Popover,
      { ...sharedProps, placement, variant, showCloseButton, arrowSize },
      React.createElement(Tile, { compact: true }, children)
    );
  }

  const {
    id,
    onOpen,
    onClose,
    "aria-label": ariaLabel,
  } = sharedProps;

  return React.createElement(
    Modal,
    {
      id,
      title: fallbackTitle,
      width: fallbackWidth,
      onOpen,
      onClose,
      "aria-label": ariaLabel,
    },
    React.createElement(ModalBody, null, children)
  );
};
SafePopover.displayName = "SafePopover";
