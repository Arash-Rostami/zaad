"use client";

import { useState } from "react";
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
import { animateScrollTo } from "../lib/scroll";
export default function App() {
  const [activeTab, setActiveTab] = useState("showroom");
  const [preselectedItem, setPreselectedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleScrollToSection = (sectionId) => {
    setActiveTab("showroom");
    // If a product details page is open, close it first with smooth transition before scrolling
    if (selectedProduct) {
      setSelectedProduct(null);
    }
    // Leverage the custom cinematic scrolling engine
    animateScrollTo(sectionId);
  };
  const handleInquireItem = (item) => {
    setSelectedProduct(null); // Return to standard view where concierge forms are visible
    setPreselectedItem(item);
    // Scroll with subtle luxury lag timing so the state is fully integrated first
    setTimeout(() => {
      animateScrollTo("concierge", 1600); // 1.6s slower elegant travel for inquiry
    }, 120);
  };
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#EAE7DC] selection:text-[#1C1C1C]">
      {/* Editorial global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (selectedProduct) {
            setSelectedProduct(null);
          }
        }}
        selectedProduct={selectedProduct}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main viewport body routing view with fluid exit/entrance choreography */}
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
              {/* Cinematic Fullscreen Hero Cover */}
              <Hero
                onScrollToCollection={() => handleScrollToSection("collection")}
              />

              {/* Elegant asymmetric Manifesto Story section */}
              <Story />

              {/* Curated Collection Showcase segment */}
              <Showcase
                onInquireItem={handleInquireItem}
                onViewDetails={(item) => setSelectedProduct(item)}
              />

              {/* Our Competitive Advantages segment */}
              <Advantages />

              {/* Tactile macro Material Analysis Explorer segment */}
              <Materials />

              {/* Custom Acquisition concierge form along with server-bound AI assistant */}
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
              <Blueprint />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Quiet-luxury global Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
