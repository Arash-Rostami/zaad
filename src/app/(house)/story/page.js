import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import StoryValueChapter from "@/components/house/StoryValueChapter";

export const dynamic = "force-static";

export async function generateMetadata() {
    return (await MetadataService.forStory()).meta;
}

export default async function Page() {
    const { schemas } = await MetadataService.forStory();
    return (
        <>
            <JsonLd schemas={schemas} />
            <StoryValueChapter />
        </>
    );
}
