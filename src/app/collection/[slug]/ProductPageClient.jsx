"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailsPage from "@/components/ProductDetailsPage";

export default function ProductPageClient({ item }) {
    const router = useRouter();

    const setActiveTab = (tab) => {
        if (tab === "pdf") {
            window.open("/pdf/index.html", "_blank", "noopener,noreferrer");
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
                onSelectProduct={(product) => router.push(`/collection/${product.id}`)}
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
        </div>
    );
}
