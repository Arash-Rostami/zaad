import { MetadataService } from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";
import SustainabilityResponsibilityChapter from "@/components/house/SustainabilityResponsibilityChapter";

export const dynamic = "force-dynamic";

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