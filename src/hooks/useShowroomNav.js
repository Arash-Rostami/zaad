import { useCallback, useState } from "react";
import { animateScrollTo } from "@/services/ScrollService";

export default function useShowroomNav() {
  const [activeTab, setActiveTabRaw] = useState("showroom");
  const [preselectedItem, setPreselectedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const setActiveTab = useCallback((tab) => {
    setActiveTabRaw(tab);
    setSelectedProduct((prev) => (prev ? null : prev));
  }, []);

  const handleScrollToSection = useCallback((sectionId) => {
    setActiveTabRaw("showroom");
    setSelectedProduct((prev) => (prev ? null : prev));
    animateScrollTo(sectionId);
  }, []);

  const handleInquireItem = useCallback((item) => {
    setSelectedProduct(null);
    setPreselectedItem(item);
    setTimeout(() => {
      animateScrollTo("concierge", 1600);
    }, 120);
  }, []);

  return {
    activeTab,
    setActiveTab,
    preselectedItem,
    setPreselectedItem,
    selectedProduct,
    setSelectedProduct,
    handleScrollToSection,
    handleInquireItem,
  };
}