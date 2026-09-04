"use client";

import React, { useMemo } from "react";
import HouseDiptychShell from "./HouseDiptychShell";
import { useLanguage } from "@/services/TranslationService";

const EMPTY_ARRAY = [];

function StoryValueChapter() {
    const { t, data } = useLanguage();

    const sections = data("aboutSections") || EMPTY_ARRAY;
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
            heroImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90"
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