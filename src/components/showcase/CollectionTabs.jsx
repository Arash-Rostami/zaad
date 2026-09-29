import React, { memo, useCallback } from "react";
import { motion } from "motion/react";
import MaisonReveal from "../shared/MaisonReveal";

const TAB_LINE_TRANSITION = Object.freeze({
    type: "spring",
    stiffness: 350,
    damping: 30,
});

const TabButton = memo(function TabButton({ item, isActive, onSelect }) {
    const handleClick = useCallback(() => {
        onSelect?.(item);
    }, [onSelect, item]);

    const nameClassName = `text-base sm:text-lg md:text-xl font-serif uppercase transition-colors duration-300 ${
        isActive
            ? "text-ink font-semibold"
            : "text-muted/50 dark:text-muted/50 group-hover:text-ink dark:group-hover:text-white"
    }`;

    return (
        <button
            type="button"
            onClick={handleClick}
            className="group relative pb-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shrink-0"
        >
            <span className={nameClassName}>
                {item?.name}
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeArchetypeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent"
                    transition={TAB_LINE_TRANSITION}
                />
            )}
        </button>
    );
});

function CollectionTabs({ collection, selectedItem, selectItem, t }) {
    const selectedId = selectedItem?.id;

    return (
        <>
            <MaisonReveal variant="unveil" delay={0.1} threshold={0.01}>
                <span className="text-[length:calc(11px*var(--zaad-font-scale))] sm:text-xs font-mono text-accent font-semibold uppercase block mb-1">
                    {t("collectionsLabel")}
                </span>
            </MaisonReveal>
            <MaisonReveal variant="lines" delay={0.3} threshold={0.01}>
                <h2 className="text-2xl md:text-3xl font-serif text-ink tracking-tight font-light mb-1 text-glow-subtle">
                    {t("showcaseTitle")}
                </h2>
            </MaisonReveal>
            <MaisonReveal variant="unveil" delay={0.5} threshold={0.01}>
                <p className="text-sm md:text-base text-muted font-light leading-relaxed max-w-xl mb-6 md:mb-8">
                    {t("showcaseCatalogueDesc")}
                </p>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.45} threshold={0.01}>
                <div className="flex justify-center items-center space-x-6 sm:space-x-10 md:space-x-16 border-b border-ink/10 pb-0 mb-16 mx-auto w-full flex-wrap gap-y-4">
                    {Array.isArray(collection) &&
                        collection.map((item) => (
                            <TabButton
                                key={item.id}
                                item={item}
                                isActive={selectedId === item.id}
                                onSelect={selectItem}
                            />
                        ))}
                </div>
            </MaisonReveal>
        </>
    );
}

export default memo(CollectionTabs);