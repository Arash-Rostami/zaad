"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Landmark, Sliders, Globe } from "lucide-react";
import MaisonButton from "./MaisonButton";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "../lib/TranslationService";
const MATERIAL_SAMPLES = [
  {
    id: "travertine-classico",
    name: "Travertine Classico",
    category: "Sedimentary Calcium Carbonate",
    origins: "Tuscan Thermal Springs, Rapolano (Italy)",
    properties: [
      "High thermal crystallization resistant",
      "Naturally aerated vesicular voids",
      "Honed satin tactile profile",
    ],
    philosophicalNote:
        "Travertine is solidified time itself. Emerging from natural hot thermal springs, its mineral pockets and craters register thousands of years of cooling, ensuring no two blocks share the same structural pattern.",
    history:
        "Favored by Roman architects to raise monumental structures such as the Colosseum and St. Peter's Basilica. We leave the craters unfilled to honor its brutalist history.",
    density: "2.42 g/cm³ (High density load)",
    imageUrl:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
    farsi: {
      name: "تراورتن کلاسیکو طبیعی",
      category: "سنگ رسوبی کربنات کلسیم",
      origins: "چشمه‌های آب‌گرم توسکانی، راپولانو (ایتالیا)",
      properties: [
        "مقاوم در برابر تبلور دمایی کلوخه‌ای سنگ",
        "حفره‌های تنفسی هوازده نامنظم طبیعی",
        "پرداخت ساتن کدر صیقل خورده دستی",
      ],
      philosophicalNote:
          "سنگ تراورتن تجسم فیزیکی خودِ زمان است. جوشیده از دل پدیده‌های ترمال توسکانی، حباب‌ها و دهانه‌های ظریف آن گواهی خنک شدن املاح زمین در اعصار دیرینه است، به گونه‌ای که هیچ دو تراشه‌ای کپی هم نخواهند بود.",
      history:
          "محبوب معماران روم باستان برای برافراشتن بناهای سترگی چون استادیوم کولوسئوم و کاخ پترز. ما حفره‌های سنگی را پر نمی‌کنیم تا به ماهیت بیرحم طبیعی صخره احترام بگذاریم.",
      density: "۲.۴۲ گرم بر سانتی‌متر مکعب (تراکم مادی بالا)",
    },
  },
  {
    id: "american-walnut",
    name: "Aged Walnut Timber",
    category: "Hardwood (Juglans nigra)",
    origins: "Apennine Mountain Foothills (Northern Italy)",
    properties: [
      "Friction-polished continuous grain",
      "Solid wood joint flexion support",
      "Aged naturally for 3 years",
    ],
    philosophicalNote:
        "American walnut lends structural elegance. It behaves like a skeletal foundation, providing a high strength-to-weight ratio that permits fluid, continuous curved furniture frames with zero metal anchors.",
    history:
        "Utilized for centuries by renaissance cabinet makers. Our timber is burnished by hand using organic local beeswax and friction blocks, without toxic VOC varnishes.",
    density: "0.68 g/cm³ (High wood strength)",
    imageUrl:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=90",
    farsi: {
      name: "الوار چوب گردوی کهنه",
      category: "الوار سخت‌چوب کوهستانی",
      origins: "دامنه‌های کوه آند و رشته‌کوه‌های آپنین (ایتالیا)",
      properties: [
        "براق‌کاری دستی یکپارچه الیاف چوب",
        "انعطاف بی‌نظیر اتصالات به شکل کام و زبانه",
        "خشک‌شده به صورت کاملاً طبیعی به مدت ۳ سال",
      ],
      philosophicalNote:
          "چوب گردو وقار استواری را هدیه می‌دهد. این متریال مانند اسکلت‌بندی تندیس عمل می‌کند و به سازندگان اجازه می‌دهد بدون نیاز به بست‌های فلزی یا پیچ عریان، خطوط پیوسته سیالی خلق کنند.",
      history:
          "کار گرفته شده توسط نجاران استاد رنسانس. ما الوارها را با استفاده از موم خام محلی تماسی مالش داده‌ایم تا از لاک‌های فرار آلاینده شیمیایی دوری کنیم.",
      density: "۰.۶۸ گرم بر سانتی‌متر مکعب (استحکام بافت گردوی جنگلی)",
    },
  },
  {
    id: "wool-boucle",
    name: "Hand-Spun Biella Bouclé",
    category: "72% Raw Wool / 18% Alpaca / 10% Raw Silk",
    origins: "Historic Spinning Mills of Biella (Italy)",
    properties: [
      "High physical loop density",
      "Retained natural lanolin odor",
      "Non-uniform rustic texture",
    ],
    philosophicalNote:
        "The envelope must breathe. Spun exclusively in Biella's alpine mills, this raw wool is hand-handled to keep vegetable fragments in place, providing an honest tactile landscape.",
    history:
        "Initially selected by high-fashion Parisian ateliers in the 1950s. We have widened the loops to maximize microscopic shadows on the chair's surface.",
    density: "1.24 kg/m² (Luxurious fiber weight)",
    imageUrl:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=90",
    farsi: {
      name: "پشم ریسیده شده بیلا بوکله",
      category: "۷۲٪ پشم الیاف طبیعی / ۱۸٪ آلپاکا / ۱۰٪ ابریشم خالص",
      origins: "کارخانجات ریسندگی تاریخی منطقه سالپین بیلا (ایتالیا)",
      properties: [
        "دانسیته کرولایت فوق‌العاده تار و پود بوکله",
        "حفظ بوی خوشایند چربی لانولین طبیعی پشم خام",
        "سطح نامتقارن و الیاف زبر کدر کتان",
      ],
      philosophicalNote:
          "روکش مبل زاد همواره نفس می‌کشد. ریسیده شده در کوهستان بیلا، این پشم طبیعی با تخصص دست‌آمده به گونه‌ای محافظت شده که ذرات مادی کرک‌های اصیل پشم گوسفند دست‌نخورده جلوه دهند.",
      history:
          "ابتدا در دهه ۱۹۵۰ مد ممتاز فرانسه را فتح کرد. ما حلقه‌ها را با نوسانات عریض‌تری بافته‌ایم تا ریزسایه‌های زایای متراکمی در سطح تکیه‌گاه ایجاد کنیم.",
      density: "۱.۲۴ کیلوگرم بر متر مربع (وزن مخملی فاخر)",
    },
  },
];
export default function Materials() {
  const { isFarsi } = useLanguage();
  const [activeMaterial, setActiveMaterial] = useState(MATERIAL_SAMPLES[0]);
  const matName =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.name
          : activeMaterial.name;
  const matCategory =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.category
          : activeMaterial.category;
  const matOrigins =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.origins
          : activeMaterial.origins;
  const matNote =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.philosophicalNote
          : activeMaterial.philosophicalNote;
  const matDensity =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.density
          : activeMaterial.density;
  const matHistory =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.history
          : activeMaterial.history;
  const matProperties =
      isFarsi && activeMaterial.farsi
          ? activeMaterial.farsi.properties
          : activeMaterial.properties;
  return (
      <section className="py-24 md:py-36 bg-[#E8E4DF]/40 px-6 sm:px-12 border-b border-[#1C1C1C]/10 relative overflow-hidden text-left rtl:text-right">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Interactive Material Sample Selection Panels */}
            <MaisonReveal variant="unveil" className="lg:col-span-6">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#8E7A62] font-semibold uppercase block mb-3">
              {isFarsi ? "شناسی علمی سنگ و چوب خام" : "MATERIAL ARCHAEOLOGY"}
            </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1C] tracking-tight font-light mb-8">
                {isFarsi
                    ? "مطالعه‌ای در رئالیسم لایه‌ها"
                    : "A Study in Physical Realism"}
              </h2>

              <div className="space-y-4">
                {MATERIAL_SAMPLES.map((mat) => {
                  const sampleName =
                      isFarsi && mat.farsi ? mat.farsi.name : mat.name;
                  const sampleCategory =
                      isFarsi && mat.farsi ? mat.farsi.category : mat.category;
                  return (
                      <MaisonButton
                          key={mat.id}
                          variant="material-choice"
                          onClick={() => setActiveMaterial(mat)}
                          className={`w-full flex items-center justify-between group ${activeMaterial.id === mat.id ? "bg-white border-[#1C1C1C]! shadow-md" : ""}`}
                      >
                        <div className="text-left rtl:text-right">
                      <span className="text-[10px] font-mono tracking-widest text-[#8E7A62] font-semibold block mb-1 uppercase">
                        {sampleCategory}
                      </span>
                          <span className="text-lg md:text-xl font-serif font-light text-[#1C1C1C] block">
                        {sampleName}
                      </span>
                        </div>
                        <span
                            className={`text-[11px] font-mono tracking-widest text-[#1C1C1C] transition-transform duration-300 shrink-0 ${activeMaterial.id === mat.id ? "translate-x-1 font-semibold text-[#8E7A62]" : "opacity-40 group-hover:opacity-100"}`}
                        >
                      {isFarsi ? "مشاهده نمونه سندی ←" : "HEXA SAMPLE →"}
                    </span>
                      </MaisonButton>
                  );
                })}
              </div>
            </MaisonReveal>

            {/* Right: Close-up Analysis & Spec Card */}
            <MaisonReveal
                variant="scale-down-unveil"
                delay={0.2}
                className="lg:col-span-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                    key={activeMaterial.id}
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    transition={{
                      duration: 0.6,
                    }}
                    className="bg-[#F4F1ED] border border-[#1C1C1C]/10 p-8 shadow-xl relative rounded-2xl"
                >
                  {/* Microscopic preview circle */}
                  <div className="relative aspect-video w-full overflow-hidden border border-[#1C1C1C]/10 mb-6 rounded-xl">
                    <img
                        src={activeMaterial.imageUrl}
                        alt={`${matName} Macro Close-up`}
                        className="object-cover w-full h-full hover:scale-105 duration-1000"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-[#1C1C1C] text-[#F4F1ED] px-3 py-1 font-mono text-[9px] tracking-widest uppercase rounded-md">
                      {isFarsi ? "نمای فوق نزدیک لوکس" : "MACRO PREVIEW"}
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-light text-[#1C1C1C] mb-2">
                    {isFarsi ? "آنالیز ساختار" : ""} {matName}{" "}
                    {isFarsi ? "" : "Analysis"}
                  </h3>
                  <p className="text-xs text-[#5C5954] font-mono tracking-widest uppercase mb-4 border-b border-[#1C1C1C]/10 pb-4 flex items-center justify-start">
                    <Globe className="w-3.5 h-3.5 mr-2 rtl:mr-0 rtl:ml-2 text-[#8E7A62]" />
                    {isFarsi ? "خاستگاه بومی اثر:" : "Geographical Origin:"}{" "}
                    {matOrigins}
                  </p>

                  <p className="text-sm text-[#1C1C1C] font-light leading-relaxed mb-6 italic">
                    "{matNote}"
                  </p>

                  {/* Sub specs list */}
                  <div className="space-y-4 border-t border-[#1C1C1C]/10 pt-6 text-left rtl:text-right">
                    <div className="flex items-start justify-start">
                      <Sliders className="w-4 h-4 text-[#8E7A62] mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                      <div>
                      <span className="text-[10px] font-mono text-[#5C5954] tracking-widest uppercase block">
                        {isFarsi
                            ? "شاخص دانسیته فیزیکی"
                            : "Physical Density Metric"}
                      </span>
                        <span className="text-xs text-[#1C1C1C] font-light">
                        {matDensity}
                      </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-start">
                      <Landmark className="w-4 h-4 text-[#8E7A62] mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                      <div>
                      <span className="text-[10px] font-mono text-[#5C5954] tracking-widest uppercase block">
                        {isFarsi
                            ? "پیشینه و خاستگاه تاریخی"
                            : "Historical Provenance"}
                      </span>
                        <span className="text-xs text-[#1C1C1C] font-light leading-relaxed">
                        {matHistory}
                      </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-start">
                      <Hammer className="w-4 h-4 text-[#8E7A62] mt-1 mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                      <div>
                      <span className="text-[10px] font-mono text-[#5C5954] tracking-widest uppercase block">
                        {isFarsi
                            ? "شناسنامه‌ی بافت مادی"
                            : "Core Surface Qualities"}
                      </span>
                        <ul className="list-disc pl-4 rtl:pl-0 rtl:pr-4 text-xs text-[#5C5954] mt-1 space-y-1 font-light">
                          {matProperties.map((prop, index) => (
                              <li key={index}>{prop}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </MaisonReveal>
          </div>
        </div>
      </section>
  );
}
