// ═══════════════════════════════════════════════════════════════════════════
// SafeIcon — drop-in for the native <Icon> that repairs bad `name` props.
//
// The platform Icon silently renders NOTHING for an invalid `name` — no
// error, no fallback, just empty space — which makes typos nearly impossible
// to debug. SafeIcon turns the silent bug loud:
//   - valid names pass straight through to the native component,
//   - known aliases (duplicate→copy, alert→warning, …) auto-repair with a
//     one-time console.warn,
//   - anything else renders a visible alert-colored xCircle placeholder with
//     screenReaderText "Invalid icon: <bad-name>".
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { Icon } from "@hubspot/ui-extensions";
import { NATIVE_ICON_NAMES, ICON_NAME_ALIASES } from "./catalogs.js";
import { warnOnce } from "./warnings.js";

export const SafeIcon = (props) => {
  const { name, ...rest } = props || {};
  if (typeof name === "string" && NATIVE_ICON_NAMES.has(name)) {
    return React.createElement(Icon, { name, ...rest });
  }
  const alias = ICON_NAME_ALIASES[name];
  if (alias && NATIVE_ICON_NAMES.has(alias)) {
    warnOnce(
      `icon-alias-${name}`,
      `[hs-uix/safe] Icon name "${name}" is not in the catalog — auto-repaired to "${alias}".`
    );
    return React.createElement(Icon, { name: alias, ...rest });
  }
  warnOnce(
    `icon-invalid-${name}`,
    `[hs-uix/safe] Icon name "${name}" is not in the catalog. Rendering a red xCircle placeholder. See NATIVE_ICON_NAMES for the valid list.`
  );
  // Spread `rest` first so the placeholder defaults (name, color,
  // screenReaderText) always win — otherwise a caller-level color prop like
  // "success" bleeds through and the placeholder renders green.
  return React.createElement(Icon, {
    ...rest,
    name: "xCircle",
    color: "alert",
    screenReaderText: `Invalid icon: ${name ?? "(missing)"}`,
  });
};
SafeIcon.displayName = "SafeIcon";
