import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/services/LanguageProvider";
import useLightbox from "./useLightbox";

const EMPTY_ARRAY = [];

export default function useShowcase() {
  const { data } = useLanguage();
  const collection = data("collection") || EMPTY_ARRAY;

  const [selectedItem, setSelectedItem] = useState(() => collection[0]);
  const [viewMode, setViewMode] = useState("360");
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const zoomCoordsRef = useRef({ x: 50, y: 50 });
  const zoomRafRef = useRef(null);

  useEffect(
      () => () => {
        if (zoomRafRef.current) window.cancelAnimationFrame(zoomRafRef.current);
      },
      [],
  );

  const scheduleZoomCoords = useCallback((coords) => {
    zoomCoordsRef.current = coords;
    if (zoomRafRef.current) return;
    zoomRafRef.current = window.requestAnimationFrame(() => {
      zoomRafRef.current = null;
      setZoomCoords(zoomCoordsRef.current);
    });
  }, []);

  const lightbox = useLightbox(selectedItem?.images?.length ?? 0);
  const { setActiveImageIndex, activeImageIndex } = lightbox;

  const selectItem = useCallback(
      (item) => {
        setSelectedItem(item);
        setActiveImageIndex(0);
        setViewMode("360");
      },
      [setActiveImageIndex],
  );

  const handleNextImage = useCallback(() => {
    if (activeImageIndex < selectedItem.images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      const idx = collection.findIndex((i) => i.id === selectedItem.id);
      const nextItem = collection[(idx + 1) % collection.length];
      setSelectedItem(nextItem);
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, selectedItem, collection, setActiveImageIndex]);

  const handlePrevImage = useCallback(() => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      const idx = collection.findIndex((i) => i.id === selectedItem.id);
      const prevItem = collection[(idx - 1 + collection.length) % collection.length];
      setSelectedItem(prevItem);
      setActiveImageIndex(prevItem.images.length - 1);
    }
  }, [activeImageIndex, selectedItem, collection, setActiveImageIndex]);

  const handleMacroMouseMove = useCallback(
      (e) => {
        if (viewMode !== "macro") return;
        const rect = e.currentTarget.getBoundingClientRect();
        scheduleZoomCoords({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      },
      [viewMode, scheduleZoomCoords],
  );

  const handleMacroTouchMove = useCallback(
      (e) => {
        if (viewMode !== "macro") return;
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        scheduleZoomCoords({
          x: Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)),
          y: Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100)),
        });
      },
      [viewMode, scheduleZoomCoords],
  );

  const toggleSpecs = useCallback(() => setIsSpecsExpanded((prev) => !prev), []);

  return {
    ...lightbox,
    selectedItem,
    selectItem,
    handleNextImage,
    handlePrevImage,
    viewMode,
    setViewMode,
    isSpecsExpanded,
    toggleSpecs,
    zoomCoords,
    isZooming,
    setIsZooming,
    handleMacroMouseMove,
    handleMacroTouchMove,
  };
}