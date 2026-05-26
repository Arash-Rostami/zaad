"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hasLoaded = sessionStorage.getItem("zaad_initial_loaded");

        if (hasLoaded) {
            setIsLoading(false);
            return;
        }

        sessionStorage.setItem("zaad_initial_loaded", "true");

        // 5 seconds total duration to unmount
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
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

    const letterVariants = {
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

    const lineVariants = {
        hidden: {
            width: "0%",
            opacity: 0
        },
        visible: {
            width: "calc(100% + 16px)", // Right-side padding/overlap
            opacity: 1,
            transition: {
                delay: 2.2,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const brandName = "ZAAD".split("");

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        if (typeof window !== 'undefined' && window.sessionStorage.getItem('zaad_initial_loaded')) {
                            document.documentElement.classList.add('skip-loader');
                        }
                    `
                }}
            />
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        id="zaad-loader"
                        className="fixed inset-0 z-[9999] bg-surface flex flex-col items-center justify-center pointer-events-none"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                    >
                        <style dangerouslySetInnerHTML={{ __html: `
                            html.skip-loader #zaad-loader { display: none !important; }
                        `}} />
                        <div className="relative flex flex-col items-start justify-center">
                            <div className="flex space-x-1 sm:space-x-2 md:space-x-3 overflow-hidden px-2 sm:px-4">
                                {brandName.map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        variants={letterVariants}
                                        className="text-ink font-serif font-medium text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] inline-block leading-none"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                            {/* The line below the typography */}
                            <motion.div
                                variants={lineVariants}
                                className="h-[1px] bg-accent mt-8 sm:mt-10 md:mt-12 ml-2 sm:ml-4"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
