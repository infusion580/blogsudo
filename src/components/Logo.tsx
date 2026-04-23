import { useEffect, useState } from "react";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  variant?: "default" | "mono";
}

/**
 * Sudo Labs — Identidad de marca (réplica exacta del original).
 * Mark: monograma "S" estilizado con cursor de terminal parpadeante,
 * inscrito en un círculo geométrico (sello).
 * Wordmark: "sudo" en peso ligero + ".labs" en bold con gradiente.
 */
export function Logo({ size = 36, showWordmark = true, className = "", variant = "default" }: LogoProps) {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(id);
  }, []);

  const stroke = variant === "mono" ? "currentColor" : "url(#sudo-logo-gradient)";
  const cursorFill = variant === "mono" ? "currentColor" : "url(#sudo-logo-gradient)";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="sudo-logo-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.72 0.25 300)" />
            <stop offset="55%" stopColor="oklch(0.62 0.24 295)" />
            <stop offset="100%" stopColor="oklch(0.45 0.22 280)" />
          </linearGradient>
        </defs>

        {/* Sello circular sutil */}
        <circle cx="32" cy="32" r="29" stroke={stroke} strokeWidth="1.25" opacity="0.35" />

        {/* Monograma "S" estilizado */}
        <path
          d="M42 22 C 42 17, 36 15, 30 15 C 23 15, 19 18, 19 23 C 19 28, 24 30, 30 32 C 36 34, 42 36, 42 41 C 42 47, 36 49, 30 49 C 23 49, 19 46, 19 41"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="square"
          fill="none"
        />

        {/* Cursor de terminal — parpadea cada 600ms */}
        <rect
          x="44"
          y="45"
          width="8"
          height="3"
          fill={cursorFill}
          opacity={blink ? 1 : 0.15}
          style={{ transition: "opacity 0.15s ease" }}
        />
      </svg>

      {showWordmark && (
        <div className="flex items-baseline gap-0 font-display tracking-tight leading-none">
          <span className="font-light text-foreground/85">sudo</span>
          <span
            className={variant === "mono" ? "text-foreground" : "text-gradient-primary"}
            style={{ fontWeight: 700 }}
          >
            .labs
          </span>
        </div>
      )}
    </div>
  );
}
