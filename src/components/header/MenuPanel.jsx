import React from "react";
import {motion} from "motion/react";
import {animateScrollTo, animateScrollToTop} from "@/services/ScrollService";
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
        getItemTranslations,
        themeMode,
        handleThemeChange,
        onClose,
        setActiveTab,
        onSelectProduct,
    }) {
    const journeyLinks = [
        {key: "story", label: t("menuOriginsPhilosophy"), sub: t("menuChapter1")},
        {key: "collection", label: t("menuCuratedSeries"), sub: t("menuChapter2")},
        {key: "concierge", label: t("menuAcquisitionsCabinet"), sub: t("menuChapter3")},
    ];

    const navigateTo = (sectionKey) => {
        setActiveTab("showroom");
        onSelectProduct(null);
        onClose();
        setTimeout(() => animateScrollTo(sectionKey, 1400), 120);
    };

    return (
        <motion.div
            initial={{opacity: 0, clipPath: "inset(0% 0% 100% 0%)"}}
            animate={{opacity: 1, clipPath: "inset(0% 0% 0% 0%)"}}
            exit={{opacity: 0, clipPath: "inset(0% 0% 100% 0%)"}}
            transition={{duration: 1.1, ease: [0.76, 0, 0.24, 1]}}
            className="absolute top-full left-0 w-full bg-overlay-panel border-b border-accent/20 shadow-deep z-40 overflow-hidden"
        >
            <NoiseBg filterId="headerNoise"/>

            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                <svg className="w-full h-full stroke-accent/10" viewBox="0 0 1440 320"
                     xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path fill="none" strokeWidth="0.5"
                          d="M0,160 Q360,50 720,160 T1440,160 M0,200 Q360,90 720,200 T1440,200 M0,240 Q360,130 720,240 T1440,240"/>
                </svg>
            </div>

            <div
                className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent absolute top-0 left-0"/>

            <div
                className="max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-6 flex flex-col justify-between relative z-10 max-h-[85vh] overflow-y-auto">
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1]}}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
                >
                    <SystemPortals
                        t={t}
                        activeTab={activeTab}
                        selectedProduct={selectedProduct}
                        onShowroom={() => {
                            setActiveTab("showroom");
                            onSelectProduct(null);
                            onClose();
                            animateScrollToTop(1400);
                        }}
                        onBlueprint={() => {
                            setActiveTab("pdf");
                            onSelectProduct(null);
                            onClose();
                        }}
                    />

                    <JourneyIndex journeyLinks={journeyLinks} t={t} onNavigate={navigateTo}/>

                    <div
                        className="md:col-span-12 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent my-1 sm:my-2"/>

                    <SpecimenGrid
                        collection={collection}
                        selectedProduct={selectedProduct}
                        getItemTranslations={getItemTranslations}
                        t={t}
                        onSelect={(item) => {
                            setActiveTab("showroom");
                            onSelectProduct(item);
                            onClose();
                        }}
                    />
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
