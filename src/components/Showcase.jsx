"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Maximize2, ShieldCheck, X } from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "@/services/TranslationService";
import useShowcase from "../hooks/useShowcase";

export default function Showcase({ onInquireItem, onViewDetails }) {
    const { t, data, getItemTranslations } = useLanguage();
    const collection = data("collection") || [];
    const {
        selectedItem,
        selectItem,
        handleNextImage,
        handlePrevImage,
        viewMode,
        setViewMode,
        isSpecsExpanded,
        toggleSpecs,
        zoomCoords,
        isZooming,
        setIsZooming,
        handleMacroMouseMove,
        handleMacroTouchMove,
        activeImageIndex,
        setActiveImageIndex,
        isEnlarged,
        openLightbox,
        closeLightbox,
        isHoveredOverImage,
        setIsHoveredOverImage,
        lightboxScale,
        setLightboxScale,
        cycleZoom,
        lightboxPan,
        handleLightboxMouseMove,
        handleLightboxTouchMove,
        isLightboxLoading,
        setIsLightboxLoading,
        markImageLoaded,
        isZoomControllerHovered,
        setIsZoomControllerHovered,
        goNextWrapped,
        goPrevWrapped,
    } = useShowcase();

    if (!selectedItem) return null;

    return (
        <section
            id="collection"
            className="py-24 md:py-36 bg-surface px-6 sm:px-12 max-w-7xl mx-auto border-b border-ink/10"
        >
            <MaisonReveal variant="unveil" threshold={0.05}>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-ink/10">
                    <div>
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                            {t("showcaseBadge")}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light">
                            {t("showcaseTitle")}
                        </h2>
                    </div>
                    <p className="text-xs font-mono text-muted max-w-xs mt-4 md:mt-0 leading-relaxed uppercase opacity-85">
                        {t("showcaseCatalogueDesc")}
                    </p>
                </div>

                <div className="flex justify-center items-center space-x-6 sm:space-x-10 md:space-x-16 border-b border-ink/10 pb-0 mb-16 mx-auto w-full flex-wrap gap-y-4">
                    {collection.map((item) => {
                        const isActive = selectedItem.id === item.id;
                        const itemTrans = getItemTranslations(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => selectItem(item)}
                                className="group relative pb-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer focus:outline-none shrink-0"
                            >
                                <span className={`text-xs md:text-sm font-serif italic tracking-wider mb-2 transition-all duration-300 ${isActive ? "text-accent font-semibold scale-110" : "text-muted/40 text-headline/30 group-hover:text-accent"}`}>
                                    {item.number}
                                </span>
                                <span className={`text-base sm:text-lg md:text-xl font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? "text-ink font-semibold" : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"}`}>
                                    {itemTrans?.name || item.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeArchetypeTabLine"
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent"
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

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 items-start"
                >
                    <MaisonReveal
                        variant="scale-down-unveil"
                        delay={0.15}
                        className="lg:col-span-6 flex flex-col space-y-4 w-full"
                    >
                        <div
                            className="relative aspect-[4/5] bg-surface-alt border border-ink/10 overflow-hidden shadow-ambient group select-none"
                            style={{ cursor: viewMode === "macro" ? "crosshair" : "zoom-in" }}
                            onMouseEnter={() => {
                                setIsHoveredOverImage(true);
                                if (viewMode === "macro") setIsZooming(true);
                            }}
                            onMouseLeave={() => {
                                setIsHoveredOverImage(false);
                                if (viewMode === "macro") setIsZooming(false);
                            }}
                            onMouseMove={handleMacroMouseMove}
                            onTouchStart={() => { if (viewMode === "macro") setIsZooming(true); }}
                            onTouchMove={handleMacroTouchMove}
                            onTouchEnd={() => { if (viewMode === "macro") setIsZooming(false); }}
                            onTouchCancel={() => { if (viewMode === "macro") setIsZooming(false); }}
                            onClick={openLightbox}
                        >
                            <AnimatePresence mode="popLayout">
                                <motion.img
                                    key={viewMode === "editorial" ? `${selectedItem.id}-${activeImageIndex}` : `${selectedItem.id}-macro`}
                                    initial={{ opacity: 0, scale: 1.025 }}
                                    animate={{
                                        opacity: 1,
                                        scale: isZooming && viewMode === "macro" ? 3.0 : isHoveredOverImage && viewMode === "editorial" ? 1.03 : 1,
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                        scale: { duration: viewMode === "macro" ? 0.25 : 0.8, ease: [0.16, 1, 0.3, 1] },
                                    }}
                                    style={{
                                        transformOrigin: isZooming && viewMode === "macro" ? `${zoomCoords.x}% ${zoomCoords.y}%` : "center",
                                    }}
                                    src={viewMode === "editorial" ? selectedItem.images[activeImageIndex]?.url : selectedItem.macroUrl}
                                    alt={`${selectedItem.name} (${viewMode === "editorial" ? `Image ${activeImageIndex + 1}` : "macro"} view)`}
                                    className="object-cover w-full h-full pointer-events-none"
                                    referrerPolicy="no-referrer"
                                />
                            </AnimatePresence>

                            {viewMode === "editorial" && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                        className="absolute left-0 top-0 bottom-0 w-1/5 flex items-center justify-start pl-4 md:pl-6 text-headline transition-all duration-500 opacity-0 group-hover:opacity-100 cursor-pointer z-20 group/prev-btn"
                                    >
                                        <div className="flex items-center space-x-2 bg-panel/70 border border-ink/5 py-2 px-3 rounded-full translate-x-1 group-hover/prev-btn:translate-x-0 transition-all duration-300">
                                            <ChevronLeft className="w-3.5 h-3.5 stroke-[1]" />
                                            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted opacity-85 select-none">
                                                {t("showcasePrev")}
                                            </span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                        className="absolute right-0 top-0 bottom-0 w-1/5 flex items-center justify-end pr-4 md:pr-6 text-headline transition-all duration-500 opacity-0 group-hover:opacity-100 cursor-pointer z-20 group/next-btn"
                                    >
                                        <div className="flex items-center space-x-2 bg-panel/70 border border-ink/5 py-2 px-3 rounded-full -translate-x-1 group-hover/next-btn:translate-x-0 transition-all duration-300">
                                            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted opacity-85 select-none">
                                                {t("showcaseNext")}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 stroke-[1]" />
                                        </div>
                                    </button>
                                </>
                            )}

                            <div
                                className="absolute top-4 right-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-20"
                                style={{
                                    transform: isHoveredOverImage ? "translate(0, 0) scale(1)" : "translate(8px, -8px) scale(0.85)",
                                    opacity: isHoveredOverImage ? 1 : 0,
                                }}
                            >
                                <div className="w-9 h-9 flex items-center justify-center bg-panel-frost border border-ink/12 rounded-full shadow-card-sm text-ink">
                                    <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                                </div>
                            </div>

                            <div className="absolute top-6 left-6 bg-panel-frost border border-ink/10 px-4 py-2 font-mono text-[9px] tracking-widest text-ink rounded-lg z-10 uppercase">
                                {t("showcaseYear")}: {selectedItem.year}
                            </div>

                            {viewMode === "editorial" && (
                                <div className="absolute bottom-6 right-6 flex items-center space-x-1.5 bg-panel-frost border border-ink/10 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-wider text-ink z-10 uppercase">
                                    <span>{activeImageIndex + 1} / {selectedItem.images.length}</span>
                                    <span className="text-accent">•</span>
                                    <span>{selectedItem.images[activeImageIndex]?.orientation === "wide" ? t("showcaseLandscape") : t("showcasePortrait")}</span>
                                </div>
                            )}

                            {viewMode === "macro" && (
                                <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-accent border border-accent/20 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-widest text-white z-10 uppercase shadow-card-md select-none">
                                    <span className="w-1.5 h-1.5 bg-panel rounded-full animate-pulse" />
                                    <span>TACTILE LENS (3.0X)</span>
                                </div>
                            )}

                            <div className="absolute bottom-6 left-6 flex items-center space-x-2 bg-panel-frost border border-ink/10 px-3 py-1.5 rounded-full font-mono text-[8px] tracking-wider text-ink z-10">
                                <MapPin className="w-2.5 h-2.5 text-accent" />
                                <span>{selectedItem.specifications.origin}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-ink/10 pt-4">
                            <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                                {t("showcaseDiscoverPerspectives")}
                            </span>
                            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                                <MaisonButton
                                    variant={viewMode === "editorial" ? "pill-dark" : "pill-light"}
                                    onClick={() => setViewMode("editorial")}
                                    className="flex-1 sm:flex-initial text-center justify-center"
                                >
                                    {t("editorialView")}
                                </MaisonButton>
                                <MaisonButton
                                    variant={viewMode === "macro" ? "pill-dark" : "pill-light"}
                                    onClick={() => setViewMode("macro")}
                                    className="flex-1 sm:flex-initial text-center justify-center"
                                >
                                    {t("macroView")}
                                </MaisonButton>
                            </div>
                        </div>
                    </MaisonReveal>

                    <MaisonReveal
                        variant="slide-up-royal"
                        delay={0.3}
                        className="lg:col-span-6 flex flex-col w-full text-left rtl:text-right"
                    >
                        <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-4">
                            <span className="text-xs font-mono text-accent font-semibold tracking-widest">
                                {selectedItem.number} / {t("showcaseArchiveCollection")}
                            </span>
                            <span className="text-xs font-mono text-accent tracking-wider uppercase flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                {t("showcaseBespokeCommission")}
                            </span>
                        </div>

                        <h3 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-ink mb-2 leading-tight">
                            {getItemTranslations(selectedItem.id)?.name || selectedItem.name}
                        </h3>
                        <p className="text-xs font-mono tracking-widest text-muted uppercase mb-6">
                            {t("showcaseDesigner")}: {selectedItem.designer}
                        </p>

                        <p className="text-sm sm:text-base text-ink font-light leading-relaxed mb-6">
                            {getItemTranslations(selectedItem.id)?.description || selectedItem.description}
                        </p>

                        <div className="bg-surface-frosted p-6 border border-ink/10 mb-8 rounded-xl">
                            <h4 className="text-[10px] font-mono tracking-widest uppercase text-accent mb-2">
                                {t("showcaseMaterialMonograph")}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                                {getItemTranslations(selectedItem.id)?.story || selectedItem.story}
                            </p>
                        </div>

                        <div className="border-t border-b border-ink/10 mb-8 overflow-hidden animate-none">
                            <button
                                type="button"
                                onClick={toggleSpecs}
                                className="w-full py-5 flex items-center justify-between group cursor-pointer focus:outline-none"
                            >
                                <div className="flex items-center space-x-3 text-left rtl:text-right">
                                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-accent font-semibold uppercase">
                                        {t("showcaseStudioLookbook")}
                                    </span>
                                    <span className="text-[9px] font-mono text-muted opacity-65 group-hover:opacity-100 transition-opacity">
                                        ({isSpecsExpanded ? t("showcaseCollapse") : t("showcaseShowStats")})
                                    </span>
                                </div>
                                <div className="relative w-4 h-4 flex items-center justify-center">
                                    <motion.div
                                        className="absolute w-3 h-[1px] bg-ink"
                                        animate={{ rotate: isSpecsExpanded ? 0 : 90 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                    <div className="absolute w-3 h-[1px] bg-ink" />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isSpecsExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 pb-6 border-t border-ink/10 mt-1">
                                            <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-xs pb-4">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-mono tracking-widest text-muted block uppercase">
                                                        {t("showcaseScopeDimensions")}
                                                    </span>
                                                    <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">
                                                        {getItemTranslations(selectedItem.id)?.dimensions || selectedItem.dimensions}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-mono tracking-widest text-muted block uppercase">
                                                        {t("showcaseFinishDetails")}
                                                    </span>
                                                    <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">
                                                        {getItemTranslations(selectedItem.id)?.finish || selectedItem.specifications.finish}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-mono tracking-widest text-muted block uppercase">
                                                        {t("showcaseZAADWeight")}
                                                    </span>
                                                    <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">
                                                        {selectedItem.specifications.weight}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-mono tracking-widest text-muted block uppercase">
                                                        {t("showcaseCuratedDelivery")}
                                                    </span>
                                                    <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">
                                                        {getItemTranslations(selectedItem.id)?.leadTime || selectedItem.specifications.leadTime}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 pt-2">
                                                    <span className="text-[9px] font-mono tracking-widest text-muted block uppercase mb-2">
                                                        {t("showcasePrimaryMaterials")}
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(getItemTranslations(selectedItem.id)?.materials || selectedItem.materials).map((mat, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[9px] bg-panel-glass dark:bg-panel/5 border border-ink/10 px-3 py-1 text-ink uppercase font-mono tracking-wide rounded-full"
                                                            >
                                                                {mat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <span className="text-[9px] font-mono text-muted leading-relaxed max-w-sm uppercase text-left rtl:text-right">
                                                    {t("showcaseCatalogueText")}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onViewDetails(selectedItem)}
                                                    className="font-mono text-[9px] tracking-[0.2em] bg-accent text-white hover:bg-ink dark:hover:bg-panel dark:hover:text-ink py-2.5 px-5 rounded-full uppercase font-medium flex items-center space-x-2 rtl:space-x-reverse transition-all duration-300 focus:outline-none cursor-pointer hover:shadow-md"
                                                >
                                                    <span>{t("showcaseRevealDossier")}</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.8] rtl:rotate-270" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <MaisonButton
                                variant="solid"
                                onClick={() => onInquireItem(selectedItem)}
                                className="w-full"
                            >
                                {t("showcasePrivateInquiry")}
                            </MaisonButton>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 text-muted/70 text-[10px] font-mono tracking-wider justify-center sm:justify-start">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                            <span>{t("showcaseAirfreight")}</span>
                        </div>
                    </MaisonReveal>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {isEnlarged && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6 md:p-16 cursor-zoom-out group/lightbox"
                        style={{ backgroundColor: "var(--bg-card-95)" }}
                        onClick={closeLightbox}
                    >
                        <div className="absolute top-6 left-6 md:left-12 flex items-center space-x-4 pointer-events-none select-none">
                            <span className="font-mono text-[9px] tracking-[0.3em] font-semibold text-accent uppercase">
                                {selectedItem.number} ARCHIVE
                            </span>
                            <span className="text-[var(--text-secondary)] opacity-30">•</span>
                            <span className="font-serif italic text-xs text-[var(--text-primary)] select-none">
                                {selectedItem.name}
                            </span>
                            {viewMode === "editorial" && (
                                <>
                                    <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                    <span className="font-mono text-[9px] tracking-widest text-accent">
                                        {activeImageIndex + 1} OF {selectedItem.images.length}
                                    </span>
                                </>
                            )}
                        </div>

                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 md:right-12 group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] px-4 py-2 rounded-full font-mono text-[8px] tracking-[0.2em] transition-all duration-300 z-50 cursor-pointer"
                        >
                            <span>CLOSE</span>
                            <X className="w-3.5 h-3.5 stroke-[1.25] transition-transform group-hover:rotate-90 duration-300" />
                        </button>

                        <div
                            className="relative max-w-[90vw] md:max-w-[80vw] max-h-[66vh] md:max-h-[70vh] flex items-center justify-center p-1 rounded-sm overflow-hidden select-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxScale((prev) => (prev > 1 ? 1 : 2.0));
                            }}
                            onMouseMove={handleLightboxMouseMove}
                            onTouchMove={handleLightboxTouchMove}
                            style={{ cursor: lightboxScale > 1 ? "crosshair" : "zoom-in" }}
                        >
                            {viewMode === "editorial" && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                        className="absolute -left-2 md:-left-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                                    >
                                        <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:-translate-x-1 shadow-md">
                                            <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                            <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">PREV</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                        className="absolute -right-2 md:-right-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                                    >
                                        <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:translate-x-1 shadow-md">
                                            <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">NEXT</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                        </div>
                                    </button>
                                </>
                            )}

                            {isLightboxLoading && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.35, 0.7, 0.35] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        className="font-mono text-[8.5px] tracking-[0.4em] text-accent bg-[var(--bg-card-95)] px-4 py-2 rounded-sm border border-[var(--border-color-10)]"
                                    >
                                        RESOLVING SPECIMEN DETAIL...
                                    </motion.div>
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                <motion.img
                                    key={viewMode === "editorial" ? `${selectedItem.id}-${activeImageIndex}` : `${selectedItem.id}-macro`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: isLightboxLoading ? 0 : 1,
                                        scale: isLightboxLoading ? 0.95 : lightboxScale > 1 ? lightboxScale : 1,
                                    }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{
                                        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                        scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                                    }}
                                    onLoad={markImageLoaded}
                                    src={viewMode === "editorial" ? selectedItem.images[activeImageIndex]?.url : selectedItem.macroUrl}
                                    alt={selectedItem.name}
                                    style={{
                                        transformOrigin: lightboxScale > 1 ? `${lightboxPan.x}% ${lightboxPan.y}%` : "center",
                                    }}
                                    className="object-contain max-h-[62vh] md:max-h-[66vh] max-w-[85vw] md:max-w-[75vw] block rounded-sm shadow-2xl border border-[var(--border-color-15)] transition-shadow duration-300"
                                    referrerPolicy="no-referrer"
                                />
                            </AnimatePresence>
                        </div>

                        <motion.div
                            onMouseEnter={() => setIsZoomControllerHovered(true)}
                            onMouseLeave={() => setIsZoomControllerHovered(false)}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-28 md:bottom-24 left-6 sm:left-10 md:left-12 lg:left-16 z-50 pointer-events-auto flex items-center bg-panel/75 border border-ink/10 rounded-full h-11 p-1.5 shadow-card-lg select-none opacity-0 group-hover/lightbox:opacity-100 focus-within:opacity-100 transition-opacity duration-300"
                            animate={{ width: isZoomControllerHovered ? 290 : 44 }}
                            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <motion.button
                                onClick={(e) => { e.stopPropagation(); cycleZoom(); }}
                                className="w-8 h-8 rounded-full border border-ink/10 relative overflow-hidden flex items-center justify-center cursor-pointer shrink-0 z-10 bg-transparent"
                                title="Cycle zoom level"
                                animate={{
                                    rotate: (Math.abs(lightboxScale - 1.0) < 0.1 ? 0 : Math.abs(lightboxScale - 1.8) < 0.2 ? 120 : 240) + (isZoomControllerHovered ? 180 : 0),
                                }}
                                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                                whileTap={{ scale: 0.92 }}
                            >
                                <div className="absolute inset-0 bg-transparent flex">
                                    <div className="w-1/2 h-full bg-ink/12" />
                                    <div className="w-1/2 h-full bg-transparent" />
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-accent z-10" />
                            </motion.button>

                            <motion.div
                                className="flex items-center pl-3 pr-2 border-l border-ink/10 mr-1 shrink-0 overflow-hidden"
                                animate={{
                                    opacity: isZoomControllerHovered ? 1 : 0,
                                    x: isZoomControllerHovered ? 0 : 15,
                                }}
                                transition={{ duration: 0.45, delay: isZoomControllerHovered ? 0.05 : 0, ease: [0.16, 1, 0.3, 1] }}
                                style={{ pointerEvents: isZoomControllerHovered ? "auto" : "none" }}
                            >
                                <div className="flex items-center space-x-4">
                                    {viewMode === "editorial" ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); goPrevWrapped(); }}
                                            className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer"
                                            title="Previous Image"
                                        >
                                            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                                        </button>
                                    ) : (
                                        <div className="w-6" />
                                    )}

                                    <div className="flex items-center space-x-2">
                                        {[1.0, 1.8, 3.0].map((preset) => {
                                            const isActive = Math.abs(lightboxScale - preset) < 0.1;
                                            return (
                                                <button
                                                    key={preset}
                                                    onClick={(e) => { e.stopPropagation(); setLightboxScale(preset); }}
                                                    className={`px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] rounded-full transition-all cursor-pointer ${isActive ? "bg-accent text-white font-semibold shadow-sm" : "text-ink/60 dark:text-muted hover:text-headline"}`}
                                                >
                                                    {preset.toFixed(1)}X
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {viewMode === "editorial" ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); goNextWrapped(); }}
                                            className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer"
                                            title="Next Image"
                                        >
                                            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                                        </button>
                                    ) : (
                                        <div className="w-6" />
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-transparent border-t border-[var(--border-color-10)] pt-4 w-auto max-w-5xl mx-auto z-40 gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="flex items-center space-x-2.5">
                                    <span className="font-serif text-[15px] italic text-[var(--text-primary)] font-light">
                                        {selectedItem.name}
                                    </span>
                                    <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                    <span className="text-[var(--text-secondary)] opacity-80 text-[8.5px] font-mono tracking-[0.2em] uppercase">
                                        {viewMode} PERSPECTIVE
                                    </span>
                                </div>
                                <p className="text-[9.5px] text-[var(--text-secondary)] opacity-55 font-mono mt-0.5 tracking-[0.1em] uppercase">
                                    {selectedItem.materials.join("   //   ")}
                                </p>
                            </div>

                            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                                <span className="text-accent font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 font-medium select-none">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                    ACQUISITION COMMISSION
                                </span>
                                <MaisonButton
                                    variant="outline"
                                    onClick={() => { closeLightbox(); onInquireItem(selectedItem); }}
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