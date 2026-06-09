// ═══════════════════════════════════════════════════════════════════════════
// Dirty-state model — pure helpers that answer "has this form changed?".
//
// FormBuilder snapshots its initial values and needs to compare them against
// the live values on every render (for onDirtyChange, the imperative
// isDirty()/getDirtyFields() ref methods, and the confirmDiscard cancel
// guard). The comparison semantics live here, on top of formValues.deepEqual,
// so they are directly testable without rendering the component and reusable
// by consumers who track dirty state outside FormBuilder.
// ═══════════════════════════════════════════════════════════════════════════

import { deepEqual } from "./formValues.js";

/**
 * Returns true when `values` differ from `initialValues` by deep comparison.
 * Treats null/undefined inputs as empty objects, so a form with no initial
 * values is dirty as soon as any field holds a non-initial value.
 *
 * @param {Record<string, unknown> | null | undefined} values current form values
 * @param {Record<string, unknown> | null | undefined} initialValues baseline snapshot
 * @returns {boolean}
 */
export const isFormDirty = (values, initialValues) =>
  !deepEqual(values || {}, initialValues || {});

/**
 * Returns the names of fields whose current value deep-differs from the
 * baseline. Keys present on only one side count as dirty unless both sides
 * resolve to undefined (a missing key and an explicit undefined are treated
 * as the same "no value").
 *
 * @param {Record<string, unknown> | null | undefined} values current form values
 * @param {Record<string, unknown> | null | undefined} initialValues baseline snapshot
 * @returns {string[]} dirty field names, in current-values key order
 */
export const getDirtyFields = (values, initialValues) => {
  const current = values || {};
  const baseline = initialValues || {};
  const names = [...Object.keys(current)];
  for (const name of Object.keys(baseline)) {
    if (!Object.prototype.hasOwnProperty.call(current, name)) names.push(name);
  }
  return names.filter((name) => !deepEqual(current[name], baseline[name]));
};
