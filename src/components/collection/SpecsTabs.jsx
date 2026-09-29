import React, { memo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cpu, Layers, Sparkles } from "lucide-react";
import TabArchitecture from "./TabArchitecture";
import TabAppliances from "./TabAppliances";
import TabHeritage from "./TabHeritage";
import MaisonReveal from "../shared/MaisonReveal";
import wrapBrandNames from "@/lib/wrapBrandNames";

const EASE_CUBIC = Object.freeze([0.16, 1, 0.3, 1]);

const TAB_LINE_TRANSITION = Object.freeze({
    type: "spring",
    stiffness: 350,
    damping: 30,
});

const CONTENT_INITIAL = Object.freeze({ opacity: 0, y: 15 });
const CONTENT_ANIMATE = Object.freeze({ opacity: 1, y: 0 });
const CONTENT_EXIT = Object.freeze({ opacity: 0, y: -15 });
const CONTENT_TRANSITION = Object.freeze({ duration: 0.5, ease: EASE_CUBIC });

const TABS = Object.freeze([
    Object.freeze({ id: "architecture", labelKey: "tabArchitectureLabel", icon: Layers }),
    Object.freeze({ id: "appliances", labelKey: "tabAppliancesLabel", icon: Cpu }),
    Object.freeze({ id: "heritage", labelKey: "tabHeritageLabel", icon: Sparkles }),
]);

const SpecTabButton = memo(function SpecTabButton({ tab, isActive, onSelect, t }) {
    const handleClick = useCallback(() => {
        onSelect?.(tab.id);
    }, [onSelect, tab.id]);

    const Icon = tab.icon;

    const iconClassName = `w-3.5 h-3.5 ${
        isActive ? "text-accent" : "text-muted/50 group-hover:text-accent"
    }`;

    const labelClassName = `text-[length:calc(12px*var(--zaad-font-scale))] font-mono uppercase transition-colors ${
        isActive
            ? "text-ink font-semibold"
            : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"
    }`;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={handleClick}
            className="group relative pb-4 flex items-center space-x-2 transition-all duration-300 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shrink-0"
        >
            <Icon className={iconClassName} />
            <span className={labelClassName}>
                {wrapBrandNames(t(tab.labelKey))}
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeCurationTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    transition={TAB_LINE_TRANSITION}
                />
            )}
        </button>
    );
});

function TabContent({ activeTab, item, t, isFarsi }) {
    switch (activeTab) {
        case "architecture":
            return <TabArchitecture item={item} t={t} isFarsi={isFarsi} />;
        case "appliances":
            return <TabAppliances item={item} t={t} isFarsi={isFarsi} />;
        case "heritage":
        default:
            return <TabHeritage t={t} />;
    }
}

const MemoizedTabContent = memo(TabContent);

function SpecsTabs({ item, t, isFarsi, activeTab, setActiveTab }) {
    const handleTabListKeyDown = useCallback(
        (e) => {
            if (
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Home" &&
                e.key !== "End"
            ) {
                return;
            }
            e.preventDefault();

            const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
            let nextIndex = currentIndex;

            if (e.key === "Home") {
                nextIndex = 0;
            } else if (e.key === "End") {
                nextIndex = TABS.length - 1;
            } else {
                const forward = isFarsi ? e.key === "ArrowLeft" : e.key === "ArrowRight";
                nextIndex = forward
                    ? (currentIndex + 1) % TABS.length
                    : (currentIndex - 1 + TABS.length) % TABS.length;
            }

            const nextTab = TABS[nextIndex];
            setActiveTab(nextTab.id);
            document.getElementById(`tab-${nextTab.id}`)?.focus();
        },
        [activeTab, isFarsi, setActiveTab],
    );

    return (
        <div className="mb-20">
            <MaisonReveal
                variant="unveil"
                delay={0.1}
                threshold={0.01}
                className="flex justify-center border-b border-ink/10 mb-10 overflow-x-auto scrollbar-none"
                data-lenis-prevent
            >
                <div
                    role="tablist"
                    aria-orientation="horizontal"
                    onKeyDown={handleTabListKeyDown}
                    className="flex space-x-8 md:space-x-12 pb-px shrink-0"
                >
                    {TABS.map((tab) => (
                        <SpecTabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onSelect={setActiveTab}
                            t={t}
                        />
                    ))}
                </div>
            </MaisonReveal>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    id={`tabpanel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                    initial={CONTENT_INITIAL}
                    animate={CONTENT_ANIMATE}
                    exit={CONTENT_EXIT}
                    transition={CONTENT_TRANSITION}
                >
                    <MemoizedTabContent
                        activeTab={activeTab}
                        item={item}
                        t={t}
                        isFarsi={isFarsi}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default memo(SpecsTabs);