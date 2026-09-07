"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusScreen from "@/components/shared/StatusScreen";
import { useLanguage } from "@/services/LanguageProvider";

export default function Error({ error, reset }) {
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <StatusScreen
            eyebrow={t("errorEyebrow")}
            title={t("errorTitle")}
            desc={t("errorDesc")}
            primaryLabel={t("errorRetry")}
            onPrimary={reset}
            secondaryLabel={t("notFoundCta")}
            onSecondary={() => router.push("/")}
        />
    );
}
