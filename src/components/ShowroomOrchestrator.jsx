"use client";

import { motion, AnimatePresence } from "motion/react";
import Header from "./Header";
import Footer from "./Footer";
import ProductDetailsPage from "./ProductDetailsPage";
import { animateScrollTo } from "@/services/ScrollService";
import useShowroomNav from "../hooks/useShowroomNav";
import React from "react";

/**
 * ARCHITECTURAL REFACTOR:
 * Extracted the SPA routing and animation logic from app/page.js into this Client Component.
 * This allows app/page.js to become a Server Component, sending down the heavy, non-interactive
 * sections (Hero, Story, Advantages, etc.) as pre-rendered React node props ("children").
 * This maintains the single-URL SPA behavior while optimizing the Server/Client boundary.
 */
export default function ShowroomOrchestrator({
    heroSection,
    storySection,
    showcaseSection,
    advantagesSection,
    materialsSection,
    conciergeSection,
    blueprintSection
}) {
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

    return (
        <div className="in-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
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
                                onBack={() => {
                                    setSelectedProduct(null);
                                    setTimeout(() => {
                                        animateScrollTo("collection", 500);
                                    }, 100);
                                }}
                                onInquire={handleInquireItem}
                            />
                        </motion.div>
                    ) : activeTab === "blueprint" ? (
                        <motion.div
                            key="blueprint"
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.99 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {blueprintSection}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="showroom"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Injecting the Server Component nodes passed as props. We use React.cloneElement to pass down handlers needed by Showcase and Concierge */}
                            {heroSection && React.cloneElement(heroSection, { onScrollToCollection: () => handleScrollToSection("collection") })}
                            {storySection}
                            {showcaseSection && React.cloneElement(showcaseSection, { onInquireItem: handleInquireItem, onViewDetails: setSelectedProduct })}
                            {advantagesSection}
                            {materialsSection}
                            {conciergeSection && React.cloneElement(conciergeSection, { preselectedItem: preselectedItem, onClearPreselected: () => setPreselectedItem(null) })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer
                onScrollToSection={handleScrollToSection}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}
