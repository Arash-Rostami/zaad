import React, { memo } from "react";

const NoiseBg = memo(function NoiseBg({ filterId = "noiseBg" }) {
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ opacity: "var(--noise-opacity)", mixBlendMode: "var(--noise-blend)" }}
        >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id={filterId} x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${filterId})`} />
            </svg>
        </div>
    );
});

export default NoiseBg;
