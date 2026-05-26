import { useState, useEffect } from "react";

export default function useLightbox(imageCount) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isHoveredOverImage, setIsHoveredOverImage] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 50, y: 50 });
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);
  const [isZoomControllerHovered, setIsZoomControllerHovered] = useState(false);

  useEffect(() => {
    setLightboxScale(1);
    setLightboxPan({ x: 50, y: 50 });
    setIsLightboxLoading(true);
  }, [activeImageIndex, isEnlarged]);

  const openLightbox = () => setIsEnlarged(true);
  const closeLightbox = () => setIsEnlarged(false);
  const markImageLoaded = () => setIsLightboxLoading(false);

  const cycleZoom = () => {
    setLightboxScale((prev) => {
      if (Math.abs(prev - 1.0) < 0.1) return 1.8;
      if (Math.abs(prev - 1.8) < 0.2) return 3.0;
      return 1.0;
    });
  };

  const handleLightboxMouseMove = (e) => {
    if (lightboxScale <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLightboxPan({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleLightboxTouchMove = (e) => {
    if (lightboxScale <= 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setLightboxPan({
      x: Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const goNextWrapped = () => {
    setActiveImageIndex((prev) => (prev + 1) % imageCount);
    setIsLightboxLoading(true);
  };

  const goPrevWrapped = () => {
    setActiveImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    setIsLightboxLoading(true);
  };

  return {
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
  };
}
