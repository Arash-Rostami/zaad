"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], select, label[for], [tabindex]:not([tabindex="-1"]), .cursor-pointer';

function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [hover, setHover] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const opacity = useMotionValue(0);

    const springConfig = useMemo(
        () =>
            reducedMotion
                ? { damping: 100, stiffness: 5000, mass: 0.1 }
                : { damping: 30, stiffness: 400, mass: 0.25 },
        [reducedMotion]
    );

    const ringX = useSpring(x, springConfig);
    const ringY = useSpring(y, springConfig);

    const pos = useRef({ x: -100, y: -100 });
    const frame = useRef(null);

    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        setEnabled(true);
        document.documentElement.classList.add("custom-cursor-active");
        return () => document.documentElement.classList.remove("custom-cursor-active");
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const onChange = (e) => setReducedMotion(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const flush = () => {
            x.set(pos.current.x);
            y.set(pos.current.y);
            frame.current = null;
        };

        const onMove = (e) => {
            pos.current.x = e.clientX;
            pos.current.y = e.clientY;
            if (opacity.get() !== 1) opacity.set(1);
            if (!frame.current) frame.current = requestAnimationFrame(flush);
        };

        const onOver = (e) => {
            const target = e.target;
            if (!target || typeof target.closest !== "function") return;
            setHover(!!target.closest(INTERACTIVE_SELECTOR));
        };

        const onDown = () => setIsPressed(true);
        const onUp = () => setIsPressed(false);
        const onLeaveDoc = () => opacity.set(0);
        const onEnterDoc = () => opacity.set(1);

        document.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("pointerover", onOver, { passive: true });
        document.addEventListener("mousedown", onDown, { passive: true });
        document.addEventListener("mouseup", onUp, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeaveDoc, { passive: true });
        document.documentElement.addEventListener("mouseenter", onEnterDoc, { passive: true });

        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("pointerover", onOver);
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("mouseup", onUp);
            document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
            document.documentElement.removeEventListener("mouseenter", onEnterDoc);
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, [enabled, x, y, opacity]);

    if (!enabled) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
            style={{ opacity }}
        >
            <motion.span
                className="absolute top-0 left-0 rounded-full border"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isPressed ? 18 : hover ? 26 : 22,
                    height: isPressed ? 18 : hover ? 26 : 22,
                    borderColor: hover ? "var(--text-bronze, #b4783c)" : "var(--border-color-15, rgba(20, 19, 16, 0.15))",
                    backgroundColor: hover ? "color-mix(in srgb, var(--text-bronze) 8%, transparent)" : "transparent",
                    scale: isPressed ? 0.9 : 1,
                }}
                transition={
                    reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                }
            />

            <motion.svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="absolute top-0 left-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                style={{
                    x,
                    y,
                    translateX: "-12%",
                    translateY: "-8%",
                }}
                animate={{
                    scale: isPressed ? 0.88 : hover ? 0.94 : 1,
                }}
                transition={
                    reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
                }
            >
                <path
                    d="M2 1.5 L2 15.5 L5.6 12 L7.9 16.7 L9.9 15.8 L7.6 11.1 L12.5 11.1 Z"
                    style={{ fill: "var(--color-ink)", stroke: "var(--color-surface)" }}
                    strokeWidth="1"
                    strokeLinejoin="round"
                />
            </motion.svg>
        </motion.div>
    );
}

export default React.memo(CustomCursor);