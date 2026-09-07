import { cache } from "react";
import { MetadataService } from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";
import GlancePage from "@/components/glance/GlancePage";

export const dynamic = "force-dynamic";

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