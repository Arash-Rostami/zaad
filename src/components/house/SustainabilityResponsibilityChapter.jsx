"use client";

import React, { useMemo } from "react";
import HouseDiptychShell from "./HouseDiptychShell";
import { useLanguage } from "@/services/TranslationService";

const EMPTY_ARRAY = [];

function SustainabilityResponsibilityChapter() {
    const { t, data } = useLanguage();

    const sections = data("aboutSections") || EMPTY_ARRAY;
    const sustainability = useMemo(() => sections.find((s) => s.id === "sustainability"), [sections]);
    const csr = useMemo(() => sections.find((s) => s.id === "csr"), [sections]);
    const sustainabilityStats = data("sustainabilityStats") || EMPTY_ARRAY;
    const csrStats = data("csrStats") || EMPTY_ARRAY;

    const siblings = useMemo(
        () => [
            { href: "/about", eyebrow: t("menuAboutUs"), label: t("aboutTitle"), teaser: t("crossLinkAbout") },
            {
                href: "/story",
                eyebrow: t("menuStoryBrandValue"),
                label: t("storyValueHeroTitle"),
                teaser: t("crossLinkStoryValue"),
            },
        ],
        [t]
    );

    const left = useMemo(
        () => ({
            eyebrow: t("sustainabilityHeroEyebrow"),
            title: t("sustainabilityHeroTitle"),
            intro: t("sustainabilityHeroIntro"),
            content: sustainability?.content ?? "",
            stats: sustainabilityStats,
        }),
        [t, sustainability, sustainabilityStats]
    );

    const right = useMemo(
        () => ({
            eyebrow: t("csrHeroEyebrow"),
            title: t("csrHeroTitle"),
            intro: t("csrHeroIntro"),
            content: csr?.content ?? "",
            stats: csrStats,
        }),
        [t, csr, csrStats]
    );

    return (
        <HouseDiptychShell
            heroEyebrow={t("sustainabilityResponsibilityHeroEyebrow")}
            heroTitle={t("sustainabilityResponsibilityHeroTitle")}
            heroIntro={t("sustainabilityResponsibilityHeroIntro")}
            heroImage="/video/material/stone.jpg"
            heroImageAlt={t("sustainabilityResponsibilityHeroAlt")}
            heroBadge={t("menuHouseOfZAAD")}
            heroBadgeLabel={t("sustainabilityResponsibilityHeroEyebrow")}
            left={left}
            right={right}
            siblings={siblings}
        />
    );
}

export default React.memo(SustainabilityResponsibilityChapter);