import React, { memo } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import MaisonReveal from "../shared/MaisonReveal";

const NavBar = memo(function NavBar({ t, onBack }) {
    return (
        <MaisonReveal variant="unveil" delay={0.1} threshold={0.01} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6 mb-8 sm:mb-12">
            <button
                onClick={onBack}
                data-touch-boost
                className="group flex items-center space-x-3 text-xs font-mono text-muted hover:text-headline transition-colors duration-300 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer"
            >
                <motion.span
                    className="inline-block"
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                </motion.span>
                <span>{t("productReturnShowroom")}</span>
            </button>
        </MaisonReveal>
    );
});

export default NavBar;
