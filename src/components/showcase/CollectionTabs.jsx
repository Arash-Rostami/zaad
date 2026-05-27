import React from "react";
import { motion } from "motion/react";
import MaisonReveal from "../MaisonReveal";

export default function CollectionTabs({ collection, selectedItem, selectItem, getItemTranslations, t }) {
    return (
        <MaisonReveal variant="unveil" threshold={0.05}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-ink/10">
                <div>
                    <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-3">
                        {t("showcaseBadge")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-ink tracking-tight font-light">
                        {t("showcaseTitle")}
                    </h2>
                </div>
                <p className="text-xs font-mono text-muted max-w-xs mt-4 md:mt-0 leading-relaxed uppercase opacity-85">
                    {t("showcaseCatalogueDesc")}
                </p>
            </div>

            <div className="flex justify-center items-center space-x-6 sm:space-x-10 md:space-x-16 border-b border-ink/10 pb-0 mb-16 mx-auto w-full flex-wrap gap-y-4">
                {collection.map((item) => {
                    const isActive = selectedItem.id === item.id;
                    const itemTrans = getItemTranslations(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => selectItem(item)}
                            className="group relative pb-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer focus:outline-none shrink-0"
                        >
                            <span className={`text-xs md:text-sm font-serif italic tracking-wider mb-2 transition-all duration-300 ${isActive ? "text-accent font-semibold scale-110" : "text-muted/40 text-headline/30 group-hover:text-accent"}`}>
                                {item.number}
                            </span>
                            <span className={`text-base sm:text-lg md:text-xl font-mono tracking-[0.3em] uppercase transition-colors duration-300 ${isActive ? "text-ink font-semibold" : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"}`}>
                                {itemTrans?.name || item.name}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeArchetypeTabLine"
                                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </MaisonReveal>
    );
}
