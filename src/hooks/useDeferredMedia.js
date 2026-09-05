import { useEffect, useRef, useState } from "react";

const IDLE_DELAY = 1500;
const VIEW_MARGIN = "300px";

export default function useDeferredMedia({
  mode = "in-view",
  idleDelay = IDLE_DELAY,
  rootMargin = VIEW_MARGIN,
} = {}) {
  const [ready, setReady] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ready) return;
    if (mode === "eager") {
      setReady(true);
      return;
    }
    if (mode === "idle") {
      const id = window.setTimeout(() => setReady(true), idleDelay);
      return () => window.clearTimeout(id);
    }
    let observer;
    let raf;
    const start = () => {
      const el = ref.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setReady(true);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setReady(true);
            observer.disconnect();
          }
        },
        { rootMargin },
      );
      observer.observe(el);
    };
    if (ref.current) start();
    else raf = window.requestAnimationFrame(start);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [ready, mode, idleDelay, rootMargin]);

  return [ready, ref];
}