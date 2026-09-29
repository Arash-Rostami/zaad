import React, { useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { animateScrollToTop } from "@/services/ScrollService";
import useLocalPreference from "@/hooks/useLocalPreference";
import NoiseBg from "../shared/NoiseBg";
import PrimaryPages from "./PrimaryPages";
import SpecimenGrid from "./SpecimenGrid";
import UtilityStrip from "./UtilityStrip";
import MenuControls from "./MenuControls";

export default function MenuPanel(
    {
        t,
        language,
        setLanguage,
        selectedProduct,
        collection,
        themeMode,
        handleThemeChange,
        onClose,
        setActiveTab,
        onSelectProduct,
        onScrollToSection,
    }) {
    const router = useRouter();
    const [lastViewedItem, setLastViewedItem] = useLocalPreference("lastViewedItem", null);
    const lastViewedFullItem = useMemo(
        () => (lastViewedItem ? collection.find((c) => c.id === lastViewedItem.id) : null),
        [collection, lastViewedItem]
    );
    const lastViewedDisplay = useMemo(
        () =>
            lastViewedItem
                ? { ...lastViewedItem, name: lastViewedFullItem?.name ?? lastViewedItem.name }
                : null,
        [lastViewedItem, lastViewedFullItem]
    );

    const pageLinks = useMemo(
        () => [
            { key: "/", label: t("aboutBackToShowroom"), sub: t("menuChapterHome") },
            { key: "/about", label: t("menuOriginsPhilosophy") },
            { key: "/story", label: t("menuStoryBrandValue") },
            { key: "/sustainability", label: t("menuSustainabilityResponsibility") },
        ],
        [t]
    );

    const navigateTo = useCallback(
        (href) => {
            if (href === "/") {
                setActiveTab("showroom");
                onSelectProduct(null);
                onClose();
                animateScrollToTop(1400);
                return;
            }
            onClose();
            router.push(href);
        },
        [onClose, router, setActiveTab, onSelectProduct]
    );

    const onBlueprint = useCallback(() => {
        onSelectProduct(null);
        onClose();
        window.open("/showcase/index.html", "_blank", "noopener,noreferrer");
    }, [onSelectProduct, onClose]);

    const onSelect = useCallback(
        (item) => {
            setActiveTab("showroom");
            onSelectProduct(item);
            onClose();
        },
        [setActiveTab, onSelectProduct, onClose]
    );

    const onNavigateToCollection = useCallback(() => {
        setActiveTab("showroom");
        onClose();
        setTimeout(() => onScrollToSection("collection"), 120);
    }, [setActiveTab, onClose, onScrollToSection]);

    const onNavigateToConcierge = useCallback(() => {
        setActiveTab("showroom");
        onClose();
        setTimeout(() => onScrollToSection("concierge"), 120);
    }, [setActiveTab, onClose, onScrollToSection]);

    const onContinueBrowsing = useCallback(() => {
        const fullItem = collection.find((c) => c.id === lastViewedItem?.id);
        if (!fullItem) return;
        setActiveTab("showroom");
        onSelectProduct(fullItem);
        onClose();
    }, [collection, lastViewedItem, setActiveTab, onSelectProduct, onClose]);

    const onClearLastViewed = useCallback(() => {
        setLastViewedItem(null);
    }, [setLastViewedItem]);

    return (
        <motion.div
            id="site-menu-panel"
            data-menu-panel="true"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={t("menuBrowse")}
            tabIndex={-1}
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-overlay-panel border-b border-accent/20 shadow-deep z-40 overflow-hidden outline-none"
        >
            <NoiseBg filterId="headerNoise" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                <svg className="w-full h-full stroke-accent/10" viewBox="0 0 1440 320"
                     xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path fill="none" strokeWidth="0.5"
                          d="M0,160 Q360,50 720,160 T1440,160 M0,200 Q360,90 720,200 T1440,200 M0,240 Q360,130 720,240 T1440,240" />
                </svg>
            </div>

            <div
                className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent absolute top-0 left-0" />

            <div
                data-menu-scroll-panel="true"
                className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex flex-col justify-between relative z-10 max-h-[85vh] overflow-y-auto overscroll-contain" data-lenis-prevent>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-4 md:gap-5"
                >
                    <PrimaryPages t={t} pageLinks={pageLinks} onNavigate={navigateTo} />

                    <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

                    <SpecimenGrid
                        collection={collection}
                        selectedProduct={selectedProduct}
                        t={t}
                        onSelect={onSelect}
                        onNavigateToCollection={onNavigateToCollection}
                    />

                    <UtilityStrip
                        t={t}
                        onOpenCatalogue={onBlueprint}
                        onNavigateToConcierge={onNavigateToConcierge}
                    />

                    {lastViewedDisplay && (
                        <div className="group/continue inline-flex items-center gap-2 self-start text-left rtl:text-right">
                            <button
                                type="button"
                                onClick={onContinueBrowsing}
                                className="group inline-flex items-center gap-1 self-start text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-bold uppercase hover:border-[#C5A059] pt-2 hover:text-[#C5A059] text-left rtl:text-right transition-colors duration-500 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                {t("menuContinueBrowsing")} — {lastViewedDisplay.name}
                                <ChevronRight className="w-3 h-3 shrink-0 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                            </button>
                            <button
                                type="button"
                                onClick={onClearLastViewed}
                                aria-label={t("menuDismissContinueBrowsing")}
                                className="opacity-0 group-hover/continue:opacity-100 focus-visible:opacity-100 text-muted/50 hover:text-accent transition-opacity duration-300 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </motion.div>

                <MenuControls
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                    themeMode={themeMode}
                    handleThemeChange={handleThemeChange}
                />
            </div>
        </motion.div>
    );
}
