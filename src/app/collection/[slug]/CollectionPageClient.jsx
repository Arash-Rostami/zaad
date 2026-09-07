"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionPage from "@/components/CollectionPage";
import ScrollButton from "@/components/shared/ScrollButton";
import useLenisScroll from "@/hooks/useLenisScroll";
import { setPreference } from "@/services/PreferenceService";

export default function CollectionPageClient({ item }) {
    useLenisScroll();
    const router = useRouter();

    const goHome = useCallback(
        (hash) => router.push(hash ? `/#${hash}` : "/"),
        [router]
    );

    const setActiveTab = useCallback(() => {}, []);

    const onScrollToSection = useCallback(
        (sectionId) => goHome(sectionId),
        [goHome]
    );

    const onSelectProduct = useCallback(
        (product) => router.push(product ? `/collection/${product.id}` : "/"),
        [router]
    );

    const onBack = useCallback(() => router.back(), [router]);

    const onInquire = useCallback(
        (inquireItem) => {
            setPreference("pendingInquiryItem", {
                id: inquireItem.id,
                name: inquireItem.name,
                number: inquireItem.number,
            });
            goHome("concierge");
        },
        [goHome]
    );

    return (
        <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
            <Header
                activeTab="showroom"
                setActiveTab={setActiveTab}
                selectedProduct={item}
                onSelectProduct={onSelectProduct}
                onScrollToSection={onScrollToSection}
            />

            <main className="flex-1">
                <CollectionPage
                    item={item}
                    onBack={onBack}
                    onInquire={onInquire}
                />
            </main>

            <Footer
                onScrollToSection={onScrollToSection}
                setActiveTab={setActiveTab}
                onSelectProduct={onSelectProduct}
            />

            <ScrollButton />
        </div>
    );
}