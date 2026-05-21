import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-cream border border-rule text-ink font-sans text-[16px] px-3 py-2.5 rounded-sm hover:border-ink-soft/50 focus:outline-none focus:border-ochre focus:ring-2 focus:ring-ochre/20 focus:bg-cream transition-colors duration-150 placeholder:text-muted/60 disabled:opacity-60 disabled:bg-cream-warm disabled:cursor-not-allowed resize-none aria-invalid:border-terracotta aria-invalid:ring-terracotta/20 ${className}`}
        {...props}
      />
    );
  }
);
