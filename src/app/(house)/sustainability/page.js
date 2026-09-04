import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import SustainabilityResponsibilityChapter from "@/components/house/SustainabilityResponsibilityChapter";

export const dynamic = "force-static";

export async function generateMetadata() {
    return (await MetadataService.forSustainability()).meta;
}

export default async function Page() {
    const { schemas } = await MetadataService.forSustainability();
    return (
        <>
            <JsonLd schemas={schemas} />
            <SustainabilityResponsibilityChapter />
        </>
    );
}