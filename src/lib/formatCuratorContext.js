function formatCollection(dict) {
    if (!Array.isArray(dict?.collection)) return "";

    return dict.collection
        .filter(Boolean)
        .map((item) => {
            const lines = [
                `### ${item.name ?? ""} (${item.number ?? ""}, ${item.year ?? ""})`,
                `Price: ${item.price ?? ""}`,
                `Dimensions: ${item.dimensions ?? ""}`,
                `Materials: ${Array.isArray(item.materials) ? item.materials.join(", ") : ""}`,
                `Description: ${item.description ?? ""}`,
                `Story: ${item.story ?? ""}`,
                `Provenance: ${item.provenance ?? ""}`,
            ];

            if (item.specifications) {
                const specs = Object.values(item.specifications).filter(Boolean);
                if (specs.length) lines.push(`Specifications: ${specs.join("; ")}`);
            }

            if (item.partners) {
                const partners = Object.values(item.partners).filter(Boolean);
                if (partners.length) lines.push(`Partners: ${partners.join("; ")}`);
            }

            if (item.islandSpecs?.overview) {
                lines.push(`Island layout: ${item.islandSpecs.overview}`);
            }

            if (item.tallUnits?.overview) {
                lines.push(`Tall-unit towers: ${item.tallUnits.overview}`);
            }

            if (item.appliancesDetail?.length) {
                lines.push(
                    `Appliances: ${item.appliancesDetail
                        .filter(Boolean)
                        .map((a) => `${a.category ?? ""} — ${a.name ?? ""}`)
                        .join("; ")}`
                );
            }

            if (item.accessoriesDetail?.length) {
                lines.push(
                    `Accessories: ${item.accessoriesDetail
                        .filter(Boolean)
                        .map((a) => `${a.category ?? ""} — ${a.name ?? ""}`)
                        .join("; ")}`
                );
            }

            return lines.join("\n");
        })
        .join("\n\n");
}

function formatHouse(dict) {
    if (!dict) return "";

    const brand = dict.brandStory
        ? [
            "### Brand Philosophy",
            dict.brandStory.philosophy,
            dict.brandStory.tagline,
            dict.brandStory.narrative_1,
            dict.brandStory.narrative_2,
        ]
            .filter(Boolean)
            .join("\n")
        : "";

    const sections = (dict.aboutSections || [])
        .filter(Boolean)
        .map((s) => `### ${s.title ?? ""}\n${s.summary ?? ""}\n${s.content ?? ""}`)
        .join("\n\n");

    return [brand, sections].filter(Boolean).join("\n\n");
}

function formatServices(dict) {
    if (!dict) return "";

    const items = [
        dict.privateCommissionsSub,
        dict.privateArchiveAcquisition,
        dict.residentialConsultation,
        dict.florenceViewing,
        dict.customMaterialSpec,
    ].filter(Boolean);

    return items.length ? `### Acquisitions & Services\n${items.join("\n")}` : "";
}

function buildCuratorContext(dict) {
    const services = formatServices(dict);

    return [
        "COLLECTION CATALOGUE — ground every product answer in this data; never invent items, prices, or specs:",
        formatCollection(dict),
        "\nHOUSE OF ZAAD — brand heritage, sustainability, and corporate responsibility:",
        formatHouse(dict),
        services ? `\n${services}` : "",
    ]
        .filter(Boolean)
        .join("\n\n");
}

const contextCache = new WeakMap();

export default function formatCuratorContext(dict) {
    if (!dict || typeof dict !== "object") return buildCuratorContext(dict);

    const cached = contextCache.get(dict);
    if (cached !== undefined) return cached;

    const result = buildCuratorContext(dict);
    contextCache.set(dict, result);
    return result;
}