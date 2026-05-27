import React from "react";
import SharedLightbox from "../shared/Lightbox";

export default function Lightbox({ item, lightbox, onInquire }) {
    const {
        isEnlarged, closeLightbox,
        activeImageIndex,
        isLightboxLoading, markImageLoaded,
        lightboxScale, setLightboxScale, cycleZoom, lightboxPan,
        handleLightboxMouseMove, handleLightboxTouchMove,
        isZoomControllerHovered, setIsZoomControllerHovered,
        goNextWrapped, goPrevWrapped,
    } = lightbox;

    return (
        <SharedLightbox
            isEnlarged={isEnlarged}
            closeLightbox={closeLightbox}
            imageKey={activeImageIndex}
            imageSrc={item.images[activeImageIndex]?.url}
            imageAlt={item.name}
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
            counterLabel={`${activeImageIndex + 1} OF ${item.images.length}`}
            footerTitle={item.name}
            footerPerspective="ENLARGED PERSPECTIVE"
            footerSubtitle={item.images[activeImageIndex]?.caption || "Perspective View"}
            footerBadge="MUSEUM SPECIMEN COMMISSION"
            onCta={() => { closeLightbox(); onInquire(item); }}
            showPanHint={lightboxScale > 1}
        />
    );
}
