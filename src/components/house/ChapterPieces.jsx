import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { animate, motion, useInView } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Pause, Phone, Play } from "lucide-react";
import MaisonReveal from "../shared/MaisonReveal";
import MaisonButton from "../shared/MaisonButton";
import NoiseBg from "../shared/NoiseBg";
import useDeferredMedia from "@/hooks/useDeferredMedia";
import { useLanguage } from "@/services/LanguageProvider";
import { animateScrollTo } from "@/services/ScrollService";
import wrapBrandNames from "@/lib/wrapBrandNames";
import { isStudioOpenNow } from "@/lib/studioHours";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHAPTER_HERO_VIDEOS = [
  "/video/house/chapter-gavv.mp4",
  "/video/house/chapter-zivv.mp4",
  "/video/house/chapter-rakh.mp4",
  "/video/house/chapter-vaar.mp4",
];

export const AMBIENT = (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
    <div className="absolute left-1/3 top-1/10 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-accent/0 via-accent/10 to-accent/0 dark:via-accent/20 mix-blend-screen transition-opacity duration-1000" />
    <div className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/15 mix-blend-screen" />
    <div
      className="absolute top-0 left-1/4 w-[240px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.05] dark:via-white/[0.18] to-transparent sunbeam-signature-glare pointer-events-none mix-blend-overlay"
      style={{ animationDuration: "26s" }}
    />
    <div className="absolute left-[50%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-transparent via-accent/5 to-transparent dark:via-accent/15 mix-blend-screen pointer-events-none" />
  </div>
);

function parseEditorialBlocks(content) {
  return content
    .replace(/^\s*###\s+/, "")
    .split(/\n###\s+/)
    .filter(Boolean)
    .map((b) => {
      const nl = b.indexOf("\n");
      const heading = (nl === -1 ? b : b.slice(0, nl)).trim();
      const body = nl === -1 ? "" : b.slice(nl + 1).trim();
      return { heading, body };
    });
}

export function EditorialBlock({ content, align = "start" }) {
  const centered = align === "center";
  const blocks = useMemo(() => parseEditorialBlocks(content), [content]);

  return (
    <div
      className={`space-y-12 md:space-y-16 max-w-3xl ${centered ? "mx-auto" : ""}`}
    >
      {blocks.map((blk, i) => (
        <MaisonReveal
          key={i}
          variant="slide-up-royal"
          delay={0.15 + i * 0.15}
          threshold={0.1}
        >
          <article
            className={centered ? "text-center" : "text-left rtl:text-right"}
          >
            <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent uppercase block mb-3">
              {blk.heading}
            </span>
            <p
              className={`text-base md:text-lg text-muted font-light leading-relaxed whitespace-pre-line rtl:text-justify ${
                centered ? "text-left max-w-2xl mx-auto" : ""
              }`}
            >
              {blk.body}
            </p>
          </article>
        </MaisonReveal>
      ))}
    </div>
  );
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function StatValue({ value }) {
  const { isFarsi } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [shown, setShown] = useState(0);

  const parsed = useMemo(() => {
    const match =
      typeof value === "string"
        ? value.match(/^([\d۰-۹][\d۰-۹,،]*)(\s*)(.*)$/)
        : null;
    const target = match
      ? parseInt(
          match[1]
            .replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d))
            .replace(/[،,]/g, ""),
          10,
        )
      : null;
    return { match, target };
  }, [value]);
  const { match, target } = parsed;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(isFarsi ? "fa-IR" : "en-US", {
        useGrouping: /[،,]/.test(match?.[1] || ""),
      }),
    [isFarsi, match],
  );

  useEffect(() => {
    if (target === null || !inView) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      target < 2
    ) {
      setShown(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 2.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span
      ref={ref}
      className="font-serif font-farsi italic text-3xl md:text-4xl text-ink font-light block"
    >
      {target === null
        ? value
        : `${formatter.format(shown)}${match[2]}${match[3]}`}
    </span>
  );
}

export function EditorialSignature({ className = "" }) {
  return (
    <MaisonReveal
      variant="unveil"
      delay={0.15}
      threshold={0.1}
      className={`relative py-2 max-w-3xl mt-10 md:mt-12 ${className}`}
    >
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-left rtl:origin-right"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-panel border border-accent/30 shadow-card-sm flex items-center justify-center"
      >
        <span className="font-serif italic text-accent text-lg leading-none">
          Z
        </span>
      </motion.div>
    </MaisonReveal>
  );
}

export function StatGrid({ stats, align = "start" }) {
  if (!stats || !stats.length) return null;
  const centered = align === "center";
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-ink/10">
      {stats.map((s, i) => (
        <MaisonReveal
          key={i}
          variant="unveil"
          delay={0.2 + i * 0.15}
          threshold={0.01}
          className={
            centered
              ? "text-center"
              : "text-center md:text-left rtl:md:text-right"
          }
        >
          <StatValue value={s.value} />
          <p className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-widest text-muted uppercase mt-2">
            {s.label}
          </p>
        </MaisonReveal>
      ))}
    </div>
  );
}

export function CrossLinks({ siblings }) {
  const { t } = useLanguage();
  const teasers = useMemo(
    () => siblings.map((s) => wrapBrandNames(s.teaser)),
    [siblings],
  );

  return (
    <section className="relative px-6 sm:px-12 section-y border-t border-ink/10">
      <div className="max-w-7xl mx-auto">
        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
          <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3 text-center">
            {t("crossLinkHeading")}
          </span>
        </MaisonReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 md:mt-16">
          {siblings.map((s, i) => (
            <MaisonReveal
              key={s.href}
              variant="slide-up-royal"
              delay={0.35 + i * 0.15}
              threshold={0.01}
            >
              <Link
                href={s.href}
                className="group relative block overflow-hidden bg-panel border border-ink/10 rounded-2xl p-8 md:p-10 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/40 hover:shadow-ambient text-left rtl:text-right outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <NoiseBg filterId={`crossLinkNoise-${i}`} revealOnHover />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent uppercase block mb-4">
                  {s.eyebrow}
                </span>
                <h3 className="relative z-10 text-2xl md:text-3xl font-serif font-light text-ink leading-tight">
                  {s.label}
                </h3>
                <p className="relative z-10 text-sm text-muted font-light leading-relaxed mt-4 max-w-md rtl:text-justify">
                  {teasers[i]}
                </p>
                <span className="relative z-10 inline-flex items-center gap-2 mt-8 text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase text-ink group-hover:text-accent transition-colors duration-700">
                  {t("crossLinkReadMore")}
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100 transition-transform duration-700 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </Link>
            </MaisonReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CallStrip() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    setIsOpen(isStudioOpenNow());
  }, []);

  return (
    <section className="px-6 sm:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <MaisonReveal variant="slide-up-royal" delay={0.2} threshold={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-panel border border-ink/10 rounded-2xl p-6 sm:p-8 shadow-ambient">
            <div className="text-left rtl:text-right">
              <span className="text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-semibold uppercase mb-1.5 flex items-center gap-2">
                {t("callStudio")}
                {isOpen !== null && (
                  <span className="inline-flex items-center gap-1.5 text-[length:calc(9px*var(--zaad-font-scale))] font-mono tracking-widest normal-case text-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-accent" : "bg-muted/50"}`} />
                    {isOpen ? t("studioStatusOpen") : t("studioStatusClosed")}
                  </span>
                )}
              </span>
              <p className="text-xs text-muted font-light leading-relaxed rtl:text-justify">
                {t("callStudioSub")}
              </p>
            </div>
            <a
              href={`tel:${t("studioPhoneTel")}`}
              className="group inline-flex items-center gap-3 bg-ink text-on-indicator px-6 py-3.5 rounded-md text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.2em] uppercase transition-all duration-700 hover:bg-accent hover:text-on-indicator cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500" />
              <span dir="ltr">{t("studioPhone")}</span>
            </a>
          </div>
        </MaisonReveal>
      </div>
    </section>
  );
}

export function ChapterHero({
  heroEyebrow,
  heroTitle,
  heroTitleAccent,
  heroIntro,
  heroImage,
  heroImageAlt,
  heroBadge,
  heroBadgeLabel,
  scrollTargetId = "house-editorial",
  withVideo = true,
}) {
  const { t } = useLanguage();
  const scrollToEditorial = useCallback(() => {
    animateScrollTo(scrollTargetId);
  }, [scrollTargetId]);

  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [heroVideoReady] = useDeferredMedia({ mode: "idle" });
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const mediaColRef = useRef(null);
  const textColRef = useRef(null);

  const togglePlaying = useCallback(
    () => setIsPlaying((playing) => !playing),
    [],
  );

  useEffect(() => {
    if (!withVideo || !heroVideoReady) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActiveVideo(
      CHAPTER_HERO_VIDEOS[
        Math.floor(Math.random() * CHAPTER_HERO_VIDEOS.length)
      ],
    );
  }, [withVideo, heroVideoReady]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tween = gsap.fromTo(
        mediaColRef.current,
        { yPercent: 0 },
        {
          yPercent: 12,
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

      return () => {
        textTween.scrollTrigger?.kill();
        textTween.kill();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = 0.75;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [activeVideo, isPlaying]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] pt-24 md:pt-32 pb-16 px-6 sm:px-12 flex flex-col justify-center overflow-hidden"
    >
      {AMBIENT}
      <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div
          ref={textColRef}
          className="lg:col-span-6 flex flex-col items-start text-left rtl:text-right z-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-5"
          >
            {heroEyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.12] text-ink font-light max-w-xl text-glow-subtle"
          >
            {heroTitle}{" "}
            {heroTitleAccent && (
              <span className="italic font-normal font-serif-luxury text-accent">
                {heroTitleAccent}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-8 text-sm sm:text-base md:text-lg text-muted font-light max-w-lg leading-relaxed rtl:text-justify"
          >
            {heroIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="mt-12"
          >
            <MaisonButton
              variant="outline"
              onClick={scrollToEditorial}
              icon={ArrowDown}
            >
              {t("crossLinkReadMore")}
            </MaisonButton>
          </motion.div>
        </div>

        <div
          ref={mediaColRef}
          className="lg:col-span-6 relative mt-12 lg:mt-0 z-10 w-full"
        >
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full max-w-[520px] mx-auto overflow-hidden bg-surface-alt shadow-ambient border border-ink/10 lux-vignette rounded-md"
          >
            {activeVideo ? (
              <motion.video
                key={activeVideo}
                ref={videoRef}
                src={activeVideo}
                poster={activeVideo.replace(".mp4", ".jpg")}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 1.035, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover lux-ken-burns"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {activeVideo && (
              <button
                type="button"
                onClick={togglePlaying}
                aria-label={t(isPlaying ? "heroPauseVideo" : "heroPlayVideo")}
                className="absolute top-6 end-6 z-10 flex items-center justify-center w-8 h-8 rounded-md bg-foundation/40 backdrop-blur-sm border border-canvas/30 text-canvas hover:border-canvas/60 hover:text-accent transition-colors duration-500 focus:outline-none focus-visible:border-accent cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </button>
            )}
            {heroBadge && (
              <div className="absolute bottom-6 end-6 bg-panel/90 p-4 border border-ink/10 max-w-[220px] shadow-card-md text-left rtl:text-right">
                <span className="text-[length:calc(10px*var(--zaad-font-scale))] font-mono tracking-widest text-accent block mb-1 uppercase">
                  {heroBadge}
                </span>
                <p className="text-[length:calc(12px*var(--zaad-font-scale))] font-medium tracking-wider text-ink uppercase font-sans">
                  {heroBadgeLabel}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToEditorial}
        aria-label={t("crossLinkReadMore")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2 text-[length:calc(10px*var(--zaad-font-scale))] font-mono uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors duration-700 z-10 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </motion.button>
    </section>
  );
}
