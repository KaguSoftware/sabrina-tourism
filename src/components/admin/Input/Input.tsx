import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full bg-cream-deep border border-cream-deep text-ink font-sans text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-ochre focus:bg-cream transition-colors duration-200 placeholder:text-muted/50 ${className}`}
        {...props}
      />
    );
  }
);
