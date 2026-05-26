import { useState } from "react";
import { animateScrollTo } from "../services/ScrollService";

export default function useShowroomNav() {
  const [activeTab, setActiveTabRaw] = useState("showroom");
  const [preselectedItem, setPreselectedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const setActiveTab = (tab) => {
    setActiveTabRaw(tab);
    if (selectedProduct) setSelectedProduct(null);
  };

  const handleScrollToSection = (sectionId) => {
    setActiveTabRaw("showroom");
    if (selectedProduct) setSelectedProduct(null);
    animateScrollTo(sectionId);
  };

  const handleInquireItem = (item) => {
    setSelectedProduct(null);
    setPreselectedItem(item);
    setTimeout(() => {
      animateScrollTo("concierge", 1600);
    }, 120);
  };

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
