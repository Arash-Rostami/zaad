import {MetadataService} from "@/services/MetaDataService";
import {resolveHomeUtensilImages} from "@/lib/collectionImages";
import JsonLd from "@/components/JsonLd";
import AppShell from "@/components/AppShell";

export async function generateMetadata() {
    return (await MetadataService.forHome()).meta;
}

export default async function Page() {
    const {schemas} = await MetadataService.forHome();
    const utensilImages = resolveHomeUtensilImages();
    return (
        <>
            <JsonLd schemas={schemas}/>
            <AppShell utensilImages={utensilImages}/>
        </>
    );
}