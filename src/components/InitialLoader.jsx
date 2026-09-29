"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const CONTAINER_VARIANTS = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: {
        opacity: 0,
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const LOGO_VARIANTS = {
    hidden: {
        opacity: 0,
        scale: 0.92,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.5,
            duration: 1.3,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const LINE_VARIANTS = {
    hidden: {
        scaleX: 0,
        opacity: 0
    },
    visible: {
        scaleX: 1,
        opacity: 1,
        transition: {
            delay: 1.6,
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const ENTRANCE_DONE_MS =
    Math.max(
        LOGO_VARIANTS.visible.transition.delay +
            LOGO_VARIANTS.visible.transition.duration,
        LINE_VARIANTS.visible.transition.delay +
            LINE_VARIANTS.visible.transition.duration,
    ) * 1000;

const EXIT_HOLD_MS = 600;
const EXIT_FADE_MS = CONTAINER_VARIANTS.exit.transition.duration * 1000;

const LOAD_WAIT_CAP_MS = ENTRANCE_DONE_MS + EXIT_HOLD_MS + 2000;

function InitialLoader({ isFarsi = false }) {
    const [isLoading, setIsLoading] = useState(true);
    const signaledRef = useRef(false);

    const signalComplete = () => {
        if (signaledRef.current) return;
        signaledRef.current = true;
        sessionStorage.setItem("zaad_loader_complete", "true");
        window.dispatchEvent(new Event("zaad:loaderComplete"));
    };

    useEffect(() => {
        const hasLoaded = sessionStorage.getItem("zaad_initial_loaded");
        if (hasLoaded) {
            setIsLoading(false);
            sessionStorage.setItem("zaad_loader_complete", "true");
            return;
        }

        sessionStorage.setItem("zaad_initial_loaded", "true");

        let done = false;
        let minTimer;
        let safetyTimer;
        const finish = () => {
            if (done) return;
            done = true;
            clearTimeout(minTimer);
            setIsLoading(false);
            safetyTimer = setTimeout(signalComplete, EXIT_FADE_MS + 800);
        };

        const minBrandTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ENTRANCE_DONE_MS + EXIT_HOLD_MS;
        const startedAt = performance.now();
        const fontsSettled =
            document.readyState === "complete" || !document.fonts
                ? Promise.resolve()
                : document.fonts.ready;
        const windowLoaded =
            document.readyState === "complete"
                ? Promise.resolve()
                : Promise.race([
                      new Promise((resolve) => {
                          window.addEventListener("load", resolve, { once: true });
                      }),
                      new Promise((resolve) => setTimeout(resolve, LOAD_WAIT_CAP_MS)),
                  ]);
        const doubleFrame = new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        Promise.all([fontsSettled, windowLoaded, doubleFrame]).then(() => {
            if (done) return;
            const remaining = minBrandTime - (performance.now() - startedAt);
            minTimer = setTimeout(finish, Math.max(remaining, 0));
        });

        return () => {
            done = true;
            clearTimeout(minTimer);
            clearTimeout(safetyTimer);
        };
    }, []);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        if (typeof window !== 'undefined') {
                            if (window.sessionStorage.getItem('zaad_initial_loaded')) {
                                document.documentElement.classList.add('skip-loader');
                            } else {
                                setTimeout(function () {
                                    if (!window.sessionStorage.getItem('zaad_loader_complete')) {
                                        document.documentElement.classList.add('skip-loader');
                                    }
                                }, 10000);
                            }
                        }
                    `
                }}
            />
            <AnimatePresence onExitComplete={signalComplete}>
                {isLoading && (
                    <motion.div
                        id="zaad-loader"
                        aria-hidden="true"
                        className="fixed inset-0 z-[9999] bg-surface flex flex-col items-center justify-center pointer-events-none"
                        dir="ltr"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={CONTAINER_VARIANTS}
                    >
                        <div className="relative flex flex-col items-start justify-center px-2 sm:px-4">
                            <motion.div
                                variants={LOGO_VARIANTS}
                                className="text-ink w-40 sm:w-56 md:w-72 lg:w-96"
                            >
                                <svg
                                    viewBox="0 0 219.72 54.22"
                                    className="w-full h-auto"
                                    role="img"
                                    aria-label="ZAAD"
                                    fill="currentColor"
                                >
                                    <polygon points="17.84 38.11 39.66 38.11 39.66 40.99 13.67 40.99 13.67 38.82 35.16 9.65 13.87 9.65 13.87 6.77 39.32 6.77 39.32 8.95 17.84 38.11" />
                                    <path d="M71.58,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34L56.9,6.77h3.68l14.44,34.22h-3.44ZM50.89,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                                    <path d="M106.94,41l-3.9-9.37h-17.97l-3.9,9.37h-3.34l14.44-34.22h3.68l14.44,34.22h-3.44ZM86.26,28.79h15.65l-7.85-18.75-7.8,18.75Z" />
                                    <path d="M126.28,6.77c4.92,0,9.03,1.62,12.3,4.87,3.27,3.27,4.92,7.34,4.92,12.23s-1.65,8.99-4.92,12.23c-3.27,3.27-7.39,4.89-12.3,4.89h-13.06V6.77h13.06ZM126.23,38.11c4.05,0,7.41-1.36,10.1-4.07,2.69-2.71,4.05-6.1,4.05-10.17s-1.36-7.44-4.05-10.15c-2.69-2.71-6.05-4.07-10.1-4.07h-9.98v28.46h9.98Z" />
                                    <path d="M197.86,10.94l2.95-4.12,3.59,2.54c.38.25.44.76.19,1.14l-2.38,3.39-4.35-2.95Z" />
                                    <polygon points="176.77 6.88 173.06 6.88 174.01 41.64 176.77 41.64 176.77 6.88" />
                                    <polygon points="187.09 6.88 183.38 6.88 184.34 41.64 187.04 41.64 187.09 41.6 187.09 6.88" />
                                    <path d="M167.13,28.11c-1.11-3.73-2.19-6.84-3.26-9.77h-4.31l6.5,17.22c-2.54,1.49-6.25,1.87-8.63,1.87-2.16,0-4.03-.25-5.2-1.08-.89-.63-1.43-1.55-1.43-2.92,0-.23.06-.98.21-2.58h-2.46c-.27,2.55-.36,3.45-.36,4.14,0,3.68,1.78,6.57,8.79,6.57s11.33-2.54,11.33-7.11c0-1.68-.1-2.73-1.17-6.35" />
                                    <path d="M201.82,18.42l3.96,15.58c-5.46,6.66-9.14,10.12-13.14,10.12-1.52,0-2.38-.13-4.66-.86l-1.36,2.28c2.92,1.08,5.71,1.9,7.65,1.9,6.82,0,13.9-9.33,13.9-14.15,0-4.13-.65-8.26-2.11-14.88h-4.23Z" />
                                </svg>
                            </motion.div>
                            <motion.div
                                variants={LINE_VARIANTS}
                                style={{ transformOrigin: isFarsi ? "right" : "left" }}
                                className="h-[2.5px] w-full bg-accent mt-8 sm:mt-10 md:mt-12"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default React.memo(InitialLoader);