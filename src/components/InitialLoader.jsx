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
        width: "0%",
        opacity: 0
    },
    visible: {
        width: "calc(100%)",
        opacity: 1,
        transition: {
            delay: 2.2,
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const BRAND_NAME = "ZAAD".split("");

function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hasLoaded = sessionStorage.getItem("zaad_initial_loaded");

        sessionStorage.setItem("zaad_initial_loaded", "true");

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    id="zaad-loader"
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
                            className="h-[2.5px] bg-accent mt-8 sm:mt-10 md:mt-12"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default React.memo(InitialLoader);
