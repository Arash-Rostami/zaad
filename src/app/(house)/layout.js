import HouseSmoothScroll from "@/components/house/HouseSmoothScroll";
import HouseChrome from "@/components/house/HouseChrome";
import HouseFooter from "@/components/house/HouseFooter";
import ScrollButton from "@/components/shared/ScrollButton";

export default function HouseLayout({ children }) {
    return (
        <>
            <HouseSmoothScroll />
            <HouseChrome />
            <main>{children}</main>
            <HouseFooter />
            <ScrollButton />
        </>
    );
}