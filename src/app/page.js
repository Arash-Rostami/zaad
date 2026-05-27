import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";
import AppShell from "@/components/AppShell";

export async function generateMetadata() {
    return (await MetadataService.forHome()).meta;
}

export default async function Page() {
    const { schemas } = await MetadataService.forHome();
    return (
        <>
            <JsonLd schemas={schemas} />
            <AppShell />
        </>
    );
}