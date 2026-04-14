/**
 * color.js
 *
 * Pure color math, rendering pipelines, and gamut utilities.
 * No DOM access, no global state, no event handling.
 */

import {
  convert,
  OKHSLToOKLab,
  OKLabToOKHSL,
  OKLab,
  OKLCH,
  DisplayP3,
  sRGB,
  DisplayP3Gamut,
  sRGBGamut,
  gamutMapOKLCH,
  MapToL,
} from "https://esm.sh/@texel/color";

// ── Constants ────────────────────────────────────────────────────────

export const TAU = 2 * Math.PI;

// Perceptual lightness toe
const k1 = 0.206, k2 = 0.03, k3 = (1 + k1) / (1 + k2);
export function toe(L)    { return 0.5 * (k3*L - k1 + Math.sqrt((k3*L - k1)**2 + 4*k2*k3*L)); }
export function toeInv(r) { return r * (r + k1) / (k3 * (r + k2)); }

// ── Numeric helpers ──────────────────────────────────────────────────

export const clamp01 = v => Math.max(0, Math.min(1, v));
export const to255   = v => Math.round(clamp01(v) * 255);

// Logit / sigmoid for lightbar compression
export function lToRaw(toeL) {
  const p = Math.min(Math.max(toeL, 1e-6), 1 - 1e-6);
  return Math.log(p / (1 - p));
}
export function rawToL(raw) { return 1 / (1 + Math.exp(-raw)); }

// ── Scratch arrays (module-private, reused across calls) ─────────────

const _lab = [0, 0, 0];
const _lch = [0, 0, 0];
const _p3  = [0, 0, 0];
const _rgb = [0, 0, 0];

// ── Core color conversions ───────────────────────────────────────────

/** OKHSL → OKLab using the Display P3 gamut reference. */
export function toOKLab(h, s, lr, out = _lab) {
  OKHSLToOKLab([h * 360, s, lr], DisplayP3Gamut, out);
  return out;
}

export function srgbToOKHSL(r, g, b) {
  const lab = [0, 0, 0];
  convert([r, g, b], sRGB, OKLab, lab);
  const hsl = [0, 0, 0];
  OKLabToOKHSL(lab, DisplayP3Gamut, hsl);
  return { h: hsl[0] / 360, s: hsl[1], L: toeInv(hsl[2]) };
}

/** Binary-search for the OKHSL saturation that yields a given OKLCH chroma. */
export function sForChroma(h, targetC, lr) {
  convert(toOKLab(h, 1, lr), OKLab, OKLCH, _lch);
  if (_lch[1] <= targetC) return 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) * 0.5;
    convert(toOKLab(h, mid, lr), OKLab, OKLCH, _lch);
    if (_lch[1] < targetC) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}

/** Return the OKLCH chroma of a color descriptor {h, s, L}. */
export function getActiveChroma(col) {
  convert(toOKLab(col.h, col.s, toe(col.L)), OKLab, OKLCH, _lch);
  return _lch[1];
}

/** Test whether an (h, s, lr) triple falls within the sRGB gamut. */
export function inSRGB(h, s, lr) {
  convert(toOKLab(h, s, lr), OKLab, sRGB, _rgb);
  return _rgb.every(v => v >= -1e-5 && v <= 1 + 1e-5);
}

/** Hue difference in [-0.5, 0.5] range. */
export function hueDiff(a, b) { return ((a - b + 1.5) % 1) - 0.5; }

// ── Gamut-mapped output computation ──────────────────────────────────

export function computeP3AndSRGB(color) {
  toOKLab(color.h, color.s, toe(color.L));
  convert(_lab, OKLab, DisplayP3, _p3);
  const p3Css = `color(display-p3 ${_p3[0].toFixed(4)} ${_p3[1].toFixed(4)} ${_p3[2].toFixed(4)})`;
  const p3Str = `${_p3[0].toFixed(3)} ${_p3[1].toFixed(3)} ${_p3[2].toFixed(3)}`;
  convert(_lab, OKLab, sRGB, _rgb);
  const outOfSRGB = _rgb.some(v => v < -1e-4 || v > 1 + 1e-4);
  convert(_lab, OKLab, OKLCH, _lch);
  gamutMapOKLCH(_lch, sRGBGamut, sRGB, _rgb, MapToL);
  const hex = '#' + _rgb.map(v => to255(v).toString(16).padStart(2, '0').toUpperCase()).join('');
  const srgbCss = outOfSRGB
    ? hex
    : `color(srgb ${clamp01(_rgb[0]).toFixed(4)} ${clamp01(_rgb[1]).toFixed(4)} ${clamp01(_rgb[2]).toFixed(4)})`;
  return { p3Str, p3Css, srgbCss, hex, outOfSRGB };
}

// ── SVG polar-path builder ───────────────────────────────────────────

export function polarPath(steps, radiusFn, discR) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const h = i / steps, a = h * TAU, r = radiusFn(h);
    pts.push(`${i === 0 ? 'M' : 'L'} ${(discR + Math.cos(a) * r).toFixed(2)} ${(discR - Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(' ') + ' Z';
}

// ── Disc pixel rendering ─────────────────────────────────────────────

export function renderDiscPixels(imageData, discSize, lr) {
  const d = imageData.data;
  const discR = discSize / 2;
  for (let y = 0; y < discSize; y++) {
    for (let x = 0; x < discSize; x++) {
      const dx = x - discR, dy = y - discR;
      const h  = (Math.atan2(-dy, dx) / TAU + 1) % 1;
      const s  = Math.min(1, Math.sqrt(dx * dx + dy * dy) / discR);
      convert(toOKLab(h, s, lr), OKLab, DisplayP3, _p3);
      const idx = (y * discSize + x) * 4;
      d[idx]     = to255(_p3[0]);
      d[idx + 1] = to255(_p3[1]);
      d[idx + 2] = to255(_p3[2]);
      d[idx + 3] = 255;
    }
  }
}

// ── Lightbar pixel rendering ─────────────────────────────────────────

export function renderLightbarPixels(imageData, lbWidth, lbHeight, h, s) {
  const d = imageData.data;
  for (let y = 0; y < lbHeight; y++) {
    convert(toOKLab(h, s, 1 - y / lbHeight), OKLab, DisplayP3, _p3);
    const base = y * lbWidth * 4;
    for (let x = 0; x < lbWidth; x++) {
      const idx = base + x * 4;
      d[idx]     = to255(_p3[0]);
      d[idx + 1] = to255(_p3[1]);
      d[idx + 2] = to255(_p3[2]);
      d[idx + 3] = 255;
    }
  }
}

// ── sRGB gamut boundary path ─────────────────────────────────────────

export function gamutBoundaryPath(lr, discR) {
  return polarPath(359, h => {
    let lo = 0, hi = 1;
    for (let it = 0; it < 25; it++) {
      const m = (lo + hi) * 0.5;
      if (inSRGB(h, m, lr)) lo = m; else hi = m;
    }
    return hi * discR;
  }, discR);
}

export function gamutBoundaryStyle(L, middleGray) {
  const stroke = L > middleGray ? '#000' : '#fff';
  const BASE = 0.5, MIN_HI = 0.1, MIN_LO = 0.17, EDGE = 0.5;
  let opacity = BASE;
  if (L < EDGE)       opacity = MIN_LO + (BASE - MIN_LO) * (L / EDGE);
  else if (L > 1 - EDGE) opacity = MIN_HI + (BASE - MIN_HI) * ((1 - L) / EDGE);
  return { stroke, opacity: opacity.toFixed(3) };
}

// ── Background lightness → P3 CSS ────────────────────────────────────

export function neutralP3(L) {
  _lab[0] = L; _lab[1] = 0; _lab[2] = 0;
  convert(_lab, OKLab, DisplayP3, _p3);
  return `color(display-p3 ${_p3[0]} ${_p3[1]} ${_p3[2]})`;
}

// ── Delaunay triangulation (Bowyer-Watson) ───────────────────────────

export function delaunay(pts) {
  const M = 1e4;
  const superTri = [{ x: -M, y: -M }, { x: M * 3, y: -M }, { x: -M, y: M * 3 }];
  let triangles = [{ a: 0, b: 1, c: 2 }];
  const allPts = [...superTri, ...pts];

  function inCircum(tri, p) {
    const a = allPts[tri.a], b = allPts[tri.b], c = allPts[tri.c];
    const ax = a.x - p.x, ay = a.y - p.y, al = ax * ax + ay * ay;
    const bx = b.x - p.x, by = b.y - p.y, bl = bx * bx + by * by;
    const cx = c.x - p.x, cy = c.y - p.y, cl = cx * cx + cy * cy;
    const det = ax * (by * cl - cy * bl) - ay * (bx * cl - cx * bl) + al * (bx * cy - cx * by);
    const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    return cross > 0 ? det > 0 : det < 0;
  }

  for (let pi = 3; pi < allPts.length; pi++) {
    const p = allPts[pi];
    const bad = [], poly = [];

    for (const tri of triangles) {
      if (inCircum(tri, p)) bad.push(tri);
    }

    for (const tri of bad) {
      const edges = [[tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]];
      for (const [ea, eb] of edges) {
        const shared = bad.some(other =>
          other !== tri &&
          (other.a === ea || other.b === ea || other.c === ea) &&
          (other.a === eb || other.b === eb || other.c === eb)
        );
        if (!shared) poly.push([ea, eb]);
      }
    }

    triangles = triangles.filter(t => !bad.includes(t));
    for (const [ea, eb] of poly) {
      triangles.push({ a: ea, b: eb, c: pi });
    }
  }

  const edgeSet = new Set();
  for (const tri of triangles) {
    if (tri.a < 3 || tri.b < 3 || tri.c < 3) continue;
    const a = tri.a - 3, b = tri.b - 3, c = tri.c - 3;
    edgeSet.add(a < b ? `${a},${b}` : `${b},${a}`);
    edgeSet.add(b < c ? `${b},${c}` : `${c},${b}`);
    edgeSet.add(a < c ? `${a},${c}` : `${c},${a}`);
  }
  return [...edgeSet].map(e => e.split(',').map(Number));
}
