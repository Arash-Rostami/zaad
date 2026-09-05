"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailsPage from "@/components/ProductDetailsPage";
import ScrollButton from "@/components/shared/ScrollButton";
import useLenisScroll from "@/hooks/useLenisScroll";

export default function ProductPageClient({ item }) {
    useLenisScroll();
    const router = useRouter();

    const setActiveTab = useCallback(
        (tab) => {
            if (tab === "pdf") {
                window.open("/showcase/index.html", "_blank", "noopener,noreferrer");
                return;
            }
            router.push("/");
        },
        [router]
    );

    const onScrollToSection = useCallback(
        (sectionId) => {
            router.push(`/#${sectionId}`);
        },
        [router]
    );

    const onSelectProduct = useCallback(
        (product) => router.push(product ? `/collection/${product.id}` : "/"),
        [router]
    );

    const onBack = useCallback(() => router.back(), [router]);
    const onInquire = useCallback(() => router.push("/#concierge"), [router]);

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
                <ProductDetailsPage
                    item={item}
                    onBack={onBack}
                    onInquire={onInquire}
                />
            </main>

            <Footer
                onScrollToSection={onScrollToSection}
                setActiveTab={setActiveTab}
            />

            <ScrollButton />
        </div>
    );
}