import {notFound} from "next/navigation";
import {cache} from "react";
import {en} from "@/lib/i18n/en";
import {fa} from "@/lib/i18n/fa";
import {getServerDictionary} from "@/lib/i18n/server";
import {resolveCollectionImages} from "@/lib/collectionImages";
import {MetadataService} from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";
import DorsaPreloadScript from "@/components/shared/DorsaPreloadScript";
import CollectionPageClient from "./CollectionPageClient";

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

const getResolvedItemPair = cache((slug) => {
    const enItem = en.collection.find((i) => i.id === slug);
    const faItem = fa.collection.find((i) => i.id === slug);
    if (!enItem || !faItem) return null;
    return {
        en: {...enItem, images: resolveCollectionImages(enItem, "en")},
        fa: {...faItem, images: resolveCollectionImages(faItem, "fa")},
    };
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

    const itemPair = getResolvedItemPair(slug);
    const {schemas} = await getCollectionMeta(resolvedItem);
    return (
        <>
            <DorsaPreloadScript/>
            <JsonLd schemas={schemas}/>
            <CollectionPageClient items={itemPair}/>
        </>
    );
}