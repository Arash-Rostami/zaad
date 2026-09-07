import { GoogleGenAI } from "@google/genai";
import { en } from "@/lib/i18n/en";
import { fa } from "@/lib/i18n/fa";
import formatCuratorContext from "@/lib/formatCuratorContext";

const DEFAULT_MODEL = "gemini-3.1-flash";
const REQUEST_TIMEOUT_MS = 30000;
const MAX_TOKENS = 1200;
const TEMPERATURE = 0.7;

const REGISTRY = Object.freeze({ en, fa });
const contextCache = new Map();

let _ai = null;

function getGoogleClient() {
    if (!_ai) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables");
        }
        _ai = new GoogleGenAI({
            apiKey,
            httpOptions: { headers: { "User-Agent": "aistudio-build" } },
        });
    }
    return _ai;
}

function extractPartText(parts) {
    if (!Array.isArray(parts)) return "";
    const len = parts.length;
    if (len === 1) return parts[0]?.text ?? "";
    let text = "";
    for (let i = 0; i < len; i++) {
        const chunk = parts[i]?.text;
        if (chunk) text = text ? `${text}\n${chunk}` : chunk;
    }
    return text;
}

async function callGateway(baseUrl, gatewayKey, model, messages) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            Authorization: `apikey ${gatewayKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`Curator gateway error ${res.status}:`, errText);
        throw new Error(`Curator gateway error ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
}

export class CuratorService {
    static buildContext(language) {
        const lang = language === "fa" ? "fa" : "en";
        const cached = contextCache.get(lang);
        if (cached !== undefined) return cached;

        const dict = REGISTRY[lang] ?? REGISTRY.en;
        const context = formatCuratorContext(dict);

        contextCache.set(lang, context);
        return context;
    }

    static async generateReply({ contents, systemInstruction }) {
        const baseUrl = process.env.GEMINI_BASE_URL;
        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

        if (baseUrl) {
            const gatewayKey = process.env.GEMINI_GATEWAY_API_KEY;
            if (!gatewayKey) {
                throw new Error("GEMINI_GATEWAY_API_KEY is required when GEMINI_BASE_URL is set");
            }

            const safeContents = Array.isArray(contents) ? contents : [];
            const messages = new Array(safeContents.length + 1);
            messages[0] = { role: "system", content: systemInstruction ?? "" };

            for (let i = 0; i < safeContents.length; i++) {
                const c = safeContents[i];
                messages[i + 1] = {
                    role: c?.role === "model" ? "assistant" : "user",
                    content: extractPartText(c?.parts),
                };
            }

            try {
                const text = await callGateway(baseUrl, gatewayKey, model, messages);
                console.log(`Curator reply source: primary gateway (${model})`);
                return text;
            } catch (err) {
                console.error("Curator primary gateway failed:", err);

                const fallbackUrl = process.env.GEMINI_BASE_URL_FALLBACK;
                if (fallbackUrl) {
                    const fallbackModel = process.env.GEMINI_MODEL_FALLBACK || model;
                    try {
                        const text = await callGateway(fallbackUrl, gatewayKey, fallbackModel, messages);
                        console.log(`Curator reply source: fallback gateway (${fallbackModel})`);
                        return text;
                    } catch (fallbackErr) {
                        console.error("Curator fallback gateway failed:", fallbackErr);
                        if (!process.env.GEMINI_API_KEY) throw fallbackErr;
                    }
                } else if (!process.env.GEMINI_API_KEY) {
                    throw err;
                }
            }
        }

        const client = getGoogleClient();
        const response = await client.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: TEMPERATURE,
            },
        });

        console.log(`Curator reply source: native SDK (${model})`);
        return response?.text ?? "";
    }
}