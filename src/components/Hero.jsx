"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { ArrowDown, Pause, Play } from "lucide-react";
import MaisonButton from "./shared/MaisonButton";
import RibbonScroll from "./shared/RibbonScroll";
import { useLanguage } from "@/services/LanguageProvider";
import wrapBrandNames from "@/lib/wrapBrandNames";

const HERO_VIDEOS = [
  "/video/hero/hero-01.mp4",
  "/video/hero/hero-02.mp4",
  "/video/hero/hero-03.mp4",
  "/video/hero/hero-04.mp4",
];
const HERO_VIDEO_RATE = 0.75;

function Hero({ onScrollToCollection }) {
  const { t } = useLanguage();
  const [activeVideo, setActiveVideo] = useState(0);
  const [stageReady, setStageReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mountedCount, setMountedCount] = useState(2);
  const [nextEager, setNextEager] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRefs = useRef([]);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const sectionRef = useRef(null);
  const textColRef = useRef(null);
  const videoWrapRef = useRef(null);

  const wrappedHeroDesc = useMemo(() => wrapBrandNames(t("heroDesc")), [t]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsPlaying(false);
      setPrefersReducedMotion(true);
    }
  }, []);

  useEffect(() => {
    const els = [
      titleRef.current,
      descRef.current,
      ctaRef.current,
    ].filter(Boolean);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStageReady(true);
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    let ctx;
    const playTimeline = () => {
      setStageReady(true);
      ctx = gsap.context(() => {
        gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(
                titleRef.current,
                { opacity: 0, y: 64 },
                { opacity: 1, y: 0, duration: 0.9 },
                ">+=0.2",
            )
            .fromTo(
                descRef.current,
                { opacity: 0, y: 38 },
                { opacity: 1, y: 0, duration: 0.7 },
                ">+=0.2",
            )
            .fromTo(
                ctaRef.current,
                { opacity: 0, y: 38 },
                { opacity: 1, y: 0, duration: 0.7 },
                ">+=0.2",
            );
      });
    };

    const loaderAlreadyComplete = sessionStorage.getItem(
        "zaad_loader_complete",
    );
    if (loaderAlreadyComplete) {
      playTimeline();
    } else {
      window.addEventListener("zaad:loaderComplete", playTimeline, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("zaad:loaderComplete", playTimeline);
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      video.playbackRate = HERO_VIDEO_RATE;
      if (index === activeVideo) {
        video.currentTime = 0;
      } else {
        video.pause();
      }
    });
  }, [activeVideo, mountedCount]);

  useEffect(() => {
    const activeVideoEl = videoRefs.current[activeVideo];
    if (!activeVideoEl) return;
    if (isPlaying) {
      activeVideoEl.play().catch(() => {});
    } else {
      activeVideoEl.pause();
    }
  }, [activeVideo, isPlaying, mountedCount]);

  const handleVideoEnded = useCallback(() => {
    setActiveVideo((current) => (current + 1) % HERO_VIDEOS.length);
  }, []);

  useEffect(() => {
    setMountedCount((count) =>
        Math.min(HERO_VIDEOS.length, Math.max(count, activeVideo + 2)),
    );
    setNextEager(false);
    const id = window.setTimeout(() => setNextEager(true), 3000);
    return () => window.clearTimeout(id);
  }, [activeVideo]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const textTween = gsap.fromTo(
          textColRef.current,
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -8,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          },
      );
      const videoTween = gsap.fromTo(
          videoWrapRef.current,
          { yPercent: 0 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          },
      );

      return () => {
        textTween.scrollTrigger?.kill();
        textTween.kill();
        videoTween.scrollTrigger?.kill();
        videoTween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
      <section
          ref={sectionRef}
          className="relative min-h-screen pt-[61px] sm:pt-[73px] lg:pt-32 pb-8 flex flex-col justify-between overflow-hidden bg-surface"
      >
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none grid grid-cols-4 max-w-7xl mx-auto px-6 sm:px-12">
          <div className="border-l border-ink/10 h-full w-[1px]"></div>
          <div className="border-l border-ink/10 h-full w-[1px]"></div>
          <div className="border-l border-ink/10 h-full w-[1px]"></div>
          <div className="border-l border-ink/10 h-full w-[1px] border-r"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
          <div
              ref={textColRef}
              className="order-2 lg:order-1 flex flex-col px-6 sm:px-12 lg:ps-12 lg:pe-10 xl:ps-20"
          >
            <div className="w-full max-w-xl rtl:max-w-2xl text-left rtl:text-right z-20">
              <h1
                  ref={titleRef}
                  style={{ opacity: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-[1.05] text-ink font-bold text-glow-subtle"
              >
                {t("heroTitle_1")} <br />
                <span>
                {t("heroTitle_italic")} {t("heroTitle_2")}
              </span>
              </h1>

              <p
                  ref={descRef}
                  style={{ opacity: 0 }}
                  className="mt-10 text-sm sm:text-base md:text-lg text-muted font-light max-w-lg rtl:max-w-2xl leading-relaxed"
              >
                {wrappedHeroDesc}
              </p>

              <div
                  ref={ctaRef}
                  style={{ opacity: 0 }}
                  className="mt-14 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto"
              >
                <MaisonButton
                    variant="solid"
                    onClick={onScrollToCollection}
                    icon={ArrowDown}
                    className="px-9 py-4 sm:px-10 sm:py-5"
                    iconClassName="w-4 h-4"
                >
                  {t("exploreCollection")}
                </MaisonButton>
              </div>
            </div>
          </div>

          <div ref={videoWrapRef} className="order-1 lg:order-2">
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={
                    stageReady ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }
                }
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full aspect-video lg:aspect-auto lg:h-full overflow-hidden mb-10 lg:mb-0 lux-vignette rounded-md"
            >
              {HERO_VIDEOS.slice(0, mountedCount).map((src, index) => {
                const isActive = index === activeVideo;
                const isNext = index === (activeVideo + 1) % HERO_VIDEOS.length;
                return (
                    <video
                        key={src}
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={src}
                        poster={src.replace(".mp4", ".jpg")}
                        muted
                        playsInline
                        preload={isActive || (isNext && nextEager) ? "auto" : "metadata"}
                        aria-hidden="true"
                        onEnded={handleVideoEnded}
                        className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform,filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                                ? "opacity-100 scale-100 blur-none"
                                : "opacity-0 scale-[1.035] blur-sm"
                        }`}
                    />
                );
              })}

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foundation/70 via-foundation/15 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 start-6 flex items-center gap-3">
                <button
                    type="button"
                    data-touch-boost
                    onClick={() => setIsPlaying((playing) => !playing)}
                    aria-label={t(isPlaying ? "heroPauseVideo" : "heroPlayVideo")}
                    className="flex items-center justify-center w-8 h-8 rounded-md border border-canvas/30 text-canvas hover:border-canvas/60 hover:text-accent transition-colors duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
                >
                  {isPlaying ? (
                      <Pause className="w-3 h-3" />
                  ) : (
                      <Play className="w-3 h-3" />
                  )}
                </button>
                <div
                    className="flex items-center gap-1.5"
                    role="group"
                    aria-label={t("heroExhibition")}
                >
                  {HERO_VIDEOS.map((src, index) => (
                      <button
                          key={src}
                          type="button"
                          data-touch-slop
                          aria-current={index === activeVideo}
                          aria-label={`${t("heroExhibition")} ${index + 1}`}
                          onClick={() => setActiveVideo(index)}
                          className="group flex items-center justify-center py-1.5 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm"
                      >
                    <span className="relative block w-6 h-[2px] rounded-full bg-canvas/35 group-hover:bg-canvas/60 overflow-hidden">
                      <span
                          className={`absolute inset-0 rounded-full bg-accent origin-left rtl:origin-right transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              index === activeVideo ? "scale-x-100" : "scale-x-0"
                          }`}
                      />
                    </span>
                      </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 border-t border-ink/10 pt-4 mt-10">
          <RibbonScroll height="h-10 sm:h-12" />
        </div>
      </section>
  );
}

export default React.memo(Hero);