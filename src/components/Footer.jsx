"use client";

import { useLanguage } from "../lib/TranslationService";
export default function Footer({ onScrollToSection, setActiveTab }) {
  const { t, isFarsi } = useLanguage();
  return (
      <footer className="bg-[#1C1C1C] text-[#F4F1ED] pt-16 pb-12 px-6 sm:px-12 border-t border-[#1C1C1C] text-left rtl:text-right">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-[#F4F1ED]/10 pb-12 mb-12">
            {/* Brand Col */}
            <div className="md:col-span-6">
              <h3 className="text-xl md:text-3xl font-serif tracking-[0.35em] uppercase font-semibold text-[#F4F1ED] mb-4">
                ZAAD
              </h3>
              <p className="text-xs text-[#F4F1ED]/60 leading-relaxed max-w-sm font-light uppercase tracking-wider">
                {isFarsi
                    ? "ما تندیس‌ها و ابژه‌های فیزیکی شناسنامه‌داری را پدید می‌آوریم که در کارگاه‌های فلورانس و آتلیه‌های میلان حجاری شده و فراتر از زمان زندگی می‌کنند."
                    : "We design physical, numbered objects crafted in Tuscan quarries and Milanese ateliers, designed to outlive trends."}
              </p>
            </div>

            {/* Nav Directory */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-mono tracking-widest text-[#F4F1ED]/40 uppercase mb-4">
                {isFarsi ? "راهنمای نمایشگاه" : "SHOWROOM DIRECTORY"}
              </h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-[#F4F1ED]/80 font-mono">
                <li>
                  <button
                      onClick={() => {
                        setActiveTab("showroom");
                        setTimeout(() => onScrollToSection("story"), 100);
                      }}
                      className="hover:text-[#8E7A62] transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {isFarsi ? "فلسفه و دیدگاه" : "Our Philosophy"}
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => {
                        setActiveTab("showroom");
                        setTimeout(() => onScrollToSection("collection"), 100);
                      }}
                      className="hover:text-[#8E7A62] transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {isFarsi ? "مجموعه آثار" : "The Collection"}
                  </button>
                </li>
                <li>
                  <button
                      onClick={() => {
                        setActiveTab("showroom");
                        setTimeout(() => onScrollToSection("concierge"), 100);
                      }}
                      className="hover:text-[#8E7A62] transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {isFarsi ? "بخش تدارکات و مشاوره" : "Acquisition Concierge"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Blueprints and specs */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-mono tracking-widest text-[#F4F1ED]/40 uppercase mb-4">
                {isFarsi ? "آرشیو جزئیات" : "STUDIO BLUEPRINT"}
              </h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-[#F4F1ED]/80 font-mono">
                <li>
                  <button
                      onClick={() => setActiveTab("blueprint")}
                      className="hover:text-[#8E7A62] transition-colors focus:outline-none cursor-pointer text-left rtl:text-right"
                  >
                    {isFarsi ? "دفترچه نقشه‌های فنی" : "Design Blueprint Archive"}
                  </button>
                </li>
                <li>
                <span className="text-[#F4F1ED]/40 block select-none">
                  {isFarsi
                      ? "کارگاه میلان — لومباردی"
                      : "Milan Atelier — Lombardy"}
                </span>
                </li>
                <li>
                <span className="text-[#F4F1ED]/40 block select-none">
                  {isFarsi
                      ? "معادن سنگ راپولانو — توسکانی"
                      : "Rapolano Stone — Tuscany"}
                </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom copyright indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#F4F1ED]/40 tracking-widest uppercase">
            <div className="text-center sm:text-left rtl:sm:text-right">
              {isFarsi
                  ? "© ۱۹۸۹ — ۲۰۲۶ شرکت سهامی خاص زاد. تمامی حقوق لوکس مادی محفوظ است."
                  : "© 1989 — 2026 ZAAD S.P.A. ALL PRIVACY COMMITTED."}
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-right rtl:sm:text-left">
              {isFarsi
                  ? "طراحی شده با غایت اعلای معماری و صنعت ریشه دار"
                  : "CRAFTED WITH ARCHITECTURAL SOVEREIGNTY"}
            </div>
          </div>
        </div>
      </footer>
  );
}
