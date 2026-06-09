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
 * @returns a drop-in wrapper, displayName `Safe<componentName>`
 */
export function withSafeArrayProps(Component, componentName, propNames) {
  if (!Component) return undefined;
  const SafeComponent = (props) => {
    const next = { ...(props || {}) };
    for (const propName of propNames) {
      next[propName] = arrayProp(next[propName], componentName, propName);
    }
    return React.createElement(Component, next);
  };
  SafeComponent.displayName = `Safe${componentName}`;
  return SafeComponent;
}
