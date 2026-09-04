"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailsPage from "@/components/ProductDetailsPage";
import ScrollButton from "@/components/shared/ScrollButton";
import useLenisScroll from "@/hooks/useLenisScroll";

export default function ProductPageClient({ item }) {
    useLenisScroll();
    const router = useRouter();

    const setActiveTab = (tab) => {
        if (tab === "pdf") {
            window.open("/showcase/index.html", "_blank", "noopener,noreferrer");
            return;
        }
        router.push("/");
    };

    const onScrollToSection = (sectionId) => {
        router.push(`/#${sectionId}`);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between selection:bg-selection selection:text-ink">
            <Header
                activeTab="showroom"
                setActiveTab={setActiveTab}
                selectedProduct={item}
                onSelectProduct={(product) => router.push(product ? `/collection/${product.id}` : "/")}
                onScrollToSection={onScrollToSection}
            />

            <main className="flex-1">
                <ProductDetailsPage
                    item={item}
                    onBack={() => router.back()}
                    onInquire={() => router.push("/#concierge")}
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
