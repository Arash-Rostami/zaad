import React, { memo } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

const TabHeritage = memo(function TabHeritage() {
    return (
        <div className="bg-panel-glass rounded-2xl border border-ink/5 p-6 sm:p-10 space-y-8">
            <div className="max-w-3xl">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-accent uppercase font-semibold">
                        CRAFT INTEGRITY SEAL
                    </span>
                </div>
                <h4 className="font-serif text-2xl font-light text-headline leading-snug mb-4">
                    Architectural Honesty and Spatial Silence
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-light mb-6">
                    Each ZAAD object represents a rigorous response of quiet luxury against dynamic trends. Organized symmetrically across heavy, grounded natural travertine/rapolano stone cores and durable eucalyptus veneers, the design relies strictly on authentic physical materials to establish spiritual calm within the domestic landscape.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ink/10 text-xs">
                <div className="space-y-1.5 p-5 bg-surface-alt/20 rounded-xl">
                    <h5 className="font-mono text-[10px] font-bold text-accent uppercase">THE RAW STONE CURATION</h5>
                    <p className="text-muted leading-relaxed font-light">
                        Milled, shaped, and completed directly inside Tuscan quarries under Carrara. All limestone, travertine, and onyx blocks are hand-polished using natural acid-free waxes to maintain historic texture honesty.
                    </p>
                </div>
                <div className="space-y-1.5 p-5 bg-surface-alt/20 rounded-xl">
                    <h5 className="font-mono text-[10px] font-bold text-accent uppercase">
                        EUCALYPTUS VENEERS AND SADDLE LEATHER
                    </h5>
                    <p className="text-muted leading-relaxed font-light">
                        Natural eucalyptus heartwoods overlaid at 22mm onto water-resistant structural cores. Accompanied by solid patinated brass and iron hardware cylinders wrapped in genuine Italian saddle leathers.
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-accent justify-center pt-6">
                <ShieldCheck className="w-4 h-4" />
                <span>ISSUED CERTIFICATE OF PROVENANCE SIGNED BY THE MASTER DESIGNER</span>
            </div>
        </div>
    );
});

export default TabHeritage;
