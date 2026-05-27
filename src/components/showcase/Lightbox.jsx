import React from "react";
import SharedLightbox from "../shared/Lightbox";

export default function ShowcaseLightbox({ selectedItem, showcase, onInquireItem }) {
    const {
        isEnlarged, closeLightbox,
        viewMode, activeImageIndex,
        isLightboxLoading, markImageLoaded,
        lightboxScale, setLightboxScale, cycleZoom, lightboxPan,
        handleLightboxMouseMove, handleLightboxTouchMove,
        isZoomControllerHovered, setIsZoomControllerHovered,
        handleNextImage, handlePrevImage,
    } = showcase;

    const isEditorial = viewMode === "editorial";

    return (
        <SharedLightbox
            isEnlarged={isEnlarged}
            closeLightbox={closeLightbox}
            imageKey={isEditorial ? `${selectedItem.id}-${activeImageIndex}` : `${selectedItem.id}-macro`}
            imageSrc={isEditorial ? selectedItem.images[activeImageIndex]?.url : selectedItem.macroUrl}
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
            onPrev={isEditorial ? handlePrevImage : null}
            onNext={isEditorial ? handleNextImage : null}
            archiveNumber={selectedItem.number}
            itemName={selectedItem.name}
            counterLabel={isEditorial ? `${activeImageIndex + 1} OF ${selectedItem.images.length}` : null}
            footerTitle={selectedItem.name}
            footerPerspective={`${viewMode} PERSPECTIVE`}
            footerSubtitle={selectedItem.materials.join("   //   ")}
            footerBadge="ACQUISITION COMMISSION"
            onCta={() => { closeLightbox(); onInquireItem(selectedItem); }}
            noiseOverlay
        />
    );
}
