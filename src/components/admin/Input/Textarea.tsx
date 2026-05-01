import { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 placeholder:text-muted/50 resize-none ${className}`}
        {...props}
      />
    );
  }
);
