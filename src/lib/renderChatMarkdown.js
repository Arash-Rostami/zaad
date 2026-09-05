import React from "react";
import wrapLatinRuns from "./wrapLatinRuns";

const MARKER = /(\*\*)/;

export default function renderChatMarkdown(text, isFarsi) {
    if (typeof text !== "string" || !text) return text;

    const wrapped = wrapLatinRuns(text, isFarsi);
    const nodes = Array.isArray(wrapped) ? wrapped : [wrapped];

    const out = [];
    let bold = false;
    let key = 0;

    for (const node of nodes) {
        if (typeof node !== "string") {
            out.push(bold ? <span key={key++} className="text-accent">{node}</span> : node);
            continue;
        }
        if (!node.includes("**")) {
            if (node) out.push(bold ? <span key={key++} className="text-accent">{node}</span> : node);
            continue;
        }
        for (const piece of node.split(MARKER)) {
            if (piece === "**") {
                bold = !bold;
            } else if (piece) {
                out.push(bold ? <span key={key++} className="text-accent">{piece}</span> : piece);
            }
        }
    }

    return out;
}