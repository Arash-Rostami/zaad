import React, { memo } from "react";
import { ChevronRight } from "lucide-react";

const SpecimenGrid = memo(function SpecimenGrid({ collection, selectedProduct, getItemTranslations, t, onSelect }) {
    return (
        <div className="md:col-span-12 flex flex-col space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuCuratedSpecimens")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {collection.map((item) => {
                    const isActive = selectedProduct?.id === item.id;
                    const translatedItem = getItemTranslations(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-between min-h-[140px] overflow-hidden ${
                                isActive
                                    ? "bg-surface-alt border-[#C5A059]/50 font-semibold shadow-md"
                                    : "border-ink/10 hover:border-[#C5A059]/60 bg-panel hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="flex justify-end w-full relative z-10">
                                <span className="text-xs font-mono tracking-widest text-accent/80 group-hover:text-[#C5A059] transition-colors duration-300">
                                    {item.number}
                                </span>
                            </div>
                            <div className="flex flex-col mt-6 relative z-10">
                                <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                                    {translatedItem?.name || item.name}
                                </span>
                                <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">
                                        {t("menuView")}
                                    </span>
                                    <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

export default SpecimenGrid;
