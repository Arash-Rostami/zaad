import React, { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import MaisonButton from "../MaisonButton";
import NoiseBg from "./NoiseBg";
import ExpandOnHoverPill from "./ExpandOnHoverPill";

const SWIPE_THRESHOLD = 48;

const ZoomController = React.memo(function ZoomController({
                                                              lightboxScale,
                                                              setLightboxScale,
                                                              cycleZoom,
                                                              isZoomControllerHovered,
                                                              setIsZoomControllerHovered,
                                                              onPrev,
                                                              onNext,
                                                              isRtl,
                                                          }) {
    const stop = useCallback((e) => e.stopPropagation(), []);
    const handleCycle = useCallback((e) => { e.stopPropagation(); cycleZoom(); }, [cycleZoom]);
    const handlePrev = useCallback((e) => { e.stopPropagation(); onPrev?.(); }, [onPrev]);
    const handleNext = useCallback((e) => { e.stopPropagation(); onNext?.(); }, [onNext]);

    return (
        <div
            onClick={stop}
            className="absolute bottom-28 md:bottom-24 left-6 sm:left-10 md:left-12 lg:left-16 z-50 pointer-events-none opacity-0 group-hover/lightbox:opacity-100 group-hover/lightbox:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto transition-opacity duration-300"
        >
            <ExpandOnHoverPill
                isExpanded={isZoomControllerHovered}
                onHoverChange={setIsZoomControllerHovered}
                rtl={isRtl}
                className="h-11 p-1.5 bg-panel/75 border border-ink/10 shadow-card-lg"
                trigger={
                    <motion.button
                        onClick={handleCycle}
                        className="w-8 h-8 rounded-md border border-ink/10 relative overflow-hidden flex items-center justify-center cursor-pointer shrink-0 z-10 bg-transparent"
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
                }
            >
                <div className="flex items-center ps-3 pe-2 border-s border-ink/10 me-1 shrink-0">
                    <div className="flex items-center space-x-4">
                        {onPrev ? (
                            <button data-touch-slop data-touch-boost onClick={handlePrev} className="flex items-center justify-center text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer">
                                <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                            </button>
                        ) : <div className="w-6" />}

                        <div className="flex items-center space-x-2">
                            {[1.0, 1.8, 3.0].map((preset) => {
                                const isActive = Math.abs(lightboxScale - preset) < 0.1;
                                return (
                                    <button
                                        key={preset}
                                        data-touch-slop
                                        data-touch-boost
                                        onClick={(e) => { e.stopPropagation(); setLightboxScale(preset); }}
                                        className={`flex items-center justify-center px-2.5 py-0.5 font-mono text-[length:max(9px,calc(10px*var(--zaad-font-scale)))] tracking-[0.1em] rounded-md transition-all cursor-pointer ${isActive ? "bg-accent text-on-indicator font-semibold shadow-sm" : "text-ink/60 dark:text-muted hover:text-headline"}`}
                                    >
                                        {preset.toFixed(1)}X
                                    </button>
                                );
                            })}
                        </div>

                        {onNext ? (
                            <button data-touch-slop data-touch-boost onClick={handleNext} className="flex items-center justify-center text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer">
                                <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                            </button>
                        ) : <div className="w-6" />}
                    </div>
                </div>
            </ExpandOnHoverPill>
        </div>
    );
});

const VEIL_CLIP = "inset(10% 6% 10% 6% round 10px)";
const OPEN_CLIP = "inset(0% 0% 0% 0% round 0px)";

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
                                     isRtl = false,
                                     t,
                                 }) {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const lastFocusedRef = useRef(null);
    const touchStartRef = useRef(null);
    const callbacksRef = useRef({ closeLightbox, onPrev, onNext });
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        callbacksRef.current = { closeLightbox, onPrev, onNext };
    });

    useEffect(() => {
        if (!isEnlarged) return;

        lastFocusedRef.current = document.activeElement;
        closeButtonRef.current?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                callbacksRef.current.closeLightbox();
                return;
            }
            if (e.key === "ArrowLeft") { callbacksRef.current.onPrev?.(); return; }
            if (e.key === "ArrowRight") { callbacksRef.current.onNext?.(); return; }
            if (e.key !== "Tab" || !dialogRef.current) return;

            const focusable = dialogRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            lastFocusedRef.current?.focus?.();
        };
    }, [isEnlarged]);

    const handleTouchStart = useCallback((e) => {
        if (e.touches.length > 1) {
            touchStartRef.current = null;
            return;
        }
        if (lightboxScale > 1) return;
        touchStartRef.current = e.touches[0].clientX;
    }, [lightboxScale]);

    const handleTouchEnd = useCallback((e) => {
        if (lightboxScale > 1 || touchStartRef.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartRef.current;
        touchStartRef.current = null;
        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        if (delta < 0) onNext?.();
        else onPrev?.();
    }, [lightboxScale, onNext, onPrev]);

    const handleImageAreaClick = useCallback((e) => { e.stopPropagation(); cycleZoom(); }, [cycleZoom]);
    const handlePrevClick = useCallback((e) => { e.stopPropagation(); onPrev(); }, [onPrev]);
    const handleNextClick = useCallback((e) => { e.stopPropagation(); onNext(); }, [onNext]);
    const stopPropagation = useCallback((e) => e.stopPropagation(), []);

    return (
        <AnimatePresence>
            {isEnlarged && (
                <motion.div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={itemName}
                    data-lenis-prevent
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6 md:p-16 cursor-zoom-out group/lightbox"
                    style={{ backgroundColor: "var(--bg-card-95)" }}
                    onClick={closeLightbox}
                >
                    {noiseOverlay && <NoiseBg filterId="lightboxNoise" />}

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-6 left-6 md:left-12 flex items-center space-x-4 pointer-events-none select-none"
                    >
                        <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.3em] font-semibold text-accent uppercase shrink-0">
                            <span className="font-latin">{archiveNumber}</span> {t("lightboxArchiveLabel")}
                        </span>
                        <span className="hidden sm:inline text-[var(--text-secondary)] opacity-30">•</span>
                        <span className="hidden sm:inline font-serif italic text-xs text-[var(--text-primary)] select-none truncate">{itemName}</span>
                        {counterLabel && (
                            <>
                                <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-widest text-accent shrink-0"><span dir="ltr">{counterLabel}</span></span>
                            </>
                        )}
                    </motion.div>

                    <motion.button
                        ref={closeButtonRef}
                        data-touch-boost
                        onClick={closeLightbox}
                        aria-label={t("menuClose")}
                        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-6 right-6 md:right-12 group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] px-4 py-2 rounded-md font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase transition-all duration-300 z-50 cursor-pointer"
                    >
                        <span className="hidden sm:inline">{t("menuClose")}</span>
                        <X className="w-3.5 h-3.5 stroke-[1.25] transition-transform group-hover:rotate-90 duration-300" />
                    </motion.button>

                    <div
                        className="relative max-w-[90vw] md:max-w-[80vw] max-h-[66vh] md:max-h-[70vh] flex items-center justify-center p-1 rounded-sm overflow-hidden select-none"
                        onClick={handleImageAreaClick}
                        onMouseMove={handleLightboxMouseMove}
                        onTouchMove={handleLightboxTouchMove}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{ cursor: lightboxScale > 1 ? "crosshair" : "zoom-in" }}
                    >
                        {onPrev && (
                            <motion.button
                                onClick={handlePrevClick}
                                initial={reduceMotion ? false : { opacity: 0, x: -12, y: "-50%" }}
                                animate={{ opacity: 1, x: 0, y: "-50%" }}
                                transition={{ delay: reduceMotion ? 0 : 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute -left-2 md:-left-24 top-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-md transition-all duration-300 transform group-hover:-translate-x-1 shadow-md">
                                    <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                    <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">{t("showcasePrev")}</span>
                                </div>
                            </motion.button>
                        )}

                        {onNext && (
                            <motion.button
                                onClick={handleNextClick}
                                initial={reduceMotion ? false : { opacity: 0, x: 12, y: "-50%" }}
                                animate={{ opacity: 1, x: 0, y: "-50%" }}
                                transition={{ delay: reduceMotion ? 0 : 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute -right-2 md:-right-24 top-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-md transition-all duration-300 transform group-hover:translate-x-1 shadow-md">
                                    <span className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">{t("showcaseNext")}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]" />
                                </div>
                            </motion.button>
                        )}

                        {isLightboxLoading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.35, 0.7, 0.35] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.4em] text-accent bg-[var(--bg-card-95)] px-4 py-2 rounded-sm border border-[var(--border-color-10)]"
                                >
                                    {t("resolvingSpecimen")}
                                </motion.div>
                            </div>
                        )}

                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={imageKey}
                                initial={{ opacity: 0, scale: 0.95, clipPath: reduceMotion ? OPEN_CLIP : VEIL_CLIP }}
                                animate={{
                                    opacity: isLightboxLoading ? 0 : 1,
                                    scale: isLightboxLoading ? 0.95 : lightboxScale > 1 ? lightboxScale : 1,
                                    clipPath: isLightboxLoading ? (reduceMotion ? OPEN_CLIP : VEIL_CLIP) : OPEN_CLIP,
                                }}
                                exit={{ opacity: 0, scale: 0.97, clipPath: reduceMotion ? OPEN_CLIP : VEIL_CLIP }}
                                transition={{
                                    opacity: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                                    scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                                    clipPath: { duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] },
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
                        isRtl={isRtl}
                    />

                    {showPanHint && (
                        <span className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(12px*var(--zaad-font-scale))] tracking-[0.2em] font-mono text-accent/95 font-medium uppercase select-none pointer-events-none whitespace-nowrap z-50">
                            {t("zoomHint")}
                        </span>
                    )}

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-transparent border-t border-[var(--border-color-10)] pt-4 w-auto max-w-5xl mx-auto z-40 gap-4"
                        onClick={stopPropagation}
                    >
                        <div className="flex flex-col items-center md:items-start text-center md:text-left rtl:md:text-right">
                            <div className="flex items-center space-x-2.5">
                                <span className="font-serif text-[length:calc(15px*var(--zaad-font-scale))] italic text-[var(--text-primary)] font-light">{footerTitle}</span>
                                <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                <span className="text-[var(--text-secondary)] opacity-80 text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase">
                                    {footerPerspective}
                                </span>
                            </div>
                            <p className="text-[length:calc(10.5px*var(--zaad-font-scale))] text-[var(--text-secondary)] opacity-55 font-mono mt-0.5 tracking-[0.1em] uppercase">
                                {footerSubtitle}
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-accent font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-[0.2em] uppercase flex items-center gap-1.5 font-medium select-none">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                {footerBadge}
                            </span>
                            <MaisonButton
                                variant="outline"
                                onClick={onCta}
                                icon={Sparkles}
                                className="!px-4 !py-1.5 !text-[length:calc(10px*var(--zaad-font-scale))] !tracking-[0.25em] !bg-transparent border-[var(--border-color-15)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] shadow-sm"
                            >
                                {t("lightboxInquireLabel")}
                            </MaisonButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}