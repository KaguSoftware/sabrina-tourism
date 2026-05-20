"use client";
import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "framer-motion";
import { DEFAULT_PARALLAX_AMOUNT } from "./constants";
import type { ParallaxImageProps } from "./types";

export function ParallaxImage({
  src,
  alt,
  className = "",
  amount = DEFAULT_PARALLAX_AMOUNT,
  objectPosition = "center",
  priority = false,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  const range = 50 * amount;
  const y = useTransform(scrollYProgress, [0, 1], [`${range}%`, `-${range}%`]);

  return (
    <div ref={wrapRef} className={`parallax-wrap ${className}`}>
      <m.div
        style={{
          position: "absolute",
          inset: "-15% 0",
          scale: 1.12,
          y,
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          style={{ objectFit: "cover", objectPosition }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </m.div>
    </div>
  );
}
