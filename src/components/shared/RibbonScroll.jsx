import React, { useEffect, useState } from "react";

function RibbonScroll({
  height = "h-12 sm:h-14",
  copyClassName = "h-5 sm:h-6",
  opacityClassName = "opacity-[0.18]",
  copies = 6,
  className = "",
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPrefersReducedMotion(true);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${height} ${className}`}
    >
      {prefersReducedMotion ? (
        <div className="relative z-10 flex h-full items-center justify-center">
          <img
            src="/logo-ribbon.svg"
            alt=""
            className={`${copyClassName} w-auto ${opacityClassName}`}
          />
        </div>
      ) : (
        <div dir="ltr" className="relative z-10 flex h-full items-center overflow-hidden">
          <div className="ribbon-wordmark-glide flex w-max items-center">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 items-center">
                {Array.from({ length: copies }).map((_, i) => (
                  <img
                    key={i}
                    src="/logo-ribbon.svg"
                    alt=""
                    className={`${copyClassName} w-auto shrink-0 mx-8 sm:mx-10 ${opacityClassName}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(RibbonScroll);