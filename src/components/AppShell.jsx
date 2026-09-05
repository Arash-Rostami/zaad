"use client";

import { useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Story from "../components/Story";
import Showcase from "../components/Showcase";
import Advantages from "../components/Advantages";
import Materials from "../components/Materials";
import Concierge from "../components/Concierge";
import Footer from "../components/Footer";
import ProductDetailsPage from "../components/ProductDetailsPage";
import ScrollButton from "../components/shared/ScrollButton";
import { animateScrollTo } from "@/services/ScrollService";
import useShowroomNav from "../hooks/useShowroomNav";
import useLenisScroll from "@/hooks/useLenisScroll";

export default function AppShell({ utensilImages }) {
    const {
        activeTab,
        setActiveTab,
        preselectedItem,
        setPreselectedItem,
        selectedProduct,
        setSelectedProduct,
        handleScrollToSection,
        handleInquireItem,
    } = useShowroomNav();

    useLenisScroll();

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

    const handleScrollToStory = useCallback(
        () => handleScrollToSection("story"),
        [handleScrollToSection]
    );

    const handleClearPreselected = useCallback(() => setPreselectedItem(null), [setPreselectedItem]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
                <Header
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectedProduct={selectedProduct}
                    onSelectProduct={setSelectedProduct}
                    onScrollToSection={handleScrollToSection}
                />

                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key="product-details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <ProductDetailsPage
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
                                    onScrollToStory={handleScrollToStory}
                                />
                                <Story utensilImages={utensilImages} />
                                <Showcase
                                    onInquireItem={handleInquireItem}
                                    onViewDetails={setSelectedProduct}
                                />
                                <Advantages />
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
                />

                <ScrollButton />
            </div>
        </MotionConfig>
    );
}