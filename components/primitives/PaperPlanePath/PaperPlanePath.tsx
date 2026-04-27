"use client";
import { useEffect, useRef, useCallback } from "react";
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
  const planeRef = useRef<SVGGElement>(null);
  const pathLengthRef = useRef(0);
  const rafRef = useRef(0);

  const buildPath = useCallback(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    if (!svg || !pathEl) return;

    const w = window.innerWidth;
    const h = document.documentElement.scrollHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.style.height = `${h}px`;

    const margin = Math.min(120, w * PATH_MARGIN_FRACTION);
    const lx = margin + 40;
    const rx = w - margin - 40;
    const mid = w / 2;

    const rawPts = [
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

    const scale = h / 3500;
    const pts = rawPts.map((p, i) =>
      i === rawPts.length - 1 ? p : { x: p.x, y: p.y * scale }
    );

    const d = catmullRomPath(pts);
    pathEl.setAttribute("d", d);
    pathLengthRef.current = pathEl.getTotalLength();
  }, []);

  const updatePlane = useCallback((progress: number) => {
    const pathEl = pathRef.current;
    const planeEl = planeRef.current;
    if (!pathEl || !planeEl || !pathLengthRef.current) return;

    const total = pathLengthRef.current;
    const dist = progress * total;
    const pt = pathEl.getPointAtLength(dist);
    const ahead = pathEl.getPointAtLength(Math.min(total, dist + 4));
    const angle =
      (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI + 180;

    planeEl.setAttribute(
      "transform",
      `translate(${(pt.x - PLANE_SIZE / 2).toFixed(2)} ${(pt.y - PLANE_SIZE / 2).toFixed(2)}) rotate(${angle.toFixed(2)} ${PLANE_SIZE / 2} ${PLANE_SIZE / 2})`
    );
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    buildPath();
    setTimeout(buildPath, 300);
    setTimeout(buildPath, 1000);

    if (prefersReduced) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const docH =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
        updatePlane(progress);
      });
    };

    const onResize = () => {
      buildPath();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildPath, updatePlane]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "visible",
      }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeDasharray={PATH_DASH_ARRAY}
        strokeLinecap="round"
      />
      <g ref={planeRef}>
        {/* Paper plane: nose points right (toward positive x) */}
        <polygon
          points={`${PLANE_SIZE},${PLANE_SIZE / 2} 0,4 ${PLANE_SIZE * 0.32},${PLANE_SIZE / 2} 0,${PLANE_SIZE - 4}`}
          fill="#f5ede0"
          stroke="#c99a3f"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points={`${PLANE_SIZE * 0.32},${PLANE_SIZE / 2} 0,4 0,${PLANE_SIZE - 4}`}
          fill="#c99a3f"
          opacity="0.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
