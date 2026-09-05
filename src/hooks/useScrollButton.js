"use client";

import { useEffect, useState } from "react";

const APPEAR_AT = 240;
const SHORT_PAGE_GUARD = 320;

export default function useScrollButton() {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    let rafId = null;

    const update = () => {
      rafId = null;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= SHORT_PAGE_GUARD) {
        setVisible(false);
        return;
      }

      setVisible(scrollY > APPEAR_AT);
      setDirection(scrollY >= maxScroll / 2 ? "up" : "down");
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { visible, direction };
}