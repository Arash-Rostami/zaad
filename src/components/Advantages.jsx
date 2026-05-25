"use client";

import { useLanguage } from "../lib/TranslationService";
import MaisonReveal from "./MaisonReveal";
import { Sparkles, Hammer, ShieldCheck } from "lucide-react";
export default function Advantages() {
  const { isFarsi } = useLanguage();
  const cards = [
    {
      id: "materials",
      num: "I",
      icon: Hammer,
      titleEn: "Premium Materials & Structure",
      titleFa: "کیفیت و متریال ممتاز",
      descEn:
          "Engineered with 22mm Natural Eucalyptus and solid natural wood, paired with seamless, sculpted stone countertops and bases.",
      descFa:
          "ساختاری مهندسی‌شده با استفاده از درهای چوب طبیعی و اکالیپتوس با ضخامت ۲۲ میلی‌متر، در کنار صفحات رویی و پایه‌های مجسمه‌گونه سنگی.",
    },
    {
      id: "experience",
      num: "II",
      icon: Sparkles,
      titleEn: "The Dorsa Experience",
      titleFa: "تجربه و هنر درسا",
      descEn:
          "Infused with Dorsa Home's signature craftsmanship, highlighted by leather-covered iron cylinder handles and sophisticated leather wall coverings.",
      descFa:
          "تجلی امضای درسا هوم در جزئیات لوکس، شامل دستگیره‌های استوانه‌ای فلزی با روکش چرم و دیوارپوش‌های چرمی متمایز.",
    },
    {
      id: "integration",
      num: "III",
      icon: ShieldCheck,
      titleEn: "World-Class Integration",
      titleFa: "تجهیزات در سطح جهانی",
      descEn:
          "Fully equipped with professional Gaggenau appliances, seamless Domus lighting, Salice hardware, and Kesseböhmer storage accessories.",
      descFa:
          "ادغام‌شده با لوازم خانگی توکار لوکس Gaggenau، سیستم‌های نورپردازی حرفه‌ای Domus، یراق‌آلات Salice و اکسسوری‌های ذخیره‌سازی Kesseböhmer.",
    },
  ];
  return (
      <section
          id="advantages"
          className="relative py-24 md:py-36 bg-[#E8E4DF]/40 dark:bg-[var(--bg-secondary-40)] px-6 sm:px-12 border-b border-[#1C1C1C]/10 dark:border-white/10 overflow-hidden text-left rtl:text-right"
      >
        {/* Majestic Cinematic Sunbeam Glare overlay (Matches Story & Materials) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Ambient golden pool backing */}
          <div className="absolute left-1/4 top-1/10 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#8E7A62]/0 via-[#8E7A62]/10 to-[#8E7A62]/0 dark:via-[#B7A590]/20 blur-[130px] mix-blend-screen transition-opacity duration-1000" />
          <div className="absolute -right-1/4 bottom-1/10 w-[600px] h-[600px] rounded-full bg-[#8E7A62]/5 dark:bg-[#CBB9A7]/15 blur-[140px] mix-blend-screen" />

          {/* Primary early evening window light gleams */}
          <div
              className="absolute top-0 left-1/3 w-[240px] h-[220%] bg-gradient-to-r from-transparent via-white/[0.04] dark:via-white/[0.14] to-transparent sunbeam-signature-glare pointer-events-none mix-blend-overlay"
              style={{
                animationDuration: "28s",
              }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <MaisonReveal variant="unveil" delay={0.1}>
            <span className="text-[11px] font-mono tracking-[0.3em] text-[#8E7A62] dark:text-[#CBB9A7] font-semibold uppercase block mb-3">
              {isFarsi ? "مزایای رقابتی" : "DISTINCTIVE CREDENTIALS"}
            </span>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.2}>
              <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight leading-tight text-[var(--text-primary)]">
                {isFarsi
                    ? "مزیت رقابتی زاد و تجربه درسا"
                    : "Our Competitive Advantages"}
              </h2>
            </MaisonReveal>

            <MaisonReveal variant="unveil" delay={0.3}>
              <div className="h-[1px] w-12 bg-[var(--border-color-15)] my-6"></div>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-light">
                {isFarsi
                    ? "دقت بی‌رقیب در طراحی جزئیات، کیفیت متریال استثنایی و بهره‌گیری از هنر بی‌بدیل درسا هوم در کنار معتبرترین استانداردهای مهندسی برندهای برتر اروپا."
                    : "The flawless intersection of precision design, engineering milestones, and custom curated European hardware."}
              </p>
            </MaisonReveal>
          </div>

          {/* 3-Column Luxury Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                  <div key={card.id}>
                    <MaisonReveal variant="slide-up-royal" delay={0.1 * idx}>
                      <div className="group h-full relative p-8 md:p-10 bg-[var(--bg-card-trans)] backdrop-blur-md border border-[var(--border-color-10)] hover:border-[var(--text-bronze)]/50 transition-all duration-700 rounded-2xl flex flex-col justify-between overflow-hidden">
                        {/* Absolute backdrop hover card gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#8E7A62]/3 dark:to-[#B7A590]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div>
                          {/* Card Top: Number Key and Icon */}
                          <div className="flex justify-between items-center mb-8">
                        <span className="font-mono text-xs tracking-widest text-[var(--text-bronze)] font-semibold">
                          {card.num}
                        </span>
                            <div className="p-3 bg-[var(--border-color-5)] rounded-xl text-[var(--text-bronze)] group-hover:scale-110 group-hover:bg-[#8E7A62]/10 transition-all duration-500">
                              <IconComponent className="w-5 h-5 stroke-[1.25]" />
                            </div>
                          </div>

                          {/* Card Body Title */}
                          <h3 className="text-lg md:text-xl font-serif font-medium text-[var(--text-primary)] mb-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-500">
                            {isFarsi ? card.titleFa : card.titleEn}
                          </h3>

                          {/* Card Body description */}
                          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-light font-sans">
                            {isFarsi ? card.descFa : card.descEn}
                          </p>
                        </div>

                        {/* Aesthetic card indicator marker */}
                        <div className="mt-8 pt-4 border-t border-[var(--border-color-10)] flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-widest text-[var(--text-bronze)]/50 uppercase">
                        {isFarsi ? "تایید کارگاه زاد" : "ATELIER CERTIFIED"}
                      </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-bronze)] scale-75 opacity-30 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                        </div>
                      </div>
                    </MaisonReveal>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
}
