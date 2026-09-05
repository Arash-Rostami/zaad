import { useCallback, useState } from "react";

const AUDIO_SRC = "/audio/ambient-loop.m4a";

let audioEl = null;

function getAudioEl() {
    if (typeof window === "undefined") return null;
    if (!audioEl) {
        audioEl = new Audio();
        audioEl.loop = true;
        audioEl.preload = "none";
        audioEl.src = AUDIO_SRC;
    }
    return audioEl;
}

export default function useAmbientAudio() {
    const [isMuted, setIsMuted] = useState(() => !audioEl || audioEl.paused);

    const toggleMute = useCallback(() => {
        setIsMuted((muted) => {
            if (muted) {
                const audio = getAudioEl();
                if (!audio) return muted;
                audio.play().catch(() => {});
                return false;
            }
            audioEl?.pause();
            return true;
        });
    }, []);

    return { isMuted, toggleMute };
}