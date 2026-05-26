"use client";

import { motion, AnimatePresence } from "motion/react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Story from "../components/Story";
import Showcase from "../components/Showcase";
import Advantages from "../components/Advantages";
import Materials from "../components/Materials";
import Concierge from "../components/Concierge";
import Blueprint from "../components/Blueprint";
import Footer from "../components/Footer";
import ProductDetailsPage from "../components/ProductDetailsPage";
import { animateScrollTo } from "@/services/ScrollService";
import useShowroomNav from "../hooks/useShowroomNav";

export default function App() {
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
            {/* Global Header */}
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedProduct={selectedProduct}
                onSelectProduct={(product) => setSelectedProduct(product)}
                onScrollToSection={handleScrollToSection}
            />

            {/* Main Body */}
            <main className="flex-1">
                <AnimatePresence mode="wait">
                    {selectedProduct ? (
                        <motion.div
                            key="product-details"
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <ProductDetailsPage
                                item={selectedProduct}
                                onBack={() => {
                                    setSelectedProduct(null);
                                    // Scroll back to collection seamlessly
                                    setTimeout(() => {
                                        animateScrollTo("collection", 500);
                                    }, 100);
                                }}
                                onInquire={handleInquireItem}
                            />
                        </motion.div>
                    ) : activeTab === "showroom" ? (
                        <motion.div
                            key="showroom"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.6,
                            }}
                        >
                            <Hero
                                onScrollToCollection={() => handleScrollToSection("collection")}
                            />

                            <Story/>

                            <Showcase
                                onInquireItem={handleInquireItem}
                                onViewDetails={(item) => setSelectedProduct(item)}
                            />

                            <Advantages/>

                            <Materials/>

                            <Concierge
                                preselectedItem={preselectedItem}
                                onClearPreselected={() => setPreselectedItem(null)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="blueprint"
                            initial={{
                                opacity: 0,
                                scale: 0.99,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.99,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <Blueprint/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Global Footer */}
            <Footer
                onScrollToSection={handleScrollToSection}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}
