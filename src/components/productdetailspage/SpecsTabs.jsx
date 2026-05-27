import React, { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cpu, Layers, Sparkles } from "lucide-react";
import TabArchitecture from "./TabArchitecture";
import TabAppliances from "./TabAppliances";
import TabHeritage from "./TabHeritage";

const TABS = [
    { id: "architecture", label: "MONOLITHIC ANATOMY", icon: Layers },
    { id: "appliances", label: "GAGGENAU INTEGRATION", icon: Cpu },
    { id: "heritage", label: "COMPOSITIONAL INTEGRITY", icon: Sparkles },
];

export default function SpecsTabs({ item, itemTrans, t, activeTab, setActiveTab }) {
    const activeContent = useMemo(() => {
        if (activeTab === "architecture") return <TabArchitecture item={item} />;
        if (activeTab === "appliances") return <TabAppliances item={item} />;
        return <TabHeritage />;
    }, [activeTab, item]);

    return (
        <div className="mb-20">
            <div className="flex justify-center border-b border-ink/10 mb-10 overflow-x-auto scrollbar-none">
                <div className="flex space-x-8 md:space-x-12 pb-px shrink-0">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="group relative pb-4 flex items-center space-x-2 transition-all duration-300 cursor-pointer focus:outline-none shrink-0"
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-muted/50 group-hover:text-accent"}`} />
                                <span className={`text-[10.5px] font-mono tracking-[0.2em] uppercase transition-colors ${isActive ? "text-ink font-semibold" : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"}`}>
                                    {tab.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCurationTabLine"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    {activeContent}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
