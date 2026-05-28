import {cookies} from "next/headers";
import {defaultLanguage} from "./config";
import {en} from "./en";
import {fa} from "./fa";

export async function getServerLanguage() {
    const cookieStore = await cookies();
    const stored = cookieStore.get("zaad_preferred_language")?.value;
    return stored === "fa" || stored === "en" ? stored : defaultLanguage;
}

export async function getServerDictionary() {
    const lang = await getServerLanguage();
    return lang === "fa" ? fa : en;
}
