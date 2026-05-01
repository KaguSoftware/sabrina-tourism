import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`w-full bg-cream-deep border border-cream-deep text-ink font-sans text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-ochre focus:bg-cream transition-colors duration-200 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
