// ═══════════════════════════════════════════════════════════════════════════
// warnOnce — one console.warn per unique key per session.
//
// Every safe wrapper repairs props on EVERY render, so without dedup a single
// bad icon name in a 50-row table would flood the console. One warning per
// distinct problem is loud enough to get fixed and quiet enough to ignore.
// ═══════════════════════════════════════════════════════════════════════════

const warned = new Set();

export function warnOnce(key, message) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

/** Clear the warn-once memory — for tests or long-lived sessions. */
export function resetSafeWarnings() {
  warned.clear();
}
