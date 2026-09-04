"use client";

import React from "react";
import MaisonReveal from "../MaisonReveal";
import MaisonButton from "../MaisonButton";

function StatusScreen({
                          eyebrow,
                          title,
                          desc,
                          primaryLabel,
                          onPrimary,
                          secondaryLabel,
                          onSecondary,
                      }) {
    return (
        <div className="min-h-screen bg-surface text-ink flex items-center justify-center px-6 sm:px-12 py-24">
            <div className="max-w-xl w-full text-center">
                <MaisonReveal variant="unveil" threshold={0.1}>
                    <span className="text-[length:calc(10px*var(--zaad-font-scale))] sm:text-xs font-mono tracking-[0.3em] text-accent font-semibold uppercase block mb-5">
                        {eyebrow}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-[1.12] text-ink font-light text-glow-subtle">
                        {title}
                    </h1>
                    <p className="mt-8 text-sm sm:text-base md:text-lg text-muted font-light leading-relaxed">
                        {desc}
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {onPrimary && (
                            <MaisonButton variant="solid" onClick={onPrimary} hideIcon>
                                {primaryLabel}
                            </MaisonButton>
                        )}
                        {onSecondary && (
                            <MaisonButton variant="outline" onClick={onSecondary} hideIcon>
                                {secondaryLabel}
                            </MaisonButton>
                        )}
                    </div>
                </MaisonReveal>
            </div>
        </div>
    );
}

export default React.memo(StatusScreen);