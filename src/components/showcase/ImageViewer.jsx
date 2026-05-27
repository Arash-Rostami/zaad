import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, MapPin, Maximize2 } from "lucide-react";
import MaisonButton from "../MaisonButton";
import MaisonReveal from "../MaisonReveal";

export default function ImageViewer({ selectedItem, showcase, t }) {
    const {
        handleNextImage,
        handlePrevImage,
        viewMode,
        setViewMode,
        zoomCoords,
        isZooming,
        setIsZooming,
        handleMacroMouseMove,
        handleMacroTouchMove,
        activeImageIndex,
        openLightbox,
        isHoveredOverImage,
        setIsHoveredOverImage,
    } = showcase;

    return (
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
    );
}
