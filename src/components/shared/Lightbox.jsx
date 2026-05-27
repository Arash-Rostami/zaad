import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import MaisonButton from "../MaisonButton";
import NoiseBg from "./NoiseBg";

function ZoomController({
    lightboxScale,
    setLightboxScale,
    cycleZoom,
    isZoomControllerHovered,
    setIsZoomControllerHovered,
    onPrev,
    onNext,
}) {
    return (
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
                animate={{
                    rotate:
                        (Math.abs(lightboxScale - 1.0) < 0.1 ? 0 : Math.abs(lightboxScale - 1.8) < 0.2 ? 120 : 240) +
                        (isZoomControllerHovered ? 180 : 0),
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
                animate={{ opacity: isZoomControllerHovered ? 1 : 0, x: isZoomControllerHovered ? 0 : 15 }}
                transition={{ duration: 0.45, delay: isZoomControllerHovered ? 0.05 : 0, ease: [0.16, 1, 0.3, 1] }}
                style={{ pointerEvents: isZoomControllerHovered ? "auto" : "none" }}
            >
                <div className="flex items-center space-x-4">
                    {onPrev ? (
                        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer">
                            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                        </button>
                    ) : <div className="w-6" />}

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

                    {onNext ? (
                        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer">
                            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                        </button>
                    ) : <div className="w-6" />}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Lightbox({
    isEnlarged,
    closeLightbox,
    imageKey,
    imageSrc,
    imageAlt,
    isLightboxLoading,
    markImageLoaded,
    lightboxScale,
    setLightboxScale,
    cycleZoom,
    lightboxPan,
    handleLightboxMouseMove,
    handleLightboxTouchMove,
    isZoomControllerHovered,
    setIsZoomControllerHovered,
    onPrev,
    onNext,
    archiveNumber,
    itemName,
    counterLabel,
    footerTitle,
    footerPerspective,
    footerSubtitle,
    footerBadge,
    onCta,
    noiseOverlay = false,
    showPanHint = false,
}) {
    return (
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
                    {noiseOverlay && <NoiseBg filterId="lightboxNoise" />}

                    <div className="absolute top-6 left-6 md:left-12 flex items-center space-x-4 pointer-events-none select-none">
                        <span className="font-mono text-[9px] tracking-[0.3em] font-semibold text-accent uppercase">
                            {archiveNumber} ARCHIVE
                        </span>
                        <span className="text-[var(--text-secondary)] opacity-30">•</span>
                        <span className="font-serif italic text-xs text-[var(--text-primary)] select-none">{itemName}</span>
                        {counterLabel && (
                            <>
                                <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                <span className="font-mono text-[9px] tracking-widest text-accent">{counterLabel}</span>
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
                        onClick={(e) => { e.stopPropagation(); setLightboxScale((prev) => (prev > 1 ? 1 : 2.0)); }}
                        onMouseMove={handleLightboxMouseMove}
                        onTouchMove={handleLightboxTouchMove}
                        style={{ cursor: lightboxScale > 1 ? "crosshair" : "zoom-in" }}
                    >
                        {onPrev && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                className="absolute -left-2 md:-left-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:-translate-x-1 shadow-md">
                                    <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                    <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">PREV</span>
                                </div>
                            </button>
                        )}

                        {onNext && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                                className="absolute -right-2 md:-right-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:translate-x-1 shadow-md">
                                    <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">NEXT</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                </div>
                            </button>
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
                                key={imageKey}
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
                                src={imageSrc}
                                alt={imageAlt}
                                style={{ transformOrigin: lightboxScale > 1 ? `${lightboxPan.x}% ${lightboxPan.y}%` : "center" }}
                                className="object-contain max-h-[62vh] md:max-h-[66vh] max-w-[85vw] md:max-w-[75vw] block rounded-sm shadow-2xl border border-[var(--border-color-15)] transition-shadow duration-300"
                                referrerPolicy="no-referrer"
                            />
                        </AnimatePresence>
                    </div>

                    <ZoomController
                        lightboxScale={lightboxScale}
                        setLightboxScale={setLightboxScale}
                        cycleZoom={cycleZoom}
                        isZoomControllerHovered={isZoomControllerHovered}
                        setIsZoomControllerHovered={setIsZoomControllerHovered}
                        onPrev={onPrev}
                        onNext={onNext}
                    />

                    {showPanHint && (
                        <span className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[7.5px] tracking-[0.2em] font-mono text-accent/95 font-medium uppercase select-none animate-pulse pointer-events-none whitespace-nowrap z-50">
                            [ Touch-drag or hover over image to pan texture detail ]
                        </span>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-transparent border-t border-[var(--border-color-10)] pt-4 w-auto max-w-5xl mx-auto z-40 gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center space-x-2.5">
                                <span className="font-serif text-[15px] italic text-[var(--text-primary)] font-light">{footerTitle}</span>
                                <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                <span className="text-[var(--text-secondary)] opacity-80 text-[8.5px] font-mono tracking-[0.2em] uppercase">
                                    {footerPerspective}
                                </span>
                            </div>
                            <p className="text-[9.5px] text-[var(--text-secondary)] opacity-55 font-mono mt-0.5 tracking-[0.1em] uppercase">
                                {footerSubtitle}
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-accent font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 font-medium select-none">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                {footerBadge}
                            </span>
                            <MaisonButton
                                variant="outline"
                                onClick={onCta}
                                className="!px-4 !py-1.5 !text-[8.5px] !tracking-[0.25em] !rounded-full !bg-transparent border-[var(--border-color-15)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] shadow-sm"
                            >
                                INQUIRE ACQUISITION
                            </MaisonButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
