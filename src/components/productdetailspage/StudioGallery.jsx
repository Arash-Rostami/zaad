import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function StudioGallery({ item, lightbox }) {
    const {
        activeImageIndex,
        setActiveImageIndex,
        openLightbox,
        isHoveredOverImage,
        setIsHoveredOverImage,
        goNextWrapped,
        goPrevWrapped,
    } = lightbox;

    return (
        <div className="lg:col-span-7 flex flex-col space-y-4 w-full">
            <div
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-surface-alt border border-ink/10 overflow-hidden shadow-xl rounded-sm cursor-zoom-in group"
                onMouseEnter={() => setIsHoveredOverImage(true)}
                onMouseLeave={() => setIsHoveredOverImage(false)}
                onClick={openLightbox}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeImageIndex}
                        initial={{ opacity: 0, scale: 1.015 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        src={item.images[activeImageIndex]?.url}
                        alt={item.images[activeImageIndex]?.caption || item.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                    />
                </AnimatePresence>

                <button
                    onClick={(e) => { e.stopPropagation(); goPrevWrapped(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-panel/70 border border-ink/5 p-2 rounded-full cursor-pointer hover:bg-panel transition-all z-10"
                >
                    <ChevronLeft className="w-4 h-4 text-ink stroke-[1]" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); goNextWrapped(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-panel/70 border border-ink/5 p-2 rounded-full cursor-pointer hover:bg-panel transition-all z-10"
                >
                    <ChevronRight className="w-4 h-4 text-ink stroke-[1]" />
                </button>

                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[9px] text-white/95 tracking-widest max-w-[85%] truncate z-10">
                    VIEW {activeImageIndex + 1} OF {item.images.length}:{" "}
                    {item.images[activeImageIndex]?.caption || `${item.name} layout`}
                </div>

                <div
                    className="absolute top-4 right-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-15"
                    style={{
                        transform: isHoveredOverImage ? "translate(0, 0) scale(1)" : "translate(8px, -8px) scale(0.85)",
                        opacity: isHoveredOverImage ? 1 : 0,
                    }}
                >
                    <div className="w-8 h-8 flex items-center justify-center bg-panel-frost bg-surface-alt/95 border border-ink/12 rounded-full shadow-lg text-headline">
                        <Maximize2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    </div>
                </div>

                <div className="absolute top-4 left-4 bg-panel-frost bg-surface-alt/95 border border-ink/10 px-3 py-1.5 font-mono text-[8px] tracking-widest text-ink rounded-md shadow-sm select-none z-10 leading-none">
                    MUSEUM ARCHIVE INDEX
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {item.images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-[16/10] overflow-hidden border transition-all duration-500 rounded-sm cursor-pointer ${
                            activeImageIndex === idx
                                ? "border-accent ring-1 ring-accent"
                                : "border-ink/10 opacity-60 hover:opacity-90"
                        }`}
                    >
                        <img
                            src={img.url}
                            alt={`Perspective thumbnail ${idx}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
