import React from "react";

function SpecCard({ title, heading, overview, partA, partB, listSpecs, listLabel }) {
    return (
        <div className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-[9.5px] font-mono tracking-[0.25em] text-accent uppercase font-semibold">
                        {title}
                    </span>
                </div>
                <h4 className="font-serif text-lg font-light text-headline mb-3">{heading}</h4>
                <p className="text-xs text-muted leading-relaxed font-light mb-6">{overview}</p>
                <div className="space-y-4">
                    {[partA, partB].filter(Boolean).map((part, i) => (
                        <div key={i} className="bg-surface-alt/30 p-4 rounded-xl">
                            <h5 className="font-mono text-[9px] font-bold text-accent uppercase mb-1.5">{part.title}</h5>
                            <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                {part.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            {listSpecs && (
                <div className="mt-8 border-t border-ink/10 pt-6">
                    <span className="text-[8.5px] font-mono tracking-widest text-muted block uppercase mb-3">
                        {listLabel}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                        {listSpecs.map((s, sIdx) => (
                            <div key={sIdx} className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5">
                                <span className="text-accent">▪</span>
                                <span className="truncate">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TabArchitecture({ item }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {item.islandSpecs && (
                <SpecCard
                    title="CORE ISLAND GEOMETRIES"
                    heading="Bi-Monolith Modular Central Core"
                    overview={item.islandSpecs.overview}
                    partA={item.islandSpecs.partA}
                    partB={item.islandSpecs.partB}
                    listSpecs={item.islandSpecs.listSpecs}
                    listLabel="CONSTRUCTOR MANUAL SHEETS"
                />
            )}
            {item.tallUnits && (
                <div className="bg-panel-glass p-6 sm:p-8 rounded-2xl border border-ink/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                            <span className="text-[9.5px] font-mono tracking-[0.25em] text-accent uppercase font-semibold">
                                TALL CORE ARCHITECTURES
                            </span>
                        </div>
                        <h4 className="font-serif text-lg font-light text-headline mb-3">
                            Symmetric High-Yield Housing Wall
                        </h4>
                        <p className="text-xs text-muted leading-relaxed font-light mb-6">{item.tallUnits.overview}</p>
                        {item.tallUnits.parts && (
                            <div className="space-y-2 mb-6 text-[11px]">
                                <span className="text-[8.5px] font-mono tracking-widest text-muted uppercase block mb-1">
                                    ZAAD TOWER ROW SCHEDULING
                                </span>
                                <div className="grid grid-cols-1 gap-1.5 font-mono">
                                    {item.tallUnits.parts.map((tower, tIdx) => (
                                        <div key={tIdx} className="flex items-center justify-between p-2.5 bg-panel-glass dark:bg-panel/5 border border-ink/5 rounded-lg">
                                            <span className="text-accent font-bold text-[9px] shrink-0 uppercase">{tower.key}</span>
                                            <span className="text-muted truncate text-right">{tower.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            {[
                                { adj: item.tallUnits.adjacentA, label: "Ergonomics Plan (A-Adjacent)" },
                                { adj: item.tallUnits.adjacentB, label: "Ergonomics Plan (B-Adjacent)" },
                            ].filter(({ adj }) => Boolean(adj)).map(({ adj, label }, i) => (
                                <div key={i} className="bg-surface-alt/30 p-4 rounded-xl">
                                    <span className="font-mono text-[8px] tracking-widest text-accent block mb-1.5 uppercase">{label}</span>
                                    <p className="text-[10px] text-muted italic mb-2">{adj.reason}</p>
                                    <ul className="list-disc list-inside space-y-1 text-[10.5px] text-muted leading-relaxed font-light">
                                        {adj.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    {item.tallUnits.listSpecs && (
                        <div className="mt-8 border-t border-ink/10 pt-6">
                            <span className="text-[8.5px] font-mono tracking-widest text-muted block uppercase mb-3">
                                HOUSING STRUCTURAL COMPONENTS
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                                {item.tallUnits.listSpecs.map((s, sIdx) => (
                                    <div key={sIdx} className="flex items-center space-x-1.5 p-2 bg-panel/60 dark:bg-panel/5 rounded border border-ink/5">
                                        <span className="text-accent">▪</span>
                                        <span className="truncate">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
