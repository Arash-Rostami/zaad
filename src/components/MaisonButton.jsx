"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  ArrowUpRight,
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
      return "bg-ink text-on-indicator border border-ink rounded-full text-[10px] tracking-[0.2em] font-semibold uppercase px-8 py-4 shadow-sm";
    case "outline":
      return "border border-ink/20 text-ink rounded-full text-[10px] tracking-[0.2em] font-semibold uppercase px-8 py-4 bg-transparent";
    case "pill-dark":
      return "bg-ink text-on-indicator border border-ink/10 rounded-full text-[10px] tracking-[0.18em] font-semibold uppercase px-6 py-3 shadow-sm";
    case "pill-light":
      return "border border-ink/20 text-ink rounded-full text-[9.5px] tracking-[0.2em] font-semibold uppercase px-6 py-3 bg-transparent";
    case "ghost":
      return "text-muted hover:text-ink text-[10px] tracking-widest font-mono uppercase bg-transparent py-1";
    case "tab":
      return "text-[11px] font-mono tracking-widest uppercase pb-1 bg-transparent transition-colors";
    case "material-choice":
      return "border border-ink/10 rounded-xl p-6 bg-panel-glass hover:bg-panel text-left transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
    case "text":
    default:
      return "text-xs font-semibold tracking-[0.2em] text-ink uppercase hover:opacity-80 transition-opacity";
  }
};

function MaisonButton({
                        children,
                        onClick,
                        variant = "solid",
                        className = "",
                        type = "button",
                        disabled = false,
                        hideIcon = false,
                      }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reflectionPos, setReflectionPos] = useState({ x: 50, y: 50 });

  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const springConfig = { damping: 22, stiffness: 100, mass: 0.9 };
  const smoothX = useSpring(driftX, springConfig);
  const smoothY = useSpring(driftY, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || disabled) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const strength = 0.08;
    const maxDrift = 4;
    driftX.set(Math.max(-maxDrift, Math.min(maxDrift, (clientX - centerX) * strength)));
    driftY.set(Math.max(-maxDrift, Math.min(maxDrift, (clientY - centerY) * strength)));
    setReflectionPos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  }, [disabled, driftX, driftY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    driftX.set(0);
    driftY.set(0);
  }, [driftX, driftY]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const buttonStyleClass = `relative select-none outline-none focus:outline-none overflow-hidden transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-40 cursor-pointer ${getVariantStyles(variant)} ${className}`;

  const renderContent = () => {
    if (variant === "material-choice") return children;

    const isPlainString = typeof children === "string";
    if (isPlainString) {
      const label = children;
      const IconComponent = getRelevantIcon(label);
      return (
          <span className="relative block overflow-hidden h-6 leading-6">
          <span
              className="block transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: isHovered ? "translateY(-50%)" : "translateY(0%)" }}
          >
            <span className="flex items-center justify-center space-x-2 h-6 leading-6 whitespace-nowrap px-1">
              <span className="font-semibold tracking-inherit">{label}</span>
              {!hideIcon && (
                  <IconComponent className="w-3.5 h-3.5 stroke-[1.25] pointer-events-none shrink-0" style={{ opacity: 0.65 }} />
              )}
            </span>
            <span className="flex items-center justify-center space-x-2 h-6 leading-6 whitespace-nowrap text-accent px-1">
              <span className="font-semibold tracking-inherit">{label}</span>
              {!hideIcon && (
                  <IconComponent className="w-3.5 h-3.5 stroke-[1.25] pointer-events-none shrink-0" />
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
      >
        {isHovered && !disabled && (
            <span
                className="absolute inset-0 pointer-events-none block opacity-35 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle 120px at ${reflectionPos.x}% ${reflectionPos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 80%)`,
                  mixBlendMode: "overlay",
                }}
            />
        )}
        {renderContent()}
      </motion.button>
  );
}

export default React.memo(MaisonButton);