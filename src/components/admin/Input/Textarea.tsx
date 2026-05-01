import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-cream-deep border border-cream-deep text-ink font-sans text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-ochre focus:bg-cream transition-colors duration-200 placeholder:text-muted/50 resize-none ${className}`}
        {...props}
      />
    );
  }
);
