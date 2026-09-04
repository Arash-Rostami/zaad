import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function ExpandOnHoverPill({
                             isExpanded,
                             onHoverChange,
                             trigger,
                             children,
                             className = "",
                             panelClassName = "",
                             rtl = false,
                             dropdown = false,
                             reservedWidth,
                             reservedHeight,
                           }) {
  const slideOffset = rtl ? -15 : 15;
  const rootRef = useRef(null);
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    setHoverCapable(
        window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  useEffect(() => {
    if (!dropdown || !isExpanded) return;
    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        onHoverChange(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onHoverChange(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdown, isExpanded, onHoverChange]);

  const handleMouseEnter = useCallback(() => {
    if (hoverCapable) onHoverChange(true);
  }, [hoverCapable, onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    if (hoverCapable) onHoverChange(false);
  }, [hoverCapable, onHoverChange]);

  const handleTriggerClick = useCallback(() => {
    onHoverChange(!isExpanded);
  }, [onHoverChange, isExpanded]);

  if (dropdown) {
    return (
        <div
            ref={rootRef}
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
          <button
              type="button"
              onClick={handleTriggerClick}
              aria-expanded={isExpanded}
              className={`flex items-center justify-center rounded-md select-none cursor-pointer ${className}`}
          >
            {trigger}
          </button>
          <AnimatePresence>
            {isExpanded && (
                <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-full end-0 mt-2 z-50 rounded-2xl overflow-hidden ${panelClassName}`}
                >
                  {children}
                </motion.div>
            )}
          </AnimatePresence>
        </div>
    );
  }

  const pill = (
      <motion.div
          layout
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          transition={{ layout: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
          className={`relative flex items-center rounded-md overflow-hidden select-none ${className}`}
      >
        <motion.div layout="position" className="flex items-center shrink-0">
          {trigger}
        </motion.div>
        <AnimatePresence initial={false}>
          {isExpanded && (
              <motion.div
                  key="content"
                  initial={{ opacity: 0, x: slideOffset }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideOffset }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center overflow-hidden"
              >
                {children}
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );

  if (!reservedWidth) return pill;

  return (
      <div
          className="relative shrink-0"
          style={{ width: reservedWidth, height: reservedHeight }}
      >
        <div className="absolute top-0 end-0">{pill}</div>
      </div>
  );
}

export default memo(ExpandOnHoverPill);