import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import AboutChapter from "@/components/house/AboutChapter";

export const dynamic = "force-static";

export async function generateMetadata() {
    return (await MetadataService.forAbout()).meta;
}

export default async function Page() {
    const { schemas } = await MetadataService.forAbout();
    return (
        <>
            <JsonLd schemas={schemas} />
            <AboutChapter />
        </>
    );
}