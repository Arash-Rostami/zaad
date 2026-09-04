import React, { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NoiseBg from "../shared/NoiseBg";

const SpecimenGrid = memo(function SpecimenGrid({
  collection,
  selectedProduct,
  t,
  onSelect,
  onNavigateToCollection,
}) {
  const itemsById = useMemo(
    () => new Map(collection.map((item) => [String(item.id), item])),
    [collection],
  );

  const handleGridClick = useCallback(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest("a[data-item-id]");
      if (!anchor) return;
      const item = itemsById.get(anchor.dataset.itemId);
      if (!item) return;
      e.preventDefault();
      onSelect(item);
    },
    [itemsById, onSelect],
  );

  return (
    <div className="md:col-span-12 flex flex-col space-y-2">
      <button
        type="button"
        onClick={onNavigateToCollection}
        className="group inline-flex items-center gap-1 self-start text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] font-mono tracking-[0.3em] text-accent font-bold uppercase border-b border-ink/5 hover:border-[#C5A059]/60 pb-1 mb-0.5 text-left rtl:text-right transition-colors duration-500 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t("menuCuratedSpecimens")}
        <ChevronRight className="w-3 h-3 shrink-0 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      </button>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
        onClick={handleGridClick}
      >
        {collection.map((item) => {
          const isActive = selectedProduct?.id === item.id;
          return (
            <Link
              key={item.id}
              href={`/collection/${item.id}`}
              data-item-id={item.id}
              className={`group relative text-left rtl:text-right p-4 border transition-all duration-500 rounded-lg cursor-pointer active:scale-[0.98] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex flex-col justify-between min-h-[140px] overflow-hidden ${
                isActive
                  ? "bg-surface-alt border-[#C5A059]/50 font-semibold shadow-md"
                  : "border-ink/10 hover:border-[#C5A059]/60 bg-panel hover:bg-[#C5A059]/5 shadow-sm hover:shadow-md"
              }`}
            >
              <NoiseBg filterId={`specimenNoise-${item.id}`} revealOnHover />
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100 [@media(hover:none)]:scale-x-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <div className="flex justify-end w-full relative z-10">
                <span className="text-xs font-serif font-latin tracking-widest text-accent/80 group-hover:text-[#C5A059] transition-colors duration-300">
                  {item.number}
                </span>
              </div>
              <div className="flex flex-col items-center text-center mt-6 relative z-10">
                <span className="text-lg font-serif font-semibold text-headline leading-tight group-hover:-translate-y-0.5 transition-transform duration-300">
                  {item.name}
                </span>
                <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="text-[length:calc(10px*var(--zaad-font-scale))] rtl:text-[length:calc(11px*var(--zaad-font-scale))] tracking-[0.2em] text-[#C5A059] uppercase">
                    {t("menuView")}
                  </span>
                  <ChevronRight className="w-3 h-3 text-[#C5A059] ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default SpecimenGrid;
