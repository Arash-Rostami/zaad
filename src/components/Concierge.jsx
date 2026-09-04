"use client";

import { useLanguage } from "@/services/TranslationService";
import useConcierge from "../hooks/useConcierge";
import SectionHeader from "./concierge/SectionHeader";
import InquiryForm from "./concierge/InquiryForm";
import CuratorChat from "./concierge/CuratorChat";

export default function Concierge({ preselectedItem, onClearPreselected }) {
    const { t, language } = useLanguage();
    const concierge = useConcierge({ language, preselectedItem, onClearPreselected, t });

    return (
        <section
            id="concierge"
            className="section-y-break bg-surface px-6 sm:px-12 border-b border-ink/10 relative"
        >
            <div className="max-w-7xl mx-auto">
                <SectionHeader t={t} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-18 relative">
                    <InquiryForm concierge={concierge} t={t} language={language} />
                    <CuratorChat concierge={concierge} t={t} language={language} />
                </div>
            </div>
        </section>
    );
}
