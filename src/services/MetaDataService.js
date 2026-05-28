import { getServerLanguage } from "@/lib/i18n/server";

const BRAND    = "ZAAD";
const SITE_URL = "https://zaad.com";

const COPY = {
    en: {
        homeTitle:     "Luxury Sculptural Objects & Architectural Design",
        homeDesc:      "Elite showroom for curated luxury sculptural objects, kitchen décor & architectural interiors. Explore ZAAD.",
        showcaseTitle: "Digital Catalogue — ZAAD Luxury Collection",
        showcaseDesc:  "Browse ZAAD's full luxury catalogue — sculptural objects & architectural kitchen design. View online.",
    },
    fa: {
        homeTitle:     "اشیاء مجسمه‌وار لاکچری و طراحی معماری",
        homeDesc:      "ویترین دیجیتال زاد — مجموعه منحصر به فرد اشیاء لاکچری، دکور آشپزخانه و طراحی داخلی معماری.",
        showcaseTitle: "کاتالوگ دیجیتال — کالکشن لاکچری زاد",
        showcaseDesc:  "کاتالوگ کامل زاد — اشیاء مجسمه‌وار و طراحی معماری. مشاهده آنلاین.",
    },
};

const OG_LOCALE   = { en: "en_US", fa: "fa_IR" };
const hreflangFor = (url) => ({ "x-default": url, en: url, fa: url });

async function getLang() {
    return await getServerLanguage();
}

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
        const lang = await getLang();
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
        const lang       = await getLang();
        const canonical  =  `${SITE_URL}/collection/${item.slug ?? item.id}`;

        return {
            meta: buildMeta({
                rawTitle:    item.name,
                description: (item.seoDescription ?? item.description)?.slice(0, 155),
                image:       item.imageUrl,
                canonical,
                lang,
            }),
            schemas: [
                {
                    "@context": "https://schema.org",
                    "@type":    "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home",        item: SITE_URL },
                        { "@type": "ListItem", position: 2, name: "Collection", item: `${SITE_URL}/collection` },
                        { "@type": "ListItem", position: 3, name: item.name,     item: canonical },
                    ],
                },
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

    static async forShowcase() {
        const lang      = await getLang();
        const copy      = COPY[lang] ?? COPY.en;
        const canonical = `${SITE_URL}/showcase`;

        return {
            meta: buildMeta({ rawTitle: copy.showcaseTitle, description: copy.showcaseDesc, image: "/og/showcase.jpg", canonical, lang }),
            schemas: [{
                "@context":  "https://schema.org",
                "@type":     "WebPage",
                name:        "ZAAD Digital Catalogue",
                description: "Browse ZAAD's luxury catalogue of sculptural objects & architectural design.",
                url:         canonical,
                breadcrumb: {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home",     item: SITE_URL },
                        { "@type": "ListItem", position: 2, name: "Showcase", item: canonical },
                    ],
                },
            }],
        };
    }
}