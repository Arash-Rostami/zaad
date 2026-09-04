"use client";

import React, { memo, useMemo } from "react";
import HouseChapterShell from "./HouseChapterShell";
import { useLanguage } from "@/services/TranslationService";

const STATS_KEY = "aboutStats";
const SECTION_ID = "about";
const SECTIONS_KEY = "aboutSections";
const EMPTY_ARRAY = Object.freeze([]);
const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90";

function AboutChapter() {
    const { t, data } = useLanguage();

    const editorialContent = useMemo(() => {
        const sections = data(SECTIONS_KEY);
        if (!Array.isArray(sections)) return "";
        return sections.find((s) => s?.id === SECTION_ID)?.content ?? "";
    }, [data]);

    const stats = useMemo(() => {
        const raw = data(STATS_KEY);
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

    return (
        <HouseChapterShell
            heroEyebrow={t("aboutEyebrow")}
            heroTitle={t("aboutTitle")}
            heroIntro={t("aboutIntro")}
            heroImage={HERO_IMAGE_URL}
            heroImageAlt={t("aboutHeroAlt")}
            heroBadge={t("menuHouseOfZAAD")}
            heroBadgeLabel={t("aboutEyebrow")}
            editorialContent={editorialContent}
            stats={stats}
            siblings={siblings}
        />
    );
}

export default memo(AboutChapter);