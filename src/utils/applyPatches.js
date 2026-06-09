// ═══════════════════════════════════════════════════════════════════════════
// applyPatches — RFC 6902 JSON Patch applier, minimal subset.
//
// Supported ops: add, replace, remove, move, copy. Anything else (including
// `test`) is skipped with a console warning.
//
// Returns a NEW document (structural sharing where safe). Never mutates the
// input — callers can rely on reference equality to detect what changed,
// which is what makes this useful for streaming UIs: feed each patch batch
// through and re-render only what actually moved.
//
// Intentionally permissive where RFC 6902 is strict: if a path prefix is
// missing, `add`/`replace` create it (objects by default, arrays when the
// next segment looks like an index). That makes the applier robust for
// streaming/partial-document flows where a patch for `/a/b` can arrive
// before the patch that created `/a`.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @param {any} doc  the document to patch (never mutated; `null`/`undefined`
 *                   starts from `{}` when there are patches to apply)
 * @param {Array<{op: string, path: string, from?: string, value?: any}>} patches
 * @returns {any} a new document with every patch applied in order
 */
export function applyPatches(doc, patches) {
  if (!patches || patches.length === 0) return doc;
  let out = doc ?? {};
  for (const op of patches) {
    out = applyOne(out, op);
  }
  return out;
}

function applyOne(doc, op) {
  const path = parsePointer(op.path);
  switch (op.op) {
    case "add":
    case "replace":
      return setAt(doc, path, op.value);
    case "remove":
      return removeAt(doc, path);
    case "move": {
      const from = parsePointer(op.from);
      const value = getAt(doc, from);
      const removed = removeAt(doc, from);
      return setAt(removed, path, value);
    }
    case "copy": {
      const from = parsePointer(op.from);
      const value = getAt(doc, from);
      return setAt(doc, path, deepClone(value));
    }
    default:
      console.warn("[hs-uix] applyPatches: ignoring unsupported op:", op.op);
      return doc;
  }
}

// ---------------------------------------------------------------------------

function parsePointer(pointer) {
  if (!pointer || pointer === "/") return [];
  if (pointer[0] !== "/") {
    throw new Error(`invalid JSON Pointer (must start with /): ${pointer}`);
  }
  // Split on "/", then unescape each segment.
  return pointer
    .slice(1)
    .split("/")
    .map((seg) => seg.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function getAt(obj, segs) {
  let cur = obj;
  for (const seg of segs) {
    if (cur == null) return undefined;
    cur = Array.isArray(cur) ? cur[Number(seg)] : cur[seg];
  }
  return cur;
}

function setAt(obj, segs, value) {
  if (segs.length === 0) return value;
  const [head, ...rest] = segs;
  const isArray = Array.isArray(obj);
  if (isArray) {
    const next = obj.slice();
    const idx = head === "-" ? next.length : Number(head);
    const existing = idx >= 0 && idx < next.length ? next[idx] : undefined;
    const child = setAt(existing ?? {}, rest, value);
    if (rest.length === 0) {
      // Insert (for "-") vs replace.
      if (head === "-") next.push(value);
      else next[idx] = value;
    } else {
      next[idx] = child;
    }
    return next;
  }
  // Object
  const base = obj && typeof obj === "object" ? obj : {};
  if (rest.length === 0) {
    return { ...base, [head]: value };
  }
  const existing = base[head];
  const child = setAt(existing ?? (looksLikeArrayIndex(rest[0]) ? [] : {}), rest, value);
  return { ...base, [head]: child };
}

function removeAt(obj, segs) {
  if (segs.length === 0) return undefined;
  const [head, ...rest] = segs;
  if (Array.isArray(obj)) {
    const next = obj.slice();
    const idx = Number(head);
    if (rest.length === 0) {
      next.splice(idx, 1);
    } else {
      next[idx] = removeAt(next[idx], rest);
    }
    return next;
  }
  if (!obj || typeof obj !== "object") return obj;
  if (rest.length === 0) {
    const next = { ...obj };
    delete next[head];
    return next;
  }
  if (!(head in obj)) return obj;
  return { ...obj, [head]: removeAt(obj[head], rest) };
}

function looksLikeArrayIndex(seg) {
  return seg === "-" || /^\d+$/.test(seg);
}

function deepClone(v) {
  // Fine for JSON-shaped documents — no Date/Map/Set etc.
  return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
}
