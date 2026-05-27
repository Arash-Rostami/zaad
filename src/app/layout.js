import {cookies} from "next/headers";
import "../styles/globals.css";
import {LanguageProvider} from "@/services/TranslationService";
import InitialLoader from "@/components/InitialLoader";
import {MetadataService} from "@/services/MetadataService";
import JsonLd from "@/components/JsonLd";


export const metadata = {
    metadataBase: new URL("https://zaad.com"),
    authors: [{ name: "Arash Rostami", url: "https://time-gr.com/cv/" }],
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default async function RootLayout({children}) {
    const cookieStore = await cookies();
    const stored = cookieStore.get("zaad_preferred_language")?.value;
    const initialLanguage = stored === "fa" || stored === "en" ? stored : "en";

    return (
        <html
            lang={initialLanguage}
            dir={initialLanguage === "fa" ? "rtl" : "ltr"}
            suppressHydrationWarning
        >
        <body
            className="bg-surface text-ink selection:bg-surface-alt selection:text-ink overflow-x-hidden antialiased"
        >
        <JsonLd
            schemas={[MetadataService.orgSchema]}
        />
        <InitialLoader/>
        <LanguageProvider
            initialLanguage={initialLanguage}
        >
            {children}
        </LanguageProvider>
        </body>
        </html>
    );
}