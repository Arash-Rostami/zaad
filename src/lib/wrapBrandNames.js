import React from "react";

const ZAAD_TOKENS = ["Persol Business Solution", "ZAAD", "Dorsa", "GÁVV", "ZIVV", "RÁKH", "VARR"];
const PARTNER_TOKENS = ["Gaggenau", "Domus", "Salice", "Kesseböhmer", "Coopersburg"];
const BRAND_TOKENS = [...ZAAD_TOKENS, ...PARTNER_TOKENS];

const BRAND_SET = new Set(BRAND_TOKENS);
const PATTERN = new RegExp(`(${BRAND_TOKENS.join("|")})`, "g");

export default function wrapBrandNames(text) {
    if (typeof text !== "string" || !text) return text;

    const parts = text.split(PATTERN);
    if (parts.length === 1) return text;

    return parts.map((part, i) =>
        BRAND_SET.has(part) ? (
            <span key={i} dir="ltr" className="font-serif">
                {part}
            </span>
        ) : (
            part
        )
    );
}