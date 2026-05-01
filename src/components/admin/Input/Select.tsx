import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`w-full bg-transparent border-0 border-b border-rule text-ink font-sans text-[16px] px-0 py-2.5 focus:outline-none focus:border-ochre transition-colors duration-200 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
