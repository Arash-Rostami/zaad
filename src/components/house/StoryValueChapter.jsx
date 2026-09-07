"use client";

import React, { useMemo } from "react";
import HouseDiptychShell from "./HouseDiptychShell";
import { useLanguage } from "@/services/LanguageProvider";

const EMPTY_ARRAY = [];

function StoryValueChapter() {
    const { t, data } = useLanguage();

    const sections = useMemo(() => data("aboutSections") || EMPTY_ARRAY, [data]);
    const story = useMemo(() => sections.find((s) => s.id === "story"), [sections]);
    const brandValue = useMemo(() => sections.find((s) => s.id === "brandValue"), [sections]);

    const siblings = useMemo(
        () => [
            { href: "/about", eyebrow: t("menuAboutUs"), label: t("aboutTitle"), teaser: t("crossLinkAbout") },
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
            eyebrow: t("storyHeroEyebrow"),
            title: t("storyHeroTitle"),
            intro: t("storyHeroIntro"),
            content: story?.content ?? "",
            stats: EMPTY_ARRAY,
        }),
        [t, story]
    );

    const right = useMemo(
        () => ({
            eyebrow: t("brandValueHeroEyebrow"),
            title: t("brandValueHeroTitle"),
            intro: t("brandValueHeroIntro"),
            content: brandValue?.content ?? "",
            stats: EMPTY_ARRAY,
        }),
        [t, brandValue]
    );

    return (
        <HouseDiptychShell
            heroEyebrow={t("storyValueHeroEyebrow")}
            heroTitle={t("storyValueHeroTitle")}
            heroIntro={t("storyValueHeroIntro")}
            heroImage="/video/house/chapter-gavv.jpg"
            heroImageAlt={t("storyValueHeroAlt")}
            heroBadge={t("menuHouseOfZAAD")}
            heroBadgeLabel={t("storyValueHeroEyebrow")}
            left={left}
            right={right}
            siblings={siblings}
        />
    );
}

export default React.memo(StoryValueChapter);