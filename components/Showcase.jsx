"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLLECTION_ITEMS } from "../lib/data";
import {
  ShieldCheck,
  MapPin,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "../lib/TranslationService";
export default function Showcase({ onInquireItem, onViewDetails }) {
  const [selectedItem, setSelectedItem] = useState(COLLECTION_ITEMS[0]);
  const { language, t, getItemTranslations, isFarsi } = useLanguage();
  const [viewMode, setViewMode] = useState("editorial");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isHoveredOverImage, setIsHoveredOverImage] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState("specs");
  const [zoomCoords, setZoomCoords] = useState({
    x: 50,
    y: 50,
  });
  const [isZooming, setIsZooming] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({
    x: 50,
    y: 50,
  });
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);
  const [isZoomControllerHovered, setIsZoomControllerHovered] = useState(false);
  React.useEffect(() => {
    setLightboxScale(1);
    setLightboxPan({
      x: 50,
      y: 50,
    });
    setIsLightboxLoading(true);
  }, [activeImageIndex, isEnlarged, viewMode]);
  const handleLightboxMouseMove = (e) => {
    if (lightboxScale <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightboxPan({
      x,
      y,
    });
  };
  const handleLightboxTouchMove = (e) => {
    if (lightboxScale <= 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setLightboxPan({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };
  const handleMouseMove = (e) => {
    if (viewMode !== "macro") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({
      x,
      y,
    });
  };
  const handleTouchMove = (e) => {
    if (viewMode !== "macro") return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };
  const handleNextImage = () => {
    const currentImagesCount = selectedItem.images.length;
    if (activeImageIndex < currentImagesCount - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      // Loop to next collection
      const currentItemIndex = COLLECTION_ITEMS.findIndex(
        (item) => item.id === selectedItem.id,
      );
      const nextItemIndex = (currentItemIndex + 1) % COLLECTION_ITEMS.length;
      setSelectedItem(COLLECTION_ITEMS[nextItemIndex]);
      setActiveImageIndex(0);
    }
  };
  const handlePrevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      // Loop to previous collection
      const currentItemIndex = COLLECTION_ITEMS.findIndex(
        (item) => item.id === selectedItem.id,
      );
      const prevItemIndex =
        (currentItemIndex - 1 + COLLECTION_ITEMS.length) %
        COLLECTION_ITEMS.length;
      const prevItem = COLLECTION_ITEMS[prevItemIndex];
      setSelectedItem(prevItem);
      setActiveImageIndex(prevItem.images.length - 1);
    }
  };
  return (
    <section
      id="collection"
      className="py-24 md:py-36 bg-[#F4F1ED] px-6 sm:px-12 max-w-7xl mx-auto border-b border-[#1C1C1C]/10"
    >
      <MaisonReveal variant="unveil" threshold={0.05}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#1C1C1C]/10 dark:border-white/10">
          <div>
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#8E7A62] font-semibold uppercase block mb-3">
              {t("showcaseBadge")}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1C] dark:text-[#EDECE8] tracking-tight font-light">
              {t("showcaseTitle")}
            </h2>
          </div>
          <p className="text-xs font-mono text-[#5C5954] dark:text-[#97A5B8] max-w-xs mt-4 md:mt-0 leading-relaxed uppercase opacity-85">
            {isFarsi
              ? "سه‌گانه‌ای دقیق از آثار فیزیکی منحصربفرد که با خلوص کامل فضایی و تکیه بر اصالت مواد اولیه ساخته شده‌اند."
              : "A precise trilogy of physical objects designed with absolute spatial reduction and noble raw materials."}
          </p>
        </div>

        {/* Dynamic Delicate Curator Index Bar (Highly polished, centered luxury tab layout) */}
        <div className="flex justify-center items-center space-x-6 sm:space-x-10 md:space-x-16 border-b border-[#1C1C1C]/10 dark:border-white/10 pb-0 mb-16 mx-auto w-full flex-wrap gap-y-4">
          {COLLECTION_ITEMS.map((item) => {
            const isActive = selectedItem.id === item.id;
            const itemTrans = getItemTranslations(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setActiveImageIndex(0);
                  setViewMode("editorial");
                }}
                className="group relative pb-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer focus:outline-none shrink-0"
              >
                <span
                  className={`text-xs md:text-sm font-serif italic tracking-wider mb-2 transition-all duration-300 ${isActive ? "text-[#8E7A62] dark:text-[#CBB9A7] font-semibold scale-110" : "text-[#5C5954]/40 dark:text-white/30 group-hover:text-[#8E7A62]"}`}
                >
                  {item.number}
                </span>
                <span
                  className={`text-base sm:text-lg md:text-xl font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? "text-[#1C1C1C] dark:text-[#EDECE8] font-semibold" : "text-[#5C5954]/50 dark:text-[#97A5B8]/50 group-hover:text-[#1C1C1C] dark:group-hover:text-white"}`}
                >
                  {itemTrans?.name || item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeArchetypeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#8E7A62] dark:bg-[#CBB9A7]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </MaisonReveal>

      {/* Main Showcase Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedItem.id}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -30,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 items-start"
        >
          {/* Left Side: Frame & Image (Toggleable between Editorial and Macro detail) */}
          <MaisonReveal
            variant="scale-down-unveil"
            delay={0.15}
            className="lg:col-span-6 flex flex-col space-y-4 w-full"
          >
            <div
              className="relative aspect-[4/5] bg-[#E8E4DF] border border-[#1C1C1C]/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] group select-none"
              style={{
                cursor: viewMode === "macro" ? "crosshair" : "zoom-in",
              }}
              onMouseEnter={() => {
                setIsHoveredOverImage(true);
                if (viewMode === "macro") setIsZooming(true);
              }}
              onMouseLeave={() => {
                setIsHoveredOverImage(false);
                if (viewMode === "macro") setIsZooming(false);
              }}
              onMouseMove={handleMouseMove}
              onTouchStart={() => {
                if (viewMode === "macro") setIsZooming(true);
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => {
                if (viewMode === "macro") setIsZooming(false);
              }}
              onTouchCancel={() => {
                if (viewMode === "macro") setIsZooming(false);
              }}
              onClick={() => {
                setIsEnlarged(true);
              }}
            >
              {/* Image Transition Panel */}
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={
                    viewMode === "editorial"
                      ? `${selectedItem.id}-${activeImageIndex}`
                      : `${selectedItem.id}-macro`
                  }
                  initial={{
                    opacity: 0,
                    scale: 1.025,
                  }}
                  animate={{
                    opacity: 1,
                    scale:
                      isZooming && viewMode === "macro"
                        ? 3.0
                        : isHoveredOverImage && viewMode === "editorial"
                          ? 1.03
                          : 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    },
                    scale: {
                      duration: viewMode === "macro" ? 0.25 : 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  style={{
                    transformOrigin:
                      isZooming && viewMode === "macro"
                        ? `${zoomCoords.x}% ${zoomCoords.y}%`
                        : "center",
                  }}
                  src={
                    viewMode === "editorial"
                      ? selectedItem.images[activeImageIndex]?.url
                      : selectedItem.macroUrl
                  }
                  alt={`${selectedItem.name} (${viewMode === "editorial" ? `Image ${activeImageIndex + 1}` : "macro"} view)`}
                  className="object-cover w-full h-full pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Seamless Carousel Arrow Navigation (Visible in Editorial Mode only) */}
              {viewMode === "editorial" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-0 top-0 bottom-0 w-1/5 flex items-center justify-start pl-4 md:pl-6 text-[#1C1C1C] dark:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 cursor-pointer z-20 group/prev-btn"
                  >
                    <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-[#1C1C1C]/5 py-2 px-3 rounded-full translate-x-1 group-hover/prev-btn:translate-x-0 transition-all duration-300">
                      <ChevronLeft className="w-3.5 h-3.5 stroke-[1]" />
                      <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#5C5954] opacity-85 select-none">
                        {isFarsi ? "قبلی" : "PREV"}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-1/5 flex items-center justify-end pr-4 md:pr-6 text-[#1C1C1C] dark:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 cursor-pointer z-20 group/next-btn"
                  >
                    <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-[#1C1C1C]/5 py-2 px-3 rounded-full -translate-x-1 group-hover/next-btn:translate-x-0 transition-all duration-300">
                      <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#5C5954] opacity-85 select-none">
                        {isFarsi ? "بعدی" : "NEXT"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[1]" />
                    </div>
                  </button>
                </>
              )}

              {/* Super Elegant Corner Maximizer Indicator - Slides in and fades gracefully */}
              <div
                className="absolute top-4 right-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-20"
                style={{
                  transform: isHoveredOverImage
                    ? "translate(0, 0) scale(1)"
                    : "translate(8px, -8px) scale(0.85)",
                  opacity: isHoveredOverImage ? 1 : 0,
                }}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-md border border-[#1C1C1C]/12 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.07)] text-[#1C1C1C]">
                  <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
              </div>

              {/* Museum card overlay */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm border border-[#1C1C1C]/10 px-4 py-2 font-mono text-[9px] tracking-widest text-[#1C1C1C] rounded-lg z-10 uppercase">
                {isFarsi ? "سال ثبت" : "YEAR"}: {selectedItem.year}
              </div>

              {/* Dynamic Aspect & Index Badge */}
              {viewMode === "editorial" && (
                <div className="absolute bottom-6 right-6 flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm border border-[#1C1C1C]/10 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-wider text-[#1C1C1C] z-10 uppercase">
                  <span>
                    {activeImageIndex + 1} / {selectedItem.images.length}
                  </span>
                  <span className="text-[#8E7A62]">•</span>
                  <span>
                    {isFarsi
                      ? selectedItem.images[activeImageIndex]?.orientation ===
                        "wide"
                        ? "نمای افقی"
                        : "نمای عمودی"
                      : `${selectedItem.images[activeImageIndex]?.orientation || "PORTRAIT"} VIEW`}
                  </span>
                </div>
              )}

              {viewMode === "macro" && (
                <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-[#8E7A62] border border-[#8E7A62]/20 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-widest text-white z-10 uppercase shadow-[0_4px_16px_rgba(0,0,0,0.15)] select-none">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span>TACTILE LENS (3.0X)</span>
                </div>
              )}

              {/* Sourced Location Indicator */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-2 bg-white/95 backdrop-blur-sm border border-[#1C1C1C]/10 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-wider text-[#1C1C1C] z-10">
                <MapPin className="w-2.5 h-2.5 text-[#8E7A62]" />
                <span>{selectedItem.specifications.origin}</span>
              </div>
            </div>

            {/* Toggle controls to view Macro Detail on texture materials */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#1C1C1C]/10 pt-4">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#5C5954] dark:text-[#97A5B8] uppercase">
                DISCOVER OBJECT PERSPECTIVES
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <MaisonButton
                  variant={
                    viewMode === "editorial" ? "pill-dark" : "pill-light"
                  }
                  onClick={() => setViewMode("editorial")}
                  className="flex-1 sm:flex-initial text-center justify-center"
                >
                  EDITORIAL VIEW
                </MaisonButton>
                <MaisonButton
                  variant={viewMode === "macro" ? "pill-dark" : "pill-light"}
                  onClick={() => setViewMode("macro")}
                  className="flex-1 sm:flex-initial text-center justify-center"
                >
                  MACRO TEXTURE
                </MaisonButton>
              </div>
            </div>
          </MaisonReveal>

          {/* Right Side: Museum Object Sheet & Custom Specs */}
          <MaisonReveal
            variant="slide-up-royal"
            delay={0.3}
            className="lg:col-span-6 flex flex-col w-full text-left rtl:text-right"
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#1C1C1C]/10 pb-4">
              <span className="text-xs font-mono text-[#8E7A62] font-semibold tracking-widest">
                {selectedItem.number} /{" "}
                {isFarsi ? "مجموعه آرشیو" : "ARCHIVE COLLECTION"}
              </span>
              <span className="text-xs font-mono text-[#8E7A62] tracking-wider uppercase flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 bg-[#8E7A62] rounded-full animate-pulse" />
                {isFarsi ? "ثبت سفارش دست‌ساز" : "BESPOKE COMMISSION"}
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-[#1C1C1C] mb-2 leading-tight">
              {getItemTranslations(selectedItem.id)?.name || selectedItem.name}
            </h3>
            <p className="text-xs font-mono tracking-widest text-[#5C5954] uppercase mb-6">
              {isFarsi ? "معمار اثر" : "Designer"}: {selectedItem.designer}
            </p>

            <p className="text-sm sm:text-base text-[#1C1C1C] font-light leading-relaxed mb-6">
              {getItemTranslations(selectedItem.id)?.description ||
                selectedItem.description}
            </p>

            <div className="bg-[#E8E4DF]/60 p-6 border border-[#1C1C1C]/10 mb-8 rounded-xl">
              <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#8E7A62] mb-2">
                {isFarsi
                  ? "تک‌نگاری و ریشه‌های مادی اثر"
                  : "MATERIAL MONOGRAPH"}
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5954] font-light leading-relaxed">
                {getItemTranslations(selectedItem.id)?.story ||
                  selectedItem.story}
              </p>
            </div>

            {/* Essentials Specifications Folding Dossier */}
            <div className="border-t border-b border-[#1C1C1C]/10 dark:border-white/10 mb-8 overflow-hidden animate-none">
              <button
                type="button"
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="w-full py-5 flex items-center justify-between group cursor-pointer focus:outline-none"
              >
                <div className="flex items-center space-x-3 text-left rtl:text-right">
                  <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-[#8E7A62] dark:text-[#CBB9A7] font-semibold uppercase">
                    {isFarsi
                      ? "مشخصات فنی و داده‌های اصلی اتلیه"
                      : "STUDIO LOOKBOOK & ESSENTIAL DATA"}
                  </span>
                  <span className="text-[9px] font-mono text-[#5C5954] dark:text-[#97A5B8] opacity-65 group-hover:opacity-100 transition-opacity">
                    (
                    {isSpecsExpanded
                      ? isFarsi
                        ? "بستن"
                        : "COLLAPSE"
                      : isFarsi
                        ? "نمایش جزییات"
                        : "SHOW STATS OVERVIEW"}
                    )
                  </span>
                </div>
                {/* Minimalist interactive indicators */}
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <motion.div
                    className="absolute w-3 h-[1px] bg-[#1C1C1C] dark:bg-[#EDECE8]"
                    animate={{
                      rotate: isSpecsExpanded ? 0 : 90,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                  <div className="absolute w-3 h-[1px] bg-[#1C1C1C] dark:bg-[#EDECE8]" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isSpecsExpanded && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-6 border-t border-[#1C1C1C]/10 dark:border-white/10 mt-1">
                      <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-xs pb-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-[#5C5954] dark:text-[#97A5B8] block uppercase">
                            {isFarsi ? "ابعاد فیزیکی" : "Scope / Dimensions"}
                          </span>
                          <span className="text-[#1C1C1C] dark:text-[#EDECE8] font-light text-xs sm:text-sm block leading-relaxed">
                            {getItemTranslations(selectedItem.id)?.dimensions ||
                              selectedItem.dimensions}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-[#5C5954] dark:text-[#97A5B8] block uppercase">
                            {isFarsi ? "نوع پرداخت سنگ" : "Finish Details"}
                          </span>
                          <span className="text-[#1C1C1C] dark:text-[#EDECE8] font-light text-xs sm:text-sm block leading-relaxed">
                            {getItemTranslations(selectedItem.id)?.finish ||
                              selectedItem.specifications.finish}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-[#5C5954] dark:text-[#97A5B8] block uppercase">
                            {isFarsi
                              ? "وزن خالص کارگاهی"
                              : "Atelier Net Weight"}
                          </span>
                          <span className="text-[#1C1C1C] dark:text-[#EDECE8] font-light text-xs sm:text-sm block leading-relaxed">
                            {selectedItem.specifications.weight}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-[#5C5954] dark:text-[#97A5B8] block uppercase">
                            {isFarsi
                              ? "مدت زمان تحویل متغیر"
                              : "Est. Curated Delivery"}
                          </span>
                          <span className="text-[#1C1C1C] dark:text-[#EDECE8] font-light text-xs sm:text-sm block leading-relaxed">
                            {getItemTranslations(selectedItem.id)?.leadTime ||
                              selectedItem.specifications.leadTime}
                          </span>
                        </div>
                        <div className="col-span-2 pt-2">
                          <span className="text-[9px] font-mono tracking-widest text-[#5C5954] dark:text-[#97A5B8] block uppercase mb-2">
                            {isFarsi
                              ? "ترکیب مواد خام تشکیل دهنده"
                              : "Primary Composition Materials"}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(
                              getItemTranslations(selectedItem.id)?.materials ||
                              selectedItem.materials
                            ).map((mat, i) => (
                              <span
                                key={i}
                                className="text-[9px] bg-white/40 dark:bg-white/5 border border-[#1C1C1C]/10 dark:border-white/10 px-3 py-1 text-[#1C1C1C] dark:text-[#EDECE8] uppercase font-mono tracking-wide rounded-full"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Explicit luxury entry link to open the dedicated full-screen page */}
                      <div className="mt-6 pt-4 border-t border-[#1C1C1C]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[9px] font-mono text-[#5C5954] dark:text-[#97A5B8] leading-relaxed max-w-sm uppercase text-left rtl:text-right">
                          {isFarsi
                            ? "توضیحات کامل به همراه نقشه‌ها و دستورالعمل‌های دو زبانه و جزییات لوازم خانگی Gaggenau در دفترچه جامع تدارکات وجود دارد."
                            : "Complete technical descriptions, bilingual poetry logs, & Gaggenau appliance details exist in our dedicated master catalogue."}
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewDetails(selectedItem)}
                          className="font-mono text-[9px] tracking-[0.2em] bg-[#8E7A62] text-white hover:bg-[#1C1C1C] dark:hover:bg-white dark:hover:text-[#1C1C1C] py-2.5 px-5 rounded-full uppercase font-medium flex items-center space-x-2 rtl:space-x-reverse transition-all duration-300 focus:outline-none cursor-pointer hover:shadow-md"
                        >
                          <span>
                            {isFarsi
                              ? "مشاهده پرونده سفارشی اثر"
                              : "REVEAL BESPOKE DOSSIER"}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.8] rtl:rotate-270" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inquire Acquisiton and Security Seals */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <MaisonButton
                variant="solid"
                onClick={() => onInquireItem(selectedItem)}
                className="w-full"
              >
                Initiate Private Inquiry
              </MaisonButton>
            </div>

            <div className="flex items-center space-x-2 mt-4 text-[#5C5954]/70 text-[10px] font-mono tracking-wider justify-center sm:justify-start">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8E7A62]" />
              <span>
                Complimentary insured airfreight with whiteglove placement
                globally.
              </span>
            </div>
          </MaisonReveal>
        </motion.div>
      </AnimatePresence>

      {/* Immersive High-Fidelity Cinematic Image Lightbox Viewer */}
      <AnimatePresence>
        {isEnlarged && (
          <motion.div
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
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center backdrop-blur-3xl p-6 md:p-16 cursor-zoom-out group/lightbox"
            style={{
              backgroundColor: "var(--bg-card-95)",
            }}
            onClick={() => setIsEnlarged(false)}
          >
            {/* Header info / count badge */}
            <div className="absolute top-6 left-6 md:left-12 flex items-center space-x-4 pointer-events-none select-none">
              <span className="font-mono text-[9px] tracking-[0.3em] font-semibold text-[#8E7A62] uppercase">
                {selectedItem.number} ARCHIVE
              </span>
              <span className="text-[var(--text-secondary)] opacity-30">•</span>
              <span className="font-serif italic text-xs text-[var(--text-primary)] select-none">
                {selectedItem.name}
              </span>
              {viewMode === "editorial" && (
                <>
                  <span className="text-[var(--text-secondary)] opacity-30">
                    •
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-[#8E7A62]">
                    {activeImageIndex + 1} OF {selectedItem.images.length}
                  </span>
                </>
              )}
            </div>

            {/* Elegant Close Button */}
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute top-6 right-6 md:right-12 group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] px-4 py-2 rounded-full font-mono text-[8px] tracking-[0.2em] transition-all duration-300 z-50 cursor-pointer"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5 stroke-[1.25] transition-transform group-hover:rotate-90 duration-300" />
            </button>

            {/* Image display center frame */}
            <div
              className="relative max-w-[90vw] md:max-w-[80vw] max-h-[66vh] md:max-h-[70vh] flex items-center justify-center p-1 rounded-sm overflow-hidden select-none"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle between standard view and 2.0x magnifier mode on click
                setLightboxScale((prev) => (prev > 1 ? 1 : 2.0));
              }}
              onMouseMove={handleLightboxMouseMove}
              onTouchMove={handleLightboxTouchMove}
              style={{
                cursor: lightboxScale > 1 ? "crosshair" : "zoom-in",
              }}
            >
              {viewMode === "editorial" && (
                <>
                  {/* Left arrow with consistent capsule style */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute -left-2 md:-left-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                  >
                    <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:-translate-x-1 shadow-md">
                      <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                      <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">
                        PREV
                      </span>
                    </div>
                  </button>

                  {/* Right arrow with consistent capsule style */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute -right-2 md:-right-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                  >
                    <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:translate-x-1 shadow-md">
                      <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">
                        NEXT
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                    </div>
                  </button>
                </>
              )}

              {/* Shimmering sync loader overlay */}
              {isLightboxLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: [0.35, 0.7, 0.35],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="font-mono text-[8.5px] tracking-[0.4em] text-[#8E7A62] bg-[var(--bg-card-95)] px-4 py-2 rounded-sm border border-[var(--border-color-10)]"
                  >
                    RESOLVING SPECIMEN DETAIL...
                  </motion.div>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                <motion.img
                  key={
                    viewMode === "editorial"
                      ? `${selectedItem.id}-${activeImageIndex}`
                      : `${selectedItem.id}-macro`
                  }
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: isLightboxLoading ? 0 : 1,
                    scale: isLightboxLoading
                      ? 0.95
                      : lightboxScale > 1
                        ? lightboxScale
                        : 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    },
                    scale: {
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                  onLoad={() => setIsLightboxLoading(false)}
                  src={
                    viewMode === "editorial"
                      ? selectedItem.images[activeImageIndex]?.url
                      : selectedItem.macroUrl
                  }
                  alt={selectedItem.name}
                  style={{
                    transformOrigin:
                      lightboxScale > 1
                        ? `${lightboxPan.x}% ${lightboxPan.y}%`
                        : "center",
                  }}
                  className="object-contain max-h-[62vh] md:max-h-[66vh] max-w-[85vw] md:max-w-[75vw] block rounded-sm shadow-2xl border border-[var(--border-color-15)] transition-shadow duration-300"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>

            {/* Elegant Floating Custom Zoom & Tactile Magnifier Floating Controller in Disc-shape */}
            <motion.div
              onMouseEnter={() => setIsZoomControllerHovered(true)}
              onMouseLeave={() => setIsZoomControllerHovered(false)}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-28 md:bottom-24 left-6 sm:left-10 md:left-12 lg:left-16 z-50 pointer-events-auto flex items-center bg-white/75 dark:bg-[#1C1C1C]/85 backdrop-blur-md border border-[#1C1C1C]/10 dark:border-white/10 rounded-full h-11 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] select-none opacity-0 group-hover/lightbox:opacity-100 focus-within:opacity-100 transition-opacity duration-300"
              animate={{
                width: isZoomControllerHovered ? 290 : 44,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* The curator's zoom cycle wheel (acting as the default disc view) */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  // Cycle zoom levels helper
                  const nextScale =
                    Math.abs(lightboxScale - 1.0) < 0.1
                      ? 1.8
                      : Math.abs(lightboxScale - 1.8) < 0.2
                        ? 3.0
                        : 1.0;
                  setLightboxScale(nextScale);
                }}
                className="w-8 h-8 rounded-full border border-[#1C1C1C]/10 dark:border-white/10 relative overflow-hidden flex items-center justify-center cursor-pointer shrink-0 z-10 bg-transparent"
                title="Cycle zoom level"
                animate={{
                  rotate:
                    (Math.abs(lightboxScale - 1.0) < 0.1
                      ? 0
                      : Math.abs(lightboxScale - 1.8) < 0.2
                        ? 120
                        : 240) + (isZoomControllerHovered ? 180 : 0),
                }}
                transition={{
                  duration: 0.95,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileTap={{
                  scale: 0.92,
                }}
              >
                {/* Split shadow overlay providing rotating chiaroscuro weight */}
                <div className="absolute inset-0 bg-transparent flex">
                  <div className="w-1/2 h-full bg-[#1C1C1C]/12 dark:bg-white/10" />
                  <div className="w-1/2 h-full bg-transparent" />
                </div>

                {/* Core analog bronze pivot core */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#8E7A62] dark:bg-[#CBB9A7] z-10" />
              </motion.button>

              {/* Slideable & Expansible control section */}
              <motion.div
                className="flex items-center pl-3 pr-2 border-l border-[#1C1C1C]/10 dark:border-white/10 mr-1 shrink-0 overflow-hidden"
                animate={{
                  opacity: isZoomControllerHovered ? 1 : 0,
                  x: isZoomControllerHovered ? 0 : 15,
                }}
                transition={{
                  duration: 0.45,
                  delay: isZoomControllerHovered ? 0.05 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  pointerEvents: isZoomControllerHovered ? "auto" : "none",
                }}
              >
                <div className="flex items-center space-x-4">
                  {/* PREV button */}
                  {
                    viewMode === "editorial" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Trigger image previous
                          setActiveImageIndex(
                            (prev) =>
                              (prev - 1 + selectedItem.images.length) %
                              selectedItem.images.length,
                          );
                          setIsLightboxLoading(true);
                        }}
                        className="text-[#1C1C1C]/60 dark:text-white/60 hover:text-[#1C1C1C] dark:hover:text-white p-1 transition-colors cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    ) : (
                      <div className="w-6" />
                    ) // spacer
                  }

                  {/* Preset Buttons */}
                  <div className="flex items-center space-x-2">
                    {[1.0, 1.8, 3.0].map((preset) => {
                      const isActive = Math.abs(lightboxScale - preset) < 0.1;
                      return (
                        <button
                          key={preset}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxScale(preset);
                          }}
                          className={`px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] rounded-full transition-all cursor-pointer ${isActive ? "bg-[#8E7A62] text-white font-semibold shadow-sm" : "text-[#1C1C1C]/60 dark:text-[#97A5B8] hover:text-[#1C1C1C] dark:hover:text-white"}`}
                        >
                          {preset.toFixed(1)}X
                        </button>
                      );
                    })}
                  </div>

                  {/* NEXT button */}
                  {
                    viewMode === "editorial" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Trigger image next
                          setActiveImageIndex(
                            (prev) => (prev + 1) % selectedItem.images.length,
                          );
                          setIsLightboxLoading(true);
                        }}
                        className="text-[#1C1C1C]/60 dark:text-white/60 hover:text-[#1C1C1C] dark:hover:text-white p-1 transition-colors cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    ) : (
                      <div className="w-6" />
                    ) // spacer
                  }
                </div>
              </motion.div>
            </motion.div>

            {/* Thin, Airy, Elegant Non-Blocking Bottom Status Bar */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-transparent border-t border-[var(--border-color-10)] pt-4 w-auto max-w-5xl mx-auto z-40 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center space-x-2.5">
                  <span className="font-serif text-[15px] italic text-[var(--text-primary)] font-light">
                    {selectedItem.name}
                  </span>
                  <span className="text-[var(--text-secondary)] opacity-30">
                    •
                  </span>
                  <span className="text-[var(--text-secondary)] opacity-80 text-[8.5px] font-mono tracking-[0.2em] uppercase">
                    {viewMode} PERSPECTIVE
                  </span>
                </div>
                <p className="text-[9.5px] text-[var(--text-secondary)] opacity-55 font-mono mt-0.5 tracking-[0.1em] uppercase">
                  {selectedItem.materials.join("   //   ")}
                </p>
              </div>

              <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-[#8E7A62] font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 font-medium select-none">
                  <span className="w-1.5 h-1.5 bg-[#8E7A62] rounded-full animate-pulse" />
                  ACQUISITION COMMISSION
                </span>
                <MaisonButton
                  variant="outline"
                  onClick={() => {
                    setIsEnlarged(false);
                    onInquireItem(selectedItem);
                  }}
                  className="!px-4 !py-1.5 !text-[8.5px] !tracking-[0.25em] !rounded-full !bg-transparent border-[var(--border-color-15)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] shadow-sm"
                >
                  INQUIRE ACQUISITION
                </MaisonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
