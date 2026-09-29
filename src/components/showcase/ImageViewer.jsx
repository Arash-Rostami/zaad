import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, Eye, Layers, Pause, Play, RotateCw } from "lucide-react";
import MaisonButton from "../shared/MaisonButton";
import MaisonReveal from "../shared/MaisonReveal";

const MODE_EDITORIAL = "editorial";
const MODE_MACRO = "macro";
const MODE_360 = "360";
const ORIENTATION_WIDE = "wide";

const EASE_CUBIC = Object.freeze([0.16, 1, 0.3, 1]);

const INITIAL_IMAGE_ANIMATION = Object.freeze({ opacity: 0, scale: 1.025 });
const EXIT_IMAGE_ANIMATION = Object.freeze({ opacity: 0 });
const INITIAL_SPIN_IMAGE = Object.freeze({ opacity: 1 });

const OPACITY_TRANSITION = Object.freeze({
    duration: 0.5,
    ease: EASE_CUBIC,
});

const MACRO_SCALE_TRANSITION = Object.freeze({
    duration: 0.25,
    ease: EASE_CUBIC,
});

const DEFAULT_SCALE_TRANSITION = Object.freeze({
    duration: 0.8,
    ease: EASE_CUBIC,
});

const IMAGE_TRANSITION_MACRO = Object.freeze({
    opacity: OPACITY_TRANSITION,
    scale: MACRO_SCALE_TRANSITION,
});

const IMAGE_TRANSITION_DEFAULT = Object.freeze({
    opacity: OPACITY_TRANSITION,
    scale: DEFAULT_SCALE_TRANSITION,
});

const SPIN_OVERLAY_TRANSITION = Object.freeze({
    duration: 0.5,
    ease: EASE_CUBIC,
});

const CURSOR_STYLES = Object.freeze({
    [MODE_360]: Object.freeze({ cursor: "default" }),
    [MODE_MACRO]: Object.freeze({ cursor: "crosshair" }),
    [MODE_EDITORIAL]: Object.freeze({ cursor: "zoom-in" }),
});

function ImageViewer({ selectedItem, showcase, t }) {
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
    } = showcase ?? {};

    const [isSpinPlaying, setIsSpinPlaying] = useState(true);
    const [isSpinReady, setIsSpinReady] = useState(false);
    const [canMountSpin, setCanMountSpin] = useState(false);
    const spinVideoRef = useRef(null);

    const itemId = selectedItem?.id;

    const { spin360Src, spinPosterSrc } = useMemo(() => {
        const id = itemId ?? "";
        return {
            spin360Src: `/video/spin/spin-${id}-360.mp4`,
            spinPosterSrc: `/video/spin/spin-${id}-360.jpg`,
        };
    }, [itemId]);

    useEffect(() => {
        setIsSpinReady(false);
    }, [spin360Src]);

    useEffect(() => {
        const markReady = () => setCanMountSpin(true);
        const loaderAlreadyComplete =
            typeof window !== "undefined" &&
            window.sessionStorage?.getItem("zaad_loader_complete");

        if (loaderAlreadyComplete) {
            markReady();
        } else {
            window.addEventListener("zaad:loaderComplete", markReady, { once: true });
        }

        return () => window.removeEventListener("zaad:loaderComplete", markReady);
    }, []);

    useEffect(() => {
        if (viewMode !== MODE_360 || !spinVideoRef.current) return;
        if (isSpinPlaying) {
            spinVideoRef.current.play().catch(() => {});
        } else {
            spinVideoRef.current.pause();
        }
    }, [viewMode, isSpinPlaying, canMountSpin]);

    const handleMouseEnter = useCallback(() => {
        setIsHoveredOverImage?.(true);
        if (viewMode === MODE_MACRO) setIsZooming?.(true);
    }, [viewMode, setIsHoveredOverImage, setIsZooming]);

    const handleMouseLeave = useCallback(() => {
        setIsHoveredOverImage?.(false);
        if (viewMode === MODE_MACRO) setIsZooming?.(false);
    }, [viewMode, setIsHoveredOverImage, setIsZooming]);

    const handleTouchStart = useCallback(() => {
        if (viewMode === MODE_MACRO) setIsZooming?.(true);
    }, [viewMode, setIsZooming]);

    const handleTouchEndOrCancel = useCallback(() => {
        if (viewMode === MODE_MACRO) setIsZooming?.(false);
    }, [viewMode, setIsZooming]);

    const handleImageContainerClick = viewMode === MODE_360 ? undefined : openLightbox;

    const handleContainerKeyDown = useCallback(
        (e) => {
            if (viewMode === MODE_360 || !openLightbox) return;
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            openLightbox();
        },
        [viewMode, openLightbox],
    );

    const handleSpinToggle = useCallback((e) => {
        e.stopPropagation();
        setIsSpinPlaying((playing) => !playing);
    }, []);

    const handlePrevClick = useCallback((e) => {
        e.stopPropagation();
        handlePrevImage?.();
    }, [handlePrevImage]);

    const handleNextClick = useCallback((e) => {
        e.stopPropagation();
        handleNextImage?.();
    }, [handleNextImage]);

    const setEditorialView = useCallback(() => setViewMode?.(MODE_EDITORIAL), [setViewMode]);
    const setMacroView = useCallback(() => setViewMode?.(MODE_MACRO), [setViewMode]);
    const setSpinView = useCallback(() => {
        setIsSpinReady(false);
        setViewMode?.(MODE_360);
    }, [setViewMode]);

    const handleSpinLoadedData = useCallback(() => {
        setIsSpinReady(true);
    }, []);

    const imageAlt = useMemo(() => {
        const name = selectedItem?.name ?? "";
        if (viewMode === MODE_EDITORIAL) {
            return (t("showcaseImageAlt") || "")
                .replace("{name}", name)
                .replace("{index}", String(activeImageIndex + 1));
        }
        return (t("showcaseMacroAlt") || "").replace("{name}", name);
    }, [viewMode, t, selectedItem?.name, activeImageIndex]);

    const imageScale = useMemo(() => {
        if (isZooming && viewMode === MODE_MACRO) return 3.0;
        if (isHoveredOverImage && viewMode === MODE_EDITORIAL) return 1.03;
        return 1;
    }, [isZooming, isHoveredOverImage, viewMode]);

    const imageAnimate = useMemo(
        () => ({
            opacity: 1,
            scale: imageScale,
        }),
        [imageScale]
    );

    const spinImageAnimate = useMemo(
        () => ({
            opacity: isSpinReady ? 0 : 1,
        }),
        [isSpinReady]
    );

    const imageStyle = useMemo(
        () => ({
            transformOrigin:
                isZooming && viewMode === MODE_MACRO
                    ? `${zoomCoords?.x ?? 50}% ${zoomCoords?.y ?? 50}%`
                    : "center",
        }),
        [isZooming, viewMode, zoomCoords?.x, zoomCoords?.y]
    );

    if (!selectedItem) return null;

    const images = selectedItem.images ?? [];
    const activeImage = images[activeImageIndex];
    const firstImage = images[0];
    const isWide = activeImage?.orientation === ORIENTATION_WIDE;
    const imageTransition = viewMode === MODE_MACRO ? IMAGE_TRANSITION_MACRO : IMAGE_TRANSITION_DEFAULT;
    const containerStyle = CURSOR_STYLES[viewMode] || CURSOR_STYLES[MODE_EDITORIAL];
    const isContainerOpenable = viewMode !== MODE_360;
    const openImageLabel = (t("productEnlargeImageLabel") || "").replace("{name}", selectedItem.name);

    return (
        <MaisonReveal
            variant="scale-down-unveil"
            delay={0.4}
            className="lg:col-span-6 flex flex-col h-full w-full gap-4"
        >
            <div
                className="relative aspect-[4/5] bg-surface-alt border border-ink/10 overflow-hidden shadow-ambient group select-none rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={containerStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMacroMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleMacroTouchMove}
                onTouchEnd={handleTouchEndOrCancel}
                onTouchCancel={handleTouchEndOrCancel}
                onClick={handleImageContainerClick}
                onKeyDown={handleContainerKeyDown}
                role={isContainerOpenable ? "button" : undefined}
                tabIndex={isContainerOpenable ? 0 : undefined}
                aria-label={isContainerOpenable ? openImageLabel : undefined}
            >
                {viewMode === MODE_360 ? (
                    <div className="relative w-full h-full">
                        {canMountSpin && (
                            <video
                                key={spin360Src}
                                ref={spinVideoRef}
                                src={spin360Src}
                                poster={spinPosterSrc}
                                preload="none"
                                muted
                                loop
                                playsInline
                                autoPlay
                                aria-hidden="true"
                                onLoadedData={handleSpinLoadedData}
                                className="w-full h-full object-cover cursor-default"
                            />
                        )}
                        <motion.img
                            src={firstImage?.url}
                            alt=""
                            aria-hidden="true"
                            referrerPolicy="no-referrer"
                            initial={INITIAL_SPIN_IMAGE}
                            animate={spinImageAnimate}
                            transition={SPIN_OVERLAY_TRANSITION}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={`${selectedItem.id}-${activeImageIndex}`}
                            initial={INITIAL_IMAGE_ANIMATION}
                            animate={imageAnimate}
                            exit={EXIT_IMAGE_ANIMATION}
                            transition={imageTransition}
                            style={imageStyle}
                            src={activeImage?.url}
                            alt={imageAlt}
                            className="object-cover w-full h-full pointer-events-none"
                            referrerPolicy="no-referrer"
                        />
                    </AnimatePresence>
                )}

                {viewMode === MODE_EDITORIAL && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrevClick}
                            className="absolute left-0 top-0 bottom-0 w-1/5 flex items-center justify-start pl-4 md:pl-6 text-headline transition-all duration-500 cursor-pointer z-20 group/prev-btn"
                        >
                            <div className="flex items-center space-x-2 bg-panel/70 border border-ink/5 py-2 px-3 rounded-md translate-x-1 group-hover/prev-btn:translate-x-0 transition-all duration-300">
                                <ChevronLeft className="w-3.5 h-3.5 stroke-[1]" />
                                <span className="font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] uppercase text-muted opacity-85 select-none">
                                    {t("showcasePrev")}
                                </span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={handleNextClick}
                            className="absolute right-0 top-0 bottom-0 w-1/5 flex items-center justify-end pr-4 md:pr-6 text-headline transition-all duration-500 cursor-pointer z-20 group/next-btn"
                        >
                            <div className="flex items-center space-x-2 bg-panel/70 border border-ink/5 py-2 px-3 rounded-md -translate-x-1 group-hover/next-btn:translate-x-0 transition-all duration-300">
                                <span className="font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] uppercase text-muted opacity-85 select-none">
                                    {t("showcaseNext")}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 stroke-[1]" />
                            </div>
                        </button>
                    </>
                )}

                {viewMode === MODE_360 ? (
                    <button
                        type="button"
                        onClick={handleSpinToggle}
                        aria-label={t(isSpinPlaying ? "heroPauseVideo" : "heroPlayVideo")}
                        data-touch-boost
                        className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-md bg-panel-frost border border-ink/12 shadow-card-sm text-ink hover:text-accent transition-colors duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
                    >
                        {isSpinPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                ) : (
                    <div className="absolute top-4 right-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-20 opacity-0 translate-x-2 -translate-y-2 scale-[0.85] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100">
                        <div className="w-9 h-9 flex items-center justify-center bg-panel-frost border border-ink/12 rounded-md shadow-card-sm text-ink">
                            <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </div>
                    </div>
                )}

                {viewMode === MODE_EDITORIAL && (
                    <div className="absolute bottom-6 right-6 flex items-center space-x-1.5 bg-panel-frost border border-ink/10 px-3 py-1.5 rounded-md font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] text-ink z-10 uppercase">
                        <span>{isWide ? t("showcaseLandscape") : t("showcasePortrait")}</span>
                    </div>
                )}

                {viewMode === MODE_MACRO && (
                    <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-accent border border-accent/20 px-3 py-1.5 rounded-md font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] text-on-indicator z-10 uppercase shadow-card-md select-none">
                        <span className="w-1.5 h-1.5 bg-panel rounded-full animate-pulse" />
                        <span>{t("showcaseTactileLens")}</span>
                    </div>
                )}

                {viewMode === MODE_360 && (
                    <div className="absolute bottom-6 right-6 flex items-center space-x-1.5 bg-panel-frost border border-ink/10 px-3 py-1.5 rounded-md font-mono text-[length:max(9px,calc(8px*var(--zaad-font-scale)))] text-ink z-10 uppercase">
                        <RotateCw className="w-3 h-3 text-accent" />
                        <span>{t("productSpin360Label")}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-ink/10 pt-4 mt-auto">
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <MaisonButton
                        variant={viewMode === MODE_EDITORIAL ? "pill-dark" : "pill-light"}
                        onClick={setEditorialView}
                        icon={Eye}
                        aria-label={t("editorialView")}
                        labelClassName="hidden sm:inline"
                        className="flex-1 sm:flex-initial !px-4 sm:!px-6 text-center justify-center"
                    >
                        {t("editorialView")}
                    </MaisonButton>
                    <MaisonButton
                        variant={viewMode === MODE_MACRO ? "pill-dark" : "pill-light"}
                        onClick={setMacroView}
                        icon={Layers}
                        aria-label={t("macroView")}
                        labelClassName="hidden sm:inline"
                        className="flex-1 sm:flex-initial !px-4 sm:!px-6 text-center justify-center"
                    >
                        {t("macroView")}
                    </MaisonButton>
                    <MaisonButton
                        variant={viewMode === MODE_360 ? "pill-dark" : "pill-light"}
                        onClick={setSpinView}
                        icon={RotateCw}
                        aria-label={t("productSpin360Label")}
                        labelClassName="hidden sm:inline"
                        className="flex-1 sm:flex-initial !px-4 sm:!px-6 text-center justify-center"
                    >
                        {t("productSpin360Label")}
                    </MaisonButton>
                </div>
            </div>
        </MaisonReveal>
    );
}

export default memo(ImageViewer);