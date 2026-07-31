import { describe, expect, it, vi } from "vitest";
import { Modal, ModalBody } from "@hubspot/ui-extensions";

vi.mock("@hubspot/ui-extensions/experimental", () => ({ Popover: undefined }));

import { SafePopover } from "./SafePopover.js";

describe("SafePopover without an experimental Popover export", () => {
  it("renders the same children in a native Modal", () => {
    const el = SafePopover({
      id: "details-overlay",
      placement: "bottom",
      variant: "longform",
      fallbackTitle: "Event details",
      fallbackWidth: "medium",
      children: "content",
    });

    expect(el.type).toBe(Modal);
    expect(el.props.id).toBe("details-overlay");
    expect(el.props.title).toBe("Event details");
    expect(el.props.width).toBe("medium");
    expect(el.props.placement).toBeUndefined();
    expect(el.props.variant).toBeUndefined();
    expect(el.props.children.type).toBe(ModalBody);
    expect(el.props.children.props.children).toBe("content");
  });
});
