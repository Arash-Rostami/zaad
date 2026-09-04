import {notFound} from "next/navigation";
import {en} from "@/lib/i18n/en";
import {fa} from "@/lib/i18n/fa";
import {getServerDictionary} from "@/lib/i18n/server";
import {resolveCollectionImages} from "@/lib/collectionImages";
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

    const lang = dict === fa ? "fa" : "en";
    const resolvedItem = {...item, images: resolveCollectionImages(item, lang)};

    const {schemas} = await MetadataService.forCollection(resolvedItem);
    return (
        <>
            <JsonLd schemas={schemas}/>
            <ProductPageClient item={resolvedItem}/>
        </>
    );
}