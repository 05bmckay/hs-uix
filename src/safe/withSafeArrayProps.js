// ═══════════════════════════════════════════════════════════════════════════
// withSafeArrayProps — wrap a component so required collection props are
// always arrays.
//
// A missing data path (`data={rows}` where `rows` resolved undefined, or an
// API that returned an object instead of a list) makes several components
// throw inside HubSpot's reconciler ("Cannot read properties of undefined
// (reading 'length')"), which blanks the whole extension in production.
// Coercing the required array props to [] degrades to the component's own
// empty state instead.
//
// `derivePropNames` covers the optional-with-fallback flavor (CrmDataTable
// columns, CrmKanban stages): those components auto-derive the prop when it's
// OMITTED, and an empty array would suppress that (`columns || infer` — [] is
// truthy). So derive props are left alone when null/undefined and DROPPED
// (with a warn) when set to a non-array, keeping the derive path alive.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { warnOnce } from "./warnings.js";

const arrayProp = (value, componentName, propName) => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  warnOnce(
    `${componentName}-${propName}-not-array`,
    `[hs-uix/safe] ${componentName}.${propName} must be an array — received ${typeof value}; using [].`
  );
  return [];
};

/**
 * @param {import("react").ComponentType<any>} Component
 * @param {string} componentName  used in warnings and the displayName
 * @param {string[]} propNames    props to force to arrays: null/undefined → []
 *                                silently, any other non-array → [] with a
 *                                one-time console.warn
 * @param {string[]} [derivePropNames]  auto-derived-when-omitted props:
 *                                null/undefined pass through untouched (so the
 *                                component still derives them); non-arrays are
 *                                dropped with a one-time console.warn
 * @returns a drop-in wrapper (refs forward through), displayName
 *          `Safe<componentName>`
 */
export function withSafeArrayProps(Component, componentName, propNames, derivePropNames = []) {
  if (!Component) return undefined;
  // forwardRef so wrapped forwardRef components (FormBuilder's imperative
  // ref API) stay drop-ins.
  const SafeComponent = React.forwardRef((props, ref) => {
    const next = { ...(props || {}) };
    for (const propName of propNames) {
      next[propName] = arrayProp(next[propName], componentName, propName);
    }
    for (const propName of derivePropNames) {
      const value = next[propName];
      if (value == null || Array.isArray(value)) continue;
      warnOnce(
        `${componentName}-${propName}-not-array`,
        `[hs-uix/safe] ${componentName}.${propName} must be an array — received ${typeof value}; omitting it so ${componentName} derives it automatically.`
      );
      delete next[propName];
    }
    return React.createElement(Component, ref != null ? { ...next, ref } : next);
  });
  SafeComponent.displayName = `Safe${componentName}`;
  return SafeComponent;
}
