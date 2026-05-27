"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/services/TranslationService";
import useLightbox from "../hooks/useLightbox";
import NavBar from "./productdetailspage/NavBar";
import StudioGallery from "./productdetailspage/StudioGallery";
import ProductMeta from "./productdetailspage/ProductMeta";
import LookbookPoetry from "./productdetailspage/LookbookPoetry";
import SpecsTabs from "./productdetailspage/SpecsTabs";
import AcquisitionCTA from "./productdetailspage/AcquisitionCTA";
import Lightbox from "./productdetailspage/Lightbox";

export default function ProductDetailsPage({ item, onBack, onInquire }) {
    const { t, getItemTranslations } = useLanguage();
    const itemTrans = getItemTranslations(item.id);
    const [activeTab, setActiveTab] = useState("architecture");
    const lightbox = useLightbox(item.images.length);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [item.id]);

    return (
        <div className="bg-surface text-ink min-h-screen py-10 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto border-b border-ink/10 transition-colors duration-1050">
            <NavBar item={item} itemTrans={itemTrans} t={t} onBack={onBack} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 md:mb-24">
                <StudioGallery item={item} lightbox={lightbox} />
                <ProductMeta item={item} itemTrans={itemTrans} t={t} onInquire={onInquire} onBack={onBack} />
            </div>

            <LookbookPoetry item={item} />

            <SpecsTabs
                item={item}
                itemTrans={itemTrans}
                t={t}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <AcquisitionCTA item={item} t={t} onInquire={onInquire} onBack={onBack} />

            <Lightbox item={item} lightbox={lightbox} onInquire={onInquire} />
        </div>
    );
}
