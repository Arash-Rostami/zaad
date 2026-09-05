import {notFound} from "next/navigation";
import {cache} from "react";
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

const getResolvedItem = cache(async (slug) => {
    const dict = await getServerDictionary();
    const item = dict.collection.find((i) => i.id === slug) ?? null;
    if (!item) return null;
    const lang = dict === fa ? "fa" : "en";
    return {...item, images: resolveCollectionImages(item, lang)};
});

const getCollectionMeta = cache((resolvedItem) => MetadataService.forCollection(resolvedItem));

export async function generateMetadata({params}) {
    const {slug} = await params;
    const resolvedItem = await getResolvedItem(slug);
    if (!resolvedItem) return {};
    return (await getCollectionMeta(resolvedItem)).meta;
}

export default async function ProductPage({params}) {
    const {slug} = await params;
    const resolvedItem = await getResolvedItem(slug);
    if (!resolvedItem) notFound();

    const {schemas} = await getCollectionMeta(resolvedItem);
    return (
        <>
            <JsonLd schemas={schemas}/>
            <ProductPageClient item={resolvedItem}/>
        </>
    );
}