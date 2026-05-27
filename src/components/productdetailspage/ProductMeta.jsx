import React, { memo } from "react";
import { Calendar, MapPin, Scale } from "lucide-react";
import MaisonButton from "../MaisonButton";
import MaisonReveal from "../MaisonReveal";

const ProductMeta = memo(function ProductMeta({ item, itemTrans, t, onInquire, onBack }) {
    return (
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
                    {t("productZAAD")} {item.year} {t("productRelease")}
                </p>

                <p className="text-sm md:text-base font-light text-ink leading-relaxed mb-8">
                    {itemTrans?.description || item.description}
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-surface-alt rounded-xl p-5 border border-ink/5 mb-8 text-xs">
                    <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">{t("productOrigin")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                            {itemTrans?.origin || item.specifications.origin}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">{t("productZAADWeight")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <Scale className="w-3.5 h-3.5 text-accent shrink-0" />
                            {item.specifications.weight}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">{t("productFinish")}</span>
                        <span className="font-light text-ink">{itemTrans?.finish || item.specifications.finish}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-wider text-muted block uppercase">{t("productLeadTime")}</span>
                        <span className="font-light text-ink flex items-center gap-1.5 justify-start">
                            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
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
    );
});

export default ProductMeta;
