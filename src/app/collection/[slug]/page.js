import { notFound } from "next/navigation";
import { en } from "@/lib/i18n/en";
import { fa } from "@/lib/i18n/fa";
import { cookies } from "next/headers";
import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
    return en.collection.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const cookieStore = await cookies();
    const lang = cookieStore.get("zaad_preferred_language")?.value === "fa" ? "fa" : "en";
    const dict = lang === "fa" ? fa : en;

    const item = dict.collection.find((i) => i.id === slug);
    if (!item) return {};
    return (await MetadataService.forCollection(item)).meta;
}

export default async function ProductPage({ params }) {
    const { slug } = await params;

    const cookieStore = await cookies();
    const lang = cookieStore.get("zaad_preferred_language")?.value === "fa" ? "fa" : "en";
    const dict = lang === "fa" ? fa : en;

    const item = dict.collection.find((i) => i.id === slug) ?? null;
    if (!item) notFound();

    const { schemas } = await MetadataService.forCollection(item);
    return (
        <>
            <JsonLd schemas={schemas} />
            <ProductPageClient item={item} />
        </>
    );
}