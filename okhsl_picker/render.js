/**
 * render.js
 *
 * Canvas drawing, SVG overlay construction, handle & swatch DOM management,
 * guide lines, mesh edges.  Reads from a shared state object (`S`) passed
 * at init time but never attaches event listeners — that's main.js's job.
 *
 * Call window.initPickerRender() after ColorEngine is ready.
 * Exposes window.PickerRender.
 */

window.initPickerRender = function () {
  var CE = window.ColorEngine;
  var TAU              = CE.TAU;
  var toe              = CE.toe;
  var clamp01          = CE.clamp01;
  var sForChroma       = CE.sForChroma;
  var getActiveChroma  = CE.getActiveChroma;
  var computeP3AndSRGB = CE.computeP3AndSRGB;
  var polarPath        = CE.polarPath;
  var renderDiscPixels     = CE.renderDiscPixels;
  var renderLightbarPixels = CE.renderLightbarPixels;
  var gamutBoundaryPath    = CE.gamutBoundaryPath;
  var gamutBoundaryStyle   = CE.gamutBoundaryStyle;
  var neutralP3        = CE.neutralP3;
  var delaunay         = CE.delaunay;

  var ns = 'http://www.w3.org/2000/svg';

  // ── SVG helpers ──────────────────────────────────────────────────

  function svgEl(tag, attrs) {
    attrs = attrs || {};
    var el = document.createElementNS(ns, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function setAttrs(el, obj) {
    for (var k in obj) el.setAttribute(k, obj[k]);
  }

  var idxOf = function (el) { return parseInt(el.dataset.index); };

  // ══════════════════════════════════════════════════════════════════
  // createPicker(S, cfg)
  // ══════════════════════════════════════════════════════════════════

  function createPicker(S, cfg) {

    var DISC_SIZE   = cfg.DISC_SIZE;
    var DISC_LB_GAP = cfg.DISC_LB_GAP;
    var LB_WIDTH    = cfg.LB_WIDTH;
    var LB_HEIGHT   = cfg.LB_HEIGHT;
    var HANDLE_R    = cfg.HANDLE_R;
    var HANDLE_SW   = cfg.HANDLE_SW;
    var MIDDLE_GRAY = cfg.MIDDLE_GRAY;
    var DISC_R       = DISC_SIZE / 2;
    var HANDLE_OUTER = HANDLE_R + HANDLE_SW / 2;

    // ── Geometry helpers ─────────────────────────────────────────

    function handlePos(col) {
      var a = col.h * TAU;
      return {
        x: DISC_R + Math.cos(a) * col.s * DISC_R,
        y: DISC_R - Math.sin(a) * col.s * DISC_R,
      };
    }

    function yToToeL(y) { return clamp01(1 - y / LB_HEIGHT); }
    function toeLToY(tl) { return LB_HEIGHT * (1 - tl); }

    // ── CSS custom properties ────────────────────────────────────
    var cssVars = {
      'disc-lb-gap': DISC_LB_GAP, 'disc-canvas': DISC_SIZE,
      'lb-width': LB_WIDTH, 'lb-height': LB_HEIGHT,
    };
    for (var k in cssVars)
      document.documentElement.style.setProperty('--' + k, cssVars[k] + 'px');

    // ── DOM lookups ──────────────────────────────────────────────
    var wheelCanvas     = document.getElementById('wheel');
    var lightbarCanvas  = document.getElementById('lightbar');
    var leftOverlay     = document.getElementById('left-overlay');
    var lightbarOverlay = document.getElementById('lightbar-overlay');
    var pickerWrap      = document.querySelector('.picker-wrap');
    var swatches        = document.querySelector('.swatches');
    var addSwatchBtn    = document.getElementById('add-swatch-btn');

    // ── Canvas init ──────────────────────────────────────────────
    function initCanvas(canvas, w, h) {
      canvas.width = w; canvas.height = h;
      canvas.style.cssText += 'width:' + w + 'px;height:' + h + 'px;image-rendering:pixelated;';
    }
    initCanvas(wheelCanvas, DISC_SIZE, DISC_SIZE);
    wheelCanvas.style.clipPath = 'circle(' + DISC_R + 'px at ' + DISC_R + 'px ' + DISC_R + 'px)';
    initCanvas(lightbarCanvas, LB_WIDTH, LB_HEIGHT);

    function initOverlay(svg, w, h) { setAttrs(svg, { width: w, height: h }); }
    initOverlay(leftOverlay, DISC_SIZE, DISC_SIZE);
    initOverlay(lightbarOverlay, LB_WIDTH, LB_HEIGHT);

    function makeHitArea(parent, el) {
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'crosshair';
      parent.appendChild(el);
      return el;
    }
    makeHitArea(leftOverlay, svgEl('circle', { cx: DISC_R, cy: DISC_R, r: DISC_R, fill: 'transparent' }));
    makeHitArea(lightbarOverlay, svgEl('rect', { x: 0, y: 0, width: LB_WIDTH, height: LB_HEIGHT, fill: 'transparent' }));

    // ── SVG overlay elements ─────────────────────────────────────
    var GamutBoundary = svgEl('path', {
      id: 'gamut-boundary', fill: 'none', stroke: '#000', 'stroke-width': '0.5', 'stroke-linejoin': 'round',
    });
    leftOverlay.appendChild(GamutBoundary);

    var discHueLine = svgEl('line', {
      fill: 'none', 'stroke-width': '1', 'stroke-opacity': '0.3', 'pointer-events': 'none', opacity: '0',
    });
    var discChromaPath = svgEl('path', {
      fill: 'none', 'stroke-width': '1', 'stroke-opacity': '0.3', 'pointer-events': 'none', opacity: '0',
    });
    leftOverlay.appendChild(discHueLine);
    leftOverlay.appendChild(discChromaPath);

    var discMesh         = svgEl('g', { 'pointer-events': 'none' });
    var discRadialGuides = svgEl('g', { 'pointer-events': 'none' });
    leftOverlay.appendChild(discMesh);
    leftOverlay.appendChild(discRadialGuides);

    // ── Render cache ─────────────────────────────────────────────
    var disc_img = null, disc_L = -1;
    var lightbar_img = null, lightbar_key = null;

    function invalidateCache() {
      disc_img = null; disc_L = -1;
      lightbar_img = null; lightbar_key = null;
    }

    // ── Handle arrays ────────────────────────────────────────────
    var handles = [];
    var lightHandles = [];

    var HANDLE_HTML       = '<circle r="' + HANDLE_R + '" fill="transparent" stroke-width="' + HANDLE_SW + '" class="circle"/>';
    var LIGHT_HANDLE_HTML = '<rect x="-8" y="-3" width="16" height="6" rx="3" fill="transparent" stroke-width="1.5" class="pill"/>';

    function createHandleG(parent, cls, html, index) {
      var g = document.createElementNS(ns, 'g');
      g.classList.add('handle', cls);
      g.innerHTML = html;
      g.dataset.index = index;
      if (index === S.activeIndex) g.classList.add('active');
      parent.appendChild(g);
      return g;
    }

    function createHandle(i) {
      handles[i] = createHandleG(leftOverlay, 'disc-handle', HANDLE_HTML, i);
      return handles[i];
    }

    function createLightHandle(i) {
      lightHandles[i] = createHandleG(lightbarOverlay, 'light-handle', LIGHT_HANDLE_HTML, i);
      return lightHandles[i];
    }

    function setHandleActive(el, on) { if (el) el.classList.toggle('active', on); }

    function reindex() {
      handles.forEach(function (h, i) { h.dataset.index = i; });
      lightHandles.forEach(function (h, i) { h.dataset.index = i; });
      swatches.querySelectorAll('.swatch-container').forEach(function (c, i) { c.dataset.index = i; });
    }

    // ── Disc drawing ─────────────────────────────────────────────
    function drawDisc() {
      var ctx = wheelCanvas.getContext('2d', { colorSpace: 'display-p3' });
      if (S.activeIndex !== -1) S.lastActiveIndex = S.activeIndex;
      var refL = S.colors[S.lastActiveIndex] ? S.colors[S.lastActiveIndex].L : 0.5;
      var lr   = toe(refL);

      if (disc_L === refL && disc_img) {
        ctx.putImageData(disc_img, 0, 0);
        updateGamutBoundary(refL, lr);
        return;
      }

      var img = ctx.createImageData(DISC_SIZE, DISC_SIZE);
      renderDiscPixels(img, DISC_SIZE, lr);
      ctx.putImageData(img, 0, 0);
      disc_img = ctx.getImageData(0, 0, DISC_SIZE, DISC_SIZE);
      disc_L   = refL;
      updateGamutBoundary(refL, lr);
    }

    function updateGamutBoundary(L, lr) {
      var style = gamutBoundaryStyle(L, MIDDLE_GRAY);
      GamutBoundary.setAttribute('stroke', style.stroke);
      GamutBoundary.setAttribute('stroke-opacity', style.opacity);
      GamutBoundary.setAttribute('d', gamutBoundaryPath(lr, DISC_R));
    }

    // ── Lightbar drawing ─────────────────────────────────────────
    function drawLightbar() {
      var ctx    = lightbarCanvas.getContext('2d', { colorSpace: 'display-p3' });
      var active = S.colors[S.activeIndex !== -1 ? S.activeIndex : 0];
      var key    = active.h.toFixed(4) + '_' + active.s.toFixed(4);

      if (lightbar_img && lightbar_key === key) {
        ctx.putImageData(lightbar_img, 0, 0);
        return;
      }

      var img = ctx.createImageData(LB_WIDTH, LB_HEIGHT);
      renderLightbarPixels(img, LB_WIDTH, LB_HEIGHT, active.h, active.s);
      ctx.putImageData(img, 0, 0);
      lightbar_img = ctx.getImageData(0, 0, LB_WIDTH, LB_HEIGHT);
      lightbar_key = key;
    }

    // ── Guide overlays ───────────────────────────────────────────

    function drawHueLine(col, stroke, radius) {
      if (radius === undefined) radius = DISC_R;
      var a = col.h * TAU;
      setAttrs(discHueLine, {
        stroke: stroke, 'stroke-linecap': 'round', 'stroke-opacity': '0.3', opacity: '1',
        x1: DISC_R, y1: DISC_R,
        x2: (DISC_R + Math.cos(a) * radius).toFixed(2),
        y2: (DISC_R - Math.sin(a) * radius).toFixed(2),
      });
    }

    function showChromaPath(targetC, lr, stroke) {
      setAttrs(discChromaPath, {
        stroke: stroke, opacity: '1',
        d: polarPath(360, function (h) { return sForChroma(h, targetC, lr) * DISC_R; }, DISC_R),
      });
    }

    function drawGuideForColor(col, stroke) {
      if (S.modKeys.shift && !S.modKeys.meta) {
        var a = col.h * TAU;
        discRadialGuides.appendChild(svgEl('line', {
          x1: DISC_R, y1: DISC_R,
          x2: (DISC_R + Math.cos(a) * DISC_R).toFixed(2),
          y2: (DISC_R - Math.sin(a) * DISC_R).toFixed(2),
          stroke: stroke, 'stroke-width': '1', 'pointer-events': 'none',
        }));
      }
      if (S.modKeys.meta) {
        var lr = toe(col.L);
        var targetC = getActiveChroma(col);
        discRadialGuides.appendChild(svgEl('path', {
          d: polarPath(360, function (h) { return sForChroma(h, targetC, lr) * DISC_R; }, DISC_R),
          fill: 'none', stroke: stroke, 'stroke-width': '1', 'pointer-events': 'none',
        }));
        if (!S.modKeys.shift) {
          var a2 = col.h * TAU;
          var r = Math.max(0, col.s * DISC_R - HANDLE_OUTER);
          discRadialGuides.appendChild(svgEl('line', {
            x1: DISC_R, y1: DISC_R,
            x2: (DISC_R + Math.cos(a2) * r).toFixed(2),
            y2: (DISC_R - Math.sin(a2) * r).toFixed(2),
            stroke: stroke, 'stroke-width': '1', 'pointer-events': 'none',
          }));
        }
      }
    }

    function updateDiscGuides() {
      discHueLine.setAttribute('opacity', '0');
      discChromaPath.setAttribute('opacity', '0');

      if (S.activeIndex === -1) return null;

      if (S.isMultiMode()) {
        discRadialGuides.innerHTML = '';
        if (S.modKeys.shift || S.modKeys.meta) {
          var refL = S.colors[S.activeIndex] ? S.colors[S.activeIndex].L : S.colors[Array.from(S.multiSelect)[0]].L;
          var stroke = refL > MIDDLE_GRAY ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
          S.multiSelect.forEach(function (i) { drawGuideForColor(S.colors[i], stroke); });

          if (S.hoveredHandle !== -1 && !S.multiSelect.has(S.hoveredHandle)) {
            var dimStroke = refL > MIDDLE_GRAY ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
            drawGuideForColor(S.colors[S.hoveredHandle], dimStroke);
          }

          if (S.modKeys.shift && S.modKeys.meta && (S.mouseInPicker || (S.hueConvergeDrag && S.hueConvergeDrag.lockedH != null))) {
            var targetH = (S.hueConvergeDrag && S.hueConvergeDrag.lockedH != null) ? S.hueConvergeDrag.lockedH : S.mouseHueAngle;
            var a = targetH * TAU;
            setAttrs(discHueLine, {
              stroke: stroke, 'stroke-linecap': 'round', 'stroke-opacity': '1', opacity: '1',
              x1: DISC_R, y1: DISC_R,
              x2: (DISC_R + Math.cos(a) * DISC_R).toFixed(2),
              y2: (DISC_R - Math.sin(a) * DISC_R).toFixed(2),
            });
          }
        }
        return null;
      }

      // Single-mode guides
      var col    = S.colors[S.activeIndex];
      var stroke2 = col.L > MIDDLE_GRAY ? '#000' : '#fff';

      discRadialGuides.innerHTML = '';
      if ((S.modKeys.shift || S.modKeys.meta) && S.hoveredHandle !== -1 && S.hoveredHandle !== S.activeIndex) {
        var dimStroke2 = col.L > MIDDLE_GRAY ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)';
        drawGuideForColor(S.colors[S.hoveredHandle], dimStroke2);
      }

      if (S.modKeys.shift) {
        drawHueLine(col, stroke2);
        if (S.modKeys.meta) showChromaPath(getActiveChroma(col), toe(col.L), stroke2);
        return null;
      }

      if (S.modKeys.meta) {
        var targetC, pathL;
        if (S.lockedChromaPath) {
          targetC = S.lockedChromaPath.targetC;
          pathL   = S.lockedChromaPath.L;
        } else {
          targetC = getActiveChroma(col);
          pathL   = col.L;
        }
        showChromaPath(targetC, toe(pathL), stroke2);
        drawHueLine(col, stroke2, Math.max(0, col.s * DISC_R - HANDLE_OUTER));
        return { targetC: targetC, L: pathL, cx: DISC_R, cy: DISC_R };
      }

      return null;
    }

    // ── Mesh edges ───────────────────────────────────────────────

    function computeFrozenEdges() {
      var indices = Array.from(S.multiSelect);
      var pts = indices.map(function (i) { return handlePos(S.colors[i]); });
      var localEdges;
      if (pts.length < 2)      { S.frozenEdges = []; return; }
      if (pts.length === 2)      localEdges = [[0, 1]];
      else if (pts.length === 3) localEdges = [[0, 1], [1, 2], [0, 2]];
      else                       localEdges = delaunay(pts);
      S.frozenEdges = localEdges.map(function (e) { return [indices[e[0]], indices[e[1]]]; });
    }

    function renderMeshEdges(edges, stroke) {
      for (var ei = 0; ei < edges.length; ei++) {
        var i = edges[ei][0], j = edges[ei][1];
        var a = handlePos(S.colors[i]);
        var b = handlePos(S.colors[j]);
        var dx = b.x - a.x, dy = b.y - a.y;
        var len = Math.hypot(dx, dy);
        if (len < HANDLE_OUTER * 2) continue;
        var ux = dx / len, uy = dy / len;
        discMesh.appendChild(svgEl('line', {
          x1: (a.x + ux * HANDLE_OUTER).toFixed(2), y1: (a.y + uy * HANDLE_OUTER).toFixed(2),
          x2: (b.x - ux * HANDLE_OUTER).toFixed(2), y2: (b.y - uy * HANDLE_OUTER).toFixed(2),
          stroke: stroke, 'stroke-width': '1',
        }));
      }
    }

    function updateMesh() {
      discMesh.innerHTML = '';
      if (!S.isMultiMode() || !S.frozenEdges || S.modKeys.shift || S.modKeys.meta) return;
      var refIdx = S.multiSelect.has(S.activeIndex) ? S.activeIndex : Array.from(S.multiSelect)[0];
      var stroke = (S.colors[refIdx] && S.colors[refIdx].L > MIDDLE_GRAY) ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';
      renderMeshEdges(S.frozenEdges, stroke);
    }

    // ── Handle positioning ───────────────────────────────────────

    function updateAllDiscHandles() {
      S.colors.forEach(function (col, i) {
        var a = col.h * TAU;
        handles[i].setAttribute('transform',
          'translate(' + (DISC_R + Math.cos(a) * col.s * DISC_R) + ',' + (DISC_R - Math.sin(a) * col.s * DISC_R) + ')');
      });
    }

    function updateLightHandles() {
      S.colors.forEach(function (col, i) {
        lightHandles[i].setAttribute('transform', 'translate(' + (LB_WIDTH / 2) + ',' + (LB_HEIGHT * (1 - toe(col.L))) + ')');
      });
    }

    // ── Swatch DOM ───────────────────────────────────────────────

    function swatchEl(i) { return swatches.querySelector('[data-index="' + i + '"]'); }

    function updateSwatch(index) {
      var container = swatchEl(index);
      if (!container) return;
      var info = computeP3AndSRGB(S.colors[index]);
      container.querySelector('.color-swatch.p3').style.background   = info.p3Css;
      container.querySelector('.color-swatch.srgb').style.background = info.srgbCss;
      container.querySelector('.swatch-readout.p3').textContent       = info.p3Str;
      container.querySelector('.swatch-readout.srgb').textContent     = info.hex;
      container.classList.toggle('out-of-srgb', info.outOfSRGB);
      container.classList.toggle('light', S.colors[index].L > MIDDLE_GRAY);
    }

    function createSwatchDOM(index) {
      var info = computeP3AndSRGB(S.colors[index]);
      var container = document.createElement('div');
      container.className     = 'swatch-container';
      container.dataset.index = index;
      if (info.outOfSRGB)            container.classList.add('out-of-srgb');
      if (S.colors[index].L > 0.5)  container.classList.add('light');
      if (index === S.activeIndex)   container.classList.add('selected');

      container.innerHTML =
        '<div class="swatch-inner">' +
          '<div class="color-swatch p3" style="background:' + info.p3Css + '">' +
            '<div class="swatch-readout p3">' + info.p3Str + '</div>' +
          '</div>' +
          '<div class="color-swatch srgb" style="background:' + info.srgbCss + '">' +
            '<div class="swatch-readout srgb">' + info.hex + '</div>' +
          '</div>' +
          '<span class="icon gamut-warning">' +
            '<svg viewBox="0 0 18 16" fill="currentColor">' +
              '<path d="M17.8,13.6L10.4.8c-.7-1.1-2.2-1.1-2.9,0L.2,13.6c-.6,1.1.2,2.4,1.5,2.4h14.7c1.3,0,2.1-1.3,1.5-2.4ZM7.8,4.4c0-.7.6-1.2,1.2-1.2s1.2.6,1.2,1.2v5.1c0,.7-.6,1.2-1.2,1.2s-1.2-.6-1.2-1.2v-5.1ZM9,14.8c-.8,0-1.4-.6-1.4-1.4s.7-1.4,1.4-1.4,1.4.6,1.4,1.4-.6,1.4-1.4,1.4Z"/>' +
            '</svg>' +
          '</span>' +
          '<span class="icon delete-swatch">' +
            '<svg viewBox="0 0 16 16" fill="currentColor">' +
              '<path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8,8-3.6,8-8S12.4,0,8,0ZM12.1,10.6l-1.6,1.6-2.6-2.6-2.6,2.6-1.6-1.6,2.6-2.6-2.6-2.6,1.6-1.6,2.6,2.6,2.6-2.6,1.6,1.6-2.6,2.6,2.6,2.6Z"/>' +
            '</svg>' +
          '</span>' +
        '</div>';

      swatches.insertBefore(container, addSwatchBtn);
      return container;
    }

    // ── Background ───────────────────────────────────────────────

    function updateBackground() {
      var L = S.colors[S.activeIndex !== -1 ? S.activeIndex : 0].L;
      pickerWrap.style.backgroundColor = neutralP3(L);
    }

    // ── Multi-select visuals ─────────────────────────────────────

    function clearMultiVisuals() {
      swatches.querySelectorAll('.swatch-container.multi-selected')
        .forEach(function (el) { el.classList.remove('multi-selected'); });
      handles.forEach(function (h) { h.classList.remove('multi'); });
      lightHandles.forEach(function (h) { h.classList.remove('multi'); });
      discRadialGuides.innerHTML = '';
    }

    function applyMultiVisuals() {
      S.multiSelect.forEach(function (i) {
        var sw = swatchEl(i); if (sw) sw.classList.add('multi-selected');
        if (handles[i])      handles[i].classList.add('multi');
        if (lightHandles[i]) lightHandles[i].classList.add('multi');
      });
    }

    // ── Full render ──────────────────────────────────────────────

    function render() {
      drawDisc();
      drawLightbar();
      updateAllDiscHandles();
      updateLightHandles();
      S.colors.forEach(function (_, i) {
        if (lightHandles[i]) lightHandles[i].classList.toggle('light-color', S.colors[i].L > MIDDLE_GRAY);
      });

      if (S.isMultiMode()) {
        S.multiSelect.forEach(function (i) { updateSwatch(i); });
      } else {
        updateSwatch(S.activeIndex);
      }

      updateBackground();
      updateDiscGuides();
      updateMesh();
      var lightBg = S.activeIndex !== -1 && S.colors[S.activeIndex].L > MIDDLE_GRAY;
      leftOverlay.classList.toggle('light-color', lightBg);
      lightbarOverlay.classList.toggle('light-color', lightBg);
    }

    // ── Public API ───────────────────────────────────────────────

    return {
      DISC_R: DISC_R,
      HANDLE_OUTER: HANDLE_OUTER,

      handlePos: handlePos,
      yToToeL: yToToeL,
      toeLToY: toeLToY,

      els: { wheelCanvas: wheelCanvas, lightbarCanvas: lightbarCanvas, leftOverlay: leftOverlay, lightbarOverlay: lightbarOverlay, pickerWrap: pickerWrap, swatches: swatches, addSwatchBtn: addSwatchBtn },

      handles: handles,
      lightHandles: lightHandles,

      render: render,
      invalidateCache: invalidateCache,
      updateSwatch: updateSwatch,
      updateDiscGuides: updateDiscGuides,
      updateMesh: updateMesh,

      createHandle: createHandle,
      createLightHandle: createLightHandle,
      setHandleActive: setHandleActive,
      reindex: reindex,
      swatchEl: swatchEl,

      createSwatchDOM: createSwatchDOM,

      clearMultiVisuals: clearMultiVisuals,
      applyMultiVisuals: applyMultiVisuals,
      computeFrozenEdges: computeFrozenEdges,

      hideHueLine: function () { discHueLine.setAttribute('opacity', '0'); },
    };
  }

  // ── Public API ─────────────────────────────────────────────────────

  window.PickerRender = {
    svgEl: svgEl,
    setAttrs: setAttrs,
    idxOf: idxOf,
    createPicker: createPicker,
  };
};
