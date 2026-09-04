import { useEffect, useState } from "react";

const AUDIO_SRC = "/audio/ambient.mp3";
const STORAGE_KEY = "zaad-audio-muted";

let audioEl = null;

function getAudioEl() {
    if (typeof window === "undefined") return null;
    if (!audioEl) {
        audioEl = new Audio(AUDIO_SRC);
        audioEl.loop = true;
        audioEl.muted = true;
    }
    return audioEl;
}

export default function useAmbientAudio() {
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const audio = getAudioEl();
        if (!audio) return;
        const cached = localStorage.getItem(STORAGE_KEY);
        const initialMuted = cached === null ? true : cached === "true";
        audio.muted = initialMuted;
        setIsMuted(initialMuted);
        audio.play().catch(() => {});
    }, []);

    const toggleMute = () => {
        const audio = getAudioEl();
        if (!audio) return;
        const next = !audio.muted;
        audio.muted = next;
        setIsMuted(next);
        localStorage.setItem(STORAGE_KEY, String(next));
        if (!next) audio.play().catch(() => {});
    };

    return { isMuted, toggleMute };
}
