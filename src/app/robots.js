export default function robots() {
    const SITE_URL = "https://zaad.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/ledger"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
