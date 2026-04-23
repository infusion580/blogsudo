interface Props {
  className?: string;
  size?: number;
}

/**
 * Logo sudo.labs — réplica del original:
 * - Anillo circular violeta fino con glow suave.
 * - "S" italica violeta centrada.
 * - Pequeño punto violeta abajo a la derecha de la S.
 * - El anillo gira lentamente de forma continua (animate-logo-ring).
 */
export function Logo({ className = "", size = 32 }: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Glow violeta detrás del círculo */}
      <span
        className="absolute inset-0 rounded-full blur-md opacity-50"
        style={{ background: "var(--primary)" }}
      />

      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        {/* Anillo giratorio */}
        <g className="animate-logo-ring">
          <circle
            cx="16"
            cy="16"
            r="14.5"
            stroke="var(--primary)"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* "S" italica centrada */}
        <text
          x="16"
          y="17.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontStyle="italic"
          fontWeight="600"
          fontSize="15"
          fill="var(--primary)"
          letterSpacing="-0.5"
        >
          S
        </text>
        {/* Punto violeta a la derecha de la S */}
        <circle cx="22" cy="22" r="1.1" fill="var(--primary)" />
      </svg>
    </span>
  );
}
