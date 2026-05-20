"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Plane } from "lucide-react";
import {
  PATH_MARGIN_FRACTION,
  PATH_STROKE_COLOR,
  PATH_STROKE_WIDTH,
  PATH_DASH_ARRAY,
  PLANE_SIZE,
  SAMPLE_STEP_PX,
  SPRING_K,
  ANGLE_SMOOTH_PX,
  TRAIL_THROTTLE_BYPASS_DELTA,
} from "./constants";

function catmullRomPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PaperPlanePath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const totalLenRef = useRef(0);

  // Pre-sampled path: [x0,y0,a0, x1,y1,a1, ...] in CSS pixels / radians.
  const samplesRef = useRef<Float32Array>(new Float32Array(0));
  const sampleCountRef = useRef(0);
  const planeSizeRef = useRef(PLANE_SIZE);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const reducedRef = useRef(false);
  const lastTrailTsRef = useRef(0);
  const lastTrailPRef = useRef(0);

  const pathname = usePathname();

  // ---- build path + sample table ------------------------------------------
  const buildPath = () => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    if (!svg || !pathEl) return;

    const w = document.documentElement.clientWidth;
    planeSizeRef.current = w < 640 ? 28 : PLANE_SIZE;

    // measure document height excluding our own wrapper
    const wrapper = wrapperRef.current;
    if (wrapper) wrapper.style.display = "none";
    const h = document.documentElement.scrollHeight;
    if (wrapper) {
      wrapper.style.display = "";
      wrapper.style.height = `${h}px`;
      wrapper.style.width = `${w}px`;
    }
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.style.height = `${h}px`;

    const isMobile = w < 640;
    const mid = w / 2;
    const lx = isMobile ? w * 0.06 : Math.min(120, w * PATH_MARGIN_FRACTION) + 40;
    const rx = isMobile ? w * 0.94 : w - Math.min(120, w * PATH_MARGIN_FRACTION) - 40;

    const rawPts = isMobile
      ? [
          { x: mid, y: 160 },
          { x: rx, y: 380 },
          { x: lx, y: 620 },
          { x: rx, y: 900 },
          { x: mid * 0.4, y: 1180 },
          { x: rx, y: 1480 },
          { x: lx, y: 1780 },
          { x: mid * 1.6, y: 2080 },
          { x: lx, y: 2400 },
          { x: rx, y: 2720 },
          { x: lx, y: 3060 },
          { x: mid, y: h - 160 },
        ]
      : [
          { x: mid - 40, y: 180 },
          { x: rx, y: 480 },
          { x: mid + 20, y: 860 },
          { x: lx, y: 1260 },
          { x: mid + 60, y: 1700 },
          { x: lx, y: 2150 },
          { x: rx - 40, y: 2600 },
          { x: lx + 80, y: 3100 },
          { x: mid, y: h - 200 },
        ];

    const refH = isMobile ? 3200 : 3500;
    const scale = h / refH;
    const pts = rawPts.map((p, i) =>
      i === rawPts.length - 1 ? p : { x: p.x, y: p.y * scale }
    );

    const d = catmullRomPath(pts);
    pathEl.setAttribute("d", d);
    const trailEl = trailRef.current;
    if (trailEl) trailEl.setAttribute("d", d);

    // Pre-sample once. Lookup is O(1) after this; no getPointAtLength on the
    // hot path. Angles are smoothed over ANGLE_SMOOTH_PX of arc to kill apex
    // wobble.
    const total = pathEl.getTotalLength();
    const count = Math.max(2, Math.ceil(total / SAMPLE_STEP_PX) + 1);
    const samples = new Float32Array(count * 3);
    const xs = new Float32Array(count);
    const ys = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const dist = Math.min(total, i * SAMPLE_STEP_PX);
      const pt = pathEl.getPointAtLength(dist);
      xs[i] = pt.x;
      ys[i] = pt.y;
    }
    const smoothSteps = Math.max(1, Math.round(ANGLE_SMOOTH_PX / SAMPLE_STEP_PX));
    for (let i = 0; i < count; i++) {
      const a = Math.max(0, i - smoothSteps);
      const b = Math.min(count - 1, i + smoothSteps);
      samples[i * 3] = xs[i];
      samples[i * 3 + 1] = ys[i];
      samples[i * 3 + 2] = Math.atan2(ys[b] - ys[a], xs[b] - xs[a]);
    }
    samplesRef.current = samples;
    sampleCountRef.current = count;
    totalLenRef.current = total;
    if (trailEl) {
      trailEl.setAttribute("stroke-dasharray", String(total));
      trailEl.setAttribute("stroke-dashoffset", String(total));
    }
  };

  // ---- write transform from progress --------------------------------------
  // `nowMs` lets us throttle the trail update independently of the plane.
  const applyProgress = (progress: number, nowMs: number = 0) => {
    const planeEl = planeRef.current;
    const count = sampleCountRef.current;
    const samples = samplesRef.current;
    if (!planeEl || count < 2) return;

    const p = progress <= 0 ? 0 : progress >= 1 ? 1 : progress;
    const f = p * (count - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(count - 1, i0 + 1);
    const t = f - i0;

    const x0 = samples[i0 * 3];
    const y0 = samples[i0 * 3 + 1];
    const a0 = samples[i0 * 3 + 2];
    const x1 = samples[i1 * 3];
    const y1 = samples[i1 * 3 + 1];
    let a1 = samples[i1 * 3 + 2];

    const da = a1 - a0;
    if (da > Math.PI) a1 -= Math.PI * 2;
    else if (da < -Math.PI) a1 += Math.PI * 2;

    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const ang = (a0 + (a1 - a0) * t) * (180 / Math.PI);
    const ps = planeSizeRef.current;
    const s = ps / PLANE_SIZE;
    const cx = x - ps / 2;
    const cy = y - ps / 2;

    // Plane: GPU-composited transform on a real DOM <div>, every frame.
    planeEl.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) rotate(${ang.toFixed(2)}deg) scale(${s})`;

    // Trail: throttle to ~30Hz on slow scroll (the dashed reveal repaints a
    // huge SVG path — the dominant cost). On FAST scroll, the throttle would
    // make the trail jump in visible steps, so we bypass it when the per-frame
    // progress delta is large and keep the trail glued to the plane.
    const trailEl = trailRef.current;
    const total = totalLenRef.current;
    if (trailEl && total) {
      const delta = Math.abs(p - lastTrailPRef.current);
      const throttled = nowMs !== 0 && nowMs - lastTrailTsRef.current < 33;
      const bypass = delta >= TRAIL_THROTTLE_BYPASS_DELTA;
      if (!throttled || bypass) {
        lastTrailTsRef.current = nowMs;
        lastTrailPRef.current = p;
        trailEl.style.strokeDashoffset = (total - p * total).toFixed(2);
      }
    }
  };

  const readTargetProgress = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const raw = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
    const bias = window.scrollY / document.documentElement.scrollHeight;
    return Math.min(1, raw * 0.4 + bias * 0.6);
  };

  // ---- spring loop --------------------------------------------------------
  const tick = (ts: number) => {
    const last = lastTsRef.current || ts;
    const dt = Math.min(0.064, (ts - last) / 1000);
    lastTsRef.current = ts;

    const target = targetRef.current;
    let cur = currentRef.current;
    // Fixed-step integration smooths frames where dt > 16ms (slow frame,
    // tab returning from background, etc.) — without it a single big dt
    // causes a visible jump along the path.
    const STEP = 1 / 120; // 8.3ms
    let remaining = dt;
    while (remaining > 0) {
      const h = remaining > STEP ? STEP : remaining;
      const alpha = 1 - Math.exp(-h * SPRING_K);
      cur = cur + (target - cur) * alpha;
      remaining -= h;
    }
    const next = cur;
    currentRef.current = next;
    applyProgress(next, ts);

    if (Math.abs(target - next) > 0.00025) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      currentRef.current = target;
      applyProgress(target, ts);
      rafRef.current = 0;
      lastTsRef.current = 0;
    }
  };

  const kick = () => {
    if (rafRef.current || reducedRef.current) return;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  };

  // ---- mount: build, listeners --------------------------------------------
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    buildPath();
    targetRef.current = readTargetProgress();
    currentRef.current = targetRef.current;
    applyProgress(targetRef.current);

    const onScroll = () => {
      targetRef.current = readTargetProgress();
      if (reducedRef.current) {
        currentRef.current = targetRef.current;
        applyProgress(targetRef.current);
      } else {
        kick();
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildPath();
        targetRef.current = readTargetProgress();
        applyProgress(currentRef.current);
        kick();
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- route change: rebuild synchronously after ScrollToTop --------------
  useIsoLayoutEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    buildPath();
    targetRef.current = readTargetProgress();
    currentRef.current = targetRef.current;
    applyProgress(targetRef.current);
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke={PATH_STROKE_COLOR}
          strokeWidth={PATH_STROKE_WIDTH}
          strokeDasharray={PATH_DASH_ARRAY}
          strokeLinecap="round"
          opacity="0.35"
          shapeRendering="geometricPrecision"
        />
        {/* solid gold trail revealed behind the plane via stroke-dashoffset */}
        <path
          ref={trailRef}
          fill="none"
          stroke="#b8893d"
          strokeWidth={PATH_STROKE_WIDTH + 1}
          strokeLinecap="round"
          opacity="1"
          shapeRendering="geometricPrecision"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Plane lives in the DOM, NOT inside the SVG. CSS transforms on real
          HTML elements are 100% reliable across browsers; nested-svg + CSS
          transform-on-<g> was unreliable and was the reason it was invisible. */}
      <div
        ref={planeRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: PLANE_SIZE,
          height: PLANE_SIZE,
          transformOrigin: "center",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Lucide Plane: native orientation is up-right (~45°); counter-rotate
            so 0° = nose-right, letting the path-tangent rotation align the
            nose with the direction of travel. */}
        <Plane
          size={PLANE_SIZE}
          color="#8a6529"
          fill="#c99a3f"
          strokeWidth={1.5}
          style={{ transform: "rotate(45deg)" }}
        />
      </div>
    </div>
  );
}
