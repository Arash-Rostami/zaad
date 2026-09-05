import React, { memo } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AudioToggle = memo(function AudioToggle({ isMuted, onToggle, label }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={label}
            aria-pressed={!isMuted}
            data-touch-boost
            className={`cursor-pointer flex items-center justify-center h-7 w-7 rounded-md transition-colors duration-700 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isMuted ? "text-muted/70 hover:text-headline" : "text-[#C5A059] hover:text-[#C5A059]/80"
            }`}
        >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
    );
});

export default AudioToggle;
