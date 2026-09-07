"use client";

import React, { memo, useCallback } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/services/LanguageProvider";
import { animateScrollToTop, animateScrollToBottom } from "@/services/ScrollService";
import useScrollButton from "@/hooks/useScrollButton";
import Tooltip from "./Tooltip";

const ScrollButton = memo(function ScrollButton() {
    const { t } = useLanguage();
    const { visible, direction } = useScrollButton();

    const handleClick = useCallback(() => {
        if (direction === "up") animateScrollToTop(1200);
        else animateScrollToBottom(1200);
    }, [direction]);

    const label = direction === "up" ? t("scrollToTopLabel") : t("scrollToBottomLabel");
    const Icon = direction === "up" ? ArrowUp : ArrowDown;

    return (
        <MotionConfig reducedMotion="user">
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.94 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-6 sm:bottom-8 end-6 sm:end-8 z-[25]"
                    >
                        <Tooltip label={label}>
                            <button
                                type="button"
                                onClick={handleClick}
                                aria-label={label}
                                className="cursor-pointer flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-md bg-panel/85 hover:bg-panel border border-ink/10 shadow-canvas-mid hover:shadow-canvas-lift backdrop-blur-[6px] text-accent transition-all duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={direction}
                                        initial={{ opacity: 0, y: direction === "up" ? 4 : -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: direction === "up" ? -4 : 4 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex items-center justify-center"
                                    >
                                        <Icon className="w-4 h-4 stroke-[1.5]" />
                                    </motion.span>
                                </AnimatePresence>
                            </button>
                        </Tooltip>
                    </motion.div>
                )}
            </AnimatePresence>
        </MotionConfig>
    );
});

export default ScrollButton;