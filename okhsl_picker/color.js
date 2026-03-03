/**
 * color.js
 *
 * Pure color math, rendering pipelines, and gamut utilities.
 * No DOM access, no global state, no event handling.
 *
 * Call window.initColorEngine(TexelColor) to initialize.
 * Exposes window.ColorEngine.
 */

window.initColorEngine = function (TC) {
  var {
    convert, OKHSLToOKLab,
    OKLab, OKLCH, DisplayP3, sRGB,
    DisplayP3Gamut, sRGBGamut,
    gamutMapOKLCH, MapToL,
  } = TC;

  // ── Constants ────────────────────────────────────────────────────────

  const TAU = 2 * Math.PI;

  // Perceptual lightness toe
  const k1 = 0.206, k2 = 0.03, k3 = (1 + k1) / (1 + k2);
  function toe(L)    { return 0.5 * (k3*L - k1 + Math.sqrt((k3*L - k1)**2 + 4*k2*k3*L)); }
  function toeInv(r) { return r * (r + k1) / (k3 * (r + k2)); }

  // ── Numeric helpers ──────────────────────────────────────────────────

  const clamp01 = v => Math.max(0, Math.min(1, v));
  const to255   = v => Math.round(clamp01(v) * 255);

  // Logit / sigmoid for lightbar compression
  function lToRaw(toeL) {
    const p = Math.min(Math.max(toeL, 1e-6), 1 - 1e-6);
    return Math.log(p / (1 - p));
  }
  function rawToL(raw) { return 1 / (1 + Math.exp(-raw)); }

  // ── Scratch arrays (private, reused across calls) ──────────────────

  const _lab = [0, 0, 0];
  const _lch = [0, 0, 0];
  const _p3  = [0, 0, 0];
  const _rgb = [0, 0, 0];

  // ── Core color conversions ─────────────────────────────────────────

  function toOKLab(h, s, lr, out) {
    out = out || _lab;
    OKHSLToOKLab([h * 360, s, lr], DisplayP3Gamut, out);
    return out;
  }

  function sForChroma(h, targetC, lr) {
    convert(toOKLab(h, 1, lr), OKLab, OKLCH, _lch);
    if (_lch[1] <= targetC) return 1;
    var lo = 0, hi = 1;
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) * 0.5;
      convert(toOKLab(h, mid, lr), OKLab, OKLCH, _lch);
      if (_lch[1] < targetC) lo = mid; else hi = mid;
    }
    return (lo + hi) * 0.5;
  }

  function getActiveChroma(col) {
    convert(toOKLab(col.h, col.s, toe(col.L)), OKLab, OKLCH, _lch);
    return _lch[1];
  }

  function inSRGB(h, s, lr) {
    convert(toOKLab(h, s, lr), OKLab, sRGB, _rgb);
    return _rgb.every(function (v) { return v >= -1e-5 && v <= 1 + 1e-5; });
  }

  function hueDiff(a, b) { return ((a - b + 1.5) % 1) - 0.5; }

  // ── Gamut-mapped output computation ────────────────────────────────

  function computeP3AndSRGB(color) {
    toOKLab(color.h, color.s, toe(color.L));
    convert(_lab, OKLab, DisplayP3, _p3);
    var p3Css = 'color(display-p3 ' + _p3[0].toFixed(4) + ' ' + _p3[1].toFixed(4) + ' ' + _p3[2].toFixed(4) + ')';
    var p3Str = _p3[0].toFixed(3) + ' ' + _p3[1].toFixed(3) + ' ' + _p3[2].toFixed(3);
    convert(_lab, OKLab, sRGB, _rgb);
    var outOfSRGB = _rgb.some(function (v) { return v < -1e-4 || v > 1 + 1e-4; });
    convert(_lab, OKLab, OKLCH, _lch);
    gamutMapOKLCH(_lch, sRGBGamut, sRGB, _rgb, MapToL);
    var hex = '#' + _rgb.map(function (v) { return to255(v).toString(16).padStart(2, '0').toUpperCase(); }).join('');
    var srgbCss = outOfSRGB
      ? hex
      : 'color(srgb ' + clamp01(_rgb[0]).toFixed(4) + ' ' + clamp01(_rgb[1]).toFixed(4) + ' ' + clamp01(_rgb[2]).toFixed(4) + ')';
    return { p3Str: p3Str, p3Css: p3Css, srgbCss: srgbCss, hex: hex, outOfSRGB: outOfSRGB };
  }

  // ── SVG polar-path builder ─────────────────────────────────────────

  function polarPath(steps, radiusFn, discR) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var h = i / steps, a = h * TAU, r = radiusFn(h);
      pts.push((i === 0 ? 'M' : 'L') + ' ' + (discR + Math.cos(a) * r).toFixed(2) + ' ' + (discR - Math.sin(a) * r).toFixed(2));
    }
    return pts.join(' ') + ' Z';
  }

  // ── Disc pixel rendering ───────────────────────────────────────────

  function renderDiscPixels(imageData, discSize, lr) {
    var d = imageData.data;
    var discR = discSize / 2;
    for (var y = 0; y < discSize; y++) {
      for (var x = 0; x < discSize; x++) {
        var dx = x - discR, dy = y - discR;
        var h  = (Math.atan2(-dy, dx) / TAU + 1) % 1;
        var s  = Math.min(1, Math.sqrt(dx * dx + dy * dy) / discR);
        convert(toOKLab(h, s, lr), OKLab, DisplayP3, _p3);
        var idx = (y * discSize + x) * 4;
        d[idx]     = to255(_p3[0]);
        d[idx + 1] = to255(_p3[1]);
        d[idx + 2] = to255(_p3[2]);
        d[idx + 3] = 255;
      }
    }
  }

  // ── Lightbar pixel rendering ───────────────────────────────────────

  function renderLightbarPixels(imageData, lbWidth, lbHeight, h, s) {
    var d = imageData.data;
    for (var y = 0; y < lbHeight; y++) {
      convert(toOKLab(h, s, 1 - y / lbHeight), OKLab, DisplayP3, _p3);
      var base = y * lbWidth * 4;
      for (var x = 0; x < lbWidth; x++) {
        var idx = base + x * 4;
        d[idx]     = to255(_p3[0]);
        d[idx + 1] = to255(_p3[1]);
        d[idx + 2] = to255(_p3[2]);
        d[idx + 3] = 255;
      }
    }
  }

  // ── sRGB gamut boundary ────────────────────────────────────────────

  function gamutBoundaryPath(lr, discR) {
    return polarPath(359, function (h) {
      var lo = 0, hi = 1;
      for (var it = 0; it < 25; it++) {
        var m = (lo + hi) * 0.5;
        if (inSRGB(h, m, lr)) lo = m; else hi = m;
      }
      return hi * discR;
    }, discR);
  }

  function gamutBoundaryStyle(L, middleGray) {
    var stroke = L > middleGray ? '#000' : '#fff';
    var BASE = 0.5, MIN_HI = 0.1, MIN_LO = 0.17, EDGE = 0.5;
    var opacity = BASE;
    if (L < EDGE)       opacity = MIN_LO + (BASE - MIN_LO) * (L / EDGE);
    else if (L > 1 - EDGE) opacity = MIN_HI + (BASE - MIN_HI) * ((1 - L) / EDGE);
    return { stroke: stroke, opacity: opacity.toFixed(3) };
  }

  // ── Background lightness → P3 CSS ──────────────────────────────────

  function neutralP3(L) {
    _lab[0] = L; _lab[1] = 0; _lab[2] = 0;
    convert(_lab, OKLab, DisplayP3, _p3);
    return 'color(display-p3 ' + _p3[0] + ' ' + _p3[1] + ' ' + _p3[2] + ')';
  }

  // ── Delaunay triangulation (Bowyer-Watson) ─────────────────────────

  function delaunay(pts) {
    var M = 1e4;
    var superTri = [{ x: -M, y: -M }, { x: M * 3, y: -M }, { x: -M, y: M * 3 }];
    var triangles = [{ a: 0, b: 1, c: 2 }];
    var allPts = superTri.concat(pts);

    function inCircum(tri, p) {
      var a = allPts[tri.a], b = allPts[tri.b], c = allPts[tri.c];
      var ax = a.x - p.x, ay = a.y - p.y, al = ax*ax + ay*ay;
      var bx = b.x - p.x, by = b.y - p.y, bl = bx*bx + by*by;
      var cx = c.x - p.x, cy = c.y - p.y, cl = cx*cx + cy*cy;
      var det = ax * (by*cl - cy*bl) - ay * (bx*cl - cx*bl) + al * (bx*cy - cx*by);
      var cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      return cross > 0 ? det > 0 : det < 0;
    }

    for (var pi = 3; pi < allPts.length; pi++) {
      var p = allPts[pi];
      var bad = [], poly = [];

      for (var ti = 0; ti < triangles.length; ti++) {
        if (inCircum(triangles[ti], p)) bad.push(triangles[ti]);
      }

      for (var bi = 0; bi < bad.length; bi++) {
        var tri = bad[bi];
        var edges = [[tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]];
        for (var ei = 0; ei < edges.length; ei++) {
          var ea = edges[ei][0], eb = edges[ei][1];
          var shared = bad.some(function (other) {
            return other !== tri &&
              (other.a === ea || other.b === ea || other.c === ea) &&
              (other.a === eb || other.b === eb || other.c === eb);
          });
          if (!shared) poly.push([ea, eb]);
        }
      }

      triangles = triangles.filter(function (t) { return bad.indexOf(t) === -1; });
      for (var pe = 0; pe < poly.length; pe++) {
        triangles.push({ a: poly[pe][0], b: poly[pe][1], c: pi });
      }
    }

    var edgeSet = new Set();
    for (var fi = 0; fi < triangles.length; fi++) {
      var t = triangles[fi];
      if (t.a < 3 || t.b < 3 || t.c < 3) continue;
      var a = t.a - 3, b = t.b - 3, c = t.c - 3;
      edgeSet.add(a < b ? a+','+b : b+','+a);
      edgeSet.add(b < c ? b+','+c : c+','+b);
      edgeSet.add(a < c ? a+','+c : c+','+a);
    }
    return Array.from(edgeSet).map(function (e) { return e.split(',').map(Number); });
  }

  // ── Public API ─────────────────────────────────────────────────────

  window.ColorEngine = {
    TAU: TAU,
    toe: toe,
    toeInv: toeInv,
    clamp01: clamp01,
    to255: to255,
    lToRaw: lToRaw,
    rawToL: rawToL,
    toOKLab: toOKLab,
    sForChroma: sForChroma,
    getActiveChroma: getActiveChroma,
    inSRGB: inSRGB,
    hueDiff: hueDiff,
    computeP3AndSRGB: computeP3AndSRGB,
    polarPath: polarPath,
    renderDiscPixels: renderDiscPixels,
    renderLightbarPixels: renderLightbarPixels,
    gamutBoundaryPath: gamutBoundaryPath,
    gamutBoundaryStyle: gamutBoundaryStyle,
    neutralP3: neutralP3,
    delaunay: delaunay,
  };
};
