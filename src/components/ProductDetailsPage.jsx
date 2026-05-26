"use client";

import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Layers,
    MapPin,
    Maximize2,
    Scale,
    ShieldCheck,
    Sparkles,
    X,
} from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import {useLanguage} from "@/services/TranslationService";
import useLightbox from "../hooks/useLightbox";

export default function ProductDetailsPage({item, onBack, onInquire}) {
    const {t, getItemTranslations} = useLanguage();
    const itemTrans = getItemTranslations(item.id);
    const [activeTab, setActiveTab] = useState("architecture");

    const {
        activeImageIndex,
        setActiveImageIndex,
        isEnlarged,
        openLightbox,
        closeLightbox,
        isHoveredOverImage,
        setIsHoveredOverImage,
        lightboxScale,
        setLightboxScale,
        cycleZoom,
        lightboxPan,
        handleLightboxMouseMove,
        handleLightboxTouchMove,
        isLightboxLoading,
        markImageLoaded,
        isZoomControllerHovered,
        setIsZoomControllerHovered,
        goNextWrapped,
        goPrevWrapped,
    } = useLightbox(item.images.length);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [item.id]);

    return (
        <div
            className="bg-surface text-ink min-h-screen py-10 md:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto border-b border-ink/10 transition-colors duration-1050">
            {/* 1. Header Navigation Bar */}
            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6 mb-8 sm:mb-12">
                <button
                    onClick={onBack}
                    className="group flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono tracking-widest text-muted hover:text-headline transition-colors duration-300 focus:outline-none cursor-pointer"
                >
                    <motion.span
                        className="inline-block rtl:rotate-180"
                        animate={{x: [0, -4, 0]}}
                        transition={{repeat: Infinity, duration: 1.5, repeatType: "reverse"}}
                    >
                        <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]"/>
                    </motion.span>
                    <span>{t("productReturnShowroom")}</span>
                </button>

                <div
                    className="flex items-center space-x-2 rtl:space-x-reverse text-[10px] font-mono tracking-widest uppercase">
          <span className="text-muted opacity-60">
            {t("productZAADArchive")}
          </span>
                    <span className="text-accent font-semibold">{item.number}</span>
                    <span className="text-muted opacity-60">/</span>
                    <span className="text-ink font-medium">
            {itemTrans?.name || item.name}{" "}
                        {t("productDirectory")}
          </span>
                </div>
            </div>

            {/* 2. Top Splitted Cover View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 md:mb-24">
                {/* Left column - Studio Gallery */}
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
                                initial={{opacity: 0, scale: 1.015}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
                                src={item.images[activeImageIndex]?.url}
                                alt={item.images[activeImageIndex]?.caption || item.name}
                                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                                referrerPolicy="no-referrer"
                            />
                        </AnimatePresence>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrevWrapped();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-panel/70   border border-ink/5 p-2 rounded-full cursor-pointer hover:bg-panel transition-all z-10"
                        >
                            <ChevronLeft className="w-4 h-4 text-ink stroke-[1]"/>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goNextWrapped();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-panel/70   border border-ink/5 p-2 rounded-full cursor-pointer hover:bg-panel transition-all z-10"
                        >
                            <ChevronRight className="w-4 h-4 text-ink stroke-[1]"/>
                        </button>

                        <div
                            className="absolute bottom-4 left-4 bg-black/50   px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[9px] text-white/95 tracking-widest max-w-[85%] truncate z-10">
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
                            <div
                                className="w-8 h-8 flex items-center justify-center bg-panel-frost bg-surface-alt/95   border border-ink/12 rounded-full shadow-lg text-headline">
                                <Maximize2 className="w-3.5 h-3.5 stroke-[1.8]"/>
                            </div>
                        </div>

                        <div
                            className="absolute top-4 left-4 bg-panel-frost bg-surface-alt/95 border border-ink/10 px-3 py-1.5 font-mono text-[8px] tracking-widest text-ink rounded-md shadow-sm select-none z-10 leading-none">
                            MUSEUM ARCHIVE INDEX
                        </div>
                    </div>

                    {/* Micro layout thumbnails */}
                    <div className="grid grid-cols-3 gap-3">
                        {item.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative aspect-[16/10] overflow-hidden border transition-all duration-500 rounded-sm cursor-pointer ${activeImageIndex === idx ? "border-accent ring-1 ring-accent" : "border-ink/10 opacity-60 hover:opacity-90"}`}
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

                {/* Right column - Noble Product Metadata */}
                <div className="lg:col-span-4 flex flex-col justify-start text-left rtl:text-right">
                    <MaisonReveal variant="slide-up-royal">
            <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-2">
              {t("productArchitecturalRecord")} {item.number}
            </span>
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif tracking-tight font-extralight text-headline leading-tight mb-2">
                            {itemTrans?.name || item.name}
                        </h1>
                        <p className="text-xs font-mono tracking-[0.15em] text-muted uppercase mb-6 pb-4 border-b border-ink/10">
                            {t("productCurator")}: {item.designer} •{" "}
                            {t("productZAAD")} {item.year}{" "}
                            {t("productRelease")}
                        </p>

                        <p className="text-sm md:text-base font-light text-ink leading-relaxed mb-8">
                            {itemTrans?.description || item.description}
                        </p>

                        <div
                            className="grid grid-cols-2 gap-y-4 gap-x-6 bg-surface-alt/30 bg-surface-alt rounded-xl p-5 border border-ink/5 mb-8 text-xs">
                            <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">
                  {t("productOrigin")}
                </span>
                                <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0"/>
                                    {itemTrans?.origin || item.specifications.origin}
                </span>
                            </div>
                            <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">
                  {t("productZAADWeight")}
                </span>
                                <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                  <Scale className="w-3.5 h-3.5 text-accent shrink-0"/>
                                    {item.specifications.weight}
                </span>
                            </div>
                            <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">
                  {t("productFinish")}
                </span>
                                <span className="font-light text-ink">
                  {itemTrans?.finish || item.specifications.finish}
                </span>
                            </div>
                            <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">
                  {t("productLeadTime")}
                </span>
                                <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                  <Calendar className="w-3.5 h-3.5 text-accent shrink-0"/>
                                    {itemTrans?.leadTime || item.specifications.leadTime}
                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                            <MaisonButton
                                variant="solid"
                                onClick={() => onInquire(item)}
                                className="flex-1 text-center justify-center font-semibold text-xs py-3.5 font-sans"
                            >
                                {t("productInitiateInquiry")}
                            </MaisonButton>
                            <MaisonButton
                                variant="outline"
                                onClick={onBack}
                                className="text-center justify-center font-mono text-[10px] tracking-widest text-muted"
                            >
                                {t("productReturnGrid")}
                            </MaisonButton>
                        </div>
                    </MaisonReveal>
                </div>
            </div>

            {/* 3. Bilingual Lookbook Poetry Section */}
            {item.farsiStory && (
                <MaisonReveal variant="unveil">
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch py-12 md:py-16 px-6 md:px-10 bg-surface-alt/20 dark:bg-black/15 border border-ink/5 rounded-2xl mb-16 md:mb-24 relative overflow-hidden">
                        <div
                            className="absolute right-6 top-6 opacity-[0.03] select-none text-[6rem] font-serif pr-4 leading-none"
                            dir="rtl">
                            زمین
                        </div>

                        <div
                            className="md:col-span-6 border-r-2 border-accent pr-6 flex flex-col justify-center text-right"
                            dir="rtl">
              <span className="text-[9px] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
                {item.farsiStory.title} — زبان نگاه
              </span>
                            <h3 className="font-serif text-lg md:text-xl font-medium text-headline mb-4 leading-relaxed antialiased">
                                {item.farsiStory.title}
                            </h3>
                            <div className="space-y-4">
                                {item.farsiStory.paragraphs.map((p, idx) => (
                                    <p key={idx}
                                       className="text-[12px] sm:text-[13px] text-muted leading-loose font-light antialiased">
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-6 pl-4 flex flex-col justify-center">
              <span className="text-[9px] font-mono tracking-[0.25em] text-accent uppercase block mb-3">
                MATERIAL MONOGRAPH & HERITAGE NARRATIVE
              </span>
                            <h3 className="font-serif text-lg md:text-xl font-light text-headline mb-4 leading-relaxed">
                                The Heritage of {item.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-4">
                                {item.story}
                            </p>
                            <div className="pt-2 text-[11px] font-mono tracking-wider italic text-accent uppercase">
                                Provenance Record: &ldquo;{item.provenance}&rdquo;
                            </div>
                        </div>
                    </div>
                </MaisonReveal>
            )}

            {/* 4. Architectural Specs Tab Bar */}
            <div className="mb-20">
                <div className="flex justify-center border-b border-ink/10 mb-10 overflow-x-auto scrollbar-none">
                    <div className="flex space-x-8 md:space-x-12 pb-px shrink-0">
                        {[
                            {id: "architecture", label: "MONOLITHIC ANATOMY", icon: Layers},
                            {id: "appliances", label: "GAGGENAU INTEGRATION", icon: Cpu},
                            {id: "heritage", label: "COMPOSITIONAL INTEGRITY", icon: Sparkles},
                        ].map((tab) => {
                            const isTabActive = activeTab === tab.id;
                            const IconComp = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="group relative pb-4 flex items-center space-x-2 transition-all duration-300 cursor-pointer focus:outline-none shrink-0"
                                >
                                    <IconComp
                                        className={`w-3.5 h-3.5 ${isTabActive ? "text-accent" : "text-muted/50 group-hover:text-accent"}`}/>
                                    <span
                                        className={`text-[10.5px] font-mono tracking-[0.2em] uppercase transition-colors ${isTabActive ? "text-ink font-semibold" : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"}`}>
                    {tab.label}
                  </span>
                                    {isTabActive && (
                                        <motion.div
                                            layoutId="activeCurationTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                                            transition={{type: "spring", stiffness: 350, damping: 30}}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                    >
                        {activeTab === "architecture" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                                {item.islandSpecs && (
                                    <div
                                        className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="w-1.5 h-1.5 bg-accent rounded-full"/>
                                                <span
                                                    className="text-[9.5px] font-mono tracking-[0.25em] text-accent uppercase font-semibold">CORE ISLAND GEOMETRIES</span>
                                            </div>
                                            <h4 className="font-serif text-lg font-light text-headline mb-3">Bi-Monolith
                                                Modular Central Core</h4>
                                            <p className="text-xs text-muted leading-relaxed font-light mb-6">{item.islandSpecs.overview}</p>
                                            <div className="space-y-4">
                                                {item.islandSpecs.partA && (
                                                    <div className="bg-surface-alt/30 p-4 rounded-xl">
                                                        <h5 className="font-mono text-[9px] font-bold text-accent uppercase mb-1.5">{item.islandSpecs.partA.title}</h5>
                                                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                                            {item.islandSpecs.partA.bullets.map((b, bIdx) => <li
                                                                key={bIdx}>{b}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                                {item.islandSpecs.partB && (
                                                    <div className="bg-surface-alt/30 p-4 rounded-xl">
                                                        <h5 className="font-mono text-[9px] font-bold text-accent uppercase mb-1.5">{item.islandSpecs.partB.title}</h5>
                                                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                                            {item.islandSpecs.partB.bullets.map((b, bIdx) => <li
                                                                key={bIdx}>{b}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.islandSpecs.listSpecs && (
                                            <div className="mt-8 border-t border-ink/10 pt-6">
                                                <span
                                                    className="text-[8.5px] font-mono tracking-widest text-muted block uppercase mb-3">CONSTRUCTOR MANUAL SHEETS</span>
                                                <div
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                                                    {item.islandSpecs.listSpecs.map((s, sIdx) => (
                                                        <div key={sIdx}
                                                             className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5">
                                                            <span className="text-accent">▪</span>
                                                            <span className="truncate">{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {item.tallUnits && (
                                    <div
                                        className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <span className="w-1.5 h-1.5 bg-accent rounded-full"/>
                                                <span
                                                    className="text-[9.5px] font-mono tracking-[0.25em] text-accent uppercase font-semibold">TALL CORE ARCHITECTURES</span>
                                            </div>
                                            <h4 className="font-serif text-lg font-light text-headline mb-3">Symmetric
                                                High-Yield Housing Wall</h4>
                                            <p className="text-xs text-muted leading-relaxed font-light mb-6">{item.tallUnits.overview}</p>
                                            {item.tallUnits.parts && (
                                                <div className="space-y-2 mb-6 text-[11px]">
                                                    <span
                                                        className="text-[8.5px] font-mono tracking-widest text-muted uppercase block mb-1">ZAAD TOWER ROW SCHEDULING</span>
                                                    <div className="grid grid-cols-1 gap-1.5 font-mono">
                                                        {item.tallUnits.parts.map((tower, tIdx) => (
                                                            <div key={tIdx}
                                                                 className="flex items-center justify-between p-2.5 bg-panel-glass dark:bg-panel/5 border border-ink/5 rounded-lg">
                                                                <span
                                                                    className="text-accent font-bold text-[9px] shrink-0 uppercase">{tower.key}</span>
                                                                <span
                                                                    className="text-muted truncate text-right">{tower.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-4">
                                                {item.tallUnits.adjacentA && (
                                                    <div className="bg-surface-alt/30 p-4 rounded-xl">
                                                        <span
                                                            className="font-mono text-[8px] tracking-widest text-accent block mb-1.5 uppercase">Ergonomics Plan (A-Adjacent)</span>
                                                        <p className="text-[10px] text-muted italic mb-2">{item.tallUnits.adjacentA.reason}</p>
                                                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                                            {item.tallUnits.adjacentA.bullets.map((b, bIdx) => <li
                                                                key={bIdx}>{b}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                                {item.tallUnits.adjacentB && (
                                                    <div className="bg-surface-alt/30 p-4 rounded-xl">
                                                        <span
                                                            className="font-mono text-[8px] tracking-widest text-accent block mb-1.5 uppercase">Ergonomics Plan (B-Adjacent)</span>
                                                        <p className="text-[10px] text-muted italic mb-2">{item.tallUnits.adjacentB.reason}</p>
                                                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                                            {item.tallUnits.adjacentB.bullets.map((b, bIdx) => <li
                                                                key={bIdx}>{b}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.tallUnits.listSpecs && (
                                            <div className="mt-8 border-t border-ink/10 pt-6">
                                                <span
                                                    className="text-[8.5px] font-mono tracking-widest text-muted block uppercase mb-3">HOUSING STRUCTURAL COMPONENTS</span>
                                                <div
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                                                    {item.tallUnits.listSpecs.map((s, sIdx) => (
                                                        <div key={sIdx}
                                                             className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5">
                                                            <span className="text-accent">▪</span>
                                                            <span className="truncate">{s}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "appliances" && (
                            <div className="space-y-8">
                                {item.partners && (
                                    <div
                                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-panel-glass border border-ink/5 p-6 rounded-2xl shadow-sm text-xs">
                                        <div className="space-y-1">
                                            <span
                                                className="text-[8px] font-mono text-muted block uppercase tracking-wider">CHASSIS TYPOLOGY</span>
                                            <strong
                                                className="text-[11px] text-ink uppercase font-mono block">{item.partners.typology}</strong>
                                        </div>
                                        <div className="space-y-1">
                                            <span
                                                className="text-[8px] font-mono text-muted block uppercase tracking-wider">HARDWARE CORE</span>
                                            <strong
                                                className="text-[11px] text-ink uppercase font-mono block">{item.partners.hardware}</strong>
                                        </div>
                                        <div className="space-y-1">
                                            <span
                                                className="text-[8px] font-mono text-muted block uppercase tracking-wider">INTEGRATED GLASSWARE</span>
                                            <strong
                                                className="text-[11px] text-ink uppercase font-mono block">{item.partners.appliances}</strong>
                                        </div>
                                        <div className="space-y-1">
                                            <span
                                                className="text-[8px] font-mono text-muted block uppercase tracking-wider">SMART ACC. & LED</span>
                                            <strong
                                                className="text-[11px] text-ink uppercase font-mono block">{item.partners.accessories} • {item.partners.light}</strong>
                                        </div>
                                    </div>
                                )}
                                {item.appliancesDetail && (
                                    <div className="space-y-4">
                                        <span
                                            className="text-[9px] font-mono tracking-[0.2em] text-accent uppercase block">GAGGENAU ZAAD CATALOG INTEGRATION SPECIFICS</span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {item.appliancesDetail.map((app, idx) => (
                                                <div key={idx}
                                                     className="bg-panel-glass p-5 sm:p-6 rounded-2xl border border-ink/5 flex flex-col justify-between">
                                                    <div className="space-y-3">
                                                        <div
                                                            className="flex items-center justify-between border-b border-ink/5 pb-2">
                                                            <span
                                                                className="text-[8.5px] bg-accent text-white py-0.5 px-2 rounded-full font-mono font-medium">{app.category}</span>
                                                        </div>
                                                        <h5 className="font-serif text-sm font-semibold text-ink">{app.name}</h5>
                                                        <ul className="list-disc list-inside space-y-1.5 text-[10.5px] text-muted pl-1 font-light leading-relaxed">
                                                            {app.specs.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div
                                                        className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between">
                                                        <span className="text-[8px] font-mono text-muted uppercase">INTEGRATION RATING</span>
                                                        <span className="text-[9px] font-mono font-bold text-accent">GAGGENAU 200/400</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.accessoriesDetail && (
                                    <div className="bg-panel-glass p-6 rounded-2xl border border-ink/5 space-y-4 mt-8">
                                        <span
                                            className="text-[9px] font-mono tracking-widest text-accent block uppercase">KESSEBÖHMER BUILT-IN ACCESSORIES STRUCTURES</span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {item.accessoriesDetail.map((acc, aIdx) => (
                                                <div key={aIdx} className="space-y-2">
                                                    <h6 className="font-mono text-[11px] font-bold text-ink uppercase">{acc.name}</h6>
                                                    <div
                                                        className="text-[10px] bg-surface-alt/30 p-3 rounded-lg border border-ink/5">
                                                        <ul className="list-disc list-inside space-y-1 text-muted">
                                                            {acc.specs.map((s, sIdx) => <li key={sIdx}
                                                                                            className="font-light">{s}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "heritage" && (
                            <div className="bg-panel-glass rounded-2xl border border-ink/5 p-6 sm:p-10 space-y-8">
                                <div className="max-w-3xl">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Sparkles className="w-4 h-4 text-accent animate-pulse"/>
                                        <span
                                            className="text-[9px] font-mono tracking-widest text-accent uppercase font-semibold">CRAFT INTEGRITY SEAL</span>
                                    </div>
                                    <h4 className="font-serif text-2xl font-light text-headline leading-snug mb-4">Architectural
                                        Honesty and Spatial Silence</h4>
                                    <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-6">
                                        Each ZAAD object represents a rigorous response of quiet luxury against
                                        dynamic trends. Organized symmetrically across heavy, grounded natural
                                        travertine/rapolano stone cores and durable eucalyptus veneers, the design
                                        relies strictly on authentic physical materials to establish spiritual calm
                                        within the domestic landscape.
                                    </p>
                                </div>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ink/10 text-xs">
                                    <div className="space-y-1.5 p-5 bg-surface-alt/20 rounded-xl">
                                        <h5 className="font-mono text-[10px] font-bold text-accent uppercase">THE RAW
                                            STONE CURATION</h5>
                                        <p className="text-muted leading-relaxed font-light">Milled, shaped, and
                                            completed directly inside Tuscan quarries under Carrara. All limestone,
                                            travertine, and onyx blocks are hand-polished using natural acid-free waxes
                                            to maintain historic texture honesty.</p>
                                    </div>
                                    <div className="space-y-1.5 p-5 bg-surface-alt/20 rounded-xl">
                                        <h5 className="font-mono text-[10px] font-bold text-accent uppercase font-semibold">EUCALYPTUS
                                            VENEERS AND SADDLE LEATHER</h5>
                                        <p className="text-muted leading-relaxed font-light">Natural eucalyptus
                                            heartwoods overlaid at 22mm onto water-resistant structural cores.
                                            Accompanied by solid patinated brass and iron hardware cylinders wrapped in
                                            genuine Italian saddle leathers.</p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-accent justify-center pt-6">
                                    <ShieldCheck className="w-4 h-4"/>
                                    <span>ISSUED CERTIFICATE OF PROVENANCE SIGNED BY THE MASTER DESIGNER</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 5. Direct Inquire CTA Footer Box */}
            <div
                className="bg-surface-alt bg-surface-alt rounded-2xl p-8 md:p-12 border border-ink/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none"/>
                <span className="text-[10px] font-mono tracking-[0.3em] text-accent uppercase block mb-3 font-semibold">ACQUISITION PRIVILEGES</span>
                <h3 className="font-serif text-2xl md:text-4xl text-headline font-light tracking-tight max-w-2xl leading-snug mb-4">
                    Establish an Archetype of Permanent Symmetry inside Your Home
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-xl font-light mb-8 leading-relaxed">
                    Through ZAAD concierge services, each bespoke order is supervised from stone selection at
                    the quarry to local installation by master technicians.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <MaisonButton variant="solid" onClick={() => onInquire(item)}
                                  className="!px-8 !py-3.5 text-xs font-semibold">
                        {t("productInitiateInquiry")}
                    </MaisonButton>
                    <MaisonButton variant="outline" onClick={onBack}
                                  className="text-[10px] font-mono tracking-widest text-muted px-6 py-3">
                        {t("productReturnGrid")}
                    </MaisonButton>
                </div>
            </div>

            {/* Cinematic Image Lightbox Viewer */}
            <AnimatePresence>
                {isEnlarged && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
                        className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6 md:p-16 cursor-zoom-out group/lightbox"
                        style={{backgroundColor: "var(--bg-card-95)"}}
                        onClick={closeLightbox}
                    >
                        <div
                            className="absolute top-6 left-6 md:left-12 flex items-center space-x-4 pointer-events-none select-none">
                            <span
                                className="font-mono text-[9px] tracking-[0.3em] font-semibold text-accent uppercase">{item.number} ARCHIVE</span>
                            <span className="text-[var(--text-secondary)] opacity-30">•</span>
                            <span
                                className="font-serif italic text-xs text-[var(--text-primary)] select-none">{item.name}</span>
                            <span className="text-[var(--text-secondary)] opacity-30">•</span>
                            <span
                                className="font-mono text-[9px] tracking-widest text-accent">{activeImageIndex + 1} OF {item.images.length}</span>
                        </div>

                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 md:right-12 group flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] px-4 py-2 rounded-full font-mono text-[8px] tracking-[0.2em] transition-all duration-300 z-50 cursor-pointer"
                        >
                            <span>CLOSE</span>
                            <X className="w-3.5 h-3.5 stroke-[1.25] transition-transform group-hover:rotate-90 duration-300"/>
                        </button>

                        <div
                            className="relative max-w-[90vw] md:max-w-[80vw] max-h-[66vh] md:max-h-[70vh] flex items-center justify-center p-1 rounded-sm overflow-hidden select-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxScale((prev) => (prev > 1 ? 1 : 2.0));
                            }}
                            onMouseMove={handleLightboxMouseMove}
                            onTouchMove={handleLightboxTouchMove}
                            style={{cursor: lightboxScale > 1 ? "crosshair" : "zoom-in"}}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrevWrapped();
                                }}
                                className="absolute -left-2 md:-left-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div
                                    className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:-translate-x-1 shadow-md">
                                    <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]"/>
                                    <span
                                        className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">PREV</span>
                                </div>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNextWrapped();
                                }}
                                className="absolute -right-2 md:-right-24 top-1/2 -translate-y-1/2 group flex items-center text-[var(--text-primary)] cursor-pointer z-50 select-none py-4 px-2"
                            >
                                <div
                                    className="flex items-center space-x-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color-15)] py-2 px-3.5 rounded-full transition-all duration-300 transform group-hover:translate-x-1 shadow-md">
                                    <span
                                        className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-[var(--text-secondary)] select-none">NEXT</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[1.2]"/>
                                </div>
                            </button>

                            {isLightboxLoading && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: [0.35, 0.7, 0.35]}}
                                        transition={{repeat: Infinity, duration: 1.5, ease: "easeInOut"}}
                                        className="font-mono text-[8.5px] tracking-[0.4em] text-accent bg-[var(--bg-card-95)] px-4 py-2 rounded-sm border border-[var(--border-color-10)]"
                                    >
                                        RESOLVING SPECIMEN DETAIL...
                                    </motion.div>
                                </div>
                            )}

                            <AnimatePresence mode="popLayout">
                                <motion.img
                                    key={activeImageIndex}
                                    initial={{opacity: 0, scale: 0.95}}
                                    animate={{
                                        opacity: isLightboxLoading ? 0 : 1,
                                        scale: isLightboxLoading ? 0.95 : lightboxScale > 1 ? lightboxScale : 1,
                                    }}
                                    exit={{opacity: 0, scale: 0.97}}
                                    transition={{
                                        opacity: {duration: 0.5, ease: [0.16, 1, 0.3, 1]},
                                        scale: {duration: 0.45, ease: [0.16, 1, 0.3, 1]},
                                    }}
                                    onLoad={markImageLoaded}
                                    src={item.images[activeImageIndex]?.url}
                                    alt={item.name}
                                    style={{transformOrigin: lightboxScale > 1 ? `${lightboxPan.x}% ${lightboxPan.y}%` : "center"}}
                                    className="object-contain max-h-[62vh] md:max-h-[66vh] max-w-[85vw] md:max-w-[75vw] block rounded-sm shadow-2xl border border-[var(--border-color-15)] transition-shadow duration-300"
                                    referrerPolicy="no-referrer"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Floating Zoom Controller */}
                        <motion.div
                            onMouseEnter={() => setIsZoomControllerHovered(true)}
                            onMouseLeave={() => setIsZoomControllerHovered(false)}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-28 md:bottom-24 left-6 sm:left-10 md:left-12 lg:left-16 z-50 pointer-events-auto flex items-center bg-panel/75   border border-ink/10 rounded-full h-11 p-1.5 shadow-card-lg select-none opacity-0 group-hover/lightbox:opacity-100 focus-within:opacity-100 transition-opacity duration-300"
                            animate={{width: isZoomControllerHovered ? 290 : 44}}
                            transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
                        >
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cycleZoom();
                                }}
                                className="w-8 h-8 rounded-full border border-ink/10 relative overflow-hidden flex items-center justify-center cursor-pointer shrink-0 z-10 bg-transparent"
                                title="Cycle zoom level"
                                animate={{
                                    rotate:
                                        (Math.abs(lightboxScale - 1.0) < 0.1 ? 0 : Math.abs(lightboxScale - 1.8) < 0.2 ? 120 : 240) +
                                        (isZoomControllerHovered ? 180 : 0),
                                }}
                                transition={{duration: 0.95, ease: [0.16, 1, 0.3, 1]}}
                                whileTap={{scale: 0.92}}
                            >
                                <div className="absolute inset-0 bg-transparent flex">
                                    <div className="w-1/2 h-full bg-ink/12"/>
                                    <div className="w-1/2 h-full bg-transparent"/>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-accent z-10"/>
                            </motion.button>

                            <motion.div
                                className="flex items-center pl-3 pr-2 border-l border-ink/10 mr-1 shrink-0 overflow-hidden"
                                animate={{
                                    opacity: isZoomControllerHovered ? 1 : 0,
                                    x: isZoomControllerHovered ? 0 : 15
                                }}
                                transition={{
                                    duration: 0.45,
                                    delay: isZoomControllerHovered ? 0.05 : 0,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                style={{pointerEvents: isZoomControllerHovered ? "auto" : "none"}}
                            >
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goPrevWrapped();
                                        }}
                                        className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer"
                                        title="Previous Image"
                                    >
                                        <ChevronLeft className="w-4 h-4 stroke-[1.5]"/>
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        {[1.0, 1.8, 3.0].map((preset) => {
                                            const isActive = Math.abs(lightboxScale - preset) < 0.1;
                                            return (
                                                <button
                                                    key={preset}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setLightboxScale(preset);
                                                    }}
                                                    className={`px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] rounded-full transition-all cursor-pointer ${isActive ? "bg-accent text-white font-semibold shadow-sm" : "text-ink/60 dark:text-muted hover:text-headline"}`}
                                                >
                                                    {preset.toFixed(1)}X
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goNextWrapped();
                                        }}
                                        className="text-ink/60 hover:text-headline p-1 transition-colors cursor-pointer"
                                        title="Next Image"
                                    >
                                        <ChevronRight className="w-4 h-4 stroke-[1.5]"/>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        {lightboxScale > 1 && (
                            <span
                                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[7.5px] tracking-[0.2em] font-mono text-accent/95 font-medium uppercase select-none animate-pulse pointer-events-none whitespace-nowrap z-50">
                [ Touch-drag or hover over image to pan texture detail ]
              </span>
                        )}

                        <motion.div
                            initial={{opacity: 0, y: 15}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
                            className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-center justify-between pointer-events-auto bg-transparent border-t border-[var(--border-color-10)] pt-4 w-auto max-w-5xl mx-auto z-40 gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="flex items-center space-x-2.5">
                                    <span
                                        className="font-serif text-[15px] italic text-[var(--text-primary)] font-light">{item.name}</span>
                                    <span className="text-[var(--text-secondary)] opacity-30">•</span>
                                    <span
                                        className="text-[var(--text-secondary)] opacity-80 text-[8.5px] font-mono tracking-[0.2em] uppercase">ENLARGED PERSPECTIVE</span>
                                </div>
                                <p className="text-[9.5px] text-[var(--text-secondary)] opacity-55 font-mono mt-0.5 tracking-[0.1em] uppercase">
                                    {item.images[activeImageIndex]?.caption || `Perspective View`}
                                </p>
                            </div>
                            <div
                                className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <span
                    className="text-accent font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 font-medium select-none">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"/>
                  MUSEUM SPECIMEN COMMISSION
                </span>
                                <MaisonButton
                                    variant="outline"
                                    onClick={() => {
                                        closeLightbox();
                                        onInquire(item);
                                    }}
                                    className="!px-4 !py-1.5 !text-[8.5px] !tracking-[0.25em] !rounded-full !bg-transparent border-[var(--border-color-15)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] shadow-sm"
                                >
                                    INQUIRE ACQUISITION
                                </MaisonButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
