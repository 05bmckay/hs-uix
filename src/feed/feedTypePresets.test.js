import { describe, it, expect } from "vitest";
import { NATIVE_ICON_NAME_LIST } from "../common-components/Icon.js";
import {
  DEFAULT_FEED_TYPE_PRESETS,
  applyTypePreset,
  lookupTypePreset,
} from "./feedTypePresets.js";

const STATUS_TAG_VARIANTS = new Set(["default", "info", "success", "warning", "danger"]);

describe("DEFAULT_FEED_TYPE_PRESETS", () => {
  it("covers HubSpot's standard activity types", () => {
    const keys = Object.keys(DEFAULT_FEED_TYPE_PRESETS);
    ["call", "email", "meeting", "note", "task", "sms", "whatsapp", "postal_mail"].forEach((type) => {
      expect(keys).toContain(type);
    });
  });

  it("only uses icon names from the NATIVE icon whitelist (invalid names render nothing)", () => {
    const nativeNames = new Set(NATIVE_ICON_NAME_LIST);
    Object.entries(DEFAULT_FEED_TYPE_PRESETS).forEach(([type, preset]) => {
      expect(typeof preset.icon, `${type} preset must declare an icon`).toBe("string");
      expect(nativeNames.has(preset.icon), `"${preset.icon}" (${type}) must be a native icon name`).toBe(true);
    });
  });

  it("declares a human label for every type and only valid StatusTag variants", () => {
    Object.entries(DEFAULT_FEED_TYPE_PRESETS).forEach(([type, preset]) => {
      expect(typeof preset.label, `${type} preset must declare a label`).toBe("string");
      expect(preset.label.length).toBeGreaterThan(0);
      if (preset.statusVariant != null) {
        expect(STATUS_TAG_VARIANTS.has(preset.statusVariant), `${type} statusVariant`).toBe(true);
      }
    });
  });
});

describe("lookupTypePreset", () => {
  it("matches exact, lowercase, and snake_case-normalized type values", () => {
    expect(lookupTypePreset("call", DEFAULT_FEED_TYPE_PRESETS)).toBe(DEFAULT_FEED_TYPE_PRESETS.call);
    expect(lookupTypePreset("CALL", DEFAULT_FEED_TYPE_PRESETS)).toBe(DEFAULT_FEED_TYPE_PRESETS.call);
    expect(lookupTypePreset("Postal Mail", DEFAULT_FEED_TYPE_PRESETS)).toBe(
      DEFAULT_FEED_TYPE_PRESETS.postal_mail
    );
    expect(lookupTypePreset("linkedin-message", DEFAULT_FEED_TYPE_PRESETS)).toBe(
      DEFAULT_FEED_TYPE_PRESETS.linkedin_message
    );
  });

  it("returns null for unknown types, empty types, and missing presets", () => {
    expect(lookupTypePreset("teleport", DEFAULT_FEED_TYPE_PRESETS)).toBeNull();
    expect(lookupTypePreset("", DEFAULT_FEED_TYPE_PRESETS)).toBeNull();
    expect(lookupTypePreset(null, DEFAULT_FEED_TYPE_PRESETS)).toBeNull();
    expect(lookupTypePreset("call", null)).toBeNull();
  });
});

describe("applyTypePreset", () => {
  const presets = {
    call: { icon: "calling", color: "success", label: "Call", statusVariant: "info" },
  };

  it("fills iconName, iconColor, typeLabel, and statusVariant when missing", () => {
    const merged = applyTypePreset({ id: 1, type: "call" }, presets);
    expect(merged).toMatchObject({
      iconName: "calling",
      iconColor: "success",
      typeLabel: "Call",
      statusVariant: "info",
    });
  });

  it("lets item-level values win over the preset", () => {
    const merged = applyTypePreset(
      {
        id: 1,
        type: "call",
        iconName: "video",
        iconColor: "warning",
        typeLabel: "Video call",
        statusVariant: "success",
      },
      presets
    );
    expect(merged.iconName).toBe("video");
    expect(merged.iconColor).toBe("warning");
    expect(merged.typeLabel).toBe("Video call");
    expect(merged.statusVariant).toBe("success");
  });

  it("treats an item-level icon node as winning over the preset icon", () => {
    const node = { $$typeof: Symbol.for("react.element") };
    const merged = applyTypePreset({ type: "call", icon: node }, presets);
    expect(merged.iconName).toBeUndefined();
    expect(merged.icon).toBe(node);
  });

  it("does not set statusVariant when an outcome/severity variant alias exists", () => {
    const merged = applyTypePreset({ type: "call", outcomeVariant: "danger" }, presets);
    expect(merged.statusVariant).toBeUndefined();
  });

  it("returns the SAME reference when no preset matches or nothing changes", () => {
    const noMatch = { type: "unknown" };
    expect(applyTypePreset(noMatch, presets)).toBe(noMatch);

    const complete = {
      type: "call",
      iconName: "video",
      iconColor: "warning",
      typeLabel: "Video call",
      statusVariant: "success",
    };
    expect(applyTypePreset(complete, presets)).toBe(complete);
  });

  it("is safe with non-object items and missing presets", () => {
    expect(applyTypePreset(null, presets)).toBeNull();
    const item = { type: "call" };
    expect(applyTypePreset(item, null)).toBe(item);
  });

  it("works with DEFAULT_FEED_TYPE_PRESETS for uppercase API type values", () => {
    const merged = applyTypePreset({ type: "EMAIL" }, DEFAULT_FEED_TYPE_PRESETS);
    expect(merged.iconName).toBe("email");
    expect(merged.typeLabel).toBe("Email");
  });
});
