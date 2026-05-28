import {notFound} from "next/navigation";
import {en} from "@/lib/i18n/en";
import {getServerDictionary} from "@/lib/i18n/server";
import {MetadataService} from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
    return en.collection.map((item) => ({slug: item.id}));
}

export async function generateMetadata({params}) {
    const {slug} = await params;
    const dict = await getServerDictionary();

    const item = dict.collection.find((i) => i.id === slug);
    if (!item) return {};
    return (await MetadataService.forCollection(item)).meta;
}

export default async function ProductPage({params}) {
    const {slug} = await params;
    const dict = await getServerDictionary();

    const item = dict.collection.find((i) => i.id === slug) ?? null;
    if (!item) notFound();

    const {schemas} = await MetadataService.forCollection(item);
    return (
        <>
            <JsonLd schemas={schemas}/>
            <ProductPageClient item={item}/>
        </>
    );
}