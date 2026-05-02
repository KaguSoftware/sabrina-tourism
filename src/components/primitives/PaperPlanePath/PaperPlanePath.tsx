"use client";
import { useEffect, useRef, useCallback } from "react";
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
  const rafRef = useRef(0);
  const rebuildTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pathname = usePathname();

  const buildPath = useCallback(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;
    if (!svg || !pathEl || !trailEl) return;

    const w = document.documentElement.clientWidth;
    planeSizeRef.current = w < 640 ? 28 : PLANE_SIZE;
    // Measure content height excluding the SVG itself
    svg.style.display = "none";
    const h = document.documentElement.scrollHeight;
    svg.style.display = "";
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.style.height = `${h}px`;

    const isMobile = w < 640;
    const mid = w / 2;
    // on mobile push edges beyond margin so the path swings wide
    const lx = isMobile ? w * 0.06 : Math.min(120, w * PATH_MARGIN_FRACTION) + 40;
    const rx = isMobile ? w * 0.94 : w - Math.min(120, w * PATH_MARGIN_FRACTION) - 40;

    const rawPts = isMobile ? [
      { x: mid,        y: 160  },
      { x: rx,         y: 380  },
      { x: lx,         y: 620  },
      { x: rx,         y: 900  },
      { x: mid * 0.4,  y: 1180 },
      { x: rx,         y: 1480 },
      { x: lx,         y: 1780 },
      { x: mid * 1.6,  y: 2080 },
      { x: lx,         y: 2400 },
      { x: rx,         y: 2720 },
      { x: lx,         y: 3060 },
      { x: mid,        y: h - 160 },
    ] : [
      { x: mid - 40, y: 180  },
      { x: rx,       y: 480  },
      { x: mid + 20, y: 860  },
      { x: lx,       y: 1260 },
      { x: mid + 60, y: 1700 },
      { x: lx,       y: 2150 },
      { x: rx - 40,  y: 2600 },
      { x: lx + 80,  y: 3100 },
      { x: mid,      y: h - 200 },
    ];

    const refH = isMobile ? 3200 : 3500;
    const scale = h / refH;
    const pts = rawPts.map((p, i) =>
      i === rawPts.length - 1 ? p : { x: p.x, y: p.y * scale }
    );

    const d = catmullRomPath(pts);
    pathEl.setAttribute("d", d);
    trailEl.setAttribute("d", d);
    const total = pathEl.getTotalLength();
    pathLengthRef.current = total;
    // trail: starts fully hidden, revealed as plane moves
    trailEl.setAttribute("stroke-dasharray", String(total));
    trailEl.setAttribute("stroke-dashoffset", String(total));
  }, []);

  const updatePlane = useCallback((progress: number) => {
    const pathEl = pathRef.current;
    const trailEl = trailRef.current;
    const planeEl = planeRef.current;
    if (!pathEl || !trailEl || !planeEl || !pathLengthRef.current) return;

    const total = pathLengthRef.current;
    const dist = progress * total;
    const pt = pathEl.getPointAtLength(dist);
    const ahead = pathEl.getPointAtLength(Math.min(total, dist + 4));
    const angle =
      (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

    // reveal trail behind the plane
    trailEl.setAttribute("stroke-dashoffset", String(total - dist));

    const ps = planeSizeRef.current;
    planeEl.setAttribute(
      "transform",
      `translate(${(pt.x - ps / 2).toFixed(2)} ${(pt.y - ps / 2).toFixed(2)}) rotate(${angle.toFixed(2)} ${ps / 2} ${ps / 2}) scale(${ps / PLANE_SIZE})`
    );
  }, []);

  const getProgress = useCallback(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const rawProgress = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
    const viewportBias = window.scrollY / document.documentElement.scrollHeight;
    return Math.min(1, rawProgress * 0.4 + viewportBias * 0.6);
  }, []);

  // Initial mount: set up scroll + resize listeners.
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    buildPath();
    updatePlane(0);

    if (prefersReduced) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        updatePlane(getProgress());
      });
    };

    const onResize = () => { buildPath(); onScroll(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildPath, updatePlane, getProgress]);

  // On every page navigation: snap plane to top, then rebuild once new page has rendered.
  useEffect(() => {
    // Cancel any pending rebuild timers from a previous navigation.
    rebuildTimersRef.current.forEach(clearTimeout);
    rebuildTimersRef.current = [];

    // Cancel any in-flight RAF so stale progress isn't applied after rebuild.
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    // Immediately snap to position 0 — scroll resets to 0 on navigation.
    updatePlane(0);

    // Rebuild after the new page's content has painted (two passes for safety).
    rebuildTimersRef.current.push(
      setTimeout(() => { buildPath(); updatePlane(getProgress()); }, 80),
      setTimeout(() => { buildPath(); updatePlane(getProgress()); }, 400),
    );

    return () => {
      rebuildTimersRef.current.forEach(clearTimeout);
      rebuildTimersRef.current = [];
    };
  }, [pathname, buildPath, updatePlane, getProgress]);


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
      }}
    >
      {/* ghost track — full path, very faint */}
      <path
        ref={pathRef}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeDasharray={PATH_DASH_ARRAY}
        strokeLinecap="round"
        opacity="0.18"
      />
      {/* revealed trail — follows the plane */}
      <path
        ref={trailRef}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeDasharray={PATH_DASH_ARRAY}
        strokeLinecap="round"
      />
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
