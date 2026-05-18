interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: 16,
  md: 28,
  lg: 48,
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const px = SIZES[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      className={`animate-spin ${className}`}
      aria-label="Loading"
      role="status"
    >
      {/* Background track */}
      <circle cx="24" cy="24" r="20" stroke="#d6cab5" strokeWidth="3.5" />
      {/* Ochre arc — ~270° sweep */}
      <path
        d="M24 4 A20 20 0 1 1 4 24"
        stroke="#c99a3f"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Navy accent dot at the leading tip */}
      <circle cx="24" cy="4" r="3" fill="#0b1a2e" />
    </svg>
  );
}
