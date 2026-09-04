import React from "react";
import wrapBrandNames from "./wrapBrandNames";

const NON_FARSI_TOKEN = /[^؀-ۿ‌‏\s]+/g;
const ALNUM = /[A-Za-z0-9]/;

export default function wrapLatinRuns(text, isFarsi) {
    if (typeof text !== "string" || !text) return text;
    if (!isFarsi) return wrapBrandNames(text);

    const runs = [];
    let current = null;
    for (const match of text.matchAll(NON_FARSI_TOKEN)) {
        const start = match.index;
        const end = start + match[0].length;
        if (current && text.slice(current.end, start) === " ") {
            current.end = end;
        } else {
            if (current) runs.push(current);
            current = { start, end };
        }
    }
    if (current) runs.push(current);
    if (!runs.length) return text;

    const nodes = [];
    let cursor = 0;
    for (let i = 0; i < runs.length; i++) {
        let { start, end } = runs[i];
        while (start < end && !ALNUM.test(text[start])) start++;
        while (end > start && !ALNUM.test(text[end - 1])) end--;
        if (end <= start) continue;
        if (start > cursor) nodes.push(text.slice(cursor, start));
        nodes.push(
            React.createElement("span", { key: i, dir: "ltr", className: "font-serif" }, text.slice(start, end))
        );
        cursor = end;
    }
    if (!nodes.length) return text;
    if (cursor < text.length) nodes.push(text.slice(cursor));

    return nodes;
}