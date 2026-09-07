import { MetadataService } from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";
import StoryValueChapter from "@/components/house/StoryValueChapter";

export const dynamic = "force-dynamic";

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
