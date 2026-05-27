import React from "react";

export default function TabAppliances({ item }) {
    return (
        <div className="space-y-8">
            {item.partners && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-panel-glass border border-ink/5 p-6 rounded-2xl shadow-sm text-xs">
                    {[
                        { label: "CHASSIS TYPOLOGY", value: item.partners.typology },
                        { label: "HARDWARE CORE", value: item.partners.hardware },
                        { label: "INTEGRATED GLASSWARE", value: item.partners.appliances },
                        { label: "SMART ACC. & LED", value: `${item.partners.accessories} • ${item.partners.light}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="space-y-1">
                            <span className="text-[8px] font-mono text-muted block uppercase tracking-wider">{label}</span>
                            <strong className="text-[11px] text-ink uppercase font-mono block">{value}</strong>
                        </div>
                    ))}
                </div>
            )}

            {item.appliancesDetail && (
                <div className="space-y-4">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-accent uppercase block">
                        GAGGENAU ZAAD CATALOG INTEGRATION SPECIFICS
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {item.appliancesDetail.map((app, idx) => (
                            <div key={idx} className="bg-panel-glass p-5 sm:p-6 rounded-2xl border border-ink/5 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                                        <span className="text-[8.5px] bg-accent text-white py-0.5 px-2 rounded-full font-mono font-medium">
                                            {app.category}
                                        </span>
                                    </div>
                                    <h5 className="font-serif text-sm font-semibold text-ink">{app.name}</h5>
                                    <ul className="list-disc list-inside space-y-1.5 text-[10.5px] text-muted pl-1 font-light leading-relaxed">
                                        {app.specs.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between">
                                    <span className="text-[8px] font-mono text-muted uppercase">INTEGRATION RATING</span>
                                    <span className="text-[9px] font-mono font-bold text-accent">GAGGENAU 200/400</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {item.accessoriesDetail && (
                <div className="bg-panel-glass p-6 rounded-2xl border border-ink/5 space-y-4 mt-8">
                    <span className="text-[9px] font-mono tracking-widest text-accent block uppercase">
                        KESSEBÖHMER BUILT-IN ACCESSORIES STRUCTURES
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {item.accessoriesDetail.map((acc, aIdx) => (
                            <div key={aIdx} className="space-y-2">
                                <h6 className="font-mono text-[11px] font-bold text-ink uppercase">{acc.name}</h6>
                                <div className="text-[10px] bg-surface-alt/30 p-3 rounded-lg border border-ink/5">
                                    <ul className="list-disc list-inside space-y-1 text-muted">
                                        {acc.specs.map((s, sIdx) => (
                                            <li key={sIdx} className="font-light">{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
