import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { AnimatePresence, motion } from "motion/react";

function Tooltip({ label, children, side = "top", className = "" }) {
    const [isVisible, setIsVisible] = useState(false);
    const [hoverCapable, setHoverCapable] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setHoverCapable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const close = () => setIsVisible(false);
        const handleOutsidePointerDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
        };
        document.addEventListener("pointerdown", handleOutsidePointerDown);
        document.addEventListener("pointercancel", close);
        document.addEventListener("contextmenu", close);
        window.addEventListener("scroll", close, true);
        return () => {
            document.removeEventListener("pointerdown", handleOutsidePointerDown);
            document.removeEventListener("pointercancel", close);
            document.removeEventListener("contextmenu", close);
            window.removeEventListener("scroll", close, true);
        };
    }, [isVisible]);

    const showTooltip = useCallback(() => setIsVisible(true), []);
    const hideTooltip = useCallback(() => setIsVisible(false), []);

    const handleMouseEnter = hoverCapable ? showTooltip : undefined;
    const handleMouseLeave = hoverCapable ? hideTooltip : undefined;

    const handleFocus = useCallback((e) => {
        if (e.target.matches(":focus-visible")) setIsVisible(true);
    }, []);

    const handlePointerDown = useCallback((e) => {
        if (e.pointerType === "touch") setIsVisible((visible) => !visible);
    }, []);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key !== "Escape" || !isVisible) return;
            e.nativeEvent.stopImmediatePropagation();
            setIsVisible(false);
            wrapperRef.current?.querySelector("button, a, input, select, textarea")?.focus();
        },
        [isVisible]
    );

    const sideClasses =
        side === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2" : "bottom-full left-1/2 -translate-x-1/2 mb-2";

    return (
        <span
            ref={wrapperRef}
            className={`relative inline-flex ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={hideTooltip}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
        >
            {children}
            <AnimatePresence>
                {isVisible && label && (
                    <motion.span
                        role="tooltip"
                        initial={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-panel-frost backdrop-blur-[6px] border border-ink-mild shadow-canvas-lift text-ink text-[length:calc(9px*var(--zaad-font-scale))] font-mono uppercase px-3.5 py-1.5 ${sideClasses}`}
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
}

export default memo(Tooltip);