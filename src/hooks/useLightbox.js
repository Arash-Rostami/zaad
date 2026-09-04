import { useState, useEffect, useRef } from "react";

export default function useLightbox(imageCount) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isHoveredOverImage, setIsHoveredOverImage] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 50, y: 50 });
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);
  const [isZoomControllerHovered, setIsZoomControllerHovered] = useState(false);
  const scaleRef = useRef(1);
  const pinchRef = useRef(null);
  const pinchElementRef = useRef(null);

  const applyScale = (value) => {
    const next = typeof value === "function" ? value(scaleRef.current) : value;
    scaleRef.current = next;
    setLightboxScale(next);
  };

  useEffect(() => {
    scaleRef.current = 1;
    setLightboxScale(1);
    setLightboxPan({ x: 50, y: 50 });
    setIsLightboxLoading(true);
  }, [activeImageIndex, isEnlarged]);

  const openLightbox = () => setIsEnlarged(true);
  const closeLightbox = () => setIsEnlarged(false);
  const markImageLoaded = () => setIsLightboxLoading(false);

  const cycleZoom = () => {
    applyScale((prev) => (prev < 1.8 ? 1.8 : prev < 3.0 ? 3.0 : 1.0));
  };

  const handleLightboxMouseMove = (e) => {
    if (lightboxScale <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLightboxPan({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handlePinchTouchMove = (e) => {
    if (e.touches.length < 2) return;
    e.preventDefault();
    const [first, second] = e.touches;
    const dist = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
    if (dist <= 0) return;
    if (!pinchRef.current) pinchRef.current = { lastDist: dist, scale: scaleRef.current };
    const raw = Math.min(3.0, Math.max(1.0, (pinchRef.current.scale * dist) / pinchRef.current.lastDist));
    const scale = raw < 1.05 ? 1.0 : raw;
    const rect = e.currentTarget.getBoundingClientRect();
    pinchRef.current = { lastDist: dist, scale };
    applyScale(scale);
    setLightboxPan({
      x: Math.max(0, Math.min(100, (((first.clientX + second.clientX) / 2 - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (((first.clientY + second.clientY) / 2 - rect.top) / rect.height) * 100)),
    });
  };

  const handlePinchTouchEnd = (e) => {
    if (!pinchRef.current) return;
    pinchRef.current = null;
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setLightboxPan({
      x: Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const ensurePinchListeners = (element) => {
    if (pinchElementRef.current === element) return;
    element.addEventListener("touchmove", handlePinchTouchMove, { passive: false });
    element.addEventListener("touchend", handlePinchTouchEnd);
    element.addEventListener("touchcancel", handlePinchTouchEnd);
    pinchElementRef.current = element;
    pinchRef.current = null;
  };

  const handleLightboxTouchMove = (e) => {
    ensurePinchListeners(e.currentTarget);
    if (e.touches.length > 1) return;
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
    setLightboxScale: applyScale,
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