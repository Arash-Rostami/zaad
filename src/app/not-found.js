"use client";

import { useRouter } from "next/navigation";
import StatusScreen from "@/components/shared/StatusScreen";
import { useLanguage } from "@/services/LanguageProvider";

export default function NotFound() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <StatusScreen
            eyebrow={t("notFoundEyebrow")}
            title={t("notFoundTitle")}
            desc={t("notFoundDesc")}
            primaryLabel={t("notFoundCta")}
            onPrimary={() => router.push("/")}
        />
    );
}
