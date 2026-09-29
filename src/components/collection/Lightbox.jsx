import React, { memo, useCallback, useMemo } from "react";
import SharedLightbox from "../shared/Lightbox";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

function Lightbox({ item, lightbox, onInquire, isRtl, t }) {
    const {
        isEnlarged,
        closeLightbox,
        activeImageIndex,
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
        goNextWrapped,
        goPrevWrapped,
    } = lightbox ?? {};

    const handleCta = useCallback(() => {
        closeLightbox?.();
        onInquire?.(item);
    }, [closeLightbox, onInquire, item]);

    const footerPerspective = useMemo(() => {
        return t("lightboxEnlargedPerspective");
    }, [t]);

    const footerSubtitle = useMemo(() => {
        return wrapLatinRuns(
            item?.images?.[activeImageIndex]?.caption ||
                t("lightboxPerspectiveViewFallback"),
            isRtl,
        );
    }, [item?.images, activeImageIndex, t, isRtl]);

    const footerBadge = useMemo(() => {
        return t("lightboxMuseumSpecimenCommission");
    }, [t]);

    if (!item || !lightbox) return null;

    const activeImage = item.images?.[activeImageIndex];
    const showPanHint = lightboxScale > 1;
    const imageAlt = activeImage?.caption || item.name;

    return (
        <SharedLightbox
            isEnlarged={isEnlarged}
            closeLightbox={closeLightbox}
            imageKey={activeImageIndex}
            imageSrc={activeImage?.url}
            imageAlt={imageAlt}
            isLightboxLoading={isLightboxLoading}
            markImageLoaded={markImageLoaded}
            lightboxScale={lightboxScale}
            setLightboxScale={setLightboxScale}
            cycleZoom={cycleZoom}
            lightboxPan={lightboxPan}
            handleLightboxMouseMove={handleLightboxMouseMove}
            handleLightboxTouchMove={handleLightboxTouchMove}
            isZoomControllerHovered={isZoomControllerHovered}
            setIsZoomControllerHovered={setIsZoomControllerHovered}
            onPrev={goPrevWrapped}
            onNext={goNextWrapped}
            archiveNumber={item.number}
            itemName={item.name}
            footerTitle={item.name}
            footerPerspective={footerPerspective}
            footerSubtitle={footerSubtitle}
            footerBadge={footerBadge}
            onCta={handleCta}
            noiseOverlay
            showPanHint={showPanHint}
            isRtl={isRtl}
            t={t}
        />
    );
}

export default memo(Lightbox);