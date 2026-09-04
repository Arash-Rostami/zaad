import { getServerLanguage } from "@/lib/i18n/server";

const BRAND    = "ZAAD";
const SITE_URL = "https://zaad.com";

const COPY = {
    en: {
        homeTitle:     "Luxury Sculptural Objects & Architectural Design",
        homeDesc:      "Elite showroom for curated luxury sculptural objects, kitchen décor & architectural interiors. Explore ZAAD.",
        aboutTitle:    "About ZAAD",
        aboutDesc:    "A design-and-build atelier bringing considered quality and elegance to the scale of the home — kitchens, wardrobes, and interior spaces.",
        storyTitle:   "Story & Brand Value",
        storyDesc:    "The perspective that shaped ZAAD, and the values — precision, restraint, function — that hold every space to it.",
        sustainabilityTitle: "Sustainability & Responsibility",
        sustainabilityDesc:  "How ZAAD treats the materials it shapes, and the people and places behind them — considered resource use and craft stewardship together.",
    },
    fa: {
        homeTitle:     "اشیاء مجسمه‌وار لاکچری و طراحی معماری",
        homeDesc:      "ویترین دیجیتال زاد — مجموعه منحصر به فرد اشیاء لاکچری، دکور آشپزخانه و طراحی داخلی معماری.",
        aboutTitle:    "درباره زاد",
        aboutDesc:    "آتلیه‌ای در حوزه طراحی و ساخت فضاهای داخلی لوکس — آشپزخانه، کمد و فضاهای داخلی، در مقیاس خانه.",
        storyTitle:   "داستان و ارزش‌های برند",
        storyDesc:    "نگاهی که زاد را شکل داد، و ارزش‌هایی — دقت، پرهیز از نمایش، عملکرد — که هر فضا را به آن پایبند نگه می‌دارند.",
        sustainabilityTitle: "پایداری و مسئولیت",
        sustainabilityDesc:  "چگونگی رفتار زاد با موادی که شکل می‌دهد، و انسان‌ها و مکان‌های پشت آن — مصرف سنجیده منابع و سرپرستی صنعت در کنار هم.",
    },
};

const OG_LOCALE   = { en: "en_US", fa: "fa_IR" };
const hreflangFor = (url) => ({ "x-default": url, en: url, fa: url });

function buildMeta({ rawTitle, description, image, canonical, lang }) {
    const copy     = COPY[lang] ?? COPY.en;
    const absolute = rawTitle
        ? `${rawTitle} — ${BRAND}`
        : `${BRAND} | ${copy.homeTitle}`;

    return {
        title:      { absolute },
        description,
        alternates: { canonical, languages: hreflangFor(canonical) },
        openGraph: {
            title: absolute, description,
            type: "website", siteName: BRAND,
            locale: OG_LOCALE[lang] ?? OG_LOCALE.en,
            ...(image && { images: [{ url: image, width: 1400, height: 920, alt: rawTitle ?? BRAND }] }),
        },
        twitter: {
            card: "summary_large_image",
            title: absolute, description,
            site: "@zaad_x_placeholder", // TODO
            ...(image && { images: [image] }),
        },
    };
}

function breadcrumbSchema(name, canonical) {
    return {
        "@context": "https://schema.org",
        "@type":    "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name, item: canonical },
        ],
    };
}

function aboutPageSchema(name, canonical, lang) {
    return {
        "@context": "https://schema.org",
        "@type":    "AboutPage",
        name, url: canonical, inLanguage: lang,
        isPartOf: { "@type": "WebSite", name: BRAND, url: SITE_URL },
    };
}

async function simplePage(path, titleKey, descKey, extraSchema) {
    const lang      = await getServerLanguage();
    const copy      = COPY[lang] ?? COPY.en;
    const canonical = `${SITE_URL}${path}`;
    const title     = copy[titleKey];

    return {
        meta: buildMeta({ rawTitle: title, description: copy[descKey], image: "/og/home.jpg", canonical, lang }),
        schemas: [breadcrumbSchema(title, canonical), extraSchema(title, canonical, lang)],
    };
}

export class MetadataService {

    // ─── Layout (static, no lang needed) ─────────────────────────

    static get orgSchema() {
        return {
            "@context": "https://schema.org",
            "@type":    "Organization",
            name:  BRAND,
            url:   SITE_URL,
            logo:  `${SITE_URL}/logo.png`,
            sameAs: [
                "https://instagram.com/zaad_placeholder", // TODO
                "https://t.me/zaad_placeholder",          // TODO
                "https://x.com/zaad_placeholder",         // TODO
            ],
            contactPoint: {
                "@type":           "ContactPoint",
                contactType:       "customer service",
                availableLanguage: ["English", "Persian"],
                url:               "https://wa.me/zaad_placeholder", // TODO
            },
        };
    }

    // ─── Pages ───────────────────────────────────────────────────

    static async forHome() {
        const lang = await getServerLanguage();
        const copy = COPY[lang] ?? COPY.en;

        return {
            meta: buildMeta({ rawTitle: null, description: copy.homeDesc, image: "/og/home.jpg", canonical: SITE_URL, lang }),
            schemas: [{
                "@context": "https://schema.org",
                "@type":    "WebSite",
                name: BRAND, url: SITE_URL, inLanguage: ["en", "fa"],
                potentialAction: {
                    "@type":       "SearchAction",
                    target:        { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/collection?q={search_term_string}` },
                    "query-input": "required name=search_term_string",
                },
            }],
        };
    }

    static async forCollection(item) {
        const lang      = await getServerLanguage();
        const canonical = `${SITE_URL}/collection/${item.slug ?? item.id}`;

        return {
            meta: buildMeta({
                rawTitle:    item.name,
                description: (item.seoDescription ?? item.description)?.slice(0, 155),
                image:       item.imageUrl,
                canonical,
                lang,
            }),
            schemas: [
                breadcrumbSchema(item.name, canonical),
                {
                    "@context":  "https://schema.org",
                    "@type":     "Product",
                    name:        item.name,
                    description: item.description,
                    image:       item.imageUrl,
                    url:         canonical,
                    brand:       { "@type": "Brand", name: BRAND },
                },
            ],
        };
    }

    static forAbout() {
        return simplePage("/about", "aboutTitle", "aboutDesc", aboutPageSchema);
    }

    static forStory() {
        return simplePage("/story", "storyTitle", "storyDesc", aboutPageSchema);
    }

    static forSustainability() {
        return simplePage("/sustainability", "sustainabilityTitle", "sustainabilityDesc", (name, canonical, lang) => ({
            "@context":  "https://schema.org",
            "@type":     "WebPage",
            name, url: canonical, inLanguage: lang,
            isPartOf:    { "@type": "WebSite", name: BRAND, url: SITE_URL },
            about:       "Environmental stewardship and corporate social responsibility of the ZAAD atelier",
        }));
    }

}