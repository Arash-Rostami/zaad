"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import MaisonReveal from "./shared/MaisonReveal";
import {useLanguage} from "@/services/LanguageProvider";
import wrapLatinRuns from "@/lib/wrapLatinRuns";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

import Image from "next/image";
// import { motion, AnimatePresence } from "motion/react";
// const SILK_ENTER = [0.19, 1, 0.22, 1];
// const SILK_EXIT = [0.7, 0, 0.84, 0];
// const SLIDE_MS = 7000;

const STORY_VIDEOS = [
    "/video/story/story-pan.mp4",
    "/video/story/story-oven.mp4",
    "/video/story/story-inbuilt.mp4",
    "/video/story/story-hood.mp4",
    "/video/story/story-cupboard.mp4",
    "/video/story/story-light.mp4",
];

const BACKGROUND_ELEMENTS = (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
            className="absolute left-1/3 top-1/10 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-accent/0 via-accent/10 to-accent/0 dark:via-accent/20 mix-blend-screen transition-opacity duration-1000"/>
        <div
            className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/15 mix-blend-screen"/>
        <div
            className="absolute top-0 left-1/4 w-[240px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.05] dark:via-white/[0.18] to-transparent sunbeam-signature-glare pointer-events-none mix-blend-overlay"
            style={{animationDuration: "26s"}}
        />
        <div
            className="absolute top-0 left-1/3 w-[140px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.02] dark:via-accent/12 to-transparent sunbeam-signature-glare pointer-events-none mix-blend-color-dodge"
            style={{animationDelay: "-8s", animationDuration: "35s"}}
        />
        <div
            className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-transparent via-accent/5 to-transparent dark:via-accent/15 mix-blend-screen pointer-events-none"/>
    </div>
);

function Vision({ utensilImages = [] }) {
    const {t, language} = useLanguage();
    const isFarsi = language === "fa";
    const reduceMotion = useReducedMotion();
    const gridRef = useRef(null);
    const imageColRef = useRef(null);
    const textColRef = useRef(null);
    // const [utensilIndex, setUtensilIndex] = useState(0);
    // const slideCount = utensilImages.length;
    // const slide = utensilImages[utensilIndex];
    // const slideFits = slide && slide.width > 0 && slide.height > 0;

    const [activeStoryVideo, setActiveStoryVideo] = useState(0);
    const [isStoryVideoPlaying, setIsStoryVideoPlaying] = useState(true);
    const [storyGalleryMounted, setStoryGalleryMounted] = useState(false);
    const [storyGalleryVisible, setStoryGalleryVisible] = useState(false);
    const storyVideoRefs = useRef([]);
    const storyVideoFrameRef = useRef(null);
    const storyVideoErrorCount = useRef(0);

    useEffect(() => {
        if (reduceMotion) setIsStoryVideoPlaying(false);
    }, [reduceMotion]);

    useEffect(() => {
        const el = storyVideoFrameRef.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setStoryGalleryMounted(true);
            setStoryGalleryVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                setStoryGalleryVisible(entry.isIntersecting);
                if (entry.isIntersecting) setStoryGalleryMounted(true);
            },
            { rootMargin: "0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!storyGalleryMounted) return;
        storyVideoRefs.current.forEach((video, index) => {
            if (!video) return;
            if (index === activeStoryVideo) {
                video.currentTime = 0;
            } else {
                video.pause();
            }
        });
    }, [storyGalleryMounted, activeStoryVideo]);

    useEffect(() => {
        if (!storyGalleryMounted) return;
        const activeEl = storyVideoRefs.current[activeStoryVideo];
        if (!activeEl) return;
        if (isStoryVideoPlaying && storyGalleryVisible) {
            activeEl.play().catch(() => {});
        } else {
            activeEl.pause();
        }
    }, [storyGalleryMounted, storyGalleryVisible, activeStoryVideo, isStoryVideoPlaying]);

    const handleStoryVideoEnded = () => {
        storyVideoErrorCount.current = 0;
        setActiveStoryVideo((current) => (current + 1) % STORY_VIDEOS.length);
    };

    const handleStoryVideoError = (index) => {
        if (index !== activeStoryVideo) return;
        storyVideoErrorCount.current += 1;
        if (storyVideoErrorCount.current >= STORY_VIDEOS.length) return;
        setActiveStoryVideo((current) => (current + 1) % STORY_VIDEOS.length);
    };

    // const numberFormatter = useMemo(
    //     () => new Intl.NumberFormat(isFarsi ? "fa-IR" : "en-GB", {minimumIntegerDigits: 2}),
    //     [isFarsi]
    // );
    // const frameLabels = useMemo(() => {
    //     const totalStr = numberFormatter.format(slideCount);
    //     const template = t("storyFrameLabel");
    //     return Array.from({length: slideCount}, (_, i) =>
    //         template.replace("{index}", numberFormatter.format(i + 1)).replace("{total}", totalStr)
    //     );
    // }, [numberFormatter, slideCount, t]);
    // const currentFrameNumber = useMemo(
    //     () => numberFormatter.format(utensilIndex + 1),
    //     [numberFormatter, utensilIndex]
    // );
    // const totalFrameNumber = useMemo(() => numberFormatter.format(slideCount), [numberFormatter, slideCount]);

    const storyFixturesText = useMemo(() => wrapLatinRuns(t("storyFixturesText"), isFarsi), [t, isFarsi]);
    const storyP1 = useMemo(() => wrapLatinRuns(t("storyP1"), isFarsi), [t, isFarsi]);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const computeEnd = () => {
                const delta = textColRef.current.offsetHeight - imageColRef.current.offsetHeight;
                return "+=" + Math.max(delta, 0);
            };

            const trigger = ScrollTrigger.create({
                trigger: gridRef.current,
                pin: imageColRef.current,
                start: "top top+=88",
                end: computeEnd,
                pinSpacing: false,
                invalidateOnRefresh: true,
            });

            const frameTween = gsap.fromTo(
                storyVideoFrameRef.current,
                { scale: 1 },
                {
                    scale: 1.06,
                    ease: "none",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top top+=88",
                        end: computeEnd,
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }
            );

            return () => {
                trigger.kill();
                frameTween.scrollTrigger?.kill();
                frameTween.kill();
            };
        });

        return () => mm.revert();
    }, [language]);

    return (
        <section
            id="vision"
            className="relative section-y-break bg-surface-overlay px-6 sm:px-12 border-y border-ink/10 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-tone/30 pointer-events-none"></div>

            {BACKGROUND_ELEMENTS}

            <div className="max-w-7xl mx-auto relative z-10">
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-18 items-center">
                    <div ref={imageColRef} className="lg:col-span-5 lg:col-start-1 relative">
                        {/*
                        <MaisonReveal variant="scale-down-unveil" delay={0.3} threshold={0.01}>
                            <div
                                className="relative aspect-[3/4] w-full max-w-[420px] mx-auto overflow-hidden bg-transparent">
                                {slideCount > 1 && (
                                    <Image
                                        src={utensilImages[(utensilIndex + 1) % slideCount].src}
                                        alt=""
                                        aria-hidden="true"
                                        fill
                                        sizes="(min-width: 1024px) 420px, 90vw"
                                        className="absolute inset-0 opacity-0 pointer-events-none"
                                    />
                                )}
                                {slideCount > 0 && (
                                    <AnimatePresence mode="sync" initial={false}>
                                        <motion.div
                                            key={utensilIndex}
                                            initial={{ opacity: 0, scale: 0.94, clipPath: "inset(30% 12% 30% 12% round 18px)" }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                clipPath: "inset(0% 0% 0% 0% round 6px)",
                                                transition: {
                                                    duration: 1.9,
                                                    delay: 0.25,
                                                    ease: SILK_ENTER,
                                                    opacity: { duration: 1.3, delay: 0.25 },
                                                },
                                            }}
                                            exit={{ opacity: 0, transition: { duration: 1.6, ease: SILK_EXIT } }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <motion.div
                                                animate={reduceMotion ? { scale: 1, y: "0%" } : { scale: 1.035, y: "-1%" }}
                                                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                                                className={slideFits ? "relative overflow-hidden rounded-md" : "absolute inset-0"}
                                                style={
                                                    slideFits
                                                        ? {
                                                              aspectRatio: `${slide.width} / ${slide.height}`,
                                                              ...(slide.width / slide.height >= 3 / 4
                                                                  ? { width: "100%" }
                                                                  : { height: "100%" }),
                                                          }
                                                        : undefined
                                                }
                                            >
                                                <Image
                                                    src={slide?.src}
                                                    alt={t("storyUtensilAlt")}
                                                    fill
                                                    sizes="(min-width: 1024px) 420px, 90vw"
                                                    className="object-contain"
                                                    priority={utensilIndex === 0}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}


                                {slideCount > 1 && (
                                    <MaisonReveal variant="unveil" delay={0.7} threshold={0.01} className="absolute bottom-5 start-5 z-20 flex items-center gap-1">
                                        {utensilImages.map((_, i) => (
                                                <span className="relative block w-6 h-px bg-ink/20 overflow-hidden rounded-full"
                                                      key={i}
                                                >
                                                    {i === utensilIndex && (
                                                        reduceMotion ? (
                                                            <span className="absolute inset-0 bg-accent"/>
                                                        ) : (
                                                            <motion.span
                                                                key={utensilIndex}
                                                                initial={{ scaleX: 0 }}
                                                                animate={{ scaleX: 1 }}
                                                                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                                                                onAnimationComplete={() => setUtensilIndex((idx) => (idx + 1) % slideCount)}
                                                                style={{ transformOrigin: isFarsi ? "100% 50%" : "0% 50%" }}
                                                                className="absolute inset-0 bg-accent"
                                                            />
                                                        )
                                                    )}
                                                </span>
                                        ))}
                                    </MaisonReveal>
                                )}
                            </div>
                        </MaisonReveal>
                        */}

                        <MaisonReveal variant="scale-down-unveil" delay={0.3} threshold={0.01}>
                            <div ref={storyVideoFrameRef} className="relative aspect-[3/4] w-full max-w-[420px] mx-auto overflow-hidden rounded-md">
                                {storyGalleryMounted ? (
                                    <>
                                        {STORY_VIDEOS.map((src, index) => {
                                            const isActive = index === activeStoryVideo;
                                            const isNext = index === (activeStoryVideo + 1) % STORY_VIDEOS.length;
                                            return (
                                                <motion.video
                                                    key={src}
                                                    ref={(el) => {
                                                        storyVideoRefs.current[index] = el;
                                                    }}
                                                    src={src}
                                                    poster={src.replace(".mp4", ".jpg")}
                                                    muted
                                                    playsInline
                                                    preload={isActive || isNext ? "auto" : "metadata"}
                                                    aria-hidden="true"
                                                    onEnded={handleStoryVideoEnded}
                                                    onError={() => handleStoryVideoError(index)}
                                                    initial={false}
                                                    animate={{
                                                        opacity: isActive ? 1 : 0,
                                                        scale: isActive ? 1 : 1.035,
                                                        clipPath: isActive
                                                            ? "inset(0% 0% 0% 0% round 6px)"
                                                            : "inset(6% 4% 6% 4% round 10px)",
                                                    }}
                                                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            );
                                        })}

                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foundation/70 via-foundation/15 to-transparent pointer-events-none"/>

                                        <button
                                            type="button"
                                            data-touch-boost
                                            onClick={() => setIsStoryVideoPlaying((playing) => !playing)}
                                            aria-label={t(isStoryVideoPlaying ? "heroPauseVideo" : "heroPlayVideo")}
                                            className="absolute bottom-5 start-5 z-20 flex items-center justify-center w-8 h-8 rounded-md border border-canvas/30 text-canvas hover:border-canvas/60 hover:text-accent transition-colors duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
                                        >
                                            {isStoryVideoPlaying ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
                                        </button>
                                    </>
                                ) : (
                                    <Image
                                        src={STORY_VIDEOS[0].replace(".mp4", ".jpg")}
                                        alt=""
                                        aria-hidden="true"
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 420px, 90vw"
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </MaisonReveal>

                        <MaisonReveal
                            variant="slide-up-royal"
                            delay={1.3}
                            threshold={0.01}
                            className="absolute bottom-4 end-4 bg-panel-frost border border-ink/10 p-4 sm:p-5 shadow-card-md max-w-[160px] sm:max-w-[220px] rounded-xl z-20 text-left rtl:text-right"
                        >
                            <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono text-accent block mb-1">
                                {t("storyFixturesLabel")}
                            </span>
                            <p className="text-[length:calc(12px*var(--zaad-font-scale))] text-ink font-serif font-farsi leading-relaxed font-medium">
                                {storyFixturesText}
                            </p>
                        </MaisonReveal>
                    </div>

                    <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center text-left rtl:text-right">
                        <div ref={textColRef}>
                            <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                                <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                                    {t("manifestoBadge")}
                                </span>
                            </MaisonReveal>
                            <MaisonReveal variant="lines" delay={0.3} threshold={0.01}>
                                <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight leading-[1.15] text-[var(--text-primary)] text-glow-subtle">
                                    {t("storyTitle")}
                                </h2>
                            </MaisonReveal>

                            <MaisonReveal variant="unveil" delay={0.5} threshold={0.01}>
                                <p className="text-lg md:text-xl font-serif font-farsi font-light text-[var(--text-bronze)] mt-6 italic leading-relaxed">
                                    "{t("storyQuote2")}"
                                </p>
                            </MaisonReveal>

                            <MaisonReveal variant="unveil" delay={0.65} threshold={0.01}>
                                <div className="h-[1px] w-12 bg-[var(--border-color-15)] my-8"></div>
                            </MaisonReveal>

                            <MaisonReveal variant="unveil" delay={0.75} threshold={0.01}>
                                <div
                                    className="space-y-6 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light rtl:text-justify">
                                    <p>{storyP1}</p>
                                    <p>{t("storyP2")}</p>
                                </div>
                            </MaisonReveal>

                            <div
                                className="grid grid-cols-3 gap-4 md:gap-6 pt-10 border-t border-[var(--border-color-15)] mt-10 text-center md:text-start">
                                <MaisonReveal variant="unveil" delay={0.9} threshold={0.01}>
                                    <div>
                                        <span className="font-serif font-farsi italic text-2xl text-[var(--text-primary)] font-light">
                                            {t("storySpecialistsCount")}
                                        </span>
                                        <p className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                            {t("storySpecialistsLabel")}
                                        </p>
                                    </div>
                                </MaisonReveal>
                                <MaisonReveal variant="unveil" delay={1.05} threshold={0.01}>
                                    <div>
                                        <span className="font-serif font-farsi italic text-2xl text-[var(--text-primary)] font-light">
                                            {t("storyOriginValue")}
                                        </span>
                                        <p className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                            {t("storyOriginLabel")}
                                        </p>
                                    </div>
                                </MaisonReveal>
                                <MaisonReveal variant="unveil" delay={1.2} threshold={0.01}>
                                    <div>
                                        <span className="font-serif font-farsi italic text-2xl text-[var(--text-primary)] font-light">
                                            {t("collectionsCount")}
                                        </span>
                                        <p className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-[var(--text-secondary)] uppercase mt-1">
                                            {t("collectionsLabel")}
                                        </p>
                                    </div>
                                </MaisonReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(Vision);