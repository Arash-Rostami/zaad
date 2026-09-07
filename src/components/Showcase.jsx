"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/services/LanguageProvider";
import useShowcase from "../hooks/useShowcase";
import CollectionTabs from "./showcase/CollectionTabs";
import ImageViewer from "./showcase/ImageViewer";
import CollectionPanel from "./showcase/CollectionPanel";
import ShowcaseLightbox from "./showcase/Lightbox";

const EMPTY_ARRAY = Object.freeze([]);

export default function Showcase({ onInquireItem, onViewDetails }) {
    const { t, data, isFarsi } = useLanguage();
    const collection = useMemo(() => data("collection") || EMPTY_ARRAY, [data]);
    const showcase = useShowcase();
    const { selectedItem } = showcase;

    if (!selectedItem) return null;

    return (
        <section
            id="collection"
            className="section-y bg-surface px-6 sm:px-12 max-w-7xl mx-auto border-b border-ink/10"
        >
            <CollectionTabs
                collection={collection}
                selectedItem={selectedItem}
                selectItem={showcase.selectItem}
                t={t}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 items-start"
                >
                    <ImageViewer selectedItem={selectedItem} showcase={showcase} t={t} />
                    <CollectionPanel
                        selectedItem={selectedItem}
                        showcase={showcase}
                        t={t}
                        isFarsi={isFarsi}
                        onInquireItem={onInquireItem}
                        onViewDetails={onViewDetails}
                    />
                </motion.div>
            </AnimatePresence>

            <ShowcaseLightbox
                selectedItem={selectedItem}
                showcase={showcase}
                onInquireItem={onInquireItem}
                isRtl={isFarsi}
                t={t}
            />
        </section>
    );
}