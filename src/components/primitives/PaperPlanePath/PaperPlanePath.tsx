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
  const planeRef = useRef<SVGGElement>(null);
  const pathLengthRef = useRef(0);
  const planeSizeRef = useRef(PLANE_SIZE);

  // Smoothing: targetProgress is updated synchronously from scroll, displayed
  // progress lerps toward it inside an rAF loop. This kills the jitter that
  // came from binding the plane 1:1 to wheel events.
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const rafRef = useRef(0);
  const inViewRef = useRef(true);
  // Track the last frame timestamp so the lerp can be framerate-independent:
  // a high-refresh display (120Hz) should not converge twice as fast as 60Hz.
  const lastTickRef = useRef(0);

  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const buildPath = useCallback(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;
    if (!svg || !pathEl || !trailEl) return;

    const w = document.documentElement.clientWidth;
    planeSizeRef.current = w < 640 ? 26 : PLANE_SIZE;

    // Measure content height without including the SVG itself.
    const prevDisplay = svg.style.display;
    svg.style.display = "none";
    const h = document.documentElement.scrollHeight;
    svg.style.display = prevDisplay;

    // Bail out on transient mid-navigation short pages — ResizeObserver will
    // re-trigger this when real content lands.
    if (h < window.innerHeight * 1.2) return;

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.style.height = `${h}px`;

    const isMobile = w < 640;
    const mid = w / 2;
    const lx = isMobile ? w * 0.08 : Math.min(120, w * PATH_MARGIN_FRACTION) + 40;
    const rx = isMobile
      ? w * 0.92
      : w - Math.min(120, w * PATH_MARGIN_FRACTION) - 40;

    // Smoother, wider arcs with fewer hard reversals than before.
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
  }, []);

  // Paint the plane and trail at a given normalized progress (0..1).
  const paint = useCallback((progress: number) => {
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;
    const planeEl = planeRef.current;
    const total = pathLengthRef.current;
    if (!pathEl || !trailEl || !planeEl || !total) return;

    const dist = progress * total;
    const pt = pathEl.getPointAtLength(dist);
    // Sample further ahead for stable rotation (8px gives much smoother angle
    // changes than 4px on tight curves).
    const ahead = pathEl.getPointAtLength(Math.min(total, dist + 8));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

    trailEl.setAttribute("stroke-dashoffset", String(total - dist));

    const ps = planeSizeRef.current;
    planeEl.setAttribute(
      "transform",
      `translate(${(pt.x - ps / 2).toFixed(2)} ${(pt.y - ps / 2).toFixed(2)}) rotate(${angle.toFixed(2)} ${ps / 2} ${ps / 2}) scale(${(ps / PLANE_SIZE).toFixed(3)})`,
    );
  }, []);

  const computeTargetProgress = useCallback(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / docH));
  }, []);

  const tick = useCallback((now: number) => {
    const target = targetProgressRef.current;
    const display = displayProgressRef.current;
    const diff = target - display;
    const absDiff = Math.abs(diff);

    // Framerate-independent lerp via exponential decay: `1 - exp(-rate * dt)`.
    // A higher decay rate = snappier convergence. We use TWO rates:
    //   - a fast rate that kicks in on the first frame after a restart, so
    //     the plane catches up immediately when you scroll after stopping;
    //   - a softer steady-state rate for the tail of the easing so it still
    //     glides into position rather than snapping.
    const dt = lastTickRef.current
      ? Math.min(0.05, (now - lastTickRef.current) / 1000) // clamp at 20fps worst-case
      : 1 / 60;
    lastTickRef.current = now;

    // Stop the loop when settled; resume on next scroll.
    if (absDiff < 0.0005) {
      displayProgressRef.current = target;
      paint(target);
      rafRef.current = 0;
      lastTickRef.current = 0;
      return;
    }

    // Adaptive decay rate: large remaining distance → snappy (rate ~18),
    // small remaining distance → smooth (rate ~9). Maps roughly to alpha
    // 0.26 → 0.14 per frame at 60fps, but stays consistent at any refresh.
    const rate = absDiff > 0.04 ? 18 : 9 + absDiff * 225; // continuous blend
    const alpha = 1 - Math.exp(-rate * dt);

    displayProgressRef.current = display + diff * alpha;
    paint(displayProgressRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [paint]);

  const requestTick = useCallback(() => {
    if (rafRef.current) return;
    // Restart impulse: close 45% of the gap immediately so the plane never
    // feels frozen when you start scrolling after a pause. Without this,
    // small scroll deltas (a single trackpad tick = ~1% of doc) take many
    // frames for the lerp to make them visibly large.
    const target = targetProgressRef.current;
    const display = displayProgressRef.current;
    const diff = target - display;
    if (Math.abs(diff) > 0.0005) {
      displayProgressRef.current = display + diff * 0.45;
      paint(displayProgressRef.current);
    }
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick, paint]);

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
      if (inViewRef.current) requestTick();
    };

    const onResize = () => {
      buildPath();
      targetProgressRef.current = computeTargetProgress();
      // Snap on resize — interpolation across layout changes looks wrong.
      displayProgressRef.current = targetProgressRef.current;
      paint(displayProgressRef.current);
    };

    let rebuildScheduled = false;
    const onBodyResize = () => {
      if (rebuildScheduled) return;
      rebuildScheduled = true;
      requestAnimationFrame(() => {
        rebuildScheduled = false;
        buildPath();
        targetProgressRef.current = computeTargetProgress();
        displayProgressRef.current = targetProgressRef.current;
        paint(displayProgressRef.current);
      });
    };
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onBodyResize)
        : null;
    if (ro) ro.observe(document.body);

    // Skip per-frame work when the SVG is fully off-screen (rare since it
    // covers the whole doc, but cheap insurance against future layout
    // changes).
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && svgRef.current) {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) requestTick();
        },
        { rootMargin: "200px" },
      );
      io.observe(svgRef.current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildPath, paint, computeTargetProgress, requestTick, tick]);

  // On navigation: rebuild against the new layout once it settles. Hide the
  // plane briefly so it doesn't jitter to its new position visibly.
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

  return (
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
      {/* ghost track — dashed, very faint */}
      <path
        ref={pathRef}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeDasharray={PATH_DASH_ARRAY}
        strokeLinecap="round"
        opacity="0.18"
      />
      {/* trail that fills in behind the plane — solid, the dasharray on this
          one is used as a length mask, not a visual pattern */}
      <path
        ref={trailRef}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeLinecap="round"
      />
      {/* Original paper-plane artwork — kept visually identical. The outer
          <g ref={planeRef}> handles translate + rotate from the scroll loop;
          the inner <g rotate(45)> keeps the artwork's tip pointing along the
          path's direction-of-travel (the artwork is drawn pointing up-right). */}
      <g ref={planeRef}>
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
      </g>
    </svg>
  );
}
