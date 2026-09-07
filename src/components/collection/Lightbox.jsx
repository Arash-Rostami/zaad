import React, { memo, useCallback, useMemo } from "react";
import SharedLightbox from "../shared/Lightbox";

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

    const counterLabel = useMemo(() => {
        if (!item?.images) return "";
        return `${activeImageIndex + 1} ${t("lightboxCounterOf")} ${item.images.length}`;
    }, [activeImageIndex, item?.images, t]);

    const footerPerspective = useMemo(() => {
        return t("lightboxEnlargedPerspective");
    }, [t]);

    const footerSubtitle = useMemo(() => {
        return (
            item?.images?.[activeImageIndex]?.caption ||
            t("lightboxPerspectiveViewFallback")
        );
    }, [item?.images, activeImageIndex, t]);

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
            counterLabel={counterLabel}
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