"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import NoiseBg from "./shared/NoiseBg";
import { useLanguage } from "@/services/TranslationService";

function InitialLoader() {
    const { t } = useLanguage();

    // PH1 FIX: Initializing skip based on sessionStorage inside useEffect to avoid SSR hydration mismatch
    const [skip, setSkip] = useState(true); // default to true to not block SSR, we fix it in effect
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasLoaded = window.sessionStorage.getItem('zaad_initial_loaded');
            if (hasLoaded) {
                setSkip(true);
                document.documentElement.classList.add('skip-loader');
            } else {
                setSkip(false);
            }
        }
    }, []);

    useEffect(() => {
        if (skip) return;

        // Block scrolling during load
        document.body.style.overflow = 'hidden';

        const duration = 2400; // ms
        const interval = 20; // ms
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            // Ease-out expo logic for progress number
            const rawProgress = currentStep / steps;
            const easedProgress = rawProgress === 1 ? 1 : 1 - Math.pow(2, -10 * rawProgress);

            setProgress(Math.floor(easedProgress * 100));

            if (currentStep >= steps) {
                clearInterval(timer);
                setProgress(100);
                setTimeout(() => {
                    setIsComplete(true);
                    document.body.style.overflow = '';
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('zaad_initial_loaded', 'true');
                    }
                }, 400); // Hold at 100% briefly
            }
        }, interval);

        return () => {
            clearInterval(timer);
            document.body.style.overflow = '';
        };
    }, [skip]);

    if (skip) return null;

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface text-ink"
                >
                    <NoiseBg />

                    <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-8 overflow-hidden"
                        >
                            <span className="text-[10px] font-mono tracking-[0.4em] text-accent uppercase block text-center">
                                {t("studioArchives") || "ZAAD STUDIO"}
                            </span>
                        </motion.div>

                        {/* Progress Number */}
                        <div className="text-6xl sm:text-7xl font-serif font-light tabular-nums tracking-tighter w-full text-center mb-8 flex items-baseline justify-center">
                            <span>{progress}</span>
                            <span className="text-xl text-muted ml-1">%</span>
                        </div>

                        {/* Minimal Progress Bar */}
                        <div className="w-full h-[1px] bg-ink/10 relative overflow-hidden rounded-full">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-ink"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1, ease: "linear" }}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: progress > 30 ? 1 : 0 }}
                            transition={{ duration: 1 }}
                            className="mt-8 text-[9px] font-mono tracking-widest text-muted uppercase"
                        >
                            {progress < 100 ? (t("statusCompiling") || "Initializing Architecture") : (t("statusCompliant") || "Ready")}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default InitialLoader;
