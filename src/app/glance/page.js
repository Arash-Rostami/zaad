import { cache } from "react";
import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import GlancePage from "@/components/glance/GlancePage";

export const dynamic = "force-static";

const getGlance = cache(() => MetadataService.forGlance());

export async function generateMetadata() {
    return (await getGlance()).meta;
}

export default async function Page() {
    const { schemas } = await getGlance();
    return (
        <>
            <GlancePage />
            <JsonLd schemas={schemas} />
        </>
    );
}