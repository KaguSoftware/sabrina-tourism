"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { m, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import {
  PATH_MARGIN_FRACTION,
  PATH_STROKE_COLOR,
  PATH_STROKE_WIDTH,
  PATH_DASH_ARRAY,
  PLANE_SIZE,
  PLANE_SIZE_MOBILE,
  SAMPLE_COUNT,
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

function buildRawPoints(w: number, h: number) {
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
  return rawPts.map((p, i) =>
    i === rawPts.length - 1 ? p : { x: p.x, y: p.y * scale }
  );
}

type Sample = { x: number; y: number; rot: number };

// Sample N points evenly along an SVG path; angle = direction to next sample,
// smoothed by looking +/-1 sample to kill apex jitter.
function samplePath(pathEl: SVGPathElement, count: number): Sample[] {
  const total = pathEl.getTotalLength();
  if (total === 0) return [];
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const p = pathEl.getPointAtLength(t * total);
    xs[i] = p.x;
    ys[i] = p.y;
  }
  const out: Sample[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(count - 1, i + 1);
    const rot = (Math.atan2(ys[b] - ys[a], xs[b] - xs[a]) * 180) / Math.PI;
    out.push({ x: xs[i], y: ys[i], rot });
  }
  return out;
}

function buildKeyframesCss(
  samples: Sample[],
  planeSize: number,
  animName: string
): string {
  const half = planeSize / 2;
  const stops = samples
    .map((s, i) => {
      const pct = ((i / (samples.length - 1)) * 100).toFixed(3);
      const tx = (s.x - half).toFixed(2);
      const ty = (s.y - half).toFixed(2);
      return `${pct}% { transform: translate3d(${tx}px, ${ty}px, 0) rotate(${s.rot.toFixed(2)}deg); }`;
    })
    .join("\n");
  return `@keyframes ${animName} {\n${stops}\n}`;
}

function PlaneSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-6 -6 36 36"
      fill="#f5ede0"
      stroke="#8a6529"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <g transform="rotate(45 12 12)">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>
    </svg>
  );
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Geom = {
  width: number;
  height: number;
  pathD: string;
  samples: Sample[];
  planeSize: number;
};

export function PaperPlanePath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measurePathRef = useRef<SVGPathElement>(null);
  const [geom, setGeom] = useState<Geom | null>(null);
  const [supportsNative, setSupportsNative] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSupportsNative(
      typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("animation-timeline: scroll()")
    );
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const measure = () => {
    const wrapper = wrapperRef.current;
    const measurePath = measurePathRef.current;
    if (!wrapper || !measurePath) return;
    const w = document.documentElement.clientWidth;
    const planeSize = w < 640 ? PLANE_SIZE_MOBILE : PLANE_SIZE;

    // hide our wrapper so its height doesn't bias the document measurement
    const prevDisplay = wrapper.style.display;
    wrapper.style.display = "none";
    const h = document.documentElement.scrollHeight;
    wrapper.style.display = prevDisplay;

    const pathD = catmullRomPath(buildRawPoints(w, h));
    measurePath.setAttribute("d", pathD);
    const samples = samplePath(measurePath, SAMPLE_COUNT);

    setGeom({ width: w, height: h, pathD, samples, planeSize });
  };

  useIsoLayoutEffect(() => {
    measure();
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };
    window.addEventListener("resize", onResize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(document.documentElement);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: geom?.width ?? 0,
        height: geom?.height ?? 0,
        pointerEvents: "none",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      {/* offscreen measurer for getPointAtLength sampling */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, visibility: "hidden" }}
      >
        <path ref={measurePathRef} />
      </svg>

      {geom && !reduced && (
        <Overlay geom={geom} supportsNative={supportsNative} />
      )}
      {geom && reduced && <StaticOverlay geom={geom} />}
    </div>
  );
}

function StaticPathSVG({ geom }: { geom: Geom }) {
  // Static dashed path. Painted ONCE. No animation on this SVG, so the
  // document-tall layer is composited cheaply on scroll (no invalidation).
  return (
    <svg
      width={geom.width}
      height={geom.height}
      viewBox={`0 0 ${geom.width} ${geom.height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <path
        d={geom.pathD}
        fill="none"
        stroke={PATH_STROKE_COLOR}
        strokeWidth={PATH_STROKE_WIDTH}
        strokeDasharray={PATH_DASH_ARRAY}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}

function Overlay({
  geom,
  supportsNative,
}: {
  geom: Geom;
  supportsNative: boolean;
}) {
  return supportsNative ? (
    <NativeOverlay geom={geom} />
  ) : (
    <FallbackOverlay geom={geom} />
  );
}

function NativeOverlay({ geom }: { geom: Geom }) {
  // Build keyframes from the precomputed samples. The plane's transform is
  // the only animated property; animation-timeline: scroll(root) drives it
  // on the compositor.
  const css = buildKeyframesCss(geom.samples, geom.planeSize, "plane-fly");
  return (
    <>
      <StaticPathSVG geom={geom} />
      <style>{css}</style>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: geom.planeSize,
          height: geom.planeSize,
          willChange: "transform",
          animation: "plane-fly linear both",
          animationTimeline: "scroll(root block)",
        }}
      >
        <PlaneSVG size={geom.planeSize} />
      </div>
    </>
  );
}

function FallbackOverlay({ geom }: { geom: Geom }) {
  // Motion fallback: scrollYProgress → x/y/rot via N-stop useTransform.
  // One MotionValue, one transform write per scroll frame.
  const half = geom.planeSize / 2;
  const inputs = geom.samples.map((_, i) => i / (geom.samples.length - 1));
  const xs = geom.samples.map((s) => s.x - half);
  const ys = geom.samples.map((s) => s.y - half);
  const rots = geom.samples.map((s) => s.rot);

  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, inputs, xs);
  const y = useTransform(scrollYProgress, inputs, ys);
  const rot = useTransform(scrollYProgress, inputs, rots);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;

  return (
    <>
      <StaticPathSVG geom={geom} />
      <m.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: geom.planeSize,
          height: geom.planeSize,
          willChange: "transform",
          transform,
        }}
      >
        <PlaneSVG size={geom.planeSize} />
      </m.div>
    </>
  );
}

function StaticOverlay({ geom }: { geom: Geom }) {
  // prefers-reduced-motion: show the path but pin the plane at the start.
  const half = geom.planeSize / 2;
  const s = geom.samples[0];
  return (
    <>
      <StaticPathSVG geom={geom} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: geom.planeSize,
          height: geom.planeSize,
          transform: `translate3d(${s.x - half}px, ${s.y - half}px, 0) rotate(${s.rot}deg)`,
        }}
      >
        <PlaneSVG size={geom.planeSize} />
      </div>
    </>
  );
}
