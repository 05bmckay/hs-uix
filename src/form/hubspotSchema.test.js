import { describe, it, expect } from "vitest";
import { fieldsFromHubSpotProperties } from "./hubspotSchema.js";

// ---------------------------------------------------------------------------
// Realistic property fixtures (shapes from GET /crm/v3/properties/{object})
// ---------------------------------------------------------------------------

const emailProperty = {
  name: "email",
  label: "Email",
  type: "string",
  fieldType: "text",
  description: "A contact's email address",
  groupName: "contactinformation",
  hidden: false,
  options: [],
};

const dealstageProperty = {
  name: "dealstage",
  label: "Deal Stage",
  type: "enumeration",
  fieldType: "select",
  description: "The stage of the deal",
  groupName: "dealinformation",
  hidden: false,
  options: [
    { label: "Appointment Scheduled", value: "appointmentscheduled", displayOrder: 0, hidden: false },
    { label: "Qualified To Buy", value: "qualifiedtobuy", displayOrder: 1, hidden: false },
    { label: "Legacy Stage", value: "legacystage", displayOrder: 2, hidden: true },
    { label: "Closed Won", value: "closedwon", displayOrder: 3, hidden: false },
  ],
};

const amountProperty = {
  name: "amount",
  label: "Amount",
  type: "number",
  fieldType: "number",
  description: "The total amount of the deal",
  groupName: "dealinformation",
  hidden: false,
  options: [],
};

const closedateProperty = {
  name: "closedate",
  label: "Close Date",
  type: "date",
  fieldType: "date",
  description: "The day the deal is expected to close",
  groupName: "dealinformation",
  hidden: false,
  options: [],
};

const lastContactedProperty = {
  name: "notes_last_contacted",
  label: "Last Contacted",
  type: "datetime",
  fieldType: "date",
  groupName: "contactinformation",
  hidden: false,
  options: [],
};

const booleanProperty = {
  name: "hs_email_optout",
  label: "Opted out of email",
  type: "bool",
  fieldType: "booleancheckbox",
  groupName: "contactinformation",
  hidden: false,
  options: [
    { label: "Yes", value: "true", displayOrder: 0, hidden: false },
    { label: "No", value: "false", displayOrder: 1, hidden: false },
  ],
};

const multiCheckboxProperty = {
  name: "hs_buying_role",
  label: "Buying Role",
  type: "enumeration",
  fieldType: "checkbox",
  groupName: "contactinformation",
  hidden: false,
  options: [
    { label: "Decision Maker", value: "DECISION_MAKER", displayOrder: 0, hidden: false },
    { label: "Influencer", value: "INFLUENCER", displayOrder: 1, hidden: false },
  ],
};

const radioProperty = {
  name: "hs_persona",
  label: "Persona",
  type: "enumeration",
  fieldType: "radio",
  groupName: "contactinformation",
  hidden: false,
  options: [
    { label: "Persona A", value: "persona_1", displayOrder: 0, hidden: false },
    { label: "Persona B", value: "persona_2", displayOrder: 1, hidden: false },
  ],
};

const textareaProperty = {
  name: "description",
  label: "Description",
  type: "string",
  fieldType: "textarea",
  groupName: "dealinformation",
  hidden: false,
  options: [],
};

const phoneProperty = {
  name: "phone",
  label: "Phone Number",
  type: "string",
  fieldType: "phonenumber",
  groupName: "contactinformation",
  hidden: false,
  options: [],
};

const calculatedProperty = {
  name: "days_to_close",
  label: "Days to Close",
  type: "number",
  fieldType: "calculation_equation",
  calculated: true,
  groupName: "dealinformation",
  hidden: false,
  options: [],
};

const readOnlyValueProperty = {
  name: "createdate",
  label: "Create Date",
  type: "datetime",
  fieldType: "date",
  groupName: "contactinformation",
  hidden: false,
  options: [],
  modificationMetadata: { archivable: true, readOnlyDefinition: true, readOnlyValue: true },
};

const hiddenProperty = {
  name: "hs_internal_thing",
  label: "Internal Thing",
  type: "string",
  fieldType: "text",
  hidden: true,
  options: [],
};

const allProperties = [
  emailProperty,
  dealstageProperty,
  amountProperty,
  closedateProperty,
  booleanProperty,
];

// ---------------------------------------------------------------------------
// Type mapping
// ---------------------------------------------------------------------------

describe("fieldsFromHubSpotProperties — type mapping", () => {
  it("maps text → text (contact email)", () => {
    const [field] = fieldsFromHubSpotProperties([emailProperty]);
    expect(field).toMatchObject({ name: "email", type: "text", label: "Email" });
  });

  it("maps select enumeration → select with hidden options filtered (dealstage)", () => {
    const [field] = fieldsFromHubSpotProperties([dealstageProperty]);
    expect(field.type).toBe("select");
    expect(field.options).toEqual([
      { label: "Appointment Scheduled", value: "appointmentscheduled" },
      { label: "Qualified To Buy", value: "qualifiedtobuy" },
      { label: "Closed Won", value: "closedwon" },
    ]);
  });

  it("maps number → number with string-parsing transformIn (amount)", () => {
    const [field] = fieldsFromHubSpotProperties([amountProperty]);
    expect(field.type).toBe("number");
    expect(field.transformIn("150000")).toBe(150000);
    expect(field.transformIn(99)).toBe(99);
    expect(field.transformIn("")).toBeUndefined();
    expect(field.transformIn(null)).toBeUndefined();
    expect(field.transformIn("not-a-number")).toBeUndefined();
  });

  it("maps date storage → date (closedate)", () => {
    const [field] = fieldsFromHubSpotProperties([closedateProperty]);
    expect(field.type).toBe("date");
  });

  it("maps datetime storage → datetime even though fieldType is date", () => {
    const [field] = fieldsFromHubSpotProperties([lastContactedProperty]);
    expect(field.type).toBe("datetime");
  });

  it("maps booleancheckbox → toggle with boolean normalization (boolean)", () => {
    const [field] = fieldsFromHubSpotProperties([booleanProperty]);
    expect(field.type).toBe("toggle");
    // toggles don't carry enumeration options
    expect(field.options).toBeUndefined();
    expect(field.transformIn("true")).toBe(true);
    expect(field.transformIn("false")).toBe(false);
    expect(field.transformIn(true)).toBe(true);
    expect(field.transformIn("Yes")).toBe(true);
    expect(field.transformIn(undefined)).toBe(false);
    expect(field.transformOut(true)).toBe(true);
    expect(field.transformOut(undefined)).toBe(false);
  });

  it("maps checkbox enumeration → multiselect", () => {
    const [field] = fieldsFromHubSpotProperties([multiCheckboxProperty]);
    expect(field.type).toBe("multiselect");
    expect(field.options).toEqual([
      { label: "Decision Maker", value: "DECISION_MAKER" },
      { label: "Influencer", value: "INFLUENCER" },
    ]);
  });

  it("maps radio → radioGroup (FormBuilder's radio rendering)", () => {
    const [field] = fieldsFromHubSpotProperties([radioProperty]);
    expect(field.type).toBe("radioGroup");
    expect(field.options).toHaveLength(2);
  });

  it("maps textarea → textarea and phonenumber → text", () => {
    const fields = fieldsFromHubSpotProperties([textareaProperty, phoneProperty]);
    expect(fields[0].type).toBe("textarea");
    expect(fields[1].type).toBe("text");
  });

  it("falls back to storage type for unknown fieldTypes", () => {
    const [field] = fieldsFromHubSpotProperties([
      { name: "x", label: "X", type: "enumeration", fieldType: "weird_widget", options: [] },
    ]);
    expect(field.type).toBe("select");
    const [boolField] = fieldsFromHubSpotProperties([
      { name: "y", label: "Y", type: "bool", fieldType: "weird_widget" },
    ]);
    expect(boolField.type).toBe("toggle");
    const [textField] = fieldsFromHubSpotProperties([
      { name: "z", label: "Z", type: "string", fieldType: "weird_widget" },
    ]);
    expect(textField.type).toBe("text");
  });
});

// ---------------------------------------------------------------------------
// Selection, ordering, overrides
// ---------------------------------------------------------------------------

describe("fieldsFromHubSpotProperties — options", () => {
  it("returns [] for missing/invalid input", () => {
    expect(fieldsFromHubSpotProperties(undefined)).toEqual([]);
    expect(fieldsFromHubSpotProperties(null)).toEqual([]);
    expect(fieldsFromHubSpotProperties({})).toEqual([]);
  });

  it("include filters AND orders the output", () => {
    const fields = fieldsFromHubSpotProperties(allProperties, {
      include: ["closedate", "email"],
    });
    expect(fields.map((f) => f.name)).toEqual(["closedate", "email"]);
  });

  it("exclude drops properties", () => {
    const fields = fieldsFromHubSpotProperties(allProperties, {
      exclude: ["dealstage", "hs_email_optout"],
    });
    expect(fields.map((f) => f.name)).toEqual(["email", "amount", "closedate"]);
  });

  it("skips hidden properties unless explicitly included", () => {
    const fields = fieldsFromHubSpotProperties([emailProperty, hiddenProperty]);
    expect(fields.map((f) => f.name)).toEqual(["email"]);

    const forced = fieldsFromHubSpotProperties([emailProperty, hiddenProperty], {
      include: ["hs_internal_thing"],
    });
    expect(forced.map((f) => f.name)).toEqual(["hs_internal_thing"]);
  });

  it("overrides merge partial field configs over generated ones", () => {
    const fields = fieldsFromHubSpotProperties(allProperties, {
      include: ["email", "amount"],
      overrides: {
        email: { label: "Work email", required: true, placeholder: "name@company.com" },
        amount: { min: 0 },
      },
    });
    expect(fields[0]).toMatchObject({
      name: "email",
      type: "text",
      label: "Work email",
      required: true,
      placeholder: "name@company.com",
    });
    expect(fields[1].min).toBe(0);
  });

  it("requiredOverrides accepts an array of names", () => {
    const fields = fieldsFromHubSpotProperties(allProperties, {
      requiredOverrides: ["email", "dealstage"],
    });
    const byName = Object.fromEntries(fields.map((f) => [f.name, f]));
    expect(byName.email.required).toBe(true);
    expect(byName.dealstage.required).toBe(true);
    expect(byName.amount.required).toBeUndefined();
  });

  it("requiredOverrides accepts a name → boolean map", () => {
    const fields = fieldsFromHubSpotProperties(allProperties, {
      requiredOverrides: { email: true, amount: false },
    });
    const byName = Object.fromEntries(fields.map((f) => [f.name, f]));
    expect(byName.email.required).toBe(true);
    expect(byName.amount.required).toBe(false);
    expect(byName.closedate.required).toBeUndefined();
  });

  it("descriptions are opt-in via includeDescriptions", () => {
    const [bare] = fieldsFromHubSpotProperties([emailProperty]);
    expect(bare.description).toBeUndefined();
    const [withDesc] = fieldsFromHubSpotProperties([emailProperty], {
      includeDescriptions: true,
    });
    expect(withDesc.description).toBe("A contact's email address");
  });

  it("marks calculated and readOnlyValue properties readOnly", () => {
    const fields = fieldsFromHubSpotProperties([calculatedProperty, readOnlyValueProperty]);
    expect(fields[0].readOnly).toBe(true);
    expect(fields[1].readOnly).toBe(true);
    // but an override can re-enable editing
    const [editable] = fieldsFromHubSpotProperties([calculatedProperty], {
      overrides: { days_to_close: { readOnly: false } },
    });
    expect(editable.readOnly).toBe(false);
  });

  it("keeps option descriptions when present", () => {
    const [field] = fieldsFromHubSpotProperties([
      {
        name: "tier",
        label: "Tier",
        type: "enumeration",
        fieldType: "select",
        options: [
          { label: "Gold", value: "gold", description: "Top tier", hidden: false },
          { label: "Silver", value: "silver", hidden: false },
        ],
      },
    ]);
    expect(field.options).toEqual([
      { label: "Gold", value: "gold", description: "Top tier" },
      { label: "Silver", value: "silver" },
    ]);
  });

  it("falls back to name when label is missing and tolerates missing options arrays", () => {
    const [field] = fieldsFromHubSpotProperties([
      { name: "custom_enum", type: "enumeration", fieldType: "select" },
    ]);
    expect(field.label).toBe("custom_enum");
    expect(field.options).toEqual([]);
  });
});
