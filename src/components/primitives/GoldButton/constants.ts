export const BTN_BASE =
  "inline-flex items-center gap-3 px-6 py-4 font-sans text-[13px] font-medium tracking-[0.16em] uppercase transition-all duration-300 relative overflow-hidden group";

export const BTN_VARIANTS = {
  solid:
    "border active:scale-[0.97] shadow-[0_4px_32px_-6px_rgba(11,26,46,0.45)] hover:shadow-[0_8px_40px_-6px_rgba(11,26,46,0.35)] hover:scale-[1.02]",
  ghost:
    "bg-transparent text-cream border border-cream/40 hover:text-ochre hover:border-ochre active:scale-[0.97]",
  "ghost-navy":
    "bg-navy text-ochre border border-cream/40 hover:border-ochre active:scale-[0.97]",
  "ghost-light":
    "bg-transparent text-cream border border-ochre hover:bg-ochre hover:text-navy active:scale-[0.97]",
};
