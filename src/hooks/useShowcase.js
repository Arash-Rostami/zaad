import { useState } from "react";
import { useLanguage } from "../services/TranslationService";
import useLightbox from "./useLightbox";

export default function useShowcase() {
  const { data } = useLanguage();
  const collection = data("collection") || [];

  const [selectedItem, setSelectedItem] = useState(() => collection[0]);
  const [viewMode, setViewMode] = useState("editorial");
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const lightbox = useLightbox(selectedItem?.images?.length ?? 0);

  const selectItem = (item) => {
    setSelectedItem(item);
    lightbox.setActiveImageIndex(0);
    setViewMode("editorial");
  };

  const handleNextImage = () => {
    if (lightbox.activeImageIndex < selectedItem.images.length - 1) {
      lightbox.setActiveImageIndex(lightbox.activeImageIndex + 1);
    } else {
      const idx = collection.findIndex((i) => i.id === selectedItem.id);
      const nextItem = collection[(idx + 1) % collection.length];
      setSelectedItem(nextItem);
      lightbox.setActiveImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (lightbox.activeImageIndex > 0) {
      lightbox.setActiveImageIndex(lightbox.activeImageIndex - 1);
    } else {
      const idx = collection.findIndex((i) => i.id === selectedItem.id);
      const prevItem = collection[(idx - 1 + collection.length) % collection.length];
      setSelectedItem(prevItem);
      lightbox.setActiveImageIndex(prevItem.images.length - 1);
    }
  };

  const handleMacroMouseMove = (e) => {
    if (viewMode !== "macro") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomCoords({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMacroTouchMove = (e) => {
    if (viewMode !== "macro") return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomCoords({
      x: Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const toggleSpecs = () => setIsSpecsExpanded((prev) => !prev);

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
