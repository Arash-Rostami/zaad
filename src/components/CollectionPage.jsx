"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/services/LanguageProvider";
import { setPreference } from "@/services/PreferenceService";
import useLightbox from "../hooks/useLightbox";
import NavBar from "./collection/NavBar";
import StudioGallery from "./collection/StudioGallery";
import CollectionMeta from "./collection/CollectionMeta";
import LookbookPoetry from "./collection/LookbookPoetry";
import SpecsTabs from "./collection/SpecsTabs";
import AcquisitionCTA from "./collection/AcquisitionCTA";
import Lightbox from "./collection/Lightbox";
import { animateScrollToTop } from "@/services/ScrollService";

export default function CollectionPage({ item, onBack, onInquire }) {
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
                <CollectionMeta item={item} t={t} isFarsi={isFarsi} onInquire={onInquire} onBack={onBack} />
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
