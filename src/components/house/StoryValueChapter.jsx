"use client";

import React, { memo, useMemo } from "react";
import HouseChapterShell from "./HouseChapterShell";
import { useLanguage } from "@/services/LanguageProvider";

const SECTIONS_KEY = "aboutSections";
const SECTION_ID = "brandValue";
const EMPTY_ARRAY = Object.freeze([]);
const HERO_IMAGE_URL = "/video/house/chapter-gavv.jpg";

function StoryValueChapter() {
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
            heroTitle={t("storyValueHeroTitle")}
            heroIntro={t("brandValueHeroIntro")}
            heroImage={HERO_IMAGE_URL}
            heroImageAlt={t("storyValueHeroAlt")}
            editorialContent={editorialContent}
            stats={EMPTY_ARRAY}
            siblings={siblings}
        />
    );
}

export default memo(StoryValueChapter);