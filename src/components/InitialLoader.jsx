"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if the loader has already been shown in this session
        const hasLoaded = sessionStorage.getItem("zaad_initial_loaded");

        if (hasLoaded) {
            setIsLoading(false);
            return;
        }

        // Set the flag and calculate the total animation duration to unmount
        sessionStorage.setItem("zaad_initial_loaded", "true");

        // Duration:
        // Fade in + settle (1s)
        // Hold (1.5s)
        // Fade out (1s)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    // Stagger settings for letter-by-letter reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5, // Start slightly after the component mounts
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1], // The standard easing curve
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

    const brandName = "ZAAD".split("");

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-surface flex flex-col items-center justify-center pointer-events-none"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                >
                    <div className="relative flex items-center justify-center">
                        <div className="flex space-x-1 sm:space-x-2 md:space-x-3 overflow-hidden px-8">
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
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
