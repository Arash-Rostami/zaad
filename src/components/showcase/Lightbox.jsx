import React, { memo, useCallback, useMemo } from "react";
import SharedLightbox from "../shared/Lightbox";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

const EDITORIAL_VIEW_MODE = "editorial";
const MATERIAL_SEPARATOR = "   //   ";

function ShowcaseLightbox({ selectedItem, showcase, onInquireItem, isRtl, t }) {
    const {
        isEnlarged,
        closeLightbox,
        viewMode,
        activeImageIndex = 0,
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
        handleNextImage,
        handlePrevImage,
    } = showcase ?? {};

    const isEditorial = viewMode === EDITORIAL_VIEW_MODE;

    const handleCta = useCallback(() => {
        closeLightbox?.();
        onInquireItem?.(selectedItem);
    }, [closeLightbox, onInquireItem, selectedItem]);

    const materials = selectedItem?.materials;
    const footerSubtitle = useMemo(() => {
        return Array.isArray(materials)
            ? wrapLatinRuns(materials.join(MATERIAL_SEPARATOR), isRtl)
            : "";
    }, [materials, isRtl]);

    const footerPerspective = useMemo(() => {
        return isEditorial
            ? t("lightboxEditorialPerspective")
            : t("lightboxMacroPerspective");
    }, [isEditorial, t]);

    const footerBadge = useMemo(() => {
        return t("lightboxAcquisitionCommission");
    }, [t]);

    if (!selectedItem) return null;

    const onPrev = isEditorial ? handlePrevImage : null;
    const onNext = isEditorial ? handleNextImage : null;
    const activeImage = selectedItem.images?.[activeImageIndex];
    const imageSrc = activeImage?.url;
    const imageKey = `${selectedItem.id}-${activeImageIndex}`;

    return (
        <SharedLightbox
            isEnlarged={isEnlarged}
            closeLightbox={closeLightbox}
            imageKey={imageKey}
            imageSrc={imageSrc}
            imageAlt={selectedItem.name}
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
            onPrev={onPrev}
            onNext={onNext}
            archiveNumber={selectedItem.number}
            itemName={selectedItem.name}
            footerTitle={selectedItem.name}
            footerPerspective={footerPerspective}
            footerSubtitle={footerSubtitle}
            footerBadge={footerBadge}
            onCta={handleCta}
            noiseOverlay
            isRtl={isRtl}
            t={t}
        />
    );
}

export default memo(ShowcaseLightbox);