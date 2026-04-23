interface Props {
  className?: string;
}

export function Logo({ className = "h-8 w-8" }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(var(--primary-glow-l, 0.75) var(--primary-c, 0.22) var(--primary-h, 295))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#logo-grad)"
        strokeWidth="1.75"
        fill="none"
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="url(#logo-grad)"
      >
        S
      </text>
    </svg>
  );
}
