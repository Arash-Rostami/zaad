"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/services/TranslationService";
import { setPreference } from "@/services/PreferenceService";
import useLightbox from "../hooks/useLightbox";
import NavBar from "./productdetailspage/NavBar";
import StudioGallery from "./productdetailspage/StudioGallery";
import ProductMeta from "./productdetailspage/ProductMeta";
import LookbookPoetry from "./productdetailspage/LookbookPoetry";
import SpecsTabs from "./productdetailspage/SpecsTabs";
import AcquisitionCTA from "./productdetailspage/AcquisitionCTA";
import Lightbox from "./productdetailspage/Lightbox";
import { animateScrollToTop } from "@/services/ScrollService";

export default function ProductDetailsPage({ item, onBack, onInquire }) {
    const { t, isFarsi } = useLanguage();
    const [activeTab, setActiveTab] = useState("architecture");
    const lightbox = useLightbox(item.images.length);

    useEffect(() => {
        animateScrollToTop(1300);
    }, [item.id]);

    useEffect(() => {
        setPreference("lastViewedItem", { id: item.id, name: item.name, number: item.number });
    }, [item.id, item.name, item.number]);

    return (
        <div className="bg-surface text-ink min-h-screen pt-[calc(61px+3rem)] sm:pt-[calc(73px+3rem)] pb-14 md:pb-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto border-b border-ink/10 transition-colors duration-1050">
            <NavBar item={item} t={t} onBack={onBack} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-12 md:mb-16">
                <StudioGallery item={item} lightbox={lightbox} />
                <ProductMeta item={item} t={t} isFarsi={isFarsi} onInquire={onInquire} onBack={onBack} />
            </div>

            <LookbookPoetry item={item} t={t} isFarsi={isFarsi} />

            <SpecsTabs
                item={item}
                t={t}
                isFarsi={isFarsi}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <AcquisitionCTA item={item} t={t} onInquire={onInquire} onBack={onBack} />

            <Lightbox item={item} lightbox={lightbox} onInquire={onInquire} isRtl={isFarsi} t={t} />
        </div>
    );
}
