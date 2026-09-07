import { MetadataService } from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";
import AboutChapter from "@/components/house/AboutChapter";

export const dynamic = "force-dynamic";

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