import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  RotateCw,
} from "lucide-react";
import { useLanguage } from "@/services/LanguageProvider";
import MaisonReveal from "../shared/MaisonReveal";

const EASE_CUBIC = Object.freeze([0.16, 1, 0.3, 1]);

const MAIN_IMAGE_INITIAL = Object.freeze({
  opacity: 0,
  scale: 1.02,
  clipPath: "inset(6% 4% 6% 4%)",
});
const MAIN_IMAGE_ANIMATE = Object.freeze({
  opacity: 1,
  scale: 1,
  clipPath: "inset(0% 0% 0% 0%)",
});
const MAIN_IMAGE_EXIT = Object.freeze({
  opacity: 0,
  transition: { duration: 0.45, ease: EASE_CUBIC },
});
const MAIN_IMAGE_TRANSITION = Object.freeze({
  duration: 0.9,
  ease: EASE_CUBIC,
});

const SPIN_IMAGE_INITIAL = Object.freeze({ opacity: 1 });
const SPIN_IMAGE_TRANSITION = Object.freeze({
  duration: 0.5,
  ease: EASE_CUBIC,
});

const EMPTY_ARRAY = Object.freeze([]);

const GalleryThumbnail = memo(function GalleryThumbnail({
  image,
  index,
  isActive,
  onSelect,
  altText,
}) {
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className="group relative aspect-[16/10] overflow-hidden border border-ink/10 hover:border-accent/50 rounded-sm cursor-pointer active:scale-[0.98] transition-all duration-500 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Image
        src={image?.url}
        alt={altText}
        fill
        sizes="200px"
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        referrerPolicy="no-referrer"
      />
      <span
        className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left rtl:origin-right transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
});

function StudioGallery({ item, lightbox }) {
  const { t, isFarsi } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const {
    activeImageIndex = 0,
    setActiveImageIndex,
    openLightbox,
    goNextWrapped,
    goPrevWrapped,
  } = lightbox ?? {};

  const [show360, setShow360] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSpinReady, setIsSpinReady] = useState(false);
  const videoRef = useRef(null);

  const itemId = item?.id;
  const images = Array.isArray(item?.images) ? item.images : EMPTY_ARRAY;
  const imagesCount = images.length;
  const activeImage = images[activeImageIndex];
  const firstImage = images[0];

  const { spin360Src, spinPosterSrc } = useMemo(() => {
    const id = itemId ?? "";
    return {
      spin360Src: `/video/spin/spin-${id}-360.mp4`,
      spinPosterSrc: `/video/spin/spin-${id}-360.jpg`,
    };
  }, [itemId]);

  useEffect(() => {
    setShow360(false);
  }, [itemId]);

  useEffect(() => {
    setIsSpinReady(false);
  }, [spin360Src]);

  useEffect(() => {
    if (!show360 || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [show360, isPlaying]);

  const handlePrevClick = useCallback(
    (e) => {
      e.stopPropagation();
      goPrevWrapped?.();
    },
    [goPrevWrapped],
  );

  const handleNextClick = useCallback(
    (e) => {
      e.stopPropagation();
      goNextWrapped?.();
    },
    [goNextWrapped],
  );

  const handleTogglePlay = useCallback((e) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  }, []);

  const handleVideoLoadedData = useCallback(() => {
    setIsSpinReady(true);
  }, []);

  const handleSelectThumbnail = useCallback(
    (idx) => {
      setShow360(false);
      setActiveImageIndex?.(idx);
    },
    [setActiveImageIndex],
  );

  const handleSelectSpin = useCallback(() => {
    setIsSpinReady(false);
    setShow360(true);
  }, []);

  const handleContainerKeyDown = useCallback(
    (e) => {
      if (show360 || !openLightbox) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      openLightbox();
    },
    [show360, openLightbox],
  );

  const digitFormatter = useMemo(
    () => new Intl.NumberFormat(isFarsi ? "fa-IR" : "en-US"),
    [isFarsi],
  );

  const captionText = useMemo(() => {
    const itemName = item?.name ?? "";
    if (show360) {
      return `${t("productSpin360Label")}: ${itemName}`;
    }
    const currentCaption =
      activeImage?.caption || `${itemName} ${t("productStudioLayoutFallback")}`;
    return `${t("productStudioViewLabel")} ${digitFormatter.format(activeImageIndex + 1)} ${t("lightboxCounterOf")} ${digitFormatter.format(imagesCount)}: ${currentCaption}`;
  }, [
    show360,
    item?.name,
    t,
    activeImage?.caption,
    activeImageIndex,
    imagesCount,
    digitFormatter,
  ]);

  const spinImageAnimate = useMemo(
    () => ({
      opacity: isSpinReady ? 0 : 1,
    }),
    [isSpinReady],
  );

  if (!item) return null;

  const handleContainerClick = show360 ? undefined : openLightbox;
  const playPauseAriaLabel = t(isPlaying ? "heroPauseVideo" : "heroPlayVideo");
  const activeImageAlt = activeImage?.caption || item.name;
  const openImageLabel = t("productEnlargeImageLabel").replace("{name}", item.name);
  const prevImageLabel = t("showcasePrev");
  const nextImageLabel = t("showcaseNext");

  return (
    <MaisonReveal
      variant="scale-down-unveil"
      delay={0.35}
      threshold={0.01}
      className="lg:col-span-7 flex flex-col space-y-5 w-full"
    >
      <div className="flex flex-col space-y-2.5 w-full">
        <div
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-surface-alt border border-ink/10 overflow-hidden shadow-ambient rounded-sm group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={handleContainerClick}
          onKeyDown={handleContainerKeyDown}
          role={show360 ? undefined : "button"}
          tabIndex={show360 ? undefined : 0}
          aria-label={show360 ? undefined : openImageLabel}
        >
          {show360 ? (
            <div className="relative w-full h-full">
              <video
                key={spin360Src}
                ref={videoRef}
                src={spin360Src}
                poster={spinPosterSrc}
                preload="none"
                muted
                loop
                playsInline
                autoPlay
                aria-hidden="true"
                onLoadedData={handleVideoLoadedData}
                className="w-full h-full object-cover cursor-default"
              />
              <motion.img
                src={firstImage?.url}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                initial={SPIN_IMAGE_INITIAL}
                animate={spinImageAnimate}
                transition={SPIN_IMAGE_TRANSITION}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={
                  prefersReducedMotion ? { opacity: 0 } : MAIN_IMAGE_INITIAL
                }
                animate={
                  prefersReducedMotion ? { opacity: 1 } : MAIN_IMAGE_ANIMATE
                }
                exit={MAIN_IMAGE_EXIT}
                transition={MAIN_IMAGE_TRANSITION}
                className="absolute inset-0"
              >
                <Image
                  fill
                  priority
                  src={activeImage?.url}
                  alt={activeImageAlt}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover cursor-zoom-in transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
          )}

          {!show360 && (
            <>
              <button
                type="button"
                onClick={handlePrevClick}
                aria-label={prevImageLabel}
                data-touch-boost
                className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1.5 flex items-center justify-center w-10 h-10 rounded-full bg-panel-glass backdrop-blur-sm border border-ink/10 cursor-pointer hover:border-accent/40 z-10 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0"
              >
                <ChevronLeft className="w-4 h-4 text-ink stroke-[1]" />
              </button>
              <button
                type="button"
                onClick={handleNextClick}
                aria-label={nextImageLabel}
                data-touch-boost
                className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-1.5 flex items-center justify-center w-10 h-10 rounded-full bg-panel-glass backdrop-blur-sm border border-ink/10 cursor-pointer hover:border-accent/40 z-10 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 focus-visible:opacity-100 focus-visible:translate-x-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0"
              >
                <ChevronRight className="w-4 h-4 text-ink stroke-[1]" />
              </button>

              <div className="absolute top-4 right-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-15 opacity-0 translate-x-2 -translate-y-2 scale-[0.85] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-x-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100">
                <div className="w-8 h-8 flex items-center justify-center bg-panel-frost border border-ink/12 rounded-md shadow-card-sm text-headline">
                  <Maximize2 className="w-3.5 h-3.5 stroke-[1.8]" />
                </div>
              </div>
            </>
          )}

          {show360 && (
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={playPauseAriaLabel}
              data-touch-boost
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-md bg-black/50 border border-white/10 text-white/95 hover:border-white/30 hover:text-accent transition-colors duration-500 focus:outline-none focus-visible:border-accent cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
          )}

          <div className="absolute top-4 left-4 bg-panel-frost border border-ink/10 px-3 py-1.5 font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-widest text-ink rounded-md select-none z-10 leading-none">
            {t("productStudioArchiveIndex")}
          </div>
        </div>

        <p
          title={captionText}
          className="font-mono text-[length:calc(10px*var(--zaad-font-scale))] text-muted tracking-[0.15em] rtl:tracking-normal truncate select-none"
        >
          {captionText}
        </p>
      </div>

      <MaisonReveal
        variant="slide-up-royal"
        delay={0.6}
        threshold={0.01}
        className="w-full"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <GalleryThumbnail
              key={img.url || idx}
              image={img}
              index={idx}
              isActive={!show360 && activeImageIndex === idx}
              onSelect={handleSelectThumbnail}
              altText={t("productStudioThumbnailAlt")
                .replace("{name}", item.name)
                .replace("{index}", String(idx + 1))}
            />
          ))}
          <button
            type="button"
            onClick={handleSelectSpin}
            aria-pressed={show360}
            className="group relative aspect-[16/10] overflow-hidden border border-ink/10 hover:border-accent/50 rounded-sm cursor-pointer active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-1.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Image
              src={firstImage?.url}
              alt=""
              aria-hidden="true"
              fill
              sizes="200px"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-foundation/70" />
            <RotateCw className="relative w-3.5 h-3.5 text-canvas" />
            <span className="relative font-mono text-[length:calc(10px*var(--zaad-font-scale))] tracking-widest text-canvas uppercase">
              {t("productSpin360Label")}
            </span>
            <span
              className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-left rtl:origin-right transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                show360 ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        </div>
      </MaisonReveal>
    </MaisonReveal>
  );
}

export default memo(StudioGallery);
