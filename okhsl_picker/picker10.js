// ══════════════════════════════════════════════════════════════════════
// Color
// ══════════════════════════════════════════════════════════════════════

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
const _hsl = [0, 0, 0];

// ── Core color conversions ───────────────────────────────────────────

/** OKHSL → OKLab using the Display P3 gamut reference. */
export function toOKLab(h, s, lr, out = _lab) {
  OKHSLToOKLab([h * 360, s, lr], DisplayP3Gamut, out);
  return out;
}

/** sRGB [0–1] → picker's {h, s, L} descriptor. */
export function srgbToOKHSL(r, g, b) {
  convert([r, g, b], sRGB, OKLab, _lab);
  OKLabToOKHSL(_lab, DisplayP3Gamut, _hsl);
  return { h: _hsl[0] / 360, s: _hsl[1], L: toeInv(_hsl[2]) };
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
  _p3[0] = Math.max(0, _p3[0]);
  _p3[1] = Math.max(0, _p3[1]);
  _p3[2] = Math.max(0, _p3[2]);
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

// Generate a CSS linear-gradient string (display-p3) for a hue/sat column.
// `stops` color stops are evenly distributed in toe-L space (top = lr 1, bottom = 0).
// Browsers interpolate between stops on the GPU compositor — far cheaper
// than painting every pixel via canvas, especially during drag.
export function lightbarGradientCss(h, s, stops = 64) {
  const parts = [];
  for (let i = 0; i < stops; i++) {
    const t = i / (stops - 1);    // 0 at top → 1 at bottom
    const lr = 1 - t;             // top of bar = lr 1, bottom = lr 0
    convert(toOKLab(h, s, lr), OKLab, DisplayP3, _p3);
    const r = Math.max(0, _p3[0]).toFixed(4);
    const g = Math.max(0, _p3[1]).toFixed(4);
    const b = Math.max(0, _p3[2]).toFixed(4);
    parts.push(`color(display-p3 ${r} ${g} ${b}) ${(t * 100).toFixed(2)}%`);
  }
  return `linear-gradient(to bottom, ${parts.join(', ')})`;
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

// ── sRGB gamut boundary ──────────────────────────────────────────────

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

// ── Delaunay triangulation ───────────────────────────────────────────
// Bowyer-Watson algorithm. Takes an array of {x, y} points and returns
// an array of [i, j] edge index pairs.

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
    for (const tri of triangles) { if (inCircum(tri, p)) bad.push(tri); }
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
    for (const [ea, eb] of poly) triangles.push({ a: ea, b: eb, c: pi });
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

// Given a list of points, return edge index pairs connecting them. Trivial
// for ≤3 points; Delaunay for 4+.
export function meshEdgesFor(pts) {
  if (pts.length < 2) return [];
  if (pts.length === 2) return [[0, 1]];
  if (pts.length === 3) return [[0, 1], [1, 2], [0, 2]];
  return delaunay(pts);
}

// ══════════════════════════════════════════════════════════════════════
// Render
// ══════════════════════════════════════════════════════════════════════

const ns = 'http://www.w3.org/2000/svg';

// ── SVG helpers ──────────────────────────────────────────────────────

export function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

export function setAttrs(el, obj) {
  for (const [k, v] of Object.entries(obj)) el.setAttribute(k, v);
}

export const idxOf = el => parseInt(el.dataset.index);

// ══════════════════════════════════════════════════════════════════════
// createPicker(S, cfg)
// ══════════════════════════════════════════════════════════════════════

export function createPicker(S, cfg) {

  const { DISC_SIZE, DISC_LB_GAP, LB_WIDTH, LB_HEIGHT, HANDLE_R, HANDLE_SW, MIDDLE_GRAY } = cfg;
  const DISC_R       = DISC_SIZE / 2;
  const HANDLE_OUTER = HANDLE_R + HANDLE_SW / 2;

  // ── Geometry helpers ──────────────────────────────────────────────

  function handlePos(col) {
    const a = col.h * TAU;
    return {
      x: DISC_R + Math.cos(a) * col.s * DISC_R,
      y: DISC_R - Math.sin(a) * col.s * DISC_R,
    };
  }

  function yToToeL(y) { return clamp01(1 - y / LB_HEIGHT); }
  function toeLToY(tl) { return LB_HEIGHT * (1 - tl); }

  // ── Inject CSS custom properties ─────────────────────────────────
  for (const [k, v] of Object.entries({
    'disc-lb-gap': DISC_LB_GAP, 'disc-canvas': DISC_SIZE,
    'lb-width': LB_WIDTH, 'lb-height': LB_HEIGHT,
  })) document.documentElement.style.setProperty(`--${k}`, `${v}px`);

  // ── DOM lookups ──────────────────────────────────────────────────
  const wheelCanvas     = document.getElementById('wheel');
  const lightbarEl      = document.getElementById('lightbar');
  const discOverlay     = document.getElementById('disc-overlay');
  const lightbarOverlay = document.getElementById('lightbar-overlay');
  const pickerWrap      = document.querySelector('.picker-wrap');
  const swatches        = document.querySelector('.swatches');
  const plusMinusBtn    = document.getElementById('plus-minus-btn');

  // ── Canvas init ──────────────────────────────────────────────────
  function initCanvas(canvas, w, h) {
    canvas.width = w; canvas.height = h;
    canvas.style.cssText += `width:${w}px;height:${h}px;image-rendering:pixelated;`;
  }
  initCanvas(wheelCanvas, DISC_SIZE, DISC_SIZE);
  wheelCanvas.style.clipPath = `circle(${DISC_R}px at ${DISC_R}px ${DISC_R}px)`;

  // The lightbar is a div with a CSS gradient — sized to match overlay.
  lightbarEl.style.cssText += `width:${LB_WIDTH}px;height:${LB_HEIGHT}px;display:block;`;

  function initOverlay(svg, w, h) { setAttrs(svg, { width: w, height: h }); }
  initOverlay(discOverlay, DISC_SIZE, DISC_SIZE);
  initOverlay(lightbarOverlay, LB_WIDTH, LB_HEIGHT);

  function makeHitArea(parent, el) {
    el.style.pointerEvents = 'auto';
    parent.appendChild(el);
    return el;
  }
  makeHitArea(discOverlay, svgEl('circle', { cx: DISC_R, cy: DISC_R, r: DISC_R, fill: 'transparent' }));
  makeHitArea(lightbarOverlay, svgEl('rect', { x: 0, y: 0, width: LB_WIDTH, height: LB_HEIGHT, fill: 'transparent' }));

  // ── SVG overlay elements ─────────────────────────────────────────
  const GamutBoundary = svgEl('path', {
    id: 'gamut-boundary', fill: 'none', stroke: '#000', 'stroke-width': '0.5', 'stroke-linejoin': 'round',
  });
  discOverlay.appendChild(GamutBoundary);

  const discHueLine = svgEl('line', {
    fill: 'none', 'stroke-width': '1', 'stroke-opacity': '0.3', 'pointer-events': 'none', opacity: '0',
  });
  const discChromaPath = svgEl('path', {
    fill: 'none', 'stroke-width': '1', 'stroke-opacity': '0.3', 'pointer-events': 'none', opacity: '0',
  });
  discOverlay.appendChild(discHueLine);
  discOverlay.appendChild(discChromaPath);

  const discRadialGuides = svgEl('g', { 'pointer-events': 'none' });
  discOverlay.appendChild(discRadialGuides);

  // Mesh lines between multi-selected handles. Owned by the picker;
  // `updateMesh` takes the edge list and a point lookup so the picker
  // doesn't need to know about application selection state.
  const discMesh = svgEl('g', { 'pointer-events': 'none' });
  discOverlay.appendChild(discMesh);

  function updateMesh(edges, pointFor, stroke) {
    discMesh.innerHTML = '';
    if (!edges || !edges.length || !stroke) return;
    for (const [i, j] of edges) {
      const a = pointFor(i), b = pointFor(j);
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len < HANDLE_OUTER * 2) continue;
      const ux = dx / len, uy = dy / len;
      discMesh.appendChild(svgEl('line', {
        x1: (a.x + ux * HANDLE_OUTER).toFixed(2),
        y1: (a.y + uy * HANDLE_OUTER).toFixed(2),
        x2: (b.x - ux * HANDLE_OUTER).toFixed(2),
        y2: (b.y - uy * HANDLE_OUTER).toFixed(2),
        stroke,
        'stroke-width': '1',
      }));
    }
  }

  function clearMesh() { discMesh.innerHTML = ''; }

  // ── Render cache ─────────────────────────────────────────────────
  let disc_img = null, disc_L = -1;
  let lightbar_key = null;

  function invalidateCache() {
    disc_img = null; disc_L = -1;
    lightbar_key = null;
  }

  const handles = [];
  const lightHandles = [];

  // Handle markup.
  //
  // Disc handle: one <circle> with visual attrs baked in.
  //
  // Lightbar handle: two <rect> elements with geometry (x, y, width,
  // height, rx) baked in as SVG attributes so they render reliably
  // across browsers. Inner is 16×6; outer is 20×10. Both centered on
  // the origin. Visual properties (stroke, stroke-width, fill) are
  // NOT baked in — CSS owns those.
  const HANDLE_HTML = `<circle r="${HANDLE_R}" fill="transparent" stroke-width="${HANDLE_SW}" class="circle"/>`;
  const LIGHT_HANDLE_HTML =
    `<rect x="-8"  y="-3" width="16" height="6"  rx="3" class="pill pill-inner"/>` +
    `<rect x="-8"  y="-3" width="16" height="6"  rx="3" class="pill pill-outer"/>`;

  function createHandleG(parent, cls, html, index) {
    const g = document.createElementNS(ns, 'g');
    g.classList.add('handle', cls);
    g.innerHTML = html;
    g.dataset.index = index;
    parent.appendChild(g);
    return g;
  }

  function createHandle(i) {
    handles[i] = createHandleG(discOverlay, 'disc-handle', HANDLE_HTML, i);
    return handles[i];
  }

  function createLightHandle(i) {
    lightHandles[i] = createHandleG(lightbarOverlay, 'light-handle', LIGHT_HANDLE_HTML, i);
    return lightHandles[i];
  }

  function setHandleActive(el, on) { el?.classList.toggle('active', on); }

  // ── Disc drawing ─────────────────────────────────────────────────
  function drawDisc() {
    const ctx = wheelCanvas.getContext('2d', { colorSpace: 'display-p3' });
    if (S.activeIndex !== -1) S.lastActiveIndex = S.activeIndex;
    const refL = S.colors[S.lastActiveIndex]?.L ?? 0.5;
    const lr   = toe(refL);

    if (disc_L === refL && disc_img) {
      ctx.putImageData(disc_img, 0, 0);
      updateGamutBoundary(refL, lr);
      return;
    }

    const img = ctx.createImageData(DISC_SIZE, DISC_SIZE);
    renderDiscPixels(img, DISC_SIZE, lr);
    ctx.putImageData(img, 0, 0);
    disc_img = ctx.getImageData(0, 0, DISC_SIZE, DISC_SIZE);
    disc_L   = refL;
    updateGamutBoundary(refL, lr);
  }

  function updateGamutBoundary(L, lr) {
    const { stroke, opacity } = gamutBoundaryStyle(L, MIDDLE_GRAY);
    GamutBoundary.setAttribute('stroke', stroke);
    GamutBoundary.setAttribute('stroke-opacity', opacity);
    GamutBoundary.setAttribute('d', gamutBoundaryPath(lr, DISC_R));
  }

  // ── Lightbar drawing ─────────────────────────────────────────────
  // Uses a CSS gradient on a div instead of canvas pixels — the browser
  // composites it on the GPU. Skip work if (h, s) hasn't changed.
  function drawLightbar() {
    const active = S.colors[S.activeIndex !== -1 ? S.activeIndex : 0];
    const key    = `${active.h.toFixed(4)}_${active.s.toFixed(4)}`;
    if (lightbar_key === key) return;
    lightbarEl.style.background = lightbarGradientCss(active.h, active.s);
    lightbar_key = key;
  }

  // ── Guide overlays ───────────────────────────────────────────────

  function drawHueLine(col, stroke, radius = DISC_R) {
    const a = col.h * TAU;
    setAttrs(discHueLine, {
      stroke, 'stroke-linecap': 'round', 'stroke-opacity': '0.3', opacity: '1',
      x1: DISC_R, y1: DISC_R,
      x2: (DISC_R + Math.cos(a) * radius).toFixed(2),
      y2: (DISC_R - Math.sin(a) * radius).toFixed(2),
    });
  }

  function showChromaPath(targetC, lr, stroke) {
    setAttrs(discChromaPath, {
      stroke, opacity: '1',
      d: polarPath(360, h => sForChroma(h, targetC, lr) * DISC_R, DISC_R),
    });
  }

  function drawGuideForColor(col, stroke) {
    if (S.modKeys.shift && !S.modKeys.meta) {
      const a = col.h * TAU;
      discRadialGuides.appendChild(svgEl('line', {
        x1: DISC_R, y1: DISC_R,
        x2: (DISC_R + Math.cos(a) * DISC_R).toFixed(2),
        y2: (DISC_R - Math.sin(a) * DISC_R).toFixed(2),
        stroke, 'stroke-width': '1', 'pointer-events': 'none',
      }));
    }
    if (S.modKeys.meta) {
      const lr = toe(col.L);
      const targetC = getActiveChroma(col);
      discRadialGuides.appendChild(svgEl('path', {
        d: polarPath(360, h => sForChroma(h, targetC, lr) * DISC_R, DISC_R),
        fill: 'none', stroke, 'stroke-width': '1', 'pointer-events': 'none',
      }));
      if (!S.modKeys.shift) {
        const a = col.h * TAU;
        const r = Math.max(0, col.s * DISC_R - HANDLE_OUTER);
        discRadialGuides.appendChild(svgEl('line', {
          x1: DISC_R, y1: DISC_R,
          x2: (DISC_R + Math.cos(a) * r).toFixed(2),
          y2: (DISC_R - Math.sin(a) * r).toFixed(2),
          stroke, 'stroke-width': '1', 'pointer-events': 'none',
        }));
      }
    }
  }

  function updateDiscGuides() {
    discHueLine.setAttribute('opacity', '0');
    discChromaPath.setAttribute('opacity', '0');
    discRadialGuides.innerHTML = '';

    if (S.activeIndex === -1) return null;

    const guidesVisible = S.mouseInPickerWrap || S.dragging;
    if (!guidesVisible) return null;

    if (S.isMultiMode()) {
      if (S.modKeys.shift || S.modKeys.meta) {
        const refL = S.colors[S.activeIndex]?.L ?? S.colors[[...S.multiSelect][0]].L;
        const stroke = refL > MIDDLE_GRAY ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
        for (const i of S.multiSelect) drawGuideForColor(S.colors[i], stroke);

        if (S.hoveredHandle !== -1 && !S.multiSelect.has(S.hoveredHandle)) {
          const dimStroke = refL > MIDDLE_GRAY ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
          drawGuideForColor(S.colors[S.hoveredHandle], dimStroke);
        }

        if (S.modKeys.shift && S.modKeys.meta && (S.mouseInPicker || S.hueConvergeDrag?.lockedH != null)) {
          const targetH = S.hueConvergeDrag?.lockedH ?? S.mouseHueAngle;
          const a = targetH * TAU;
          setAttrs(discHueLine, {
            stroke, 'stroke-linecap': 'round', 'stroke-opacity': '1', opacity: '1',
            x1: DISC_R, y1: DISC_R,
            x2: (DISC_R + Math.cos(a) * DISC_R).toFixed(2),
            y2: (DISC_R - Math.sin(a) * DISC_R).toFixed(2),
          });
        }
      }
      return null;
    }

    const col    = S.colors[S.activeIndex];
    const stroke = col.L > MIDDLE_GRAY ? '#000' : '#fff';

    if ((S.modKeys.shift || S.modKeys.meta) && S.hoveredHandle !== -1 && S.hoveredHandle !== S.activeIndex) {
      const dimStroke = col.L > MIDDLE_GRAY ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
      drawGuideForColor(S.colors[S.hoveredHandle], dimStroke);
    }

    if (S.modKeys.shift) {
      drawHueLine(col, stroke);
      if (S.modKeys.meta) showChromaPath(getActiveChroma(col), toe(col.L), stroke);
      return null;
    }

    if (S.modKeys.meta) {
      let targetC, pathL;
      if (S.lockedChromaPath) {
        ({ targetC, L: pathL } = S.lockedChromaPath);
      } else {
        targetC = getActiveChroma(col); pathL = col.L;
      }
      showChromaPath(targetC, toe(pathL), stroke);
      drawHueLine(col, stroke, Math.max(0, col.s * DISC_R - HANDLE_OUTER));
      return { targetC, L: pathL, cx: DISC_R, cy: DISC_R };
    }

    return null;
  }

  // ── Handle positioning ───────────────────────────────────────────

  function updateAllDiscHandles() {
    S.colors.forEach((col, i) => {
      const a = col.h * TAU;
      handles[i].setAttribute('transform',
        `translate(${DISC_R + Math.cos(a) * col.s * DISC_R},${DISC_R - Math.sin(a) * col.s * DISC_R})`);
    });
  }

  function updateLightHandles() {
    S.colors.forEach((col, i) => {
      lightHandles[i].setAttribute('transform', `translate(${LB_WIDTH / 2},${LB_HEIGHT * (1 - toe(col.L))})`);
    });
  }

  function render() {
    drawDisc();
    drawLightbar();
    updateAllDiscHandles();
    updateLightHandles();
    // The .light-color class is still set on each light handle so
    // consumer CSS *may* react to it if desired. It is no longer
    // required for baseline styling, but keeping it preserves
    // backward-compatibility for rules that key off it.
    S.colors.forEach((_, i) => lightHandles[i]?.classList.toggle('light-color', S.colors[i].L > MIDDLE_GRAY));
    updateDiscGuides();
    const lightBg = S.activeIndex !== -1 && S.colors[S.activeIndex].L > MIDDLE_GRAY;
    discOverlay.classList.toggle('light-color', lightBg);
    lightbarOverlay.classList.toggle('light-color', lightBg);
  }

  return {
    DISC_R, HANDLE_OUTER,
    handlePos, yToToeL, toeLToY,
    els: { wheelCanvas, lightbarEl, discOverlay, lightbarOverlay, pickerWrap, swatches, plusMinusBtn },
    handles, lightHandles,
    render, invalidateCache, updateDiscGuides,
    createHandle, createLightHandle, setHandleActive,
    updateMesh, clearMesh,
    hideHueLine() { discHueLine.setAttribute('opacity', '0'); },
  };
}
