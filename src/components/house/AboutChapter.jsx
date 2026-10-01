"use client";

import React, { memo, useMemo } from "react";
import HouseDiptychShell from "./HouseDiptychShell";
import { useLanguage } from "@/services/LanguageProvider";

const EMPTY_ARRAY = Object.freeze([]);
const HERO_IMAGE_URL = "/video/house/chapter-vaar.jpg";

function AboutChapter() {
    const { t, data } = useLanguage();

    const sections = useMemo(() => data("aboutSections") || EMPTY_ARRAY, [data]);
    const story = useMemo(() => sections.find((s) => s?.id === "story"), [sections]);
    const about = useMemo(() => sections.find((s) => s?.id === "about"), [sections]);
    const aboutStats = useMemo(() => {
        const raw = data("aboutStats");
        return Array.isArray(raw) ? raw : EMPTY_ARRAY;
    }, [data]);

    const siblings = useMemo(
        () => [
            {
                href: "/story",
                eyebrow: t("menuStoryBrandValue"),
                label: t("storyValueHeroTitle"),
                teaser: t("crossLinkStoryValue"),
            },
            {
                href: "/sustainability",
                eyebrow: t("menuSustainabilityResponsibility"),
                label: t("sustainabilityResponsibilityHeroTitle"),
                teaser: t("crossLinkSustainabilityResponsibility"),
            },
        ],
        [t]
    );

    const left = useMemo(
        () => ({
            eyebrow: story?.category ?? "",
            title: story?.title ?? "",
            content: story?.content ?? "",
            stats: EMPTY_ARRAY,
        }),
        [story]
    );

    const right = useMemo(
        () => ({
            eyebrow: about?.category ?? "",
            title: about?.title ?? "",
            intro: about?.summary ?? "",
            content: about?.content ?? "",
            stats: aboutStats,
        }),
        [about, aboutStats]
    );

    return (
        <HouseDiptychShell
            heroTitle={t("aboutTitle")}
            heroImage={HERO_IMAGE_URL}
            heroImageAlt={t("aboutHeroAlt")}
            left={left}
            right={right}
            siblings={siblings}
        />
    );
}

export default memo(AboutChapter);