import React, { memo, useMemo } from "react";

const NoiseBg = memo(function NoiseBg({ filterId = "noiseBg", revealOnHover = false, className = "" }) {
  const noise = useMemo(
      () => (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <filter id={filterId} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
      ),
      [filterId]
  );

  const style = useMemo(
      () => ({ opacity: "var(--noise-opacity)", mixBlendMode: "var(--noise-blend)" }),
      []
  );

  return (
      <div
          className={`absolute inset-0 overflow-hidden pointer-events-none ${
              revealOnHover
                  ? `opacity-0 group-hover:opacity-[var(--noise-opacity)] transition-opacity duration-700 ${className}`
                  : className
          }`}
          style={revealOnHover ? { mixBlendMode: "var(--noise-blend)" } : style}
      >
        {noise}
      </div>
  );
});

export default NoiseBg;