import Image from "next/image";

interface LogoLoaderProps {
  label?: string;
  fullscreen?: boolean;
}

// Branded loading state — pulses the Sabrina logo with an ochre rotating ring.
// Pure CSS animations (no client JS), respects prefers-reduced-motion via
// `motion-safe:` modifiers.
export function LogoLoader({ label = "Loading", fullscreen = false }: LogoLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={
        fullscreen
          ? "fixed inset-0 z-100 flex items-center justify-center bg-cream"
          : "flex items-center justify-center py-24"
      }
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-24 h-24 md:w-28 md:h-28">
          {/* Rotating ochre ring */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-ochre border-r-ochre/30 motion-safe:animate-[spin_1.4s_linear_infinite]"
          />
          {/* Counter-rotating inner ring */}
          <span
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-transparent border-b-navy/30 motion-safe:animate-[spin_2.6s_linear_infinite_reverse]"
          />
          {/* Logo (pulses softly) */}
          <span className="absolute inset-0 flex items-center justify-center motion-safe:animate-[logo-pulse_1.8s_ease-in-out_infinite]">
            <Image
              src="/logo_2_sabrina_cropped.png"
              alt=""
              width={64}
              height={64}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
              priority
            />
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-ink-soft motion-safe:animate-[fade-pulse_1.6s_ease-in-out_infinite]">
          {label}
        </span>
      </div>
    </div>
  );
}
