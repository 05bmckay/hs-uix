// ═══════════════════════════════════════════════════════════════════════════
// Feed per-type presets — map activity `type` machine values to display
// defaults (icon, label, icon color, status variant) so callers don't repeat
// `iconName: "calling"` on every call row. Item-level values ALWAYS win; a
// preset only fills holes. DEFAULT_FEED_TYPE_PRESETS covers HubSpot's standard
// engagement/activity types with icon names verified against the native Icon
// whitelist — an invalid native icon name renders NOTHING (see
// common-components/Icon.js), so membership is enforced by
// feedTypePresets.test.js rather than trusted.
// ═══════════════════════════════════════════════════════════════════════════

const hasValue = (value) => value != null && value !== false && value !== "";

/**
 * Display defaults for HubSpot's standard activity types, keyed by the
 * lowercase machine value (the engagements API uses CALL / EMAIL / ... —
 * lookup is case-insensitive and normalizes spaces/dashes to underscores).
 * Every `icon` below is a NATIVE HubSpot icon name; `label` is the
 * human-facing type label Feed shows when the item has no `typeLabel`.
 */
export const DEFAULT_FEED_TYPE_PRESETS = {
  call: { icon: "calling", label: "Call" },
  email: { icon: "email", label: "Email" },
  incoming_email: { icon: "inbox", label: "Incoming email" },
  forwarded_email: { icon: "forward", label: "Forwarded email" },
  meeting: { icon: "appointment", label: "Meeting" },
  note: { icon: "comment", label: "Note" },
  task: { icon: "tasks", label: "Task" },
  sms: { icon: "messages", label: "SMS" },
  whatsapp: { icon: "messages", label: "WhatsApp" },
  linkedin_message: { icon: "linkedin", label: "LinkedIn message" },
  postal_mail: { icon: "send", label: "Postal mail" },
  conversation: { icon: "questionAnswer", label: "Conversation" },
};

/**
 * Resolve the preset for a `type` value. Tries the exact key first, then the
 * lowercase form, then a snake_case normalization ("Postal Mail" →
 * "postal_mail"). Returns null when no preset matches.
 */
export const lookupTypePreset = (type, presets) => {
  if (!presets || typeof presets !== "object") return null;
  if (type == null || type === "") return null;

  if (Object.prototype.hasOwnProperty.call(presets, type)) return presets[type];

  const lower = String(type).toLowerCase();
  if (Object.prototype.hasOwnProperty.call(presets, lower)) return presets[lower];

  const snake = lower.replace(/[\s-]+/g, "_");
  if (Object.prototype.hasOwnProperty.call(presets, snake)) return presets[snake];

  return null;
};

/**
 * Merge a type preset UNDER an item: the preset fills `iconName`,
 * `iconColor`, `typeLabel`, and `statusVariant` only when the item does not
 * already provide them (item-level values, including `icon` nodes and the
 * `outcomeVariant`/`severityVariant` aliases, always win). Returns the SAME
 * item reference when nothing changes, so memoized identity checks hold.
 */
export const applyTypePreset = (item, typePresets) => {
  if (item == null || typeof item !== "object") return item;
  const preset = lookupTypePreset(item.type, typePresets);
  if (!preset || typeof preset !== "object") return item;

  let next = null;
  const fill = (key, value) => {
    if (next === null) next = { ...item };
    next[key] = value;
  };

  if (!hasValue(item.icon) && !hasValue(item.iconName) && hasValue(preset.icon)) {
    fill("iconName", preset.icon);
  }
  if (!hasValue(item.iconColor) && hasValue(preset.color)) {
    fill("iconColor", preset.color);
  }
  if (!hasValue(item.typeLabel) && hasValue(preset.label)) {
    fill("typeLabel", preset.label);
  }
  if (
    item.statusVariant == null &&
    item.outcomeVariant == null &&
    item.severityVariant == null &&
    hasValue(preset.statusVariant)
  ) {
    fill("statusVariant", preset.statusVariant);
  }

  return next ?? item;
};
