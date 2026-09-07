"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CONTAINER_VARIANTS = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.5,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const LETTER_VARIANTS = {
    hidden: {
        opacity: 0,
        y: 10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.5,
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
            delay: 2.2,
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const BRAND_NAME = "ZAAD".split("");

const ENTRANCE_DONE_MS =
    Math.max(
        CONTAINER_VARIANTS.visible.transition.delayChildren +
            (BRAND_NAME.length - 1) *
                CONTAINER_VARIANTS.visible.transition.staggerChildren +
            LETTER_VARIANTS.visible.transition.duration,
        LINE_VARIANTS.visible.transition.delay +
            LINE_VARIANTS.visible.transition.duration,
    ) * 1000;

const LOAD_WAIT_CAP_MS = ENTRANCE_DONE_MS + 2000;

function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);

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
        const finish = () => {
            if (done) return;
            done = true;
            clearTimeout(minTimer);
            setIsLoading(false);
            sessionStorage.setItem("zaad_loader_complete", "true");
            window.dispatchEvent(new Event("zaad:loaderComplete"));
        };

        const minBrandTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ENTRANCE_DONE_MS;
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
            <AnimatePresence>
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
                            <div className="flex space-x-1 sm:space-x-2 md:space-x-3 overflow-hidden">
                                {BRAND_NAME.map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        variants={LETTER_VARIANTS}
                                        className={`text-ink font-serif font-medium text-5xl sm:text-6xl md:text-8xl lg:text-9xl inline-block leading-none ${
                                            index === BRAND_NAME.length - 1
                                                ? "tracking-normal"
                                                : "tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]"
                                        }`}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                            <motion.div
                                variants={LINE_VARIANTS}
                                style={{ transformOrigin: "left" }}
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