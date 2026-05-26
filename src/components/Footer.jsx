"use client";

import {useLanguage} from "@/services/TranslationService";

export default function Footer({onScrollToSection, setActiveTab}) {
    const {t} = useLanguage();
    return (
        <footer
            className="bg-foundation text-canvas pt-16 pb-12 px-6 sm:px-12 border-t border-foundation text-left rtl:text-right">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-canvas/10 pb-12 mb-12">
                    {/* Brand Col */}
                    <div className="md:col-span-6">
                        <h3 className="text-xl md:text-3xl font-serif tracking-[0.35em] uppercase font-semibold text-canvas mb-4">
                            ZAAD
                        </h3>
                        <p className="text-xs text-canvas/60 leading-relaxed max-w-sm font-light uppercase tracking-wider">
                            {t("footerBrandDesc")}
                        </p>
                    </div>

                    {/* Nav Directory */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                            {t("footerShowroomDir")}
                        </h4>
                        <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveTab("showroom");
                                        setTimeout(() => onScrollToSection("story"), 100);
                                    }}
                                    className="hover:text-accent transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                                >
                                    {t("footerPhilosophy")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveTab("showroom");
                                        setTimeout(() => onScrollToSection("collection"), 100);
                                    }}
                                    className="hover:text-accent transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                                >
                                    {t("footerCollection")}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveTab("showroom");
                                        setTimeout(() => onScrollToSection("concierge"), 100);
                                    }}
                                    className="hover:text-accent transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                                >
                                    {t("footerConcierge")}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Blueprints and specs */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-mono tracking-widest text-canvas/40 uppercase mb-4">
                            {t("footerBlueprintTitle")}
                        </h4>
                        <ul className="space-y-3 text-xs uppercase tracking-widest text-canvas/80 font-mono">
                            <li>
                                <button
                                    onClick={() => setActiveTab("blueprint")}
                                    className="hover:text-accent transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                                >
                                    {t("footerBlueprintLink")}
                                </button>
                            </li>
                            <li>
                <span className="text-canvas/40 block select-none">
                  {t("footerMilanAtelier")}
                </span>
                            </li>
                            <li>
                <span className="text-canvas/40 block select-none">
                  {t("footerRapolanoStone")}
                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom copyright indicators */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-canvas/40 tracking-widest uppercase">
                    <div className="text-center sm:text-left rtl:sm:text-right">
                        {t("footerCopyright")}
                    </div>
                    <div className="mt-4 sm:mt-0 text-center sm:text-right rtl:sm:text-left">
                        {t("footerCraft")}
                    </div>
                </div>
            </div>
        </footer>
    );
}
