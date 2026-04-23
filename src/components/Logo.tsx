interface Props {
  className?: string;
  size?: number;
}

/**
 * Logo sudo.labs — "S." dentro de un anillo violeta segmentado que rota lentamente.
 * Replica visualmente el logo del sitio sodulabs.lovable.app.
 */
export function Logo({ className = "", size = 36 }: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Glow violeta detrás */}
      <span
        className="absolute inset-1 rounded-full blur-md opacity-70"
        style={{ background: "var(--primary)" }}
      />

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
            <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Anillo segmentado giratorio */}
        <g className="animate-logo-spin">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#logo-ring-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="80 33"
          />
        </g>

        {/* "S" centrada */}
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="19"
          fill="var(--foreground)"
        >
          S
        </text>
        {/* Punto violeta junto a la S */}
        <circle cx="28" cy="26.5" r="1.5" fill="var(--primary)" />
      </svg>
    </span>
  );
}
