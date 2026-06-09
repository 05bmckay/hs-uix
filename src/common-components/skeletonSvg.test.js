import { describe, it, expect } from "vitest";
import { makeSkeletonDataUri, SKELETON_WIDTH_TOKENS } from "./skeletonSvg.js";
import { SKELETON_FILL } from "./svgDefaults.js";

const decode = (src) => decodeURIComponent(src.replace(/^data:image\/svg\+xml;utf8,/, ""));
const countRects = (svg) => (svg.match(/<rect /g) || []).length;

describe("makeSkeletonDataUri — data URI shape", () => {
  it("returns an encodeURIComponent'd data:image/svg+xml URI", () => {
    const { src } = makeSkeletonDataUri();
    expect(src.startsWith("data:image/svg+xml")).toBe(true);
    // Encoded: no raw angle brackets after the prefix…
    expect(src).not.toMatch(/</);
    // …but the decoded payload is a real SVG document.
    expect(decode(src)).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  });

  it("uses SKELETON_FILL by default and honors a custom fill", () => {
    expect(decode(makeSkeletonDataUri().src)).toContain(`fill="${SKELETON_FILL}"`);
    expect(decode(makeSkeletonDataUri({ fill: "#ABCDEF" }).src)).toContain('fill="#ABCDEF"');
  });
});

describe("makeSkeletonDataUri — width tokens", () => {
  it("maps sm/md/lg to 120/240/360", () => {
    expect(SKELETON_WIDTH_TOKENS).toEqual({ sm: 120, md: 240, lg: 360 });
    expect(makeSkeletonDataUri({ width: "sm" }).width).toBe(120);
    expect(makeSkeletonDataUri({ width: "md" }).width).toBe(240);
    expect(makeSkeletonDataUri({ width: "lg" }).width).toBe(360);
  });

  it("accepts pixel numbers and falls back to md for junk", () => {
    expect(makeSkeletonDataUri({ width: 87 }).width).toBe(87);
    expect(makeSkeletonDataUri({ width: "xl" }).width).toBe(240);
    expect(makeSkeletonDataUri({ width: -5 }).width).toBe(240);
    expect(makeSkeletonDataUri({}).width).toBe(240);
  });
});

describe("makeSkeletonDataUri — text variant", () => {
  it("renders one full-width line by default", () => {
    const { src, width, height } = makeSkeletonDataUri({ variant: "text" });
    const svg = decode(src);
    expect(countRects(svg)).toBe(1);
    expect(width).toBe(240);
    expect(height).toBe(12); // default line height, no gaps
    expect(svg).toContain(`width="${width}" height="${height}"`);
  });

  it("stacks N lines with gaps and sizes the canvas to match", () => {
    const { src, height } = makeSkeletonDataUri({ variant: "text", lines: 4, height: 10, gap: 6 });
    expect(countRects(decode(src))).toBe(4);
    expect(height).toBe(4 * 10 + 3 * 6); // 58
  });

  it("shortens the last line to the default 0.6 fraction when lines > 1", () => {
    const svg = decode(makeSkeletonDataUri({ variant: "text", lines: 2, width: 200 }).src);
    expect(svg).toContain('width="200" height="12"'); // first line, full width
    expect(svg).toContain('width="120" height="12"'); // last line, 0.6 × 200
  });

  it("treats lastLineWidth ≤ 1 as a fraction and > 1 as px", () => {
    const fraction = decode(
      makeSkeletonDataUri({ variant: "text", lines: 2, width: 200, lastLineWidth: 0.25 }).src
    );
    expect(fraction).toContain('width="50" height="12"');

    const pixels = decode(
      makeSkeletonDataUri({ variant: "text", lines: 2, width: 200, lastLineWidth: 90 }).src
    );
    expect(pixels).toContain('width="90" height="12"');
  });

  it("clamps a px lastLineWidth to the full width and ignores it for single lines", () => {
    const clamped = decode(
      makeSkeletonDataUri({ variant: "text", lines: 2, width: 100, lastLineWidth: 500 }).src
    );
    expect(clamped).not.toContain('width="500"');

    const single = decode(
      makeSkeletonDataUri({ variant: "text", lines: 1, width: 100, lastLineWidth: 0.5 }).src
    );
    expect(single).toContain('width="100" height="12"');
    expect(single).not.toContain('width="50"');
  });

  it("applies the default 3px radius and honors radius: 0", () => {
    expect(decode(makeSkeletonDataUri({ variant: "text" }).src)).toContain('rx="3"');
    expect(decode(makeSkeletonDataUri({ variant: "text", radius: 0 }).src)).toContain('rx="0"');
  });
});

describe("makeSkeletonDataUri — box variant", () => {
  it("renders a single rect at the requested dimensions", () => {
    const { src, width, height } = makeSkeletonDataUri({ variant: "box", width: 300, height: 80 });
    const svg = decode(src);
    expect(countRects(svg)).toBe(1);
    expect(width).toBe(300);
    expect(height).toBe(80);
    expect(svg).toContain('width="300" height="80"');
  });

  it("defaults to md width × 96 height", () => {
    const { width, height } = makeSkeletonDataUri({ variant: "box" });
    expect(width).toBe(240);
    expect(height).toBe(96);
  });

  it("splits into N equal cells when columns is set (SkeletonTable rows)", () => {
    const { src, width } = makeSkeletonDataUri({
      variant: "box",
      width: 360,
      height: 16,
      columns: 3,
      columnGap: 20,
    });
    const svg = decode(src);
    expect(countRects(svg)).toBe(3);
    expect(width).toBe(360);
    // cellW = (360 − 2×20) / 3
    const cellW = (360 - 2 * 20) / 3;
    expect(svg).toContain(`x="0" y="0" width="${cellW}"`);
    expect(svg).toContain(`x="${cellW + 20}" y="0"`);
    expect(svg).toContain(`x="${2 * (cellW + 20)}" y="0"`);
  });
});

describe("makeSkeletonDataUri — circle variant", () => {
  it("renders a circle sized by height (diameter), square canvas", () => {
    const { src, width, height } = makeSkeletonDataUri({ variant: "circle", height: 48 });
    const svg = decode(src);
    expect(width).toBe(48);
    expect(height).toBe(48);
    expect(svg).toContain('<circle cx="24" cy="24" r="24"');
  });

  it("falls back to width (incl. tokens), then to the 40px default", () => {
    expect(makeSkeletonDataUri({ variant: "circle", width: 32 }).width).toBe(32);
    expect(makeSkeletonDataUri({ variant: "circle", width: "sm" }).width).toBe(120);
    const dflt = makeSkeletonDataUri({ variant: "circle" });
    expect(dflt.width).toBe(40);
    expect(dflt.height).toBe(40);
  });
});
