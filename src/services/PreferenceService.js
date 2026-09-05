const PREFIX = "zaad_pref_";

function isBrowser() {
    return typeof window !== "undefined";
}

export function getPreference(key, fallback = null) {
    if (!isBrowser()) return fallback;
    try {
        const raw = window.localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function setPreference(key, value) {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
    }
}
