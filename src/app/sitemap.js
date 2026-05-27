import { en } from "@/lib/i18n/en";

const SITE_URL = "https://zaad.com";

export default function sitemap() {
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}`,
          fa: `${SITE_URL}`,
        },
      },
    },
    {
      url: `${SITE_URL}/showcase`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${SITE_URL}/showcase`,
          fa: `${SITE_URL}/showcase`,
        },
      },
    },
  ];

  const collectionRoutes = en.collection.map((item) => {
    const url = `${SITE_URL}/collection/${item.id}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: url,
          fa: url,
        },
      },
    };
  });

  return [...routes, ...collectionRoutes];
}
