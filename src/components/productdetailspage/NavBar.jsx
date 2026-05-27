import React, { memo } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

const NavBar = memo(function NavBar({ item, itemTrans, t, onBack }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6 mb-8 sm:mb-12">
            <button
                onClick={onBack}
                className="group flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono tracking-widest text-muted hover:text-headline transition-colors duration-300 focus:outline-none cursor-pointer"
            >
                <motion.span
                    className="inline-block rtl:rotate-180"
                    animate={{ x: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                </motion.span>
                <span>{t("productReturnShowroom")}</span>
            </button>

            <div className="flex items-center space-x-2 rtl:space-x-reverse text-[10px] font-mono tracking-widest uppercase">
                <span className="text-muted opacity-60">{t("productZAADArchive")}</span>
                <span className="text-accent font-semibold">{item.number}</span>
                <span className="text-muted opacity-60">/</span>
                <span className="text-ink font-medium">
                    {itemTrans?.name || item.name} {t("productDirectory")}
                </span>
            </div>
        </div>
    );
});

export default NavBar;
