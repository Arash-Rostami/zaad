"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

const COUTURE_EASE = [0.16, 1, 0.3, 1];

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

// Per-line mask reveal: takes a single element child whose own child is a
// plain string (e.g. <MaisonReveal variant="lines"><h2>{t("key")}</h2></MaisonReveal>).
// Measures the natural line breaks after mount, re-renders each visual line
// inside its own overflow-hidden mask, and staggers the masks upward. Once the
// last line lands it re-renders the plain text again so later reflows
// (font-scale change, resize, locale switch remount) can never be clipped.
function LinesReveal({ children, delay, duration, threshold }) {
  const child = React.Children.only(children);
  const { children: text, ...tagProps } = child.props;
  const Tag = child.type;
  const measureRef = useRef(null);
  const measuredTextRef = useRef(null);
  const [lines, setLines] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof text !== "string") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    if (measuredTextRef.current === text) return;
    // A text change without a remount re-enters the measurement pass first —
    // the mask render carries no ref, so flip back before measuring.
    setDone(false);
    if (lines !== null) {
      setLines(null);
      return;
    }
    const el = measureRef.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll("[data-word]"));
    if (!words.length) return;
    const groups = [];
    let lastTop = null;
    words.forEach((word) => {
      const top = Math.round(word.offsetTop);
      if (top !== lastTop) {
        groups.push([]);
        lastTop = top;
      }
      groups[groups.length - 1].push(word.textContent);
    });
    measuredTextRef.current = text;
    setLines(groups.map((group) => group.join(" ")));
  }, [text, lines]);

  if (typeof text !== "string" || done) {
    return <Tag {...tagProps}>{text}</Tag>;
  }

  if (lines === null) {
    const words = text.split(" ").filter(Boolean);
    return (
      <Tag {...tagProps} ref={measureRef}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span data-word>{word}</span>
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag {...tagProps}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: threshold }}
            transition={{ duration: duration * 0.75, delay: delay + i * 0.12, ease: COUTURE_EASE }}
            onAnimationComplete={() => {
              if (i === lines.length - 1) setDone(true);
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

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

  if (variant === "lines") {
    return (
      <LinesReveal delay={delay} duration={duration} threshold={threshold}>
        {children}
      </LinesReveal>
    );
  }

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