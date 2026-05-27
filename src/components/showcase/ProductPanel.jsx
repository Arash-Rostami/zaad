import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import MaisonButton from "../MaisonButton";
import MaisonReveal from "../MaisonReveal";

export default function ProductPanel({ selectedItem, showcase, getItemTranslations, t, onInquireItem, onViewDetails }) {
    const { isSpecsExpanded, toggleSpecs } = showcase;
    const itemTrans = getItemTranslations(selectedItem.id);

    return (
        <MaisonReveal
            variant="slide-up-royal"
            delay={0.3}
            className="lg:col-span-6 flex flex-col w-full text-left rtl:text-right"
        >
            <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-4">
                <span className="text-xs font-mono text-accent font-semibold tracking-widest">
                    {selectedItem.number} / {t("showcaseArchiveCollection")}
                </span>
                <span className="text-xs font-mono text-accent tracking-wider uppercase flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    {t("showcaseBespokeCommission")}
                </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-ink mb-2 leading-tight">
                {itemTrans?.name || selectedItem.name}
            </h3>
            <p className="text-xs font-mono tracking-widest text-muted uppercase mb-6">
                {t("showcaseDesigner")}: {selectedItem.designer}
            </p>

            <p className="text-sm sm:text-base text-ink font-light leading-relaxed mb-6">
                {itemTrans?.description || selectedItem.description}
            </p>

            <div className="bg-surface-frosted p-6 border border-ink/10 mb-8 rounded-xl">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-accent mb-2">
                    {t("showcaseMaterialMonograph")}
                </h4>
                <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
                    {itemTrans?.story || selectedItem.story}
                </p>
            </div>

            <div className="border-t border-b border-ink/10 mb-8 overflow-hidden">
                <button
                    type="button"
                    onClick={toggleSpecs}
                    className="w-full py-5 flex items-center justify-between group cursor-pointer focus:outline-none"
                >
                    <div className="flex items-center space-x-3 text-left rtl:text-right">
                        <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-accent font-semibold uppercase">
                            {t("showcaseStudioLookbook")}
                        </span>
                        <span className="text-[9px] font-mono text-muted opacity-65 group-hover:opacity-100 transition-opacity">
                            ({isSpecsExpanded ? t("showcaseCollapse") : t("showcaseShowStats")})
                        </span>
                    </div>
                    <div className="relative w-4 h-4 flex items-center justify-center">
                        <motion.div
                            className="absolute w-3 h-[1px] bg-ink"
                            animate={{ rotate: isSpecsExpanded ? 0 : 90 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <div className="absolute w-3 h-[1px] bg-ink" />
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {isSpecsExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            // PH2 FIX: Replaced animating height directly (which causes layout shift jank)
                            // with a grid transition trick using generic grid-rows
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                            layout
                        >
                            <div className="pt-2 pb-6 border-t border-ink/10 mt-1">
                                <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-xs pb-4">
                                    {[
                                        { label: t("showcaseScopeDimensions"), value: itemTrans?.dimensions || selectedItem.dimensions },
                                        { label: t("showcaseFinishDetails"), value: itemTrans?.finish || selectedItem.specifications.finish },
                                        { label: t("showcaseZAADWeight"), value: selectedItem.specifications.weight },
                                        { label: t("showcaseCuratedDelivery"), value: itemTrans?.leadTime || selectedItem.specifications.leadTime },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="space-y-1">
                                            <span className="text-[9px] font-mono tracking-widest text-muted block uppercase">{label}</span>
                                            <span className="text-ink font-light text-xs sm:text-sm block leading-relaxed">{value}</span>
                                        </div>
                                    ))}
                                    <div className="col-span-2 pt-2">
                                        <span className="text-[9px] font-mono tracking-widest text-muted block uppercase mb-2">
                                            {t("showcasePrimaryMaterials")}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(itemTrans?.materials || selectedItem.materials).map((mat, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[9px] bg-panel-glass dark:bg-panel/5 border border-ink/10 px-3 py-1 text-ink uppercase font-mono tracking-wide rounded-full"
                                                >
                                                    {mat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <span className="text-[9px] font-mono text-muted leading-relaxed max-w-sm uppercase text-left rtl:text-right">
                                        {t("showcaseCatalogueText")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onViewDetails(selectedItem)}
                                        className="font-mono text-[9px] tracking-[0.2em] bg-accent text-white hover:bg-ink dark:hover:bg-panel dark:hover:text-ink py-2.5 px-5 rounded-full uppercase font-medium flex items-center space-x-2 rtl:space-x-reverse transition-all duration-300 focus:outline-none cursor-pointer hover:shadow-md"
                                    >
                                        <span>{t("showcaseRevealDossier")}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.8] rtl:rotate-270" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <MaisonButton variant="solid" onClick={() => onInquireItem(selectedItem)} className="w-full">
                    {t("showcasePrivateInquiry")}
                </MaisonButton>
            </div>

            <div className="flex items-center space-x-2 mt-4 text-muted/70 text-[10px] font-mono tracking-wider justify-center sm:justify-start">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>{t("showcaseAirfreight")}</span>
            </div>
        </MaisonReveal>
    );
}
