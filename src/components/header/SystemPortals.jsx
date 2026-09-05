import React, { memo } from "react";
import { ChevronRight } from "lucide-react";
import NoiseBg from "../shared/NoiseBg";

const PortalCard = memo(function PortalCard({ label, sub, isActive, onClick, filterId }) {
    return (
        <button
            onClick={onClick}
            className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer active:scale-[0.98] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex flex-col justify-center min-h-[58px] overflow-hidden ${
                isActive ? "bg-surface-alt border-[#C5A059]/50 shadow-sm font-semibold" : "border-ink/5 hover:border-[#C5A059]/60 bg-panel"
            }`}
        >
            <NoiseBg filterId={filterId} revealOnHover />
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/15 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <div className="flex justify-between items-center w-full relative z-10">
                <span className="text-base font-serif font-farsi text-headline font-semibold group-hover:-translate-y-0.5 transition-transform duration-300">
                    {label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-accent group-hover:text-[#C5A059] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
            </div>
            <span className="text-[length:calc(11px*var(--zaad-font-scale))] rtl:text-[length:calc(12.5px*var(--zaad-font-scale))] text-muted font-light mt-0.5 leading-none relative z-10 group-hover:text-[#C5A059] transition-colors duration-300">
                {sub}
            </span>
        </button>
    );
});

const SystemPortals = memo(function SystemPortals({
    t,
    activeTab,
    selectedProduct,
    onShowroom,
    onBlueprint,
}) {
    return (
        <div className="md:col-span-4 flex flex-col space-y-2">
            <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 pb-1 mb-0.5 text-left rtl:text-right">
                {t("menuSystemDirectories")}
            </span>
            <PortalCard
                label={t("menuHouseOfZAAD")}
                sub={t("menuHouseOfZAADPortalSub")}
                isActive={activeTab === "showroom" && !selectedProduct}
                onClick={onShowroom}
                filterId="portalNoiseHouse"
            />
            <PortalCard
                label={t("menuZAADCatalogue")}
                sub={t("menuZAADCatalogueSub")}
                isActive={activeTab === "pdf"}
                onClick={onBlueprint}
                filterId="portalNoiseCatalogue"
            />
        </div>
    );
});

export default SystemPortals;