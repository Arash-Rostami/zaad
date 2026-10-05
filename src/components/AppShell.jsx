"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Vision from "../components/Vision";
import Showcase from "../components/Showcase";
import Materials from "../components/Materials";
import Concierge from "../components/Concierge";
import Footer from "../components/Footer";
import CollectionPage from "./CollectionPage";
import ScrollButton from "../components/shared/ScrollButton";
import { animateScrollTo, animateScrollToSettled } from "@/services/ScrollService";
import { getPreference, setPreference } from "@/services/PreferenceService";
import useShowroomNav from "../hooks/useShowroomNav";
import useLenisScroll from "@/hooks/useLenisScroll";

export default function AppShell({ utensilImages }) {
    const {
        setActiveTab,
        preselectedItem,
        setPreselectedItem,
        selectedProduct,
        setSelectedProduct,
        handleScrollToSection,
        handleInquireItem,
    } = useShowroomNav();

    useLenisScroll();

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;
        let stopSettle = null;
        const id = window.setTimeout(() => {
            stopSettle = animateScrollToSettled(hash, 1450);
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }, 120);
        return () => {
            window.clearTimeout(id);
            stopSettle?.();
        };
    }, []);

    useEffect(() => {
        const pendingItem = getPreference("pendingInquiryItem");
        if (!pendingItem) return;
        setPreselectedItem(pendingItem);
        setPreference("pendingInquiryItem", null);
    }, [setPreselectedItem]);

    const handleBackFromProduct = useCallback(() => {
        setSelectedProduct(null);
        setTimeout(() => {
            animateScrollTo("collection", 1400);
        }, 120);
    }, [setSelectedProduct]);

    const handleScrollToCollection = useCallback(
        () => handleScrollToSection("collection"),
        [handleScrollToSection]
    );

    const handleClearPreselected = useCallback(() => setPreselectedItem(null), [setPreselectedItem]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
                <Header
                    setActiveTab={setActiveTab}
                    selectedProduct={selectedProduct}
                    onSelectProduct={setSelectedProduct}
                    onScrollToSection={handleScrollToSection}
                />

                <main id="main-content" className="flex-1">
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key="product-details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <CollectionPage
                                    item={selectedProduct}
                                    onBack={handleBackFromProduct}
                                    onInquire={handleInquireItem}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="showroom"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Hero
                                    onScrollToCollection={handleScrollToCollection}
                                />
                                <Vision utensilImages={utensilImages} />
                                <Showcase
                                    onInquireItem={handleInquireItem}
                                    onViewDetails={setSelectedProduct}
                                />
                                <Materials />
                                <Concierge
                                    preselectedItem={preselectedItem}
                                    onClearPreselected={handleClearPreselected}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <Footer
                    onScrollToSection={handleScrollToSection}
                    setActiveTab={setActiveTab}
                    onSelectProduct={setSelectedProduct}
                />

                <ScrollButton />
            </div>
        </MotionConfig>
    );
}