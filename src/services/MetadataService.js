import { getServerLanguage } from "@/lib/i18n/server";
import { en } from "@/lib/i18n/en";
import { fa } from "@/lib/i18n/fa";

const SITE_CONFIG = {
    brand: "ZAAD",
    siteUrl: "https://zaad.com",
    logoImage: "/logo.png",
    defaultOgImage: "/image/gavv/gavv-06.jpg",
    socials: {
        instagram: "https://instagram.com/zaad_placeholder", // TODO
        linkedin:  "https://linkedin.com/company/zaad_placeholder", // TODO
        telegram:  "https://t.me/zaad_placeholder", // TODO
    },
    twitter: {
        site: "@zaad_x_placeholder", // TODO
    },
    contact: {
        whatsappUrl:     "https://wa.me/zaad_placeholder", // TODO
        addressLocality: "Tehran",
        addressCountry:  "IR",
    },
};

const COPY = {
    en: {
        homeTitle:     "Luxury Kitchen Architecture",
        homeDesc:      "ZAAD is an architectural design-and-build atelier specializing in monolithic luxury kitchens, custom wardrobes, and crafted interior living spaces. Engineered in Tehran.",
        aboutTitle:    "About the Atelier",
        aboutDesc:     "Inside ZAAD: a 9,000 sqm production facility, 150 skilled craftsmen, and 8 architects designing bespoke kitchens, custom stone islands, and high-end residential interiors.",
        storyTitle:    "Origins & Philosophy",
        storyDesc:     "Born in the Land of Dorsa, ZAAD designs around quietude, spatial restraint, and structural permanence — harmonizing natural stone, eucalyptus, and functional engineering.",
        sustainabilityTitle: "Sustainability & Responsibility",
        sustainabilityDesc:  "Sustainable luxury through endurance: 0% quarry refuse, stone sourced under 200km, salaried stonemason apprenticeships, and 22mm solid timber fronts.",
        glanceTitle:    "The Kitchen Collection",
        glanceDesc:     "Architectural lookbook for GÁVV, ZIVV, RÁKH, and VAAR: dual-island layouts, Gaggenau appliance integration, Salice pocket hardware, and Kesseböhmer mechanisms.",
        collectionsCrumb: "Collections",
        homeCrumb: "Home",
    },
    fa: {
        homeTitle:     "معماری لوکس آشپزخانه",
        homeDesc:      "آتلیه طراحی و ساخت زاد؛ طراح و مجری آشپزخانه‌های کالبدی، جزیره‌های سنگی مونولیت، کمدهای اختصاصی و معماری داخلی لوکس. ریشه در اقلیم درسا با کارخانه‌ی ۹۰۰۰ مترمربعی.",
        aboutTitle:    "درباره آتلیه",
        aboutDesc:     "پشت صحنه زاد: کارخانه ۹۰۰۰ مترمربعی، ۱۵۰ متخصص چیره‌دست و تیم ۸ نفره طراحان و معماران برای خلق آشپزخانه‌ها و فضاهای داخلی پایدار و لوکس.",
        storyTitle:    "خاستگاه و فلسفه",
        storyDesc:     "رویش در اقلیم درسا؛ زاد زیبایی را در هماهنگی کارایی، جزئیات دست‌ساز، سنگ طبیعی و چوب اکالیپتوس به مقیاس خانه می‌آورد.",
        sustainabilityTitle: "پایداری و مسئولیت",
        sustainabilityDesc:  "پایداری از طریق کیفیت ماندگار: صفر درصد پسماند معدن، تأمین سنگ در شعاع کمتر از ۲۰۰ کیلومتری و کارگاه‌های آموزشی احیای هنر سنگ‌تراشی دستی در تهران.",
        glanceTitle:    "مجموعه آشپزخانه",
        glanceDesc:     "کاتالوگ جامع مجموعه‌های GÁVV، ZIVV، RÁKH و VAAR: جزئیات جزیره، یراق‌آلات پاکتی Salice، تجهیزات توکار Gaggenau و ساختارهای ذخیره‌سازی Kesseböhmer.",
        collectionsCrumb: "مجموعه‌ها",
        homeCrumb: "خانه",
    },
};

const OG_LOCALE   = { en: "en_US", fa: "fa_IR" };
const hreflangFor = (url) => ({ "x-default": url, en: url, fa: url });

const resolveImageUrl = (url) =>
    url?.startsWith("http") ? url : `${SITE_CONFIG.siteUrl}${url || SITE_CONFIG.defaultOgImage}`;

function buildMeta({ rawTitle, description, image, canonical, lang }) {
    const copy     = COPY[lang] ?? COPY.en;
    const absolute = rawTitle
        ? `${rawTitle} | ${SITE_CONFIG.brand}`
        : `${SITE_CONFIG.brand} | ${copy.homeTitle}`;
    const resolvedImage = resolveImageUrl(image);

    return {
        title:      { absolute },
        description,
        alternates: { canonical, languages: hreflangFor(canonical) },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            title: absolute, description,
            type: "website", siteName: SITE_CONFIG.brand,
            locale: OG_LOCALE[lang] ?? OG_LOCALE.en,
            images: [{ url: resolvedImage, width: 1400, height: 920, alt: rawTitle ?? SITE_CONFIG.brand }],
        },
        twitter: {
            card: "summary_large_image",
            title: absolute, description,
            site: SITE_CONFIG.twitter.site,
            images: [resolvedImage],
        },
    };
}

function breadcrumbSchema(items, canonical) {
    return {
        "@context": "https://schema.org",
        "@type":    "BreadcrumbList",
        "@id":      `${canonical}#breadcrumb`,
        itemListElement: items.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}

function aboutPageSchema(name, canonical, lang) {
    return {
        "@context": "https://schema.org",
        "@type":    "AboutPage",
        name, url: canonical, inLanguage: lang,
        isPartOf: { "@type": "WebSite", name: SITE_CONFIG.brand, url: SITE_CONFIG.siteUrl },
    };
}

async function simplePage(path, titleKey, descKey, extraSchema) {
    const lang      = await getServerLanguage();
    const copy      = COPY[lang] ?? COPY.en;
    const canonical = `${SITE_CONFIG.siteUrl}${path}`;
    const title     = copy[titleKey];

    return {
        meta: buildMeta({ rawTitle: title, description: copy[descKey], canonical, lang }),
        schemas: [
            breadcrumbSchema([
                { name: copy.homeCrumb, url: SITE_CONFIG.siteUrl },
                { name: title, url: canonical },
            ], canonical),
            extraSchema(title, canonical, lang),
        ],
    };
}

export class MetadataService {

    // ─── Layout (static, no lang needed) ─────────────────────────

    static get orgSchema() {
        return {
            "@context": "https://schema.org",
            "@type":    "Organization",
            name:  SITE_CONFIG.brand,
            url:   SITE_CONFIG.siteUrl,
            logo:  `${SITE_CONFIG.siteUrl}${SITE_CONFIG.logoImage}`,
            address: {
                "@type": "PostalAddress",
                addressLocality: SITE_CONFIG.contact.addressLocality,
                addressCountry:  SITE_CONFIG.contact.addressCountry,
            },
            sameAs: Object.values(SITE_CONFIG.socials),
            contactPoint: {
                "@type":           "ContactPoint",
                contactType:       "customer service",
                availableLanguage: ["English", "Persian"],
                url:               SITE_CONFIG.contact.whatsappUrl,
            },
        };
    }

    // ─── Pages ───────────────────────────────────────────────────

    static async forHome() {
        const lang = await getServerLanguage();
        const copy = COPY[lang] ?? COPY.en;

        return {
            meta: buildMeta({ rawTitle: null, description: copy.homeDesc, canonical: SITE_CONFIG.siteUrl, lang }),
            schemas: [{
                "@context": "https://schema.org",
                "@type":    "WebSite",
                name: SITE_CONFIG.brand, url: SITE_CONFIG.siteUrl, inLanguage: ["en", "fa"],
            }],
        };
    }

    static async forCollection(item) {
        const lang      = await getServerLanguage();
        const copy      = COPY[lang] ?? COPY.en;
        const canonical = `${SITE_CONFIG.siteUrl}/collection/${item.slug ?? item.id}`;
        const title     = item.name;
        const description = (item.seoDescription ?? item.description)?.replace(/[\r\n]+/g, " ").trim().slice(0, 155);

        return {
            meta: buildMeta({
                rawTitle:    title,
                description,
                image:       item.imageUrl,
                canonical,
                lang,
            }),
            schemas: [
                breadcrumbSchema([
                    { name: copy.homeCrumb, url: SITE_CONFIG.siteUrl },
                    { name: copy.collectionsCrumb, url: `${SITE_CONFIG.siteUrl}/glance` },
                    { name: item.name, url: canonical },
                ], canonical),
                {
                    "@context":  "https://schema.org",
                    "@type":     "Product",
                    name:        item.name,
                    description: item.description,
                    image:       resolveImageUrl(item.imageUrl),
                    url:         canonical,
                    brand:       { "@type": "Brand", name: SITE_CONFIG.brand },
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
            isPartOf:    { "@type": "WebSite", name: SITE_CONFIG.brand, url: SITE_CONFIG.siteUrl },
            about:       "Environmental stewardship and corporate social responsibility of the ZAAD atelier",
        }));
    }

    static async forGlance() {
        const lang      = await getServerLanguage();
        const copy      = COPY[lang] ?? COPY.en;
        const canonical = `${SITE_CONFIG.siteUrl}/glance`;
        const title     = copy.glanceTitle;
        const dataset   = lang === "fa" ? fa.collection : en.collection;

        return {
            meta: buildMeta({ rawTitle: title, description: copy.glanceDesc, canonical, lang }),
            schemas: [
                breadcrumbSchema([
                    { name: copy.homeCrumb, url: SITE_CONFIG.siteUrl },
                    { name: title, url: canonical },
                ], canonical),
                MetadataService.orgSchema,
                {
                    "@context":   "https://schema.org",
                    "@type":      "CollectionPage",
                    name:         title,
                    url:          canonical,
                    inLanguage:   lang,
                    description:  copy.glanceDesc,
                    isPartOf:      { "@type": "WebSite", name: SITE_CONFIG.brand, url: SITE_CONFIG.siteUrl },
                    about:        { "@type": "Brand", name: SITE_CONFIG.brand },
                    hasPart: {
                        "@type": "ItemList",
                        itemListElement: dataset.map((item, index) => ({
                            "@type":  "ListItem",
                            position: index + 1,
                            item: {
                                "@type":      "Product",
                                name:         item.name,
                                description:  item.description,
                                url:          `${SITE_CONFIG.siteUrl}/collection/${item.id}`,
                                brand:        { "@type": "Brand", name: SITE_CONFIG.brand },
                            },
                        })),
                    },
                },
            ],
        };
    }

}
