import { en } from "@/lib/i18n/en";

const SITE_URL = "https://zaad.com";

function entry(path, changeFrequency, priority) {
    const url = `${SITE_URL}${path}`;
    return {
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages: { en: url, fa: url } },
    };
}

export default function sitemap() {
    const routes = [
        entry("", "weekly", 1),
        entry("/about", "monthly", 0.7),
        entry("/story", "monthly", 0.7),
        entry("/sustainability", "monthly", 0.7),
        entry("/glance", "monthly", 0.8),
        entry("/showcase/index.html", "weekly", 0.8),
    ];

    const collectionRoutes = en.collection.map((item) =>
        entry(`/collection/${item.id}`, "monthly", 0.9)
    );

    return [...routes, ...collectionRoutes];
}