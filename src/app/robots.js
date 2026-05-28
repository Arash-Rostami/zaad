export default function robots() {
    const SITE_URL = "https://zaad.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
