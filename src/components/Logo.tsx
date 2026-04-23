interface Props {
  className?: string;
  /** Tamaño del SVG en px (alto y ancho) */
  size?: number;
}

/**
 * Logo sudo.labs — "S." dentro de un círculo fino con glow violeta.
 * El círculo gira lentamente de forma continua (animate-logo-spin definida en styles.css).
 */
export function Logo({ className = "", size = 36 }: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Glow detrás */}
      <span className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-70" />

      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        <defs>
          <linearGradient id="logo-ring-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="hsl(var(--primary-glow, var(--primary)))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Anillo giratorio (segmentado para que se note la rotación) */}
        <g className="origin-center animate-logo-spin">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#logo-ring-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="78 35"
          />
        </g>

        {/* "S." centrada, estática */}
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="18"
          fill="hsl(var(--foreground))"
        >
          S
        </text>
        <circle cx="27.5" cy="26" r="1.4" fill="hsl(var(--primary))" />
      </svg>
    </span>
  );
}
