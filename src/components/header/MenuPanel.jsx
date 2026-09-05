import React, { useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { animateScrollToTop } from "@/services/ScrollService";
import useLocalPreference from "@/hooks/useLocalPreference";
import NoiseBg from "../shared/NoiseBg";
import SystemPortals from "./SystemPortals";
import JourneyIndex from "./JourneyIndex";
import SpecimenGrid from "./SpecimenGrid";
import ControlsFooter from "./ControlsFooter";

export default function MenuPanel(
    {
        t,
        language,
        setLanguage,
        activeTab,
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

    const journeyLinks = useMemo(
        () => [
            { key: "/about", label: t("menuOriginsPhilosophy"), sub: t("menuChapter1") },
            { key: "/story", label: t("menuStoryBrandValue"), sub: t("menuChapter2") },
            { key: "/sustainability", label: t("menuSustainabilityResponsibility"), sub: t("menuChapter3") },
        ],
        [t]
    );

    const navigateTo = useCallback(
        (href) => {
            onClose();
            router.push(href);
        },
        [onClose, router]
    );

    const onShowroom = useCallback(() => {
        setActiveTab("showroom");
        onSelectProduct(null);
        onClose();
        animateScrollToTop(1400);
    }, [setActiveTab, onSelectProduct, onClose]);

    const onBlueprint = useCallback(() => {
        setActiveTab("pdf");
        onSelectProduct(null);
        onClose();
    }, [setActiveTab, onSelectProduct, onClose]);

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

    const onNavigateToConcierge = useCallback(() => {
        setActiveTab("showroom");
        onClose();
        setTimeout(() => onScrollToSection("concierge"), 120);
    }, [setActiveTab, onClose, onScrollToSection]);

    return (
        <motion.div
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
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
                >
                    <div className="md:col-span-4">
                        <SystemPortals
                            t={t}
                            activeTab={activeTab}
                            selectedProduct={selectedProduct}
                            onShowroom={onShowroom}
                            onBlueprint={onBlueprint}
                        />
                    </div>

                    <div className="md:col-span-8 md:col-start-5 flex flex-col space-y-2">
                        <JourneyIndex journeyLinks={journeyLinks} t={t} onNavigate={navigateTo} />
                        <button
                            type="button"
                            onClick={onNavigateToConcierge}
                            className="group inline-flex items-center gap-1 pb-0 self-start text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-bold uppercase hover:border-[#C5A059] pt-2 hover:text-[#C5A059] text-left rtl:text-right transition-colors duration-500 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            {t("zaadDigitalCurator")}
                            <ChevronRight className="w-3 h-3 shrink-0 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                        </button>
                    </div>

                    <div className="md:col-span-12 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent my-1 sm:my-2" />

                    <div className="md:col-span-12">
                        <SpecimenGrid
                            collection={collection}
                            selectedProduct={selectedProduct}
                            t={t}
                            onSelect={onSelect}
                            onNavigateToCollection={onNavigateToCollection}
                            lastViewedItem={lastViewedDisplay}
                            onContinueBrowsing={onContinueBrowsing}
                            onClearLastViewed={onClearLastViewed}
                        />
                    </div>
                </motion.div>

                <ControlsFooter
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