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
// before the patch that created `/a`. Invalid array indices on `remove` are
// a safe no-op (same spirit as removing a missing object key).
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
      return setAt(doc, path, op.value, true);
    case "replace":
      return setAt(doc, path, op.value, false);
    case "remove":
      return removeAt(doc, path);
    case "move": {
      // RFC 6902: move = remove from `from`, then ADD at `path`.
      const from = parsePointer(op.from);
      const value = getAt(doc, from);
      const removed = removeAt(doc, from);
      return setAt(removed, path, value, true);
    }
    case "copy": {
      const from = parsePointer(op.from);
      const value = getAt(doc, from);
      return setAt(doc, path, deepClone(value), true);
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
    if (Array.isArray(cur)) {
      cur = cur[Number(seg)];
    } else if (typeof cur === "object") {
      // Own properties only — JSON documents have no inherited keys, and
      // resolving "/constructor" etc. through the prototype chain would leak
      // non-JSON values (functions) into the document via move/copy.
      cur = Object.prototype.hasOwnProperty.call(cur, seg) ? cur[seg] : undefined;
    } else {
      return undefined;
    }
  }
  return cur;
}

// `insert` = RFC `add` semantics: at an existing array index, splice the value
// in (shifting the rest right) instead of overwriting. `replace` overwrites.
function setAt(obj, segs, value, insert) {
  if (segs.length === 0) return value;
  const [head, ...rest] = segs;
  if (Array.isArray(obj)) {
    const next = obj.slice();
    const idx = head === "-" ? next.length : Number(head);
    if (rest.length === 0) {
      if (head === "-") {
        next.push(value);
      } else if (insert && Number.isInteger(idx) && idx >= 0 && idx <= next.length) {
        next.splice(idx, 0, value);
      } else {
        next[idx] = value;
      }
      return next;
    }
    const existing = idx >= 0 && idx < next.length ? next[idx] : undefined;
    next[idx] = setAt(
      existing ?? (looksLikeArrayIndex(rest[0]) ? [] : {}),
      rest,
      value,
      insert
    );
    return next;
  }
  // Object
  const base = obj && typeof obj === "object" ? obj : {};
  if (rest.length === 0) {
    return { ...base, [head]: value };
  }
  const existing = base[head];
  const child = setAt(
    existing ?? (looksLikeArrayIndex(rest[0]) ? [] : {}),
    rest,
    value,
    insert
  );
  return { ...base, [head]: child };
}

function removeAt(obj, segs) {
  if (segs.length === 0) return undefined;
  const [head, ...rest] = segs;
  if (Array.isArray(obj)) {
    const idx = Number(head);
    // Invalid or out-of-range index → safe no-op. (Without the guard,
    // Number("-")/Number("foo") are NaN and splice(NaN, 1) silently deletes
    // index 0.)
    if (!Number.isInteger(idx) || idx < 0 || idx >= obj.length) return obj;
    const next = obj.slice();
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
  // Fine for JSON-shaped documents — no Date/Map/Set etc. Non-JSON values
  // (functions, undefined) clone to undefined instead of crashing the batch.
  const json = v === undefined ? undefined : JSON.stringify(v);
  return json === undefined ? undefined : JSON.parse(json);
}
