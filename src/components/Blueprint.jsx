"use client";

import { useState } from "react";
import MaisonReveal from "./MaisonReveal";
import { useLanguage } from "../lib/TranslationService";
const BLUEPRINT_SECTIONS = [
  {
    id: "design-system",
    title: "01. Aesthetic Systems & Identity",
    category: "Visual Archetype",
    summary:
        "Complete design, typography, color, and spacing specifications designed for lasting premium visual authority.",
    content: `### 1. FULL DESIGN SYSTEM
Our design system is based on the principle of **Architectural Honesty**. There is no tech-larping, no margin clutter, and no artificial neon glows. It prioritizes pristine alignment, tactile materials representation, and heavy negative space.

### 2. TYPOGRAPHY SYSTEM
- **Display Typography (Headings):** \`Playfair Display\` (Serif). Confident, traditional yet modern, designed for large editorial tracking-tight titles. Used at \`text-4xl\` up to \`text-8xl\`.
- **UI Core Elements:** \`Inter\` (Sans-serif). Exceptionally legible, lightweight, clean.
- **Specification Elements:** \`JetBrains Mono\` (Monospace). Captures technical precision for dimensions, pricing sheets, weights, and dates.

### 3. COLOR SYSTEM
- **Base Canvas:** \`#FAF9F6\` (Sand Sand-100). Safe on eyes, warm off-white that reminds players of raw plaster or linen.
- **Contrast Base:** \`#1C1C1C\` (Deep Graphite / Charcoal). Pure deep stone tone, high contrast without the artificial harshness of black.
- **Natural Midtones:** \`#F4F2EB\` (Sand-200), \`#EAE7DC\` (Sand-300). Used for card bases, structural gutters, and dividers.
- **Luxury Spot Colors:** \`#C5A880\` (Bronze Light), \`#8C7355\` (Bronze Dark). Earthy bronze accents representing patinated metal.

### 4. SPACING SYSTEM
- **Gutter Rule:** 1.5x proportional multipliers.
- **Section Spacing:** Generous \`py-24\` (96px) and \`py-36\` (144px) to create vertical breathing room. Whitespace is managed as a core visual luxury asset.
- **Grid Layouts:** Dynamic 12-column asymmetric setups supporting off-axis focal points.`,
    tags: ["Typography", "Color System", "Margins", "CSS Variables"],
    farsi: {
      title: "۰۱. سیستم‌های زیبایی‌شناسی و ساختار هویت",
      category: "الگوهای هویت بصری",
      summary:
          "جزئیات کامل طراحی، تایپوگرافی، پالت رنگ و فواصل معمارانه جهت پایداری غایی ارزش‌های بصری آتلیه.",
      content: `### ۱. فلسفه کلان سیستم طراحی
سیستم بصری ما بر پایه اصل **اصالت ساختار معمارانه** بنا شده است. فاقد هرگونه تزئینات و شلوغی‌های اضافه، خطوط نوری مصنوعی یا جزئیات تظاهرآمیز است. تمرکز غایی این گالری بر تقارن‌های مینیمال، انعکاس بافت کدر سنگ‌های طبیعی و جادوی فضاهای وسیع تنفسی است.

### ۲. استانداردهای تایپوگرافی کارگاه زاد
- **تایپوگرافی نمایشگاه (تیترها):** سریف فاخر برای عناوین بزرگ و کلاسیک معمارانه جهت القای اصالت سنگ‌تراشی.
- **ساختار متون وب:** سبک خوانا و مدرن بدون پچیدگی در وزن‌های لطیف.
- **جداول مشخصات فنی:** فونت منو جهت نمایش دقیق اندازه‌گیری‌ها، وزن آثار، زمان ساخت و شماره کاتالوگ‌ها.

### ۳. پالت طبع طبیعت و رنگ خام
- **آستین زمینه آتلیه:** کرم روشن رمل مانند طبیعی که حس کدر لایه‌های پلاستر، مالت و جدار گچی را زنده می‌کند.
- **کنارپرداز متضاد:** خاکستری گرافیت ذغالی کاملا کدر که غلظت سنگین تندیسی را بدون سیاهی مصنوعی پدید می‌آورد.
- **نواحی عمق و کناره‌ها:** رنگ طبیعی برنز اکسید شده و لایه‌های خام اکسپوز سنگی.

### ۴. قوانین فواصل و تعادل
- **تناسب گالری:** ضریب‌های فواصل هندسی ۱.۵ برابری.
- **فضای تنفس معمارانه:** ایجاد حاشیه‌های بزرگ و تعمدی در گوشه‌ها جهت القای وقار و دور کردن استرس صفحات تجاری شلوغ.`,
      tags: ["تایپوگرافی", "پالت رنگ تراورتن", "ابعاد هندسی", "قالب‌بندی کدر"],
    },
  },
  {
    id: "ux-strategy",
    title: "02. Core Sitemap & UX Strategy",
    category: "Information Architecture",
    summary:
        "Section-by-section strategic user flows, site schema, sitemap, and component layout hierarchies.",
    content: `### 5. COMPLETE SITEMAP
The architecture of ZAAD is designed to eliminate cognitive load and visual noise.
- **Primary Domain Root (Single Multi-Perspective Showroom View)**
  - **I. Hero Entrance Section (First Impression / Monograph Title)**
  - **II. Brand Story Section (Manifesto / Craftsmanship Origin)**
  - **III. Curated Collection Showcase (Numbered Works - N°01, N°02, N°03)**
  - **IV. Material Analysis Explorer (Interactive Tactile Grid)**
  - **V. Concierge Intake Panel (Client inquiry form + Live AI Curator)**
- **Meta-Directory Segment (Interactive Studio Design Blueprint System)**

### 6. HOMEPAGE STRUCTURE
Engineered as a cinematic scroll narrative that transitions from abstract core statements to functional museum-grid detailed interactions.

### 7. SECTION-BY-SECTION UX STRATEGY
1. **Hero Intake:** Establish prestige instantly via a stunning high-resolution architectural header. Use brief aspirational copy (\`Quietude is the highest form of resolution\`).
2. **The Manifesto Story:** Slow down the reader's attention with a large-format travertine stone closeup, paired with the atelier history.
3. **The Object Grid:** Reveal curated products individually rather than mass grids. Allow people to switch from Editorial to Macro View to feel the loop textures of wool or stone craters.
4. **The Concierge Chat:** Remove traditional static contact forms. Introduce an elite digital curator (Gemini API) that counsels clients on how objects interact with room sunlight.`,
    tags: ["Sitemap", "User Journey", "UX Hierarchy", "Curatorship"],
    farsi: {
      title: "۰۲. نقشه مرکزی فضا و استراتژی تعامل",
      category: "معماری اطلاعات معمارانه",
      summary:
          "سلسله مراتب مسیرهای گام‌به‌گام تعامل بازدیدکنندگان حرفه‌ای، جزئیات ساختار سئو و نقشه‌های کلی تعبیه ابژه‌ها.",
      content: `### ۵. نقشه ساختاری فضای گالری
شاکله گالری دیجیتال زاد به گونه‌ای مهندسی شده است که ترافیک ذهنی و سر و صدای چشمی را با تدارک مسیر یکپارچه مرتفع کند.
- **ریشه دپارتمان مرکزی (نمایشگاه تک صفحه چند وجهی)**
  - **گام اول: پیشواز معمارانه (کتیبه و غبار آغازین اثر)**
  - **گام دوم: روایت سینه به سینه (بیانیه آتلیه و خاستگاه معادن توسکانی)**
  - **گام سوم: سالن اختصاصی ابژه‌های نام‌دار (آثار شماره‌گذاری شده و آرشیوی)**
  - **گام چهارم: اطلس مادی سنگ‌های خام کارگاه**
  - **گام پنجم: پیشخان پذیرش تدارکات و هوش دیجیتال مشاور**
- **صفحات پیوست اسناد (آرشیو فنی و نقشه‌های معماری ابژه‌ها)**

### ۶. سناریوی گام‌به‌گام تعامل بازدیدکننده
۱. **پذیرش اولیه خریدار:** تثبیت اصالت برند در کسر اول ورود با تصاویر گرانبهای باکیفیت و واژگان غایت غنی.
۲. **تعلیق چشم:** مکث دادن به ضربان بافت تراورتن کات شده تا بازدیدکننده متوجه مانیفست آرام آتلیه گردد.
۳. **تمرکز بر تک‌اثر:** حذف آشفتگی فروشگاهی با نشان دادن تک آلبوم‌ها به همراه تغییر فوری زاویه دید به نمای ماکرو لمسی.
۴. **تکمیل تدارکات:** فرآیند پاسخگویی دستیار با هوش کارگزاری شده بدون فرم‌های مرسوم خسته‌کننده اداری.`,
      tags: [
        "مسیر حرکت خریدار",
        "سازه اطلاعاتی",
        "چرخه گاری مجهز",
        "شالوده مدرن",
      ],
    },
  },
  {
    id: "interaction",
    title: "03. Code Architecture & Motion Specs",
    category: "Technical Frontend",
    summary:
        "Animation specifications, mobile adaptations, front-end implementation path, and premium interactions.",
    content: `### 8. COMPONENT ARCHITECTURE (React + Vite + ESM)
Designed as highly modular, lightweight files to avoid package bloat:
- \`Header.tsx\`: Transparent navigation with dynamic scrolls.
- \`Hero.tsx\`: Staggered entrance animations.
- \`Story.tsx\`: Grid layouts presenting material narratives.
- \`Showcase.tsx\`: Single-object focal viewer. Supports multi-view texture analysis.
- \`Materials.tsx\`: Geographic micro-explorer.
- \`Concierge.tsx\`: Acquisition scheduler + Server-side Gemini chat gateway.

### 9. MOBILE ADAPTATIONS
- All tap targets are strict \`min-h-[44px]\` minimum.
- Vertical layout shifts content smoothly to a single premium vertical catalog on smaller viewport break points.
- Scroll indicators and text dimensions adapt with precise Tailwind screen widths.

### 10. ANIMATION SPECIFICATIONS (Framer Motion)
- **Entrance Ease:** Staggered transitions with luxury cubic-bezier eases (\`ease: [0.16, 1, 0.3, 1]\` - Ultra-fluid entrance).
- **Duration Tuning:** Main reveals trigger at \`1.2s\` to \`1.8s\` to reinforce premium confidence.
- **Macro Image Dissolves:** Smooth dissolve crossfades (\`duration: 0.6s\`) when transitioning between editorial product and macro detail coordinates.`,
    tags: [
      "Modular Architecture",
      "Framer Motion",
      "Viewport",
      "CSS Transitions",
    ],
    farsi: {
      title: "۰۳. مهندسی نرم‌افزار و فیزیک انیمیشن‌ها",
      category: "توسعه کدهای فرانت‌اند",
      summary:
          "مشخصات فنی توسعه ماژولار کامپوننت‌های سبک، متدهای حرکتی، کارکرد لمسی پیشرفته موبایل و لودهای سینک شده.",
      content: `### ۷. مهندسی کامپوننت‌های فرانت‌اند
اجزای رابط برنامه‌نویسی به صورت کامپوننت‌های مجزای کاملا واکنشی بنا شده است تا سرعت بارگذاری صفحات را حداکثر نگاه دارد:
- \`Header.tsx\`: سازه ناوبری شناور با محاسبات اسکرول نرم.
- \`Hero.tsx\`: جلوه‌های تاخیری کتیبه‌های بالا.
- \`Showcase.tsx\`: کنترل عمیق روی رندر و کلاژ زوم چند جهته.
- \`Concierge.tsx\`: پذیرش‌گر تدارکات تملک به اضافه درگاه پروکسی لایو هوش در سرور.

### ۸. هماهنگی کامل کاربری صفحات لمسی
- کلیه فواصل دکمه‌های آتلیه دارای گستره دسترسی حداقل ۴۴ پیکسل برای تپ روان روی شیشه‌های گوشی است.
- چیدمان‌های فرعی به جای متلاشی شدن ناگهانی، در کادرهای عرض متوسط موبایل به ستون‌های عمودی ظریفی جابجا می‌شوند تا حس کاتالوگ چاپی محفوظ بماند.

### ۹. فیزیک ترنزیشن‌های حرکتی کارگاه
- **منحنی‌های سرعت:** عبور انحصاری از ترنزیشن‌های کندشونده سیال سینوسی جهت القای وزن ابژه‌ها.
- **زمان رندرهای عمیق:** لود و محو تدریجی کلاژها همزمان با بارگذاری تصویر ماکرو با متدهای بهینه اسلایدر موازی.`,
      tags: ["معماری ماژولار", "قالب حرکتی موشن", "کاربرد موبایل لمسی"],
    },
  },
  {
    id: "production",
    title: "04. Optimization, SEO & Roadmap",
    category: "Digital Compliance",
    summary:
        "Accessibility, performance assets strategy, SEO schemas, and step-by-step launch roadmap.",
    content: `### 11. ACCESSIBILITY STRATEGY (WCAG)
- **Contrast Ratios:** Text pairings exceed strict WCAG AA contrast against Sand-100 panels (Charcoal text matches a high contrast 14.3:1 ratio).
- **Reduced Motion Support:** All transitions utilize motion media queries (\`@media (prefers-reduced-motion)\`) to gracefully degrade to static displays.
- **Aria Roles:** Full implementation on interactive inputs, select triggers, and button elements.

### 12. PERFORMANCE OPTIMIZATION STRATEGY
- **Asset Sizing:** Image files utilize modern web formats (.webp / .avif) and lazy-load using \`referrerPolicy="no-referrer"\`.
- **HMR Disabling:** The framework handles incremental development saves cleanly, avoiding flashing or layout reflow jitter.
- **GPU Accelerated Transforms:** Framer Motion configurations strictly leverage GPU pathways (translate3d, opacity) to yield fluid 60fps on mobile.

### 13. SEO STRUCTURE & SCHEMA
- **Metadata Card:** Fully updated with clean, literal descriptions.
- **Structured Data:** Implements JSON-LD LocalBusiness and Product schemas for high-end search engine crawling.

### 14. PRODUCTION-READY ROADMAP
1. **Atelier Verification:** Finalize core layout builds on Port 3000.
2. **Environment Setup:** Secure and test the server-side \`GEMINI_API_KEY\` key via the platform settings.
3. **Staging Review:** Test accessibility compliance across viewports.
4. **Deploy:** Compile using \`esbuild\` into a single, highly performant \`server.cjs\` executable.`,
    tags: ["SEO Schema", "Roadmap", "Core Web Vitals", "Optimization"],
    farsi: {
      title: "۰۴. انطباق بین‌المللی، بهینه‌سازی و نقشه راه تدارکات",
      category: "استانداردها و تدارکات استقرار",
      summary:
          "دستیابی به کنتراست‌های عالی خوانایی، استراتژی لود فشرده دارایی‌های رسانه‌ای، الگوهای سئو و نقشه راه استقرار نهایی.",
      content: `### ۱۰. دسترسی آسان خریداران و کنتراست‌ها
- **نرخ‌های کنتراست:** ترکیب رنگ خاکستری تیره با پس‌زمینه خام گچی دارای نرخ غایت ایمن است تا در تبلت‌ها و در هر نور خورشیدی بدون بازتاب بد خوانده شود.
- **پشتیبانی از لغو ترنزیشن حرکتی:** کدهای فرانت بر طبق ترجیحات سخت‌افزاری تبلت‌های مهندسین معمار، به طور هوشمند جلوه‌ها را برای ثبات راندمان متوقف می‌کنند.

### ۱۱. بهینه‌سازی سنگین سرعت رندر
- **دارایی‌های سنگبری دیجیتال:** رفرنس فرمت‌های نوین تصاویر به نحو تنبل لود شده و ترافیک پردازش اضافی لغو می‌گردد.
- **خنثی‌سازی پردازش سنگین:** ماژول لایو چت و رندرهای سه بعدی تنها در زمان نیاز فعال می‌شوند تا هسته مرورگر خریدار ترافیک مصرفی بیهوده نداشته باشد.

### ۱۲. نقشه راه و آمادگی کامل
۱. **آراستگی کد کارگاه:** همخوانی قطعی بر روی درگاه ۳۰۰۰ محیط داکرباکس.
۲. **حفظ اسرار محرمانه:** راه‌اندازی توکن اختصاصی دستیار دیجیتال در لایه سرور بدون نشر اطلاعات بر روی کلاینت.
۳. **استقرار غایی سئو:** تعریف اسکیماهای لوکس تجاری جهت خوانش رده بالا در موتورهای جستجوی لوکس معماری.`,
      tags: ["اسکیمای سئو فنی", "زمان لود کارگاه", "انطباق لوکس مدرن"],
    },
  },
];
export default function Blueprint() {
  const { isFarsi } = useLanguage();
  const [selectedSection, setSelectedSection] = useState(BLUEPRINT_SECTIONS[0]);
  const category =
      isFarsi && selectedSection.farsi
          ? selectedSection.farsi.category
          : selectedSection.category;
  const title =
      isFarsi && selectedSection.farsi
          ? selectedSection.farsi.title
          : selectedSection.title;
  const summary =
      isFarsi && selectedSection.farsi
          ? selectedSection.farsi.summary
          : selectedSection.summary;
  const content =
      isFarsi && selectedSection.farsi
          ? selectedSection.farsi.content
          : selectedSection.content;
  const tags =
      isFarsi && selectedSection.farsi
          ? selectedSection.farsi.tags
          : selectedSection.tags;
  return (
      <div className="py-24 md:py-32 bg-[#F4F1ED] min-h-screen text-left rtl:text-right">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Intro */}
          <MaisonReveal variant="unveil" threshold={0.02}>
            <div className="border-b border-[#1C1C1C]/10 pb-8 mb-12">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#8E7A62] font-semibold uppercase block mb-2">
              {isFarsi ? "اسناد و مانیفست فنی آتلیه" : "STUDIO ARCHIVES"}
            </span>
              <h1 className="text-3xl md:text-5xl font-serif text-[#1C1C1C] tracking-tight font-light">
                {isFarsi ? "جزئیات فنی و مانیفست زاد" : "ZAAD Blueprint"}
              </h1>
              <p className="text-sm md:text-base text-[#5C5954] mt-2 font-light max-w-2xl leading-relaxed">
                {isFarsi
                    ? "ارائه جامع ساختار هندسی، کالیبراسیون‌های بصری، تایپوگرافی، پالت‌های خام و فرآیندهای تجربه کاربری معمار طراحی وب آتلیه زاد."
                    : "The full structural, typographical, UX, and technical architecture requested to launch a world-class luxury web platform built with ultimate engineering discipline."}
              </p>
            </div>
          </MaisonReveal>

          {/* Dynamic Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Menu column */}
            <MaisonReveal
                variant="slide-up-royal"
                delay={0.1}
                className="lg:col-span-4 space-y-4"
            >
            <span className="text-[9px] font-mono tracking-widest text-[#5C5954] block uppercase mb-2">
              {isFarsi ? "مرور پرونده‌های جامع" : "EXPLORE BRIEFING FILES"}
            </span>
              {BLUEPRINT_SECTIONS.map((sec) => {
                const secCategory =
                    isFarsi && sec.farsi ? sec.farsi.category : sec.category;
                const secTitle =
                    isFarsi && sec.farsi ? sec.farsi.title : sec.title;
                const secSummary =
                    isFarsi && sec.farsi ? sec.farsi.summary : sec.summary;
                return (
                    <button
                        key={sec.id}
                        onClick={() => setSelectedSection(sec)}
                        className={`w-full text-left rtl:text-right p-5 border text-xs transition-all duration-300 rounded-xl focus:outline-none flex flex-col cursor-pointer ${selectedSection.id === sec.id ? "bg-white border-[#1C1C1C] shadow-md" : "bg-white/40 border-[#1C1C1C]/10 hover:bg-white"}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono text-[#8E7A62] font-semibold uppercase tracking-widest">
                      {secCategory}
                    </span>
                      </div>
                      <span className="text-sm font-serif font-light text-[#1C1C1C] block mb-1">
                    {secTitle}
                  </span>
                      <span className="text-[11px] text-[#5C5954] leading-relaxed font-light font-sans">
                    {secSummary}
                  </span>
                    </button>
                );
              })}
            </MaisonReveal>

            {/* Doc rendering column */}
            <MaisonReveal
                variant="scale-down-unveil"
                delay={0.25}
                className="lg:col-span-8 bg-[#E8E4DF]/60 p-8 border border-[#1C1C1C]/10 shadow-sm rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#1C1C1C]/10 pb-4 mb-6 text-xs font-mono">
              <span className="text-[#8E7A62] uppercase tracking-widest font-semibold">
                {category} / {isFarsi ? "پرونده فنی جاری" : "CHAPTER FILE"}
              </span>
                <span className="text-[#5C5954] uppercase tracking-widest">
                {isFarsi ? "وضعیت سند: تایید علمی" : "STATUS: COMPLIANT"}
              </span>
              </div>

              {/* Custom markdown-esque rendering for precision and high luxury feel */}
              <div className="prose max-w-none text-[#1C1C1C] text-sm md:text-base font-light leading-relaxed whitespace-pre-line space-y-6">
                {content}
              </div>

              {/* Rendered tag list */}
              <div className="border-t border-[#1C1C1C]/10 pt-6 mt-8">
              <span className="text-[9px] font-mono text-[#5C5954] uppercase block mb-3">
                {isFarsi
                    ? "برچسب‌های سیستم فنی جاری:"
                    : "BLUEPRINT SYSTEM TAGS:"}
              </span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tg, idx) => (
                      <span
                          key={idx}
                          className="bg-white border border-[#1C1C1C]/10 text-[10px] font-mono px-3 py-1.5 text-[#1C1C1C] uppercase tracking-wider rounded-full"
                      >
                    {tg}
                  </span>
                  ))}
                </div>
              </div>
            </MaisonReveal>
          </div>
        </div>
      </div>
  );
}
