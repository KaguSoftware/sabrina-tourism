import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 placeholder:text-muted/50 ${className}`}
        {...props}
      />
    );
  }
);
