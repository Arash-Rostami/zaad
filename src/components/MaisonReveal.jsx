"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";

const getVariants = (variant, delay, duration) => {
  switch (variant) {
    case "royal-gate":
      return {
        hidden: { opacity: 0, x: -24, scale: 0.98, filter: "blur(12px)" },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };
    case "lens-focus":
      return {
        hidden: { opacity: 0, filter: "blur(20px)", scale: 0.96 },
        visible: {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration: duration * 1.1, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };
    case "scale-down-unveil":
      return {
        hidden: { opacity: 0, scale: 1.04, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };
    case "slide-up-royal":
      return {
        hidden: { opacity: 0, y: 45 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };
    case "unveil":
    default:
      return {
        hidden: { opacity: 0, y: 30, filter: "blur(8px)", scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };
  }
};

function MaisonReveal({
                        children,
                        variant = "unveil",
                        delay = 0,
                        duration = 1.6,
                        className = "",
                        threshold = 0.1,
                      }) {
  const variants = useMemo(
      () => getVariants(variant, delay, duration),
      [variant, delay, duration]
  );

  return (
      <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: threshold }}
          variants={variants}
          className={className}
      >
        {children}
      </motion.div>
  );
}

export default React.memo(MaisonReveal);