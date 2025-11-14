(() => {
  const canvas = document.querySelector('canvas.background');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const CONFIG = {
    cellSize: 24,
    radius: 70,
    lineWidth: 1.2,
    colorCenter: '#b3b3b3', // цвет в центре
    colorEdge: '#1c1e21',   // цвет на краю
    clearEachFrame: true,
    wobbleAmp: 20.0,
    wobbleSpeed: 1.6,
    maxSegmentsPerFrame: 15000,
    edgeFalloff: 2.2,
    holeBias: 0.85
  };

  function basis(cell) {
    return {
      ax: cell, ay: 0,
      bx: cell * 0.5, by: cell * Math.sqrt(3) * 0.5
    };
  }

  const mouse = { x: 0, y: 0, active: false };
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;

    // --- Генерация статической сетки ---
  let staticNodes = new Map();
  const dirs = [
    [ 1,  0], [ 0,  1], [-1,  1],
    [-1,  0], [ 0, -1], [ 1, -1]
  ];

  function generateStaticGrid() {
    staticNodes.clear();
    const { cellSize } = CONFIG;
    const { ax, ay, bx, by } = basis(cellSize);

    // Заполняем всю область экрана
    const cols = Math.ceil(W / cellSize) + 4;
    const rows = Math.ceil(H / (cellSize * Math.sqrt(3) / 2)) + 4;

    for (let i = -cols; i <= cols; i++) {
      for (let j = -rows; j <= rows; j++) {
        const x = i * ax + j * bx;
        const y = i * ay + j * by;
        staticNodes.set(`${i},${j}`, { i, j, x, y });
      }
    }
  }

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width | 0);
    H = Math.max(1, rect.height | 0);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    generateStaticGrid();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function updatePos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.active = true;
  }
  window.addEventListener('mousemove', (e) => updatePos(e.clientX, e.clientY), { passive: true });
  window.addEventListener('mouseleave', () => { mouse.active = false; }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0]; if (!t) return;
    updatePos(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', () => { mouse.active = false; }, { passive: true });

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m
      ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
      : { r: 57, g: 197, b: 187 };
  }
  const colCenter = hexToRgb(CONFIG.colorCenter);
  const colEdge = hexToRgb(CONFIG.colorEdge);

  function easeOutCubic(t) {
    const u = 1 - t;
    return 1 - u * u * u;
  }

  function hash01(a, b, c, d) {
    let x = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791) ^ (d * 2654435761);
    x = (x << 13) ^ x;
    return ((x * (x * x * 15731 + 789221) + 1376312589) >>> 0) / 4294967296;
  }

  function wobble(i, j, t, amp, speed) {
    if (amp === 0) return [0, 0];
    const dx = amp * Math.sin(t * speed + i * 1.71 + j * 0.93);
    const dy = amp * Math.cos(t * (speed * 0.88) + i * 1.11 - j * 1.19);
    return [dx, dy];
  }

  function frame(now) {
    const t = now / 1000;
    if (CONFIG.clearEachFrame) ctx.clearRect(0, 0, W, H);
    if (mouse.active) drawGrid(t);
    requestAnimationFrame(frame);
  }

  function drawGrid(t) {
    const { radius, lineWidth, wobbleAmp, wobbleSpeed, edgeFalloff, holeBias } = CONFIG;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    let drawn = 0;
    for (const [, a] of staticNodes) {
      const [wx, wy] = wobble(a.i, a.j, t, wobbleAmp, wobbleSpeed);
      const axp = a.x + wx;
      const ayp = a.y + wy;

      for (let k = 0; k < 6; k++) {
        const ni = a.i + dirs[k][0];
        const nj = a.j + dirs[k][1];
        if (ni < a.i || (ni === a.i && nj <= a.j)) continue;

        const b = staticNodes.get(`${ni},${nj}`);
        if (!b) continue;

        const [wx2, wy2] = wobble(b.i, b.j, t, wobbleAmp, wobbleSpeed);
        const bxp = b.x + wx2;
        const byp = b.y + wy2;

        // Расстояние до мыши
        const da = Math.hypot(axp - mouse.x, ayp - mouse.y);
        const db = Math.hypot(bxp - mouse.x, byp - mouse.y);
        const dm = (da + db) * 0.5;
        if (dm > radius) continue;

        const tEdge = Math.max(0, 1 - dm / radius);
        const alpha = easeOutCubic(tEdge);
        if (alpha <= 0.02) continue;

        const p = Math.pow(tEdge, edgeFalloff) * (1 - holeBias) + tEdge * holeBias;
        const r = hash01(a.i, a.j, ni, nj);
        if (r > p) continue;

        // Градиент цвета от центра к краю
        const rr = colEdge.r + (colCenter.r - colEdge.r) * tEdge;
        const gg = colEdge.g + (colCenter.g - colEdge.g) * tEdge;
        const bb = colEdge.b + (colCenter.b - colEdge.b) * tEdge;

        ctx.strokeStyle = `rgba(${rr|0},${gg|0},${bb|0},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(axp, ayp);
        ctx.lineTo(bxp, byp);
        ctx.stroke();

        drawn++;
        if (drawn >= CONFIG.maxSegmentsPerFrame) return;
      }
    }
  }

  requestAnimationFrame(frame);
})();