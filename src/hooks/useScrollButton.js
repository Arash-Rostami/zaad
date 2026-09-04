"use client";

import { useEffect, useState } from "react";

const APPEAR_AT = 240;
const SHORT_PAGE_GUARD = 320;

export default function useScrollButton() {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= SHORT_PAGE_GUARD) {
        setVisible(false);
        return;
      }

      setVisible(scrollY > APPEAR_AT);
      setDirection(scrollY >= maxScroll / 2 ? "up" : "down");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { visible, direction };
}
