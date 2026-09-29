"use client";

import React, { memo, useMemo } from "react";
import HouseChapterShell from "./HouseChapterShell";
import { useLanguage } from "@/services/LanguageProvider";

const SECTIONS_KEY = "aboutSections";
const SECTION_ID = "sustainability";
const EMPTY_ARRAY = Object.freeze([]);
const HERO_IMAGE_URL = "/video/material/stone.jpg";

function SustainabilityResponsibilityChapter() {
    const { t, data } = useLanguage();

    const editorialContent = useMemo(() => {
        const sections = data(SECTIONS_KEY);
        if (!Array.isArray(sections)) return "";
        return sections.find((s) => s?.id === SECTION_ID)?.content ?? "";
    }, [data]);

    const siblings = useMemo(
        () => [
            {
                href: "/about",
                eyebrow: t("menuAboutUs"),
                label: t("aboutTitle"),
                teaser: t("crossLinkAbout"),
            },
            {
                href: "/story",
                eyebrow: t("menuStoryBrandValue"),
                label: t("storyValueHeroTitle"),
                teaser: t("crossLinkStoryValue"),
            },
        ],
        [t]
    );

    return (
        <HouseChapterShell
            heroTitle={t("sustainabilityResponsibilityHeroTitle")}
            heroIntro={t("sustainabilityResponsibilityHeroIntro")}
            heroImage={HERO_IMAGE_URL}
            heroImageAlt={t("sustainabilityResponsibilityHeroAlt")}
            editorialContent={editorialContent}
            stats={EMPTY_ARRAY}
            siblings={siblings}
        />
    );
}

export default memo(SustainabilityResponsibilityChapter);