// ═══════════════════════════════════════════════════════════════════════════
// Wizard state machine — pure step-flow logic for <Wizard> and
// <OnboardingChecklist>.
//
// Everything that decides WHERE a wizard can go lives here, render-free:
// step normalization, id/index resolution, reachability (linear gating vs.
// allowJumpAhead, with optional steps skippable), validate gating, next/back
// transitions, and completion percentages. The components stay thin —
// useState + these functions — and the gating rules become exhaustively
// testable without mounting anything.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalize a raw `steps` prop into a safe array. Drops nullish entries and
 * guarantees every step has a stable string `id` (falls back to `step-<i>`).
 * Original step objects are preserved (spread) so `render` / `validate` /
 * custom fields pass through untouched.
 */
export const normalizeWizardSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .filter((step) => step != null && typeof step === "object")
    .map((step, index) => ({
      ...step,
      id: step.id != null ? String(step.id) : `step-${index}`,
    }));
};

/**
 * Resolve a step reference (string id or numeric index) to an index.
 * Returns -1 when the reference doesn't resolve to a real step.
 */
export const findStepIndex = (steps, stepOrId) => {
  if (!Array.isArray(steps) || steps.length === 0) return -1;
  if (typeof stepOrId === "number") {
    return Number.isInteger(stepOrId) && stepOrId >= 0 && stepOrId < steps.length
      ? stepOrId
      : -1;
  }
  if (stepOrId == null) return -1;
  const id = String(stepOrId);
  return steps.findIndex((step) => step.id === id);
};

/**
 * Resolve a step reference with a fallback (used for `defaultStep`): returns
 * the resolved index, or `fallback` (default 0) when it doesn't resolve.
 */
export const resolveStepIndex = (steps, stepOrId, fallback = 0) => {
  const index = findStepIndex(steps, stepOrId);
  return index >= 0 ? index : fallback;
};

/** True when `completedIds` contains the given step id. */
export const isStepComplete = (completedIds, stepId) =>
  Array.isArray(completedIds) && stepId != null && completedIds.includes(String(stepId));

/**
 * Return a new completed-ids array with `stepId` added (deduplicated).
 * Returns the same array when the id is already present.
 */
export const completeStep = (completedIds, stepId) => {
  const ids = Array.isArray(completedIds) ? completedIds : [];
  if (stepId == null) return ids;
  const id = String(stepId);
  return ids.includes(id) ? ids : [...ids, id];
};

/**
 * Status of a step for nav markers: "complete" (validated & passed via Next),
 * "current" (active index), or "upcoming".
 */
export const getStepStatus = (steps, index, { currentIndex = 0, completedIds = [] } = {}) => {
  const step = Array.isArray(steps) ? steps[index] : undefined;
  if (step && isStepComplete(completedIds, step.id)) return "complete";
  if (index === currentIndex) return "current";
  return "upcoming";
};

/**
 * Can the user jump directly to `targetIndex`?
 *
 * Rules (in order):
 *   1. Out-of-range targets are never reachable.
 *   2. The current step and anything behind it are always reachable (back
 *      navigation is never gated).
 *   3. `allowJumpAhead` opens every step.
 *   4. Otherwise (linear mode) a future step is reachable only when every
 *      step before it is either completed or marked `optional` — optional
 *      steps are skippable, required steps must be passed via Next first.
 */
export const isStepReachable = (
  steps,
  targetIndex,
  { currentIndex = 0, completedIds = [], allowJumpAhead = false } = {}
) => {
  if (!Array.isArray(steps)) return false;
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= steps.length) {
    return false;
  }
  if (targetIndex <= currentIndex) return true;
  if (allowJumpAhead) return true;
  for (let i = 0; i < targetIndex; i += 1) {
    const step = steps[i];
    if (!step.optional && !isStepComplete(completedIds, step.id)) return false;
  }
  return true;
};

/** Index of the step after `currentIndex`, or -1 when on the last step. */
export const getNextIndex = (steps, currentIndex) => {
  if (!Array.isArray(steps)) return -1;
  const next = currentIndex + 1;
  return next > 0 && next < steps.length ? next : -1;
};

/** Index of the step before `currentIndex`, or -1 when on the first step. */
export const getBackIndex = (currentIndex) =>
  Number.isInteger(currentIndex) && currentIndex > 0 ? currentIndex - 1 : -1;

/**
 * Run a step's `validate(ctx)` and normalize the result for gating:
 * a non-empty string is the error message (Next is blocked); `true`,
 * `false`, `undefined`, `null`, `""` and any non-string all pass (null).
 * Steps without a validate function always pass.
 */
export const validateStep = (step, ctx) => {
  if (!step || typeof step.validate !== "function") return null;
  const result = step.validate(ctx);
  return typeof result === "string" && result.length > 0 ? result : null;
};

/**
 * Completion percentage (0-100 integer) — completed steps over total steps.
 * Empty wizards report 0.
 */
export const getCompletionPercent = (steps, completedIds) => {
  if (!Array.isArray(steps) || steps.length === 0) return 0;
  const done = steps.filter((step) => isStepComplete(completedIds, step.id)).length;
  return Math.round((done / steps.length) * 100);
};

/**
 * Titles for the native StepIndicator's `stepNames` (falls back to the
 * step id when a step has no title).
 */
export const getStepNames = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps.map((step) => (step.title != null ? String(step.title) : step.id));
};

/**
 * Progress summary for <OnboardingChecklist>: `{ done, total, percent }`.
 * Nullish entries are ignored; an empty list reports 0/0/0.
 */
export const getChecklistProgress = (items) => {
  const valid = Array.isArray(items) ? items.filter((item) => item != null) : [];
  const total = valid.length;
  const done = valid.filter((item) => !!item.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
};
