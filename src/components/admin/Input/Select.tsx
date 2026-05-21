import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <div className={`relative ${className}`}>
        <select
          ref={ref}
          className="w-full bg-cream border border-rule text-ink font-sans text-[16px] pl-3 pr-9 py-2.5 rounded-sm hover:border-ink-soft/50 focus:outline-none focus:border-ochre focus:ring-2 focus:ring-ochre/20 focus:bg-cream transition-colors duration-150 appearance-none cursor-pointer disabled:opacity-60 disabled:bg-cream-warm disabled:cursor-not-allowed aria-invalid:border-terracotta aria-invalid:ring-terracotta/20"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);
