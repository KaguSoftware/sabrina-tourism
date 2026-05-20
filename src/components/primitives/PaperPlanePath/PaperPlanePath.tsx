"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  PATH_MARGIN_FRACTION,
  PATH_STROKE_COLOR,
  PATH_STROKE_WIDTH,
  PATH_DASH_ARRAY,
  PLANE_SIZE,
} from "./constants";

// How many samples we pre-compute along the path. 2048 keeps the gap between
// adjacent samples under ~4px on any realistic page height — visually
// indistinguishable from the underlying continuous curve. Init cost is still
// under ~15ms and the Float32Arrays cost ~48KB total.
const LUT_SAMPLES = 2048;

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

export function PaperPlanePath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  // The plane lives in an HTML div — SVG <g transform> can't be composited,
  // but `translate3d` on a div promotes to its own GPU layer.
  // `planeWrapperRef` is a full-document-height container that escapes the
  // public layout's `overflow-y-clip` (just like the SVG does by setting its
  // own height). `planeRef` is the actual moving element inside it.
  const planeWrapperRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  // Pre-sampled path data. Reading samples is an O(1) array index; vastly
  // cheaper than calling pathEl.getPointAtLength() per frame.
  const xsRef = useRef<Float32Array | null>(null);
  const ysRef = useRef<Float32Array | null>(null);
  const angsRef = useRef<Float32Array | null>(null);
  const pathLengthRef = useRef(0);
  const planeSizeRef = useRef(PLANE_SIZE);

  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastDashRef = useRef(-1); // last written dashoffset, for throttling
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);

  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Build / rebuild the path. Also samples the LUT so per-frame paint stays
  // off the main thread's expensive path APIs.
  const buildPath = useCallback(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;
    if (!svg || !pathEl || !trailEl) return;

    const w = document.documentElement.clientWidth;
    planeSizeRef.current = w < 640 ? 26 : PLANE_SIZE;

    // Measure target height without the display:none trick (which forced a
    // full document reflow). The SVG is position:absolute and inside an
    // overflow-hidden parent, so it never inflates body's scrollHeight beyond
    // its own height — but we want to size it TO the document, so we ask
    // the main element instead. Falls back to scrollHeight if no <main>.
    const mainEl =
      typeof document !== "undefined" ? document.querySelector("main") : null;
    const h = mainEl
      ? Math.max(
          mainEl.getBoundingClientRect().height + mainEl.offsetTop,
          window.innerHeight,
        )
      : document.documentElement.scrollHeight;

    if (h < window.innerHeight * 1.2) return;

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));

    // Extend the plane's wrapper to match the document height. Without this,
    // the parent layout's `overflow-y-clip` slices the plane once its
    // translate puts it past the wrapper's own (tiny) content box. The SVG
    // sibling avoids this naturally because it sizes itself to `h`.
    if (planeWrapperRef.current) {
      planeWrapperRef.current.style.height = `${h}px`;
    }

    const isMobile = w < 640;
    const mid = w / 2;
    const lx = isMobile ? w * 0.08 : Math.min(120, w * PATH_MARGIN_FRACTION) + 40;
    const rx = isMobile
      ? w * 0.92
      : w - Math.min(120, w * PATH_MARGIN_FRACTION) - 40;

    const rawPts = isMobile
      ? [
          { x: mid, y: 180 },
          { x: rx, y: 520 },
          { x: lx, y: 920 },
          { x: rx, y: 1340 },
          { x: lx, y: 1780 },
          { x: rx, y: 2240 },
          { x: lx, y: 2720 },
          { x: mid, y: h - 180 },
        ]
      : [
          { x: mid - 20, y: 220 },
          { x: rx, y: 560 },
          { x: lx, y: 1040 },
          { x: rx - 40, y: 1560 },
          { x: lx + 60, y: 2120 },
          { x: rx - 80, y: 2700 },
          { x: mid, y: h - 220 },
        ];

    const refH = isMobile ? 3200 : 3500;
    const scale = h / refH;
    const pts = rawPts.map((p, i) =>
      i === rawPts.length - 1 ? p : { x: p.x, y: p.y * scale },
    );

    const d = catmullRomPath(pts);
    pathEl.setAttribute("d", d);
    trailEl.setAttribute("d", d);

    const total = pathEl.getTotalLength();
    pathLengthRef.current = total;
    trailEl.setAttribute("stroke-dasharray", String(total));
    trailEl.setAttribute("stroke-dashoffset", String(total));
    lastDashRef.current = total;

    // Build the lookup table once. This is the heavy operation — but it
    // happens here, not per frame.
    const N = LUT_SAMPLES;
    const xs = new Float32Array(N);
    const ys = new Float32Array(N);
    const angs = new Float32Array(N);
    const step = total / (N - 1);
    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < N; i++) {
      const dist = i * step;
      const p = pathEl.getPointAtLength(dist);
      xs[i] = p.x;
      ys[i] = p.y;
      // Angle from previous sample → reuses one path lookup per sample
      // instead of two (saves N getPointAtLength calls at init).
      if (i > 0) {
        angs[i - 1] = Math.atan2(p.y - prevY, p.x - prevX);
      }
      prevX = p.x;
      prevY = p.y;
    }
    // Last angle = penultimate angle (no "ahead" sample available).
    angs[N - 1] = angs[N - 2] ?? 0;

    xsRef.current = xs;
    ysRef.current = ys;
    angsRef.current = angs;
  }, []);

  // Paint at a given normalized progress. Now O(1): two array indexes + lerp.
  const paint = useCallback((progress: number) => {
    const xs = xsRef.current;
    const ys = ysRef.current;
    const angs = angsRef.current;
    const trailEl = trailRef.current;
    const planeEl = planeRef.current;
    const total = pathLengthRef.current;
    if (!xs || !ys || !angs || !trailEl || !planeEl || !total) return;

    const N = xs.length;
    const fIdx = progress * (N - 1);
    const i = Math.min(N - 2, Math.floor(fIdx));
    const t = fIdx - i;

    const x = xs[i] + (xs[i + 1] - xs[i]) * t;
    const y = ys[i] + (ys[i + 1] - ys[i]) * t;
    // Shortest-arc angle lerp. Linear lerp of the angle directly is fine as
    // long as we route the delta through the shorter side of the circle —
    // this avoids the numerical jitter of `atan2(lerp(cos), lerp(sin))` when
    // a0 ≈ a1 (typical on smooth paths) where the lerped vector approaches
    // zero and the recovered angle becomes noisy.
    const a0 = angs[i];
    const a1 = angs[i + 1];
    let da = a1 - a0;
    if (da > Math.PI) da -= 2 * Math.PI;
    else if (da < -Math.PI) da += 2 * Math.PI;
    const angleDeg = ((a0 + da * t) * 180) / Math.PI;

    // Trail dashoffset — throttle to >=1px change to skip no-op SVG writes
    // (each one is a full-SVG repaint).
    const dist = progress * total;
    const newDash = total - dist;
    if (Math.abs(newDash - lastDashRef.current) >= 1) {
      trailEl.setAttribute("stroke-dashoffset", newDash.toFixed(1));
      lastDashRef.current = newDash;
    }

    // Plane is a composited <div>: translate3d hits the GPU, rotate stays on
    // the same layer. Center the artwork on the path point.
    const ps = planeSizeRef.current;
    planeEl.style.transform = `translate3d(${(x - ps / 2).toFixed(2)}px, ${(y - ps / 2).toFixed(2)}px, 0) rotate(${angleDeg.toFixed(2)}deg)`;
  }, []);

  const computeTargetProgress = useCallback(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / docH));
  }, []);

  // Frame-rate-independent exponential smoother (Lenis/GSAP-style).
  // λ ≈ 14 gives a snappy-but-buttery follow on both 60Hz and 144Hz monitors.
  const tick = useCallback((now: number) => {
    const target = targetProgressRef.current;
    const display = displayProgressRef.current;
    const diff = target - display;
    const absDiff = Math.abs(diff);

    const dt = lastTickRef.current
      ? Math.min(0.05, (now - lastTickRef.current) / 1000)
      : 1 / 60;
    lastTickRef.current = now;

    if (absDiff < 0.0003) {
      displayProgressRef.current = target;
      paint(target);
      rafRef.current = 0;
      lastTickRef.current = 0;
      return;
    }

    const alpha = 1 - Math.exp(-14 * dt);
    displayProgressRef.current = display + diff * alpha;
    paint(displayProgressRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [paint]);

  const requestTick = useCallback(() => {
    if (rafRef.current) return;
    // No more synchronous paint() here — that was firing paint inside the
    // scroll handler. Just start the rAF loop; the first tick will paint.
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    buildPath();
    targetProgressRef.current = computeTargetProgress();
    displayProgressRef.current = targetProgressRef.current;
    paint(displayProgressRef.current);
    setVisible(true);

    if (prefersReduced) return;

    const onScroll = () => {
      targetProgressRef.current = computeTargetProgress();
      if (!rafRef.current) requestTick();
    };

    const onResize = () => {
      buildPath();
      targetProgressRef.current = computeTargetProgress();
      displayProgressRef.current = targetProgressRef.current;
      paint(displayProgressRef.current);
    };

    // Observe <main> instead of body to avoid feedback loops with the SVG's
    // own height changes. Debounce + ignore small deltas to stop lazy-image
    // loads from triggering full path rebuilds during scroll.
    let lastObservedH = 0;
    let rebuildTimer: ReturnType<typeof setTimeout> | null = null;
    const mainEl = document.querySelector("main");
    const onTargetResize = (entries: ResizeObserverEntry[]) => {
      const newH = entries[0]?.contentRect.height ?? 0;
      if (Math.abs(newH - lastObservedH) < 32) return;
      lastObservedH = newH;
      if (rebuildTimer) clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(() => {
        buildPath();
        targetProgressRef.current = computeTargetProgress();
        displayProgressRef.current = targetProgressRef.current;
        paint(displayProgressRef.current);
      }, 180);
    };
    const ro =
      mainEl && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onTargetResize)
        : null;
    if (ro && mainEl) ro.observe(mainEl);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (rebuildTimer) clearTimeout(rebuildTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildPath, paint, computeTargetProgress, requestTick, tick]);

  // On navigation: rebuild against the new layout once it settles.
  useEffect(() => {
    setVisible(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    let raf1 = 0;
    let raf2 = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        buildPath();
        targetProgressRef.current = computeTargetProgress();
        displayProgressRef.current = targetProgressRef.current;
        paint(displayProgressRef.current);

        timer = setTimeout(() => {
          buildPath();
          targetProgressRef.current = computeTargetProgress();
          displayProgressRef.current = targetProgressRef.current;
          paint(displayProgressRef.current);
          setVisible(true);
        }, 80);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (timer) clearTimeout(timer);
    };
  }, [pathname, buildPath, paint, computeTargetProgress]);

  // The plane SVG artwork lives inside an HTML container that we move with
  // transform: translate3d() for GPU compositing.
  const planeArtwork = (
    <svg
      width={PLANE_SIZE}
      height={PLANE_SIZE}
      viewBox="0 0 424.06 424.06"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <g transform="rotate(45 212.03 212.03)">
        <path
          style={{ fill: "#F5E6C6" }}
          d="M250.673,233.26l49.2,180c0.8,2.8,4.4,4,6.8,1.6l8.8-8.8c11.2-11.2,17.6-26.4,17.6-42.4v-212.8l64.8-64.8c12.8-12.8,19.2-30.4,17.2-48.4l-0.8-7.6c-1.2-11.6-10.8-20.8-22.8-21.6l-6.4-0.4c-16.8-0.8-33.6,5.6-45.6,17.6l-66.4,66l-212.8-0.4c-15.6,0-30.8,6.4-42,17.6l-8.8,8.8c-2,2.4-1.2,6,1.6,6.8l180,49.2l-50.8,50.8l-74,2.4c-5.2,0-10,2.4-13.6,6l-6.8,7.2c-2,2-1.2,5.6,1.6,6.4l92.8,34.8l37.2,96c1.2,2.8,4.4,3.6,6.4,1.2l7.2-7.2c3.6-3.6,5.6-8.4,6-13.6l2.8-73.6L250.673,233.26z"
        />
        <path
          style={{ fill: "#EAD9BB" }}
          d="M250.673,233.26l49.2,180c0.8,2.8,4.4,4,6.8,1.6l8.8-8.8c11.2-11.2,17.6-26.4,17.6-42.4v-212.8l64.8-64.8c12.8-12.8,19.2-30.4,17.2-48.4l-0.8-7.6c-0.4-5.6-6.8-14.4-6.8-14.4l-267.2,265.6l37.2,96c1.2,2.8,4.4,3.6,6.4,1.2l7.2-7.2c3.6-3.6,5.6-8.4,6-13.6l2.8-73.6L250.673,233.26z"
        />
        <path
          style={{ fill: "#C39215" }}
          d="M303.873,424.06c-1.2,0-2,0-3.2-0.4c-4-1.2-7.2-4.4-8.4-8.4l-45.6-166.8l-38.8,38.8l-2.8,70.4c-0.4,7.6-3.6,14-8.4,18.8l-7.2,7.2c-2.8,2.8-6.4,4.4-10.4,4s-7.6-3.2-9.2-7.2l-36-92.8l-89.2-33.6c-4-1.2-6.8-4.4-7.6-8.4c-1.2-4,0-8.4,3.2-11.2l6.8-7.2c5.6-5.6,12.4-8.4,19.6-8.4l70.4-2.4l38.8-38.8l-166.8-45.6c-4-1.2-6.8-4-8-8s-0.4-8.4,2.4-11.6l0.4-0.4l8.8-8.8c12.8-12.8,30-20,47.6-20l209.6,0.4l64-63.6c13.6-13.6,32.4-20.8,51.6-20l6.4,0.4c16,1.2,28.8,13.2,30.4,28.8l0.8,7.6c2.4,20.4-4.8,40.4-19.6,54.8l-62.4,62.4v209.6c0,18-7.2,35.2-20,48l-8.8,8.8C309.873,422.86,307.073,424.06,303.873,424.06z M307.473,411.26L307.473,411.26L307.473,411.26z M250.673,225.26c0.8,0,1.2,0,2,0.4c2.8,0.8,4.8,2.8,5.6,5.6l47.2,173.2l4-4c10-10,15.2-22.8,15.2-36.8v-212.8c0-2,0.8-4,2.4-5.6l65.2-64.8c11.2-11.2,16.8-26.4,14.8-42l-0.8-7.6c-0.8-8-7.2-14-15.2-14.4l-6.4-0.4c-14.8-0.8-29.2,4.8-39.6,15.2l-66.4,66c-1.6,1.6-3.6,2.4-5.6,2.4l0,0l-212.8-0.4c-13.2,0-26.8,5.6-36.4,15.2l-4,4l173.2,47.2c2.8,0.8,4.8,2.8,5.6,5.6s0,5.6-2,7.6l-50.8,51.2c-1.6,1.6-3.2,2.4-5.2,2.4l-74,2.4c-3.2,0-6,1.2-8.4,3.6l-2.4,2.4l87.2,32.8c2,0.8,4,2.4,4.8,4.8l34.8,90l2.8-2.8c2.8-2.8,3.6-6,3.6-8.4l2.8-73.2c0-2,0.8-4,2.4-5.2l50.8-50.8C246.673,226.06,248.673,225.26,250.673,225.26z M177.873,373.26L177.873,373.26L177.873,373.26z M51.873,245.26L51.873,245.26C51.873,245.66,51.873,245.66,51.873,245.26z M49.473,238.86L49.473,238.86L49.473,238.86z"
        />
      </g>
    </svg>
  );

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 6,
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transition: "opacity 360ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke={PATH_STROKE_COLOR}
          strokeWidth={PATH_STROKE_WIDTH}
          strokeDasharray={PATH_DASH_ARRAY}
          strokeLinecap="round"
          opacity="0.18"
        />
        <path
          ref={trailRef}
          fill="none"
          stroke={PATH_STROKE_COLOR}
          strokeWidth={PATH_STROKE_WIDTH}
          strokeLinecap="round"
        />
      </svg>
      {/* Plane lives outside the SVG so its transform hits the GPU compositor
          instead of forcing an SVG layout pass every frame.
          The outer wrapper takes the full document height (set imperatively
          by buildPath) so the public layout's overflow-y-clip can't slice
          the artwork. The inner div is what actually translates. */}
      <div
        ref={planeWrapperRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 0,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 7,
        }}
      >
        <div
          ref={planeRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PLANE_SIZE,
            height: PLANE_SIZE,
            willChange: "transform",
            transform: "translate3d(-9999px,-9999px,0)",
            opacity: visible ? 1 : 0,
            transition: "opacity 360ms cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          {planeArtwork}
        </div>
      </div>
    </>
  );
}
