import { describe, it, expect } from "vitest";
import {
  CREATE_OPTION_VALUE,
  enforceSelectionMax,
  getRecordId,
  isRecordLike,
  makeCreateOption,
  mapIdsToRecords,
  mergePickerOptions,
  normalizeRecordSelection,
  recordToPickerOption,
  shouldShowCreateOption,
  splitCreateSelection,
  upsertRecords,
} from "./recordPickerCore.js";

describe("mergePickerOptions", () => {
  it("prepends selected options missing from the current search page", () => {
    const searchPage = [
      { label: "Acme", value: "1" },
      { label: "Globex", value: "2" },
    ];
    const selected = [{ label: "Initech", value: "9" }];

    expect(mergePickerOptions(searchPage, selected)).toEqual([
      { label: "Initech", value: "9" },
      { label: "Acme", value: "1" },
      { label: "Globex", value: "2" },
    ]);
  });

  it("does not duplicate selected options already present in the search page", () => {
    const searchPage = [{ label: "Acme", value: "1" }];
    const selected = [{ label: "Acme", value: "1" }];

    expect(mergePickerOptions(searchPage, selected)).toBe(searchPage);
  });

  it("returns the search page untouched when nothing is selected", () => {
    const searchPage = [{ label: "Acme", value: "1" }];
    expect(mergePickerOptions(searchPage, [])).toBe(searchPage);
    expect(mergePickerOptions(searchPage, undefined)).toBe(searchPage);
  });

  it("accepts a single selected option (single-select mode)", () => {
    expect(mergePickerOptions([], { label: "Acme", value: "1" })).toEqual([
      { label: "Acme", value: "1" },
    ]);
  });
});

describe("enforceSelectionMax", () => {
  it("trims the selection to the first max ids (rejects the newest pick)", () => {
    expect(enforceSelectionMax(["1", "2", "3", "4"], 3)).toEqual(["1", "2", "3"]);
  });

  it("leaves the selection alone when within the cap", () => {
    const ids = ["1", "2"];
    expect(enforceSelectionMax(ids, 3)).toBe(ids);
  });

  it("ignores missing or non-positive max", () => {
    expect(enforceSelectionMax(["1", "2"], undefined)).toEqual(["1", "2"]);
    expect(enforceSelectionMax(["1", "2"], 0)).toEqual(["1", "2"]);
    expect(enforceSelectionMax(["1", "2"], -5)).toEqual(["1", "2"]);
  });

  it("normalizes scalar and empty inputs to arrays", () => {
    expect(enforceSelectionMax("1", 5)).toEqual(["1"]);
    expect(enforceSelectionMax(null, 5)).toEqual([]);
    expect(enforceSelectionMax("", 5)).toEqual([]);
  });
});

describe("shouldShowCreateOption", () => {
  const allowCreate = { onCreate: async () => "10" };
  const base = {
    allowCreate,
    searchTerm: "New Co",
    options: [{ label: "Acme", value: "1" }],
  };

  it("shows when a settled non-empty search has no exact label match", () => {
    expect(shouldShowCreateOption(base)).toBe(true);
  });

  it("hides without an allowCreate config or onCreate function", () => {
    expect(shouldShowCreateOption({ ...base, allowCreate: false })).toBe(false);
    expect(shouldShowCreateOption({ ...base, allowCreate: true })).toBe(false);
    expect(shouldShowCreateOption({ ...base, allowCreate: { label: "x" } })).toBe(false);
  });

  it("hides while searching, while a create is pending, or at max", () => {
    expect(shouldShowCreateOption({ ...base, searching: true })).toBe(false);
    expect(shouldShowCreateOption({ ...base, createPending: true })).toBe(false);
    expect(shouldShowCreateOption({ ...base, atMax: true })).toBe(false);
  });

  it("hides for empty or whitespace-only search terms", () => {
    expect(shouldShowCreateOption({ ...base, searchTerm: "" })).toBe(false);
    expect(shouldShowCreateOption({ ...base, searchTerm: "   " })).toBe(false);
    expect(shouldShowCreateOption({ ...base, searchTerm: undefined })).toBe(false);
  });

  it("hides when an option label matches the term exactly (case-insensitive, trimmed)", () => {
    expect(shouldShowCreateOption({ ...base, searchTerm: "acme" })).toBe(false);
    expect(shouldShowCreateOption({ ...base, searchTerm: "  ACME  " })).toBe(false);
    // Partial matches still allow creation.
    expect(shouldShowCreateOption({ ...base, searchTerm: "Acm" })).toBe(true);
  });
});

describe("makeCreateOption", () => {
  it("defaults to a quoted Create label with the sentinel value", () => {
    expect(makeCreateOption("New Co")).toEqual({
      label: 'Create "New Co"',
      value: CREATE_OPTION_VALUE,
    });
  });

  it("supports a static label and a label formatter", () => {
    expect(makeCreateOption("New Co", "Add company").label).toBe("Add company");
    expect(makeCreateOption("New Co", (term) => `+ ${term}`).label).toBe("+ New Co");
  });
});

describe("splitCreateSelection", () => {
  it("strips the create sentinel and reports it was chosen", () => {
    expect(splitCreateSelection(["1", CREATE_OPTION_VALUE])).toEqual({
      ids: ["1"],
      create: true,
    });
  });

  it("handles the scalar single-select payload", () => {
    expect(splitCreateSelection(CREATE_OPTION_VALUE)).toEqual({ ids: [], create: true });
    expect(splitCreateSelection("7")).toEqual({ ids: ["7"], create: false });
    expect(splitCreateSelection(null)).toEqual({ ids: [], create: false });
    expect(splitCreateSelection("")).toEqual({ ids: [], create: false });
  });
});

describe("normalizeRecordSelection", () => {
  it("splits mixed ids and records into ids plus seed records", () => {
    const record = { objectId: "2", name: "Globex" };
    expect(normalizeRecordSelection(["1", record])).toEqual({
      ids: ["1", "2"],
      records: [record],
    });
  });

  it("dedupes ids keeping the first occurrence", () => {
    const record = { objectId: "1", name: "Acme" };
    expect(normalizeRecordSelection(["1", record, "1"])).toEqual({
      ids: ["1"],
      records: [],
    });
  });

  it("accepts a scalar id or record and empty values", () => {
    expect(normalizeRecordSelection("5")).toEqual({ ids: ["5"], records: [] });
    // Numeric ids normalize to strings so they match CRM search objectIds.
    const record = { id: 6 };
    expect(normalizeRecordSelection(record)).toEqual({ ids: ["6"], records: [record] });
    expect(normalizeRecordSelection(undefined)).toEqual({ ids: [], records: [] });
    expect(normalizeRecordSelection("")).toEqual({ ids: [], records: [] });
  });

  it("drops records without a resolvable id", () => {
    expect(normalizeRecordSelection([{ name: "No id" }])).toEqual({ ids: [], records: [] });
  });
});

describe("getRecordId / isRecordLike", () => {
  it("resolves objectId, id, hs_object_id, then properties.hs_object_id", () => {
    expect(getRecordId({ objectId: "1", id: "x" })).toBe("1");
    expect(getRecordId({ id: "2" })).toBe("2");
    expect(getRecordId({ hs_object_id: "3" })).toBe("3");
    expect(getRecordId({ properties: { hs_object_id: "4" } })).toBe("4");
    expect(getRecordId({})).toBeUndefined();
    expect(getRecordId("5")).toBeUndefined();
  });

  it("treats plain objects as records but not arrays or scalars", () => {
    expect(isRecordLike({})).toBe(true);
    expect(isRecordLike([])).toBe(false);
    expect(isRecordLike("1")).toBe(false);
    expect(isRecordLike(null)).toBe(false);
  });
});

describe("mapIdsToRecords", () => {
  const acme = { objectId: "1", name: "Acme" };

  it("maps ids to registry records, stubbing unknown ids 1:1", () => {
    const registry = new Map([["1", acme]]);
    expect(mapIdsToRecords(["1", "9"], registry)).toEqual([acme, { objectId: "9" }]);
  });

  it("accepts a plain-object registry", () => {
    expect(mapIdsToRecords(["1"], { 1: acme })).toEqual([acme]);
  });

  it("returns an empty array for empty ids", () => {
    expect(mapIdsToRecords(null, new Map())).toEqual([]);
  });
});

describe("recordToPickerOption", () => {
  it("derives label and description from dotted paths", () => {
    const record = { objectId: "1", name: "Acme", properties: { domain: "acme.com" } };
    expect(
      recordToPickerOption(record, { labelField: "name", descriptionField: "properties.domain" })
    ).toEqual({ label: "Acme", value: "1", description: "acme.com" });
  });

  it("supports accessor functions for labelField", () => {
    const record = { objectId: "1", firstname: "Ada", lastname: "Lovelace" };
    expect(
      recordToPickerOption(record, { labelField: (r) => `${r.firstname} ${r.lastname}` }).label
    ).toBe("Ada Lovelace");
  });

  it("falls back to name, properties.name, then fallbackLabel", () => {
    expect(recordToPickerOption({ objectId: "1", name: "Acme" }).label).toBe("Acme");
    expect(
      recordToPickerOption({ objectId: "1", properties: { name: "Globex" } }).label
    ).toBe("Globex");
    expect(recordToPickerOption({ objectId: "1" }).label).toBe("Untitled record");
    expect(recordToPickerOption({ objectId: "1" }, { fallbackLabel: "--" }).label).toBe("--");
  });

  it("omits empty descriptions", () => {
    const option = recordToPickerOption(
      { objectId: "1", name: "Acme", email: "" },
      { descriptionField: "email" }
    );
    expect("description" in option).toBe(false);
  });
});

describe("upsertRecords", () => {
  it("appends new records and replaces existing ones by id", () => {
    const initial = [{ objectId: "1", name: "Acme" }];
    const next = upsertRecords(initial, [
      { objectId: "1", name: "Acme Corp" },
      { objectId: "2", name: "Globex" },
    ]);
    expect(next).toEqual([
      { objectId: "1", name: "Acme Corp" },
      { objectId: "2", name: "Globex" },
    ]);
  });

  it("ignores additions without ids and returns the list unchanged when nothing to add", () => {
    const initial = [{ objectId: "1", name: "Acme" }];
    expect(upsertRecords(initial, [{ name: "No id" }])).toBe(initial);
    expect(upsertRecords(initial, [])).toBe(initial);
  });
});
