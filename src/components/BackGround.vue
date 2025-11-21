<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const isInitialised = ref(false);

const initialisedBackground = () => {
    if (isInitialised.value) return;
    isInitialised.value = true;

    const canvas = document.querySelector('canvas.background');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId = null;

    const CONFIG = {
        cellSize: 24,
        radius: 70,
        lineWidth: 1.2,
        colorCenter: '#b3b3b3',
        colorEdge: '#1c1e21',
        clearEachFrame: true,
        wobbleAmp: 20.0,
        wobbleSpeed: 1.6,
        maxSegmentsPerFrame: 80,
        edgeFalloff: 2.2,
        holeBias: 0.85,
    };

    function basis(cell) {
        return {
            ax: cell,
            ay: 0,
            bx: cell * 0.5,
            by: cell * Math.sqrt(3) * 0.5,
        };
    }

    const mouse = { x: 0, y: 0, active: false };
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let W = 0,
        H = 0;

    // Оптимизация: предварительные вычисления
    const sqrt3 = Math.sqrt(3);
    const colorCache = new Map();
    let staticNodes = new Map();
    const dirs = [
        [1, 0],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [0, -1],
        [1, -1],
    ];

    // Оптимизация: кэширование цветов
    function getColor(tEdge) {
        const key = Math.floor(tEdge * 100);
        if (colorCache.has(key)) {
            return colorCache.get(key);
        }

        const { colorCenter, colorEdge } = CONFIG;
        const colCenter = hexToRgb(colorCenter);
        const colEdge = hexToRgb(colorEdge);

        const rr = colEdge.r + (colCenter.r - colEdge.r) * tEdge;
        const gg = colEdge.g + (colCenter.g - colEdge.g) * tEdge;
        const bb = colEdge.b + (colCenter.b - colEdge.b) * tEdge;
        const alpha = easeOutCubic(tEdge);

        const color = `rgba(${rr | 0},${gg | 0},${bb | 0},${alpha})`;
        colorCache.set(key, color);
        return color;
    }

    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m
            ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
            : { r: 57, g: 197, b: 187 };
    }

    function easeOutCubic(t) {
        const u = 1 - t;
        return 1 - u * u * u;
    }

    function hash01(a, b, c, d) {
        let x = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791) ^ (d * 2654435761);
        x = (x << 13) ^ x;
        return ((x * (x * x * 15731 + 789221) + 1376312589) >>> 0) / 4294967296;
    }

    // Оптимизация: предварительное вычисление wobble с меньшим кэшем
    const wobbleCache = new Map();
    let lastClearTime = 0;

    function getWobble(i, j, t, amp, speed) {
        // Очищаем кэш каждые 2 секунды вместо каждого кадра
        if (t - lastClearTime > 2) {
            wobbleCache.clear();
            lastClearTime = t;
        }

        const key = `${i},${j},${Math.floor(t * 20)}`; // Более точный ключ
        if (wobbleCache.has(key)) {
            return wobbleCache.get(key);
        }

        if (amp === 0) return [0, 0];
        const dx = amp * Math.sin(t * speed + i * 1.71 + j * 0.93);
        const dy = amp * Math.cos(t * (speed * 0.88) + i * 1.11 - j * 1.19);
        const result = [dx, dy];

        // Ограничиваем размер кэша
        if (wobbleCache.size < 1000) {
            wobbleCache.set(key, result);
        }

        return result;
    }

    // Очистка кэша цветов каждые 120 кадров
    let frameCount = 0;
    function clearCaches() {
        frameCount++;
        if (frameCount % 120 === 0) {
            colorCache.clear();
        }
    }

    function generateStaticGrid() {
        staticNodes.clear();
        const { cellSize } = CONFIG;
        const { ax, ay, bx, by } = basis(cellSize);

        const cols = Math.ceil(W / cellSize) + 4;
        const rows = Math.ceil(H / ((cellSize * sqrt3) / 2)) + 4;

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

    function updatePos(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;
    }

    function handleMouseMove(e) {
        updatePos(e.clientX, e.clientY);
    }

    function handleTouchMove(e) {
        const t = e.touches[0];
        if (!t) return;
        updatePos(t.clientX, t.clientY);
    }

    function frame(now) {
        const t = now / 1000;
        clearCaches();

        if (CONFIG.clearEachFrame) ctx.clearRect(0, 0, W, H);
        if (mouse.active) drawGrid(t);
        animationFrameId = requestAnimationFrame(frame);
    }

    function drawGrid(t) {
        const { radius, lineWidth, wobbleAmp, wobbleSpeed, edgeFalloff, holeBias } = CONFIG;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';

        let drawn = 0;

        // УБИРАЕМ быструю проверку расстояния, которая обрезала левую часть
        for (const [, a] of staticNodes) {
            const [wx, wy] = getWobble(a.i, a.j, t, wobbleAmp, wobbleSpeed);
            const axp = a.x + wx;
            const ayp = a.y + wy;

            // ВОССТАНАВЛИВАЕМ все 6 направлений как в оригинале
            for (let k = 0; k < 6; k++) {
                const ni = a.i + dirs[k][0];
                const nj = a.j + dirs[k][1];
                if (ni < a.i || (ni === a.i && nj <= a.j)) continue;

                const b = staticNodes.get(`${ni},${nj}`);
                if (!b) continue;

                const [wx2, wy2] = getWobble(b.i, b.j, t, wobbleAmp, wobbleSpeed);
                const bxp = b.x + wx2;
                const byp = b.y + wy2;

                // Используем оригинальный расчет расстояния
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

                ctx.strokeStyle = getColor(tEdge);
                ctx.beginPath();
                ctx.moveTo(axp, ayp);
                ctx.lineTo(bxp, byp);
                ctx.stroke();

                drawn++;
                if (drawn >= CONFIG.maxSegmentsPerFrame) return;
            }
        }
    }

    // Добавляем события
    const resizeHandler = () => resize();
    const mouseMoveHandler = (e) => handleMouseMove(e);
    const mouseLeaveHandler = () => {
        mouse.active = false;
    };
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = () => {
        mouse.active = false;
    };

    window.addEventListener('resize', resizeHandler, { passive: true });
    window.addEventListener('mousemove', mouseMoveHandler, { passive: true });
    window.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });
    window.addEventListener('touchmove', touchMoveHandler, { passive: true });
    window.addEventListener('touchend', touchEndHandler, { passive: true });

    resize();
    animationFrameId = requestAnimationFrame(frame);

    // Функция очистки
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseleave', mouseLeaveHandler);
        window.removeEventListener('touchmove', touchMoveHandler);
        window.removeEventListener('touchend', touchEndHandler);
    };
};

const cleanup = ref(null);

onMounted(() => {
    cleanup.value = initialisedBackground();
});

onUnmounted(() => {
    if (cleanup.value) {
        cleanup.value();
    }
});
</script>

<template>
    <canvas
        class="background fixed top-0 left-0 w-screen h-screen z-[-1000] pointer-events-none"
    ></canvas>
</template>

<style scoped></style>
