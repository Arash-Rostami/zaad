import HouseSmoothScroll from "@/components/house/HouseSmoothScroll";
import HouseChrome from "@/components/house/HouseChrome";
import Footer from "@/components/Footer";
import ScrollButton from "@/components/shared/ScrollButton";

export default function HouseLayout({ children }) {
    return (
        <>
            <HouseSmoothScroll />
            <HouseChrome />
            <main>{children}</main>
            <Footer />
            <ScrollButton />
        </>
    );
}