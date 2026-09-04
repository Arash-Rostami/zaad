"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useLenisScroll from "@/hooks/useLenisScroll";
import { animateScrollToTop } from "@/services/ScrollService";

export default function HouseSmoothScroll() {
    useLenisScroll();
    const pathname = usePathname();

    useEffect(() => {
        animateScrollToTop(900);
    }, [pathname]);

    return null;
}
