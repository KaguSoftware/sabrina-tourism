import Link from "next/link";

export function HotelBackButton() {
  return (
    <Link
      href="/packages/custom?step=hotels#custom-tour-wizard"
      style={{ color: "var(--color-ochre)" }}
      className="fixed bottom-5 left-[clamp(20px,4vw,56px)] right-[clamp(20px,4vw,56px)] z-40 inline-flex items-center justify-center gap-3 bg-navy px-6 py-3 font-mono text-[13px] font-semibold tracking-[0.16em] uppercase shadow-[4px_6px_0_-1px_#c99a3f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-soft hover:shadow-[6px_8px_0_-1px_#c99a3f] sm:bottom-auto sm:left-[max(clamp(20px,4vw,56px),calc((100vw-1320px)/2+clamp(20px,4vw,56px)))] sm:right-auto sm:top-24"
    >
      <span className="text-[17px] leading-none">&larr;</span>
      <span>Back to custom tour</span>
    </Link>
  );
}
