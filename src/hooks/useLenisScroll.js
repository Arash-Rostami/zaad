import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSmoothScroll, unregisterSmoothScroll } from "@/services/ScrollService";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const LENIS_EASE = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function useLenisScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let lenis = null;
        let disposed = false;
        const ticker = (time) => lenis && lenis.raf(time * 1000);
        import("lenis").then(({ default: Lenis }) => {
            if (disposed) return;
            lenis = new Lenis({
                duration: 1.35,
                easing: LENIS_EASE,
                smoothWheel: true,
            });
            registerSmoothScroll(lenis);
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add(ticker);
            gsap.ticker.lagSmoothing(0);
        });
        return () => {
            disposed = true;
            gsap.ticker.remove(ticker);
            gsap.ticker.lagSmoothing(500, 33);
            unregisterSmoothScroll(lenis);
            if (lenis) lenis.destroy();
        };
    }, []);
}
