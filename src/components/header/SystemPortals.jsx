import React, { memo } from "react";
import { ChevronRight } from "lucide-react";

function PortalCard({ label, sub, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`group relative text-left rtl:text-right p-2.5 border transition-all duration-500 rounded-lg cursor-pointer flex flex-col justify-center min-h-[58px] overflow-hidden ${
                isActive ? "bg-surface-alt border-[#C5A059]/50 shadow-sm font-semibold" : "border-ink/5 hover:border-[#C5A059]/60 bg-panel"
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex justify-between items-center w-full relative z-10">
                <span className="text-md font-serif text-headline font-semibold group-hover:-translate-y-0.5 transition-transform duration-300">
                    {label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-accent group-hover:text-[#C5A059] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
            </div>
            <span className="text-[11px] text-muted font-light mt-0.5 leading-none relative z-10 group-hover:text-[#C5A059] transition-colors duration-300">
                {sub}
            </span>
        </button>
    );
}

const SystemPortals = memo(function SystemPortals({ t, activeTab, selectedProduct, onShowroom, onBlueprint }) {
    return (
        <div className="md:col-span-4 flex flex-col space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuSystemDirectories")}
            </span>
            <PortalCard
                label={t("menuLivingShowroom")}
                sub={t("menuLivingShowroomSub")}
                isActive={activeTab === "showroom" && !selectedProduct}
                onClick={onShowroom}
            />
            <PortalCard
                label={t("menuZAADBlueprints")}
                sub={t("menuZAADBlueprintsSub")}
                isActive={activeTab === "blueprint"}
                onClick={onBlueprint}
            />
        </div>
    );
});

export default SystemPortals;
