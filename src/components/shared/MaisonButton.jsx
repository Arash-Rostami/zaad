"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import {
  ArrowUpRight,
  ArrowLeft,
  Compass,
  Sparkles,
  Eye,
  Layers,
  RefreshCw,
  X,
  Send,
} from "lucide-react";

const getRelevantIcon = (label) => {
  const norm = label.toLowerCase();
  if (norm.includes("browse")) return Compass;
  if (norm.includes("close")) return X;
  if (norm.includes("explore")) return Compass;
  if (norm.includes("philosophy") || norm.includes("story") || norm.includes("our")) return Sparkles;
  if (norm.includes("editorial")) return Eye;
  if (norm.includes("macro") || norm.includes("texture")) return Layers;
  if (norm.includes("submit") || norm.includes("send")) return Send;
  if (norm.includes("inquiry") || norm.includes("inquire")) return Sparkles;
  if (norm.includes("another") || norm.includes("reset") || norm.includes("refresh")) return RefreshCw;
  return ArrowUpRight;
};

const getVariantStyles = (variant) => {
  switch (variant) {
    case "solid":
      return "bg-ink text-on-indicator border border-ink rounded-full text-[length:calc(11px*var(--zaad-font-scale))] font-semibold uppercase px-8 py-4 shadow-card-sm";
    case "outline":
      return "border border-ink/20 text-ink rounded-full text-[length:calc(11px*var(--zaad-font-scale))] font-semibold uppercase px-8 py-4 bg-transparent";
    case "pill-dark":
      return "bg-ink text-on-indicator border border-ink/10 rounded-full text-[length:calc(11px*var(--zaad-font-scale))] font-semibold uppercase px-6 py-3 shadow-card-sm";
    case "pill-light":
      return "border border-ink/20 text-ink rounded-full text-[length:calc(11px*var(--zaad-font-scale))] font-semibold uppercase px-6 py-3 bg-transparent";
    case "ghost":
      return "text-muted hover:text-ink text-[length:calc(11px*var(--zaad-font-scale))] font-mono uppercase bg-transparent py-1";
    case "tab":
      return "text-[length:calc(12px*var(--zaad-font-scale))] font-mono uppercase pb-1 bg-transparent transition-colors";
    case "text":
    default:
      return "text-xs font-semibold text-ink uppercase hover:opacity-80 transition-opacity";
  }
};

const SPRING_CONFIG = Object.freeze({ damping: 22, stiffness: 100, mass: 0.9 });

function MaisonButton({
                        children,
                        onClick,
                        variant = "solid",
                        className = "",
                        type = "button",
                        disabled = false,
                        hideIcon = false,
                        icon,
                        labelClassName = "",
                        iconClassName = "",
                        ...rest
                      }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const smoothX = useSpring(driftX, SPRING_CONFIG);
  const smoothY = useSpring(driftY, SPRING_CONFIG);
  const reflectionX = useMotionValue(50);
  const reflectionY = useMotionValue(50);
  const reflectionBackground = useMotionTemplate`radial-gradient(circle 120px at ${reflectionX}% ${reflectionY}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 80%)`;

  const pendingEventRef = useRef(null);
  const frameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (disabled) return;
    pendingEventRef.current = { clientX: e.clientX, clientY: e.clientY };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const container = containerRef.current;
      const pending = pendingEventRef.current;
      if (!container || !pending) return;
      const rect = container.getBoundingClientRect();
      const { clientX, clientY } = pending;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const strength = 0.08;
      const maxDrift = 4;
      driftX.set(Math.max(-maxDrift, Math.min(maxDrift, (clientX - centerX) * strength)));
      driftY.set(Math.max(-maxDrift, Math.min(maxDrift, (clientY - centerY) * strength)));
      reflectionX.set(((clientX - rect.left) / rect.width) * 100);
      reflectionY.set(((clientY - rect.top) / rect.height) * 100);
    });
  }, [disabled, driftX, driftY, reflectionX, reflectionY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    driftX.set(0);
    driftY.set(0);
  }, [driftX, driftY]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const buttonStyleClass = `maison-button relative select-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-40 cursor-pointer ${getVariantStyles(variant)} ${className}`;

  const renderContent = () => {
    const isPlainString = typeof children === "string";
    if (isPlainString) {
      const label = children;
      const IconComponent = icon || getRelevantIcon(label);
      const iconRtlClass = IconComponent === ArrowLeft ? "" : "rtl:-scale-x-100";
      return (
          <span className="relative block overflow-hidden h-6 leading-6">
          <span
              className="block transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: isHovered ? "translateY(-50%)" : "translateY(0%)" }}
          >
            <span className="flex items-center justify-center space-x-2 h-6 leading-6 whitespace-nowrap px-1 w-max mx-auto">
              <span className={`font-semibold ${labelClassName}`}>{label}</span>
              {!hideIcon && (
                  <IconComponent className={`w-3.5 h-3.5 stroke-[1.25] pointer-events-none shrink-0 ${iconRtlClass} ${iconClassName}`} style={{ opacity: 0.65 }} />
              )}
            </span>
            <span className="flex items-center justify-center space-x-2 h-6 leading-6 whitespace-nowrap text-accent px-1 w-max mx-auto">
              <span className={`font-semibold ${labelClassName}`}>{label}</span>
              {!hideIcon && (
                  <IconComponent className={`w-3.5 h-3.5 stroke-[1.25] pointer-events-none shrink-0 ${iconRtlClass} ${iconClassName}`} />
              )}
            </span>
          </span>
        </span>
      );
    }

    return (
        <div className="flex items-center justify-center space-x-2 relative z-10 whitespace-nowrap">
          {children}
        </div>
    );
  };

  return (
      <motion.button
          ref={containerRef}
          type={type}
          disabled={disabled}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ x: smoothX, y: smoothY }}
          whileTap={disabled ? undefined : { scale: 0.985 }}
          className={buttonStyleClass}
          {...rest}
      >
        {isHovered && !disabled && (
            <motion.span
                className="absolute inset-0 pointer-events-none block opacity-35 transition-opacity duration-500"
                style={{
                  background: reflectionBackground,
                  mixBlendMode: "overlay",
                }}
            />
        )}
        {renderContent()}
      </motion.button>
  );
}

export default React.memo(MaisonButton);