// ═══════════════════════════════════════════════════════════════════════════
// HubSpot property → FormBuilder field mapping.
//
// The HubSpot properties API (`/crm/v3/properties/{objectType}`) returns rich
// property definitions ({ name, label, type, fieldType, options, ... }) that
// already describe exactly what kind of input each property needs. This pure
// module turns those definitions into FormBuilder field configs so an edit
// form for CRM records is one fetch + one function call instead of a
// hand-maintained, drift-prone field list. No React, no fetching — callers
// pass the property array they already loaded (hubspot.fetch, serverless,
// or a cached copy).
// ═══════════════════════════════════════════════════════════════════════════

// Boolean property values are wildly inconsistent across HubSpot APIs —
// normalize every spelling that means "yes" (see standards/gotchas.md).
const coerceBool = (value) =>
  value === true ||
  value === "true" ||
  value === "Yes" ||
  value === "yes" ||
  value === "1";

const coerceNumber = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

// Map a HubSpot option ({ label, value, hidden, description, ... }) to a
// FormBuilder option ({ label, value, description? }), dropping hidden ones.
const mapPropertyOptions = (options) => {
  if (!Array.isArray(options)) return undefined;
  const mapped = options
    .filter((opt) => opt && opt.hidden !== true)
    .map((opt) => {
      const result = { label: opt.label != null ? opt.label : String(opt.value), value: opt.value };
      if (opt.description != null && opt.description !== "") result.description = opt.description;
      return result;
    });
  return mapped;
};

// Resolve the FormBuilder field type for one property definition.
// `fieldType` describes the input HubSpot itself renders; `type` is the
// storage type. fieldType wins, with two exceptions: date vs datetime can
// only be told apart by `type`, and unknown fieldTypes fall back to `type`.
const resolveFieldType = (property) => {
  const { type, fieldType } = property;

  // date/datetime share fieldType "date" — storage type disambiguates.
  if (type === "datetime") return "datetime";
  if (type === "date" || fieldType === "date") return "date";

  switch (fieldType) {
    case "select":
      return "select";
    // FormBuilder's radio rendering is the "radioGroup" type (native
    // ToggleGroup with toggleType="radioButtonList").
    case "radio":
      return "radioGroup";
    // HubSpot "checkbox" = multiple checkboxes over an enumeration → multiselect.
    case "checkbox":
      return "multiselect";
    case "booleancheckbox":
      return "toggle";
    case "number":
      return "number";
    case "textarea":
      return "textarea";
    case "text":
    case "phonenumber":
      return "text";
    default:
      break;
  }

  // Unknown/missing fieldType — fall back to the storage type.
  switch (type) {
    case "enumeration":
      return "select";
    case "number":
      return "number";
    case "bool":
      return "toggle";
    default:
      return "text";
  }
};

const isPropertyReadOnly = (property) =>
  property.calculated === true ||
  (property.modificationMetadata && property.modificationMetadata.readOnlyValue === true);

const resolveRequiredOverride = (requiredOverrides, name) => {
  if (!requiredOverrides) return undefined;
  if (Array.isArray(requiredOverrides)) {
    return requiredOverrides.includes(name) ? true : undefined;
  }
  if (Object.prototype.hasOwnProperty.call(requiredOverrides, name)) {
    return !!requiredOverrides[name];
  }
  return undefined;
};

/**
 * Maps HubSpot property definitions to FormBuilder field configs.
 *
 * Type mapping (fieldType first, storage `type` as tie-breaker/fallback):
 *   select → select · radio → radioGroup · checkbox → multiselect ·
 *   booleancheckbox → toggle · date → date (datetime storage → datetime) ·
 *   number → number · textarea → textarea · text/phonenumber → text.
 * Enumeration options become { label, value } arrays with hidden options
 * filtered out. Boolean (toggle) fields get transformIn/transformOut that
 * normalize HubSpot's "true"/"false" string values; number fields get a
 * transformIn that parses HubSpot's numeric strings. Date/datetime values
 * are NOT transformed — epoch-ms ↔ value-object conversion is timezone
 * sensitive, so wire transformIn/transformOut yourself (see
 * `dateToTimestamp` in hs-uix/utils). Calculated and readOnlyValue
 * properties are emitted with readOnly: true. Hidden properties are skipped
 * unless explicitly listed in `include`.
 *
 * @param {Array<object>} properties HubSpot property definition objects
 * @param {object} [options]
 * @param {string[]} [options.include] property names to keep — also sets the output order
 * @param {string[]} [options.exclude] property names to drop
 * @param {Record<string, object>} [options.overrides] per-property partial field configs merged over the generated config
 * @param {string[] | Record<string, boolean>} [options.requiredOverrides] property names to mark required (array) or name → required map
 * @param {boolean} [options.includeDescriptions=false] copy property descriptions into field `description` help text
 * @returns {Array<object>} FormBuilder field configs
 */
export const fieldsFromHubSpotProperties = (properties, options = {}) => {
  if (!Array.isArray(properties)) return [];
  const {
    include,
    exclude,
    overrides,
    requiredOverrides,
    includeDescriptions = false,
  } = options;

  const includeSet = Array.isArray(include) ? new Set(include) : null;
  const excludeSet = Array.isArray(exclude) ? new Set(exclude) : null;

  let selected = properties.filter((property) => {
    if (!property || !property.name) return false;
    if (includeSet && !includeSet.has(property.name)) return false;
    if (excludeSet && excludeSet.has(property.name)) return false;
    // Hidden properties never made it into HubSpot's own forms either —
    // skip unless the caller explicitly asked for them via include.
    if (property.hidden === true && !includeSet) return false;
    return true;
  });

  // include doubles as field order.
  if (includeSet) {
    const order = new Map(include.map((name, idx) => [name, idx]));
    selected = [...selected].sort((a, b) => order.get(a.name) - order.get(b.name));
  }

  return selected.map((property) => {
    const type = resolveFieldType(property);

    const field = {
      name: property.name,
      type,
      label: property.label || property.name,
    };

    if (includeDescriptions && property.description) {
      field.description = property.description;
    }

    if (type === "select" || type === "multiselect" || type === "radioGroup") {
      field.options = mapPropertyOptions(property.options) || [];
    }

    if (type === "toggle") {
      // HubSpot boolean property values arrive as "true"/"false" strings;
      // Toggle needs a real boolean (otherwise "false" renders checked).
      field.transformIn = coerceBool;
      field.transformOut = (value) => !!value;
    }

    if (type === "number") {
      // HubSpot number property values arrive as strings ("150000").
      field.transformIn = coerceNumber;
    }

    if (isPropertyReadOnly(property)) {
      field.readOnly = true;
    }

    const required = resolveRequiredOverride(requiredOverrides, property.name);
    if (required !== undefined) field.required = required;

    const override = overrides && overrides[property.name];
    return override ? { ...field, ...override } : field;
  });
};
