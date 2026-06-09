import { describe, it, expect } from "vitest";
import {
  normalizeWizardSteps,
  findStepIndex,
  resolveStepIndex,
  isStepComplete,
  completeStep,
  getStepStatus,
  isStepReachable,
  getNextIndex,
  getBackIndex,
  validateStep,
  getCompletionPercent,
  getStepNames,
  getChecklistProgress,
} from "./wizardState.js";

const STEPS = normalizeWizardSteps([
  { id: "details", title: "Details" },
  { id: "config", title: "Configuration", optional: true },
  { id: "review", title: "Review" },
]);

describe("normalizeWizardSteps", () => {
  it("returns [] for non-arrays and drops nullish / non-object entries", () => {
    expect(normalizeWizardSteps(undefined)).toEqual([]);
    expect(normalizeWizardSteps(null)).toEqual([]);
    expect(normalizeWizardSteps("nope")).toEqual([]);
    expect(normalizeWizardSteps([null, undefined, { id: "a" }])).toHaveLength(1);
  });

  it("stringifies provided ids and fills missing ids positionally", () => {
    const steps = normalizeWizardSteps([{ id: 7 }, { title: "No id" }]);
    expect(steps[0].id).toBe("7");
    expect(steps[1].id).toBe("step-1");
  });

  it("preserves the original step fields (render, validate, custom)", () => {
    const render = () => null;
    const validate = () => true;
    const [step] = normalizeWizardSteps([{ id: "a", render, validate, custom: 1 }]);
    expect(step.render).toBe(render);
    expect(step.validate).toBe(validate);
    expect(step.custom).toBe(1);
  });
});

describe("findStepIndex / resolveStepIndex", () => {
  it("resolves string ids", () => {
    expect(findStepIndex(STEPS, "details")).toBe(0);
    expect(findStepIndex(STEPS, "review")).toBe(2);
    expect(findStepIndex(STEPS, "missing")).toBe(-1);
  });

  it("resolves in-range integer indexes and rejects out-of-range ones", () => {
    expect(findStepIndex(STEPS, 1)).toBe(1);
    expect(findStepIndex(STEPS, 0)).toBe(0);
    expect(findStepIndex(STEPS, 3)).toBe(-1);
    expect(findStepIndex(STEPS, -1)).toBe(-1);
    expect(findStepIndex(STEPS, 1.5)).toBe(-1);
  });

  it("handles empty / nullish inputs", () => {
    expect(findStepIndex([], "a")).toBe(-1);
    expect(findStepIndex(undefined, "a")).toBe(-1);
    expect(findStepIndex(STEPS, null)).toBe(-1);
    expect(findStepIndex(STEPS, undefined)).toBe(-1);
  });

  it("resolveStepIndex falls back when unresolved", () => {
    expect(resolveStepIndex(STEPS, "config")).toBe(1);
    expect(resolveStepIndex(STEPS, "missing")).toBe(0);
    expect(resolveStepIndex(STEPS, "missing", 2)).toBe(2);
    expect(resolveStepIndex([], "anything", 0)).toBe(0);
  });
});

describe("isStepComplete / completeStep", () => {
  it("isStepComplete checks membership defensively", () => {
    expect(isStepComplete(["a"], "a")).toBe(true);
    expect(isStepComplete(["a"], "b")).toBe(false);
    expect(isStepComplete(undefined, "a")).toBe(false);
    expect(isStepComplete(["a"], null)).toBe(false);
  });

  it("completeStep appends without mutating and deduplicates", () => {
    const before = ["a"];
    const after = completeStep(before, "b");
    expect(after).toEqual(["a", "b"]);
    expect(before).toEqual(["a"]);
    expect(completeStep(after, "b")).toBe(after); // already present -> same array
  });

  it("completeStep tolerates nullish inputs", () => {
    expect(completeStep(undefined, "a")).toEqual(["a"]);
    expect(completeStep(["a"], null)).toEqual(["a"]);
  });

  it("completeStep stringifies ids to match normalized steps", () => {
    expect(completeStep([], 7)).toEqual(["7"]);
  });
});

describe("getStepStatus", () => {
  it("reports complete / current / upcoming", () => {
    const opts = { currentIndex: 1, completedIds: ["details"] };
    expect(getStepStatus(STEPS, 0, opts)).toBe("complete");
    expect(getStepStatus(STEPS, 1, opts)).toBe("current");
    expect(getStepStatus(STEPS, 2, opts)).toBe("upcoming");
  });

  it("completed wins over current (revisiting a finished step)", () => {
    const opts = { currentIndex: 0, completedIds: ["details"] };
    expect(getStepStatus(STEPS, 0, opts)).toBe("complete");
  });

  it("defaults: index 0 is current with no options", () => {
    expect(getStepStatus(STEPS, 0)).toBe("current");
    expect(getStepStatus(STEPS, 2)).toBe("upcoming");
  });
});

describe("isStepReachable — linear gating", () => {
  it("rejects out-of-range targets", () => {
    expect(isStepReachable(STEPS, -1, { currentIndex: 0 })).toBe(false);
    expect(isStepReachable(STEPS, 3, { currentIndex: 2, allowJumpAhead: true })).toBe(false);
    expect(isStepReachable(STEPS, 0.5, { currentIndex: 0 })).toBe(false);
    expect(isStepReachable(undefined, 0, { currentIndex: 0 })).toBe(false);
  });

  it("current step and earlier steps are always reachable", () => {
    expect(isStepReachable(STEPS, 0, { currentIndex: 0 })).toBe(true);
    expect(isStepReachable(STEPS, 0, { currentIndex: 2 })).toBe(true);
    expect(isStepReachable(STEPS, 1, { currentIndex: 2, completedIds: [] })).toBe(true);
  });

  it("future steps are blocked until prior required steps complete", () => {
    expect(isStepReachable(STEPS, 1, { currentIndex: 0, completedIds: [] })).toBe(false);
    expect(isStepReachable(STEPS, 1, { currentIndex: 0, completedIds: ["details"] })).toBe(true);
  });

  it("optional steps are skippable — they never block reachability", () => {
    // "config" (index 1) is optional: review reachable once "details" is done
    expect(isStepReachable(STEPS, 2, { currentIndex: 1, completedIds: ["details"] })).toBe(true);
    // but a required incomplete step still blocks
    expect(isStepReachable(STEPS, 2, { currentIndex: 0, completedIds: [] })).toBe(false);
  });

  it("allowJumpAhead opens every in-range step", () => {
    expect(isStepReachable(STEPS, 2, { currentIndex: 0, completedIds: [], allowJumpAhead: true })).toBe(true);
  });

  it("a fully required wizard gates strictly step by step", () => {
    const required = normalizeWizardSteps([{ id: "a" }, { id: "b" }, { id: "c" }]);
    expect(isStepReachable(required, 2, { currentIndex: 0, completedIds: ["a"] })).toBe(false);
    expect(isStepReachable(required, 2, { currentIndex: 1, completedIds: ["a", "b"] })).toBe(true);
  });
});

describe("getNextIndex / getBackIndex", () => {
  it("advances until the last step, then -1", () => {
    expect(getNextIndex(STEPS, 0)).toBe(1);
    expect(getNextIndex(STEPS, 1)).toBe(2);
    expect(getNextIndex(STEPS, 2)).toBe(-1);
    expect(getNextIndex([], 0)).toBe(-1);
    expect(getNextIndex(undefined, 0)).toBe(-1);
  });

  it("goes back until the first step, then -1", () => {
    expect(getBackIndex(2)).toBe(1);
    expect(getBackIndex(1)).toBe(0);
    expect(getBackIndex(0)).toBe(-1);
    expect(getBackIndex(undefined)).toBe(-1);
  });
});

describe("validateStep", () => {
  it("passes when there is no validate function", () => {
    expect(validateStep({ id: "a" }, {})).toBeNull();
    expect(validateStep(undefined, {})).toBeNull();
    expect(validateStep({ validate: "not-a-fn" }, {})).toBeNull();
  });

  it("non-empty string blocks; everything else passes", () => {
    expect(validateStep({ validate: () => "Name is required" }, {})).toBe("Name is required");
    expect(validateStep({ validate: () => true }, {})).toBeNull();
    expect(validateStep({ validate: () => false }, {})).toBeNull();
    expect(validateStep({ validate: () => undefined }, {})).toBeNull();
    expect(validateStep({ validate: () => null }, {})).toBeNull();
    expect(validateStep({ validate: () => "" }, {})).toBeNull();
    expect(validateStep({ validate: () => 0 }, {})).toBeNull();
  });

  it("receives the ctx (values drive gating)", () => {
    const step = { validate: ({ values }) => (values.email ? true : "Email is required") };
    expect(validateStep(step, { values: {} })).toBe("Email is required");
    expect(validateStep(step, { values: { email: "a@b.co" } })).toBeNull();
  });
});

describe("getCompletionPercent", () => {
  it("computes rounded percentages", () => {
    expect(getCompletionPercent(STEPS, [])).toBe(0);
    expect(getCompletionPercent(STEPS, ["details"])).toBe(33);
    expect(getCompletionPercent(STEPS, ["details", "config"])).toBe(67);
    expect(getCompletionPercent(STEPS, ["details", "config", "review"])).toBe(100);
  });

  it("ignores ids that are not steps and handles empty wizards", () => {
    expect(getCompletionPercent(STEPS, ["bogus"])).toBe(0);
    expect(getCompletionPercent([], ["a"])).toBe(0);
    expect(getCompletionPercent(undefined, [])).toBe(0);
  });
});

describe("getStepNames", () => {
  it("uses titles, falling back to ids", () => {
    expect(getStepNames(STEPS)).toEqual(["Details", "Configuration", "Review"]);
    expect(getStepNames(normalizeWizardSteps([{ id: "a" }, { title: "B" }]))).toEqual(["a", "B"]);
    expect(getStepNames(undefined)).toEqual([]);
  });
});

describe("getChecklistProgress", () => {
  it("counts done over total with a rounded percent", () => {
    expect(
      getChecklistProgress([{ done: true }, { done: false }, { done: true }])
    ).toEqual({ done: 2, total: 3, percent: 67 });
  });

  it("treats truthy done loosely and ignores nullish entries", () => {
    expect(getChecklistProgress([{ done: 1 }, null, { done: 0 }, undefined])).toEqual({
      done: 1,
      total: 2,
      percent: 50,
    });
  });

  it("empty and invalid input report zeros", () => {
    expect(getChecklistProgress([])).toEqual({ done: 0, total: 0, percent: 0 });
    expect(getChecklistProgress(undefined)).toEqual({ done: 0, total: 0, percent: 0 });
  });
});
