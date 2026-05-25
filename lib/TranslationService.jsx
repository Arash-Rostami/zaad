"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// Interface for general site texts to keep it structured and high fidelity
const INTERFACE_TRANSLATIONS = {
  en: {
    // Header
    showroom: "Showroom",
    blueprints: "System Blueprints",
    manifesto: "About / Manifesto",
    conciergeTitle: "Inquiry & Concierge",
    lightMode: "Chiaroscuro: Light",
    darkMode: "Chiaroscuro: Dark",
    selectLanguage: "Farsi / فارسى",
    // Hero
    bespokeObjects: "Bespoke Sculptural Objects",
    heroTitle_1: "Simplicity is the",
    heroTitle_italic: "ultimate level",
    heroTitle_2: "of sophistication.",
    heroDesc:
      "The digital showroom of ZAAD. We design physical, numbered objects crafted in Tuscan quarries and Milanese ateliers, designed to outlive trends.",
    exploreCollection: "Explore Collection ↓",
    ourPhilosophy: "Our Philosophy",
    monograph: "Maison Monograph 2026",
    heroQuote:
      "The spacing of an object is as critical as the material itself. We define physical emptiness.",
    estFlorence: "EST. MCMLXXXIX — FLORENCE",
    // Story (Manifesto)
    manifestoBadge: "The Manifesto",
    storyQuote: "To assemble a space is to curate the silence within it.",
    storyEmilio: "— EMILIO CAVALCANTI, HEAD CUTTER",
    storyTactile:
      "The tactile memory of Travertine stone lingers forever on human touch.",
    rawOrigin: "RAW ORIGIN",
    quarryLocation: "Rapolano Classico Quarry, Section IV (Tuscany)",
    storyEndText:
      "Rather than forcing items into noisy digital layouts, we treat each creation as curated museum inventory. When you place one of our works in your architectural residence, you are setting down a quiet reference point that will persist for centennials.",
    weeksAssembly: "Weeks Assembly",
    assemblyDays: "14",
    sourcedItaly: "Sourced in Italy",
    curatedCount: "3",
    curatedLabel: "Curated Objects",
    // Showcase Section
    showcaseBadge: "The Collection",
    showcaseTitle: "Curated Showcase",
    editorialView: "Editorial View",
    macroView: "Macro Detail",
    viewDetails: "View Specification Dossier ↗",
    inquireBtn: "Acquiring Inquiry",
    dimensionsLabel: "Dimensions",
    designerLabel: "Architectural Designer",
    materialsLabel: "Primary Minerals & Timber",
    yearLabel: "Year of Genesis",
    provenanceLabel: "Atelier Provenance",
    specTitle: "Specimen Characteristics",
    weightLabel: "Weight Metric",
    leadTimeLabel: "Lead Time Estimation",
    originLabel: "Geographical Origin",
    finishLabel: "Surface Tactility",
    partnersTitle: "Integrated Blueprints & Hardware",
    typologyLabel: "Typology",
    hardwareLabel: "Hardware Engineering",
    appliancesLabel: "Appliance Suite",
    furnitureLabel: "Accompanying Furniture",
    accessoriesLabel: "Internal Storage Accessories",
    lightLabel: "Micro Profile Illumination",
    // Materials Section
    materialsBadge: "Material Analysis Core",
    materialsTitle: "Tactile Index & Character Analysis",
    materialsSubtitle:
      "To select a material is to formulate a tactile language. Hover or touch to read the mineral properties curated by the studio.",
    propertiesLabel: "Mineral Properties:",
    densityLabel: "Volumetric Density",
    porosityLabel: "Structural Porosity",
    hardnessLabel: "Mineral Hardness",
    // Concierge / Contact Section
    conciergeBadge: "Acquisition Concierge",
    conciergeTitleText: "Establish Connection",
    conciergeDesc:
      "Our numbered architectural artifacts are produced in highly limited collections. Commencing a commission enters you into the direct care of our regional concierge.",
    formSelectedProduct: "Selected For Commission",
    formFullName: "Your Full Name",
    formEmail: "Electronic Mail Address",
    formLocation: "Intended Installation City",
    formNotes: "Architectural Context & Special Requests",
    formSending: "Transmitting Credentials...",
    formSuccess:
      "Connection Established. Our representative will contact you in 48 hours with technical specifications.",
    formSubmit: "Initiate Acquisition Process",
    // Assistant Bot Section
    assistantBadge: "AI CONCIERGE ASSISTANT",
    assistantTitle: "Real-time Material Curation Agent",
    assistantDesc:
      "Consult with our server-bound virtual assistant on quarry origins, structural weight constraints, and bespoke architectural integration.",
    assistantInputPlaceholder:
      "Ask about marble quarries, shipping coordinates, or delivery times...",
    assistantSend: "PROBE",
    assistantLoading: "Analyzing materials...",
    // Blueprints Section
    blueprintsBadge: "System Architecture",
    blueprintsTitle: "Integrated Blueprints",
    blueprintsSub:
      "Detailed engineering layouts illustrating pocket doors, interlocking timber joints, and modular stone cantilevers.",
    specValueLabel: "Value Metric",
    // Lightbox / Detail page buttons
    backToCollection: "← Back to Collection View",
    specifications: "Specifications",
    narrative: "Narrative & Origins",
    islandLayout: "Island Systems",
    tallUnitsLayout: "Tall Cabinets",
    applianceList: "Appliance Specs",
    zoomHint: "[ Touch-drag or hover over image to pan texture detail ]",
    resolvingSpecimen: "RESOLVING SPECIMEN DETAIL...",
    inquireThis: "Inquire About This Curated System",
    closeDossier: "Close Specification Dossier",
    tactileLens: "TACTILE LENS (3.0X)",
    // Footer
    footerTitle: "ZAAD Atelier",
    footerDesc:
      "An independent architectural atelier designing silent monolithic cabinetry, sculpted stone tables, and mineral-honest spatial assets.",
    newsletterTitle: "Maison Circular",
    newsletterDesc:
      "Subscribe to receive private catalogues, quarry extraction reports, and blueprint release notifications.",
    newsletterPlaceholder: "email@address.com",
    newsletterBtn: "Register",
    rightsReserved:
      "All rights reserved. Styled for quiet luxury. Built in Florence & Milan.",
  },
  fa: {
    // Header
    showroom: "نمایشگاه",
    blueprints: "نقشه‌های مهندسی",
    manifesto: "درباره ما / بیانیه",
    conciergeTitle: "هماهنگی و پشتیبانی",
    lightMode: "درخشندگی: روشن",
    darkMode: "درخشندگی: تاریک",
    selectLanguage: "English / انگلیسی",
    // Hero
    bespokeObjects: "اشیاء مجسمه‌سازانه سفارشی",
    heroTitle_1: "سادگی",
    heroTitle_italic: "غایت و اوجِ",
    heroTitle_2: "پیچیدگی است.",
    heroDesc:
      "نمایشگاه دیجیتال کارگاه طراحی زااد. ما اشیاء منحصربه‌فرد، شماره‌دار و ماندگاری را طراحی می‌کنیم که در معادن توسکانی و آتلیه‌های میلان با ظرافت خلق شده‌اند.",
    exploreCollection: "کاوش در مجموعه‌ها ↓",
    ourPhilosophy: "فلسفه و خط فکری ما",
    monograph: "مونوگراف مکتوب زمانه ۲۰۲۶",
    heroQuote:
      "فضای خالیِ پیرامون یک شیء به اندازه خود ماده حیاتی است. ما تهی بودن فیزیکی را معنا می‌بخشیم.",
    estFlorence: "تأسیس ۱۳۶۸ — فلورانس ایتالیا",
    // Story (Manifesto)
    manifestoBadge: "بیانیه طراحی",
    storyQuote:
      "چیدمان و آفرینش یک فضا، در حقیقت هنرِ تنظیم سکوتِ جاری در آن است.",
    storyEmilio: "— امیلیو کاوالکانتی، استاد سنگ‌تراش",
    storyTactile:
      "حافظه لمسی سنگ تراورتن همواره بر سرانگشتانِ آدمی باقی خواهد ماند.",
    rawOrigin: "منشأ خالص مواد",
    quarryLocation: "معدن راپولانو کلاسیکو، بخش چهارم (توسکانی جادویی)",
    storyEndText:
      "ما به جای عرضه محصولاتمان در ویترین‌های پرسروصدا و انبوه دیجیتال، با هر یک از آثارمان همچون اثری ارزشمند در موزه رفتار می‌کنیم. انتخاب یکی از سازه‌های ما برای خانه‌تان، نشاندن نشانه ثبات و سکوتی بی‌پایان به درازای دوران است.",
    weeksAssembly: "هفته‌ها کارِ دست",
    assemblyDays: "۱۴",
    sourcedItaly: "ساخت کامل در ایتالیا",
    curatedCount: "۳",
    curatedLabel: "سازه دست‌چین‌شده",
    // Showcase Section
    showcaseBadge: "مجموعه دست‌سازها",
    showcaseTitle: "ویترین اختصاصی",
    editorialView: "نمای هنری",
    macroView: "جزئیات مایکرو",
    viewDetails: "مشاهده شناسنامه و جزئیات فنی ↗",
    inquireBtn: "درخواست مشاوره خرید",
    dimensionsLabel: "ابعاد و اندازه",
    designerLabel: "معمار و طراح اثر",
    materialsLabel: "مواد معدنی و چوب اولیه",
    yearLabel: "سال ابداع و معرفی",
    provenanceLabel: "زادگاه و آتلیه تولید",
    specTitle: "مشخصات و ماهیت اثر",
    weightLabel: "وزن فیزیکی تقریبی",
    leadTimeLabel: "زمان برآورد ساخت",
    originLabel: "خواستگاه جغرافیایی",
    finishLabel: "لطافت لمس سطوح",
    partnersTitle: "یراق‌آلات و پیوستگی فنی",
    typologyLabel: "طبقه‌بندی اثر",
    hardwareLabel: "مهندسی یراق آلات",
    appliancesLabel: "تجهیزات مکمل توکار",
    furnitureLabel: "مبلمان همراه سفارشی",
    accessoriesLabel: "تجهیزات و کشوهای داخلی",
    lightLabel: "نورپردازی ظریف داخلی",
    // Materials Section
    materialsBadge: "هسته تحلیل مواد",
    materialsTitle: "شاخص حسی و تحلیل ماهیت گرانیتی",
    materialsSubtitle:
      "انتخاب هر ماده، گویای زبانیِ حسی و لمس‌کردنی است. برای مطالعه‌ی ویژگی‌های معدنی دست‌چین‌شده، روی کارت‌ها نگه دارید یا لمس کنید.",
    propertiesLabel: "ویژگی‌های ساختاری:",
    densityLabel: "تراکم حجمی سنگ",
    porosityLabel: "تخلخل بافت درونی",
    hardnessLabel: "درجه سختی معدنی",
    // Concierge / Contact Section
    conciergeBadge: "پشتیبانی و هماهنگی خرید",
    conciergeTitleText: "آغاز گفت‌وگو و ارتباط",
    conciergeDesc:
      "اشیاء معماری شماره‌گذاری‌شده ما در تیراژ بسیار محدودی تولید می‌شوند. با ثبت درخواستِ خود، مستقیماً با کارشناس ارشد ما در منطقه خود ارتباط برقرار کنید تا کاتالوگ شخصی ارسال شود.",
    formSelectedProduct: "محصول مد نظر جهت سفارش",
    formFullName: "نام و نام خانوادگی شما",
    formEmail: "نشانی پست الکترونیکی",
    formLocation: "شهر هدف جهت نصب و بارگیری",
    formNotes: "فضای معماری ساختمان و خواسته‌های ویژه شما",
    formSending: "در حال فرستادن اطلاعات...",
    formSuccess:
      "ارتباط با موفقیت برقرار شد. کارشناسان ما تا ۴۸ ساعت آینده با جزئیات کامل فنی با شما تماس خواهند گرفت.",
    formSubmit: "آغاز فرآیند ثبت و مشاوره سفارش",
    // Assistant Bot Section
    assistantBadge: "دستیار و مشاور هوش مصنوعی",
    assistantTitle: "راهنما و مشاور هوشمند مواد معدنی",
    assistantDesc:
      "در مورد منبع اولیه سنگ‌ها، محدودیت بار سنگ، هماهنگی‌های لوجستیک و نصب بومی بپرسید تا هوش مصنوعی ما به سرعت پاسخ دهد.",
    assistantInputPlaceholder:
      "در مورد معادن سنگ، زمان ارسال و ابعاد بومی بپرسید...",
    assistantSend: "بررسی",
    assistantLoading: "تحلیل ذرات و داده‌ها...",
    // Blueprints Section
    blueprintsBadge: "مهندسی سیستم‌ها",
    blueprintsTitle: "نقشه‌های ساختاری",
    blueprintsSub:
      "بررسی الگوهای صنعتی، مکانیزم تاشوی کشوها، اتصالات چوبی ظریف و قطعات فلزی معلق جزیره‌ها.",
    specValueLabel: "شاخص کیفیت و اندازه",
    // Lightbox / Detail page buttons
    backToCollection: "← بازگشت به ویترین مجموعه‌ها",
    specifications: "ویژگی‌های فنی",
    narrative: "داستان و ریشه آفرینش",
    islandLayout: "سیستم‌های جزیره",
    tallUnitsLayout: "کابینت‌های قدبلند",
    applianceList: "مشخصات تجهیزات توکار",
    zoomHint: "[ جهت بررسی دقیق تر بافت سنگ، ماوس را حرکت دهید یا لمس کنید ]",
    resolvingSpecimen: "در حال واکاوی دقیق ساختار سنگ...",
    inquireThis: "درخواست سفارش این اثر فاخر",
    closeDossier: "بستن شناسنامه مشخصات فنی",
    tactileLens: "عدسی لمسی تلسکوپی (۳.0X)",
    // Footer
    footerTitle: "آتلیه معماری زااد",
    footerDesc:
      "یک کارگاه معماری مستقل و بی‌بدیل، پیشرو در طراحی سیستم‌های آشپزخانه مونوکل، میزهای سنگی تراشیده شده و دارایی‌های حسی ماندگار.",
    newsletterTitle: "خبرنامه مکتوب",
    newsletterDesc:
      "برای دریافت کاتالوگ‌های اختصاصی، بررسی معادن تازه کشف شده و انتشارات فنی به ما بپیوندید.",
    newsletterPlaceholder: "your-email@domain.com",
    newsletterBtn: "اشتراک",
    rightsReserved:
      "تمامی حقوق مادی و معنوی محفوظ است. طراحی شده برای سکوتِ لوکس. ساخت فلورانس و میلان.",
  },
};

// Item translations for data items to ensure fully integrated Arabic/Farsi experience
export const COLLECTION_ITEMS_TRANSLATED = {
  en: {
    gavv: {
      name: "GÁVV",
      dimensions:
        "Island: Part A (3.0m L), Part B (2.0m L). Tall Units Area: 5.4m W x 2.98m H",
      materials: [
        "MDF Nature Ocaliptus (Eucalyptus) Veneer",
        "Friction-Burnished Rapolano Stone",
        "Italian Saddle Leather Cylinders",
        "Anodized Black Aluminum",
        "Solid American Walnut",
      ],
      description:
        "An architectural kitchen landscape celebrating raw earth, origin, and functional symmetry. GÁVV organizes the domestic space into a dual-island centerpiece and a massive full-height wall cabinet system, utilizing pocket-hinge doors, nature eucalyptus surfaces, and leather-wrapped steel details.",
      story:
        "GÁVV represents a narrative born from soil and stone. Designed on a system of quiet grandeur. The cabinetry features active pocket doors in Eucalyptus natural veneer with custom handles made of iron cylinders wrapped in genuine saddle leather. The structural islands are carved from solid thermal Rapolano stone, offering a heavy, grounding physical presence.",
      provenance:
        "Designed in ZAAD Milan Atelier; Stone milled and hand-carved in Rapolano Terme, Tuscany. Signed by the master stonecutter and cabinetmaker.",
      leadTime: "16 to 20 weeks (curated build)",
      finish:
        "Natural wax burnished stone, Eucalyptus veneer with tactile leather cylinder handles",
      origin: "Atelier Milan & Tuscany, Italy",
      islandSpecs: {
        overview:
          "The GÁVV island functions as the architectural heart of the kitchen space, split into two separate, stone-clad blocks to maximize visual lightness and spatial flow.",
        partA: {
          title: "Part A — Working Monolith (3.0 meters)",
          bullets: [
            "Primary hub of preparation and daily kitchen operations.",
            "Seamlessly integrates the dual induction cooktop, large format undermount sink, and concealed dishwasher.",
            "Internally arranged to minimize physical movement between water and heat zones.",
            "Optimized drawers and pull-outs in 22mm Eucalyptus timber.",
          ],
        },
        partB: {
          title: "Part B — Social Monolith (2.0 meters)",
          bullets: [
            "Curated snack counter for serving wine, refreshments, and casual breakfast.",
            "Cantilevering 8mm black anodized industrial aluminum tray.",
            "Fosters effortless guest interaction and acts as a spatial pause point during social events.",
            "Symmetric stone cladding on sides and top for a monolithic sculptural presence.",
          ],
        },
        listSpecs: [
          "Stainless steel undermount sink: 60 x 90 cm style",
          "Flush-mounted cooktop: 60 x 90 cm induction unit",
          "Concealed dishwasher slot: 60 x 60 cm space",
          "Front doors: 22mm MDF overlaid with Natural Eucalyptus wood veneer",
          "Sides & Top Counter: 20mm premium burnished Rapolano stone",
        ],
      },
      tallUnits: {
        overview:
          "The tall cabinet wall consists of 5 modular vertical towers standing at 2.98m high, housing heavy appliances, pantry spaces, and beverage curation zones.",
        parts: [
          {
            key: "Tower A",
            name: "Solid Integrated Refrigerator Column",
          },
          {
            key: "Tower B",
            name: "The Cookie Bar / Coffee station with pocket folding doors",
          },
          {
            key: "Tower C",
            name: "Concealed Oven and Steam Oven center core",
          },
          {
            key: "Tower D",
            name: "The Social Bar with leather linings and stem glass shelving",
          },
          {
            key: "Tower E",
            name: "High-capacity Pantry Cabinet with internal steel storage bays",
          },
        ],
        adjacentA: {
          reason:
            "Towers A, B, and C (Refrigerator, Cookie Bar, Oven) are placed directly behind Island Part A:",
          bullets: [
            "Immediate access to raw ingredients during cooking.",
            "Drastic reduction of physical transit times between cooking and heating.",
            "Tight visual and functional triangulation of core high-frequency appliances.",
          ],
        },
        adjacentB: {
          reason:
            "Towers D and E (Social Bar, Pantry) are placed adjacent to Island Part B:",
          bullets: [
            "Provides immediate beverage and dry pantry access to guests seating at the snack bar.",
            "Creates an elite spatial division between heavy meal preparation and social hospitality.",
            "Maintains uninterrupted footpaths during hosting and complex events.",
          ],
        },
        listSpecs: [
          "Internal structural frame: 16mm melamine-faced MDF base",
          "Drawers & pull-out structural systems: 22mm Nature Eucalyptus wood with iron leather handles",
          "Main open shelving system: Covered in authentic Italian saddle leather with integrated LED lights",
          "Integrated appliances: Gaggenau professional ovens, coffee machines, and storage modules",
        ],
      },
    },
    zivv: {
      name: "ZIVV",
      dimensions:
        "Seamless Island: 1.9m L x 1.2m W. Tall Units Wall: 4.8m W x 2.4m H",
      materials: [
        "Italian Travertine Classico",
        "CNC Prealigned Natural Wood Veneer",
        "Lacquered RAL 1013 Satin Melamine",
        "Aluminium 8mm Snack Counter",
        "Black Matte Anodized Plinths",
      ],
      description:
        "An elegant manifestation of organic softness and structured radiance. The ZIVV collection features a seamless rounded stone-top island with a carved wooden body, double-sided snack bars, and symmetric warm cream cabinetry featuring top-tier Gaggenau 400 series integration.",
      story:
        "ZIVV (derived from the words for 'adornment' and 'beauty') represents a manifestation of radiance that illuminates. Designed with organic curves: both ends of the travertine island feature rounded structural forms that form snack bars with seamless aluminum counter wraps. The pristine wall cabinets are finished in satin RAL 1013 cream lacquer with integrated Domus horizontal light lanes.",
      provenance:
        "Designed and prototyped in Milanese Atelier; Travertine stone extracted from Rapolano stone quarries, Tuscany. Cabinet engineering completed in Lombardy, Italy.",
      leadTime: "14 to 16 weeks",
      finish:
        "Acid-free honed raw Travertine Classico, natural wood cladding, and lacquer RAL 1013",
      origin: "Atelier Milan & Tuscan Stone Studio, Italy",
      islandSpecs: {
        overview:
          "Designed as a singular, flowing architectural block, the ZIVV island contrasts the rigid stone tabletop with flowing timber curves that accommodate cozy group gatherings.",
        partA: {
          title: "Rounded Dual-End Snack Bar",
          bullets: [
            "Both left and right ends feature gentle, semicircular shapes, maximizing organic flow.",
            "Perfect organic arrangement for 4 guests seating on custom wood-clad bar stools.",
            "Features an integrated light stripe nestled on the right hand leg, injecting warm ambient upward glows.",
            "Snack bar top clad with an ultra-thin 8mm black aluminum panel.",
          ],
        },
        listSpecs: [
          "Internal framing structures: Melamine-faced MDF (16mm thickness)",
          "Curved front panels: 22mm MDF custom-grooved with high precision CNC wood veneer",
          "Top counter: Custom-polished 20mm Travertine Classico stone slab",
          "Plinths: 14cm black melamine-faced MDF waterproof plinth",
        ],
      },
      tallUnits: {
        overview:
          "Divided symmetrically into a front-facing appliance wall (Part A) and dry pantry storage cabinetry behind (Part B) to optimize daily service flow.",
        adjacentA: {
          reason: "Part A (Front Row Cabinetry):",
          bullets: [
            "Accommodates high-end Gaggenau 400 series baking, steam, and warmer appliances.",
            "Conceals the large-volume Vario refrigerator and freezer blocks behind RAL 1013 cream fronts.",
            "Direct, immediate alignment with cooking and food-prep islands.",
          ],
        },
        adjacentB: {
          reason: "Part B (Rear Row Cabinetry):",
          bullets: [
            "Features shallower storage depths of 35cm to prevent clutter.",
            "Houses pull-out pantry baskets, cleaning drawers, and long-term storage.",
            "Preserves a light, compact architectural presence that stays flush.",
          ],
        },
        listSpecs: [
          "Skeletal structure: MDF 18mm melamine-faced panels",
          "Front doors: MDF 22mm with supreme RAL 1013 satin ivory lacquer finish",
          "Concealed handles: Precision milled CNC vertical recesses on doors",
        ],
      },
    },
    rakh: {
      name: "RÁKH",
      dimensions:
        "Sculpted Island: 2.2m L x 1.1m W. Tall Cabinets: 3.6m W x 2.8m H",
      materials: [
        "MDF Nature Ocaliptus Structure",
        "Hand-carved Golden Veined Onyx Stone",
        "Italian Leather Panels",
        "Domus LED micro-profiles",
        "Cast Bronze Door Handles",
        "Satin Brushed Lacquer",
      ],
      description:
        "An architectural dialogue between Japanese poetic restraint and Italian material weight. The RÁKH collection stands on a sculpted, hand-carved stone base offset by an elongated slab countertop, backed by slatted sliding screens and dark Eucalyptus timber tall units.",
      story:
        "RÁKH (born from precision and tenderness) represents hours of intricate, dedicated craftsmanship. Drawing dense inspiration from Japanese aesthetics, guiding the kitchen landscape into minimal, peaceful balances. The island stands as a structural block: the solid golden-brown onyx stone base is hand-carved to look like an organic sculpture. This supports a floating marble countertop that serves as a quiet threshold between beauty and utility.",
      provenance:
        "Designed by ZAAD Milan Atelier. Woodworking completed in Florence; Onyx carving completed in Carrara, Italy. Stamped with the collective's seal.",
      leadTime: "16 to 18 weeks",
      finish:
        "Hand-honed raw onyx stone, natural eucalyptus wood with acid-patinated cast-bronze handles",
      origin: "Carrara Stone Labs & Florence Wood Studio, Italy",
      islandSpecs: {
        overview:
          "The RÁKH island stands as a sculptural landmark, utilizing raw weight as a structural anchor.",
        partA: {
          title: "The Sculpted Onyx Pedestal & Elongated Countertob",
          bullets: [
            "The main support base is carved from a single dense block of golden-brown Italian Onyx.",
            "Generates a deep, physical design statement that shifts under room lighting.",
            "The floating countertop cantilevers over the base, accommodating an offset 8mm matching structural aluminum snack tray.",
            "Eucalyptus drawers with custom integrated vertical finger pulls.",
          ],
        },
        listSpecs: [
          "Internal framing structures: Melamine-faced MDF (18mm, customized colors)",
          "Front doors: MDF 22mm with Natural Eucalyptus wood cladding",
          "Base support & Top Countertop: Premium selected Carrara Onyx stone, hand-polished",
          "Concealed plinths: 14cm black waterproof solid timber supports",
        ],
      },
      tallUnits: {
        overview:
          "Tall units in RÁKH are characterized by sliding wooden slatted shutters that allow light to pass through.",
        adjacentA: {
          reason: "The Slatted Wood Screens:",
          bullets: [
            "Hides secondary sinks and food ingredients behind linear slats, preserving geometric calm.",
            "Lets internal warm LED light flow like a paper lantern during evening hours.",
            "Constructed using ancient Japanese finger joints, keeping sliding frames lightweight.",
          ],
        },
        listSpecs: [
          "Structures: MDF 18mm high moisture resistant melamine-faced core",
          "Doors & basket fronts: MDF 22mm clad with Eucalyptus wood veneer",
          "Handles: Iron cylinders covered in genuine leather",
          "Inner back walls: Clad in custom Italian tan leather panels with Domus micro-LEDs",
        ],
      },
    },
    varr: {
      name: "VARR",
      dimensions:
        "Floating Island: 2.8m L x 1.2m W. Tall Units Wall: 4.8m W x 2.85m H",
      materials: [
        "Italian Dark Travertine Stone",
        "Sicilian Volcanic Basalt",
        "Burnished Blackened Carbon Steel",
        "Nature Ocaliptus Structure",
        "Authentic Italian Saddle Leather",
      ],
      description:
        "An outstanding architectural statement of absolute horizontal lines and massive spatial weight. Developed under the design name VARR, this kitchen collection utilizes floating dark volcanic stone counters, industrial blackened carbon steel legs, and integrated Coopersburg compartments.",
      story:
        "VARR is not merely a recipe kitchen; it designs space and establishes absolute, geometric order in the home. The collection has a majestic look: structural lines are precise and engineered. Slabs of Sicilian volcanic basalt and deep gray travertine are unified onto blackened carbon steel support trusses. Backed by tall units with hand-wrapped leather handles, VARR projects a calm yet steadfast presence.",
      provenance:
        "Designed in ZAAD Milan Atelier; volcanic basalt quarried and hand-milled near Mount Etna, Sicily. Steel components forged in Turin, Italy.",
      leadTime: "18 to 22 weeks",
      finish:
        "Sanding-burnished volcanic basalt with hand-burnished blackened carbon steel structures",
      origin: "Mount Etna, Sicily & Turin Steel Labs, Italy",
      islandSpecs: {
        overview:
          "The VARR island acts as an engineering masterpiece, showcasing a large piece of volcanic basalt cantilevered on solid carbon steel legs with absolute horizontal geometry.",
        listSpecs: [
          "Structures: MDF 18mm melamine-faced panels with custom dark coating",
          "Doors & drawers: MDF 22mm with authentic Nature Eucalyptus timber veneer",
          "Countertop: Sicilian hand-selected volcanic basalt slab (thickness 30mm) with stain sealing",
          "Sides: Solid volcanic basalt sheets",
          "Snack counter: Cantilevered Aluminium 8mm panel",
          "Integrated components: Triple under-sink, built-in induction burner, and table-flush exhaust ventilation",
        ],
      },
      tallUnits: {
        overview:
          "Symmetric vertical tall cabinets designed to anchor the space and structure the dry-good storing compartments.",
        listSpecs: [
          "Internal framework: Melamine-faced MDF 18mm high density sheets",
          "Doors & drawers: MDF 22mm clad in Eucalyptus timber panels with vertical orientation",
          "Cabinet handles: Solid iron cylinder tubes wrapped in heavy Italian saddle leather",
          "Open shelves: MDF 22mm lacquer coat with genuine leather coverings",
          "Integrated appliances: Dual Gaggenau Vario column wine refrigerators and professional microwave ovens",
        ],
      },
    },
  },
  fa: {
    gavv: {
      name: "گوو (GÁVV)",
      dimensions:
        "جزیره: بخش الف (۳.۰ متر)، بخش ب (۲.۰ متر). ست کابینت اصلی: ۵.۴ متر عرض در ۲.۹۸ متر ارتفاع",
      materials: [
        "روکش طبیعی چوب اوکالیپتوس جنگلی",
        "سنگ کارامل راپولانو صیقل خورده با موم",
        "سیلندرهای چرمی دست‌دوز ایتالیایی",
        "آلومینیوم آنودایز شده مشکی صنعتی",
        "چوب گردوی آمریکایی اعلاء",
      ],
      description:
        "چشم‌اندازی بی‌بدیل در آشپزخانه مدرن، الهام گرفته از اعماق زمین و تقارن هندسی. مجموعه گوو (به زبان باستانی یعنی زمین بخشنده) حیات معماری خانه را به دو جزیره‌ی مونوکل و یک ست کابینت تمام قد تقسیم می‌کند؛ تلفیقی چشم‌نواز از درب‌های ریلی پنهان‌شونده، نوآوری چرم ظریف ایتالیایی و بافت‌های شنی و سنگی توسکانی.",
      story:
        "گوو (برگرفته از زمین سخاوتمند که مهد بیداری انسان است) روایتی پر از جلوه سنگ و اصالت چوب است. این شاهکار معماری با در نظر گرفتن وقار و ایستایی بنا شده است. بدنه اصلی دارای درب‌های تاپ کینگ و کشویی با روکش طبیعی چوب اوکالیپتوس و دستگیره‌های استوانه‌ای آهنی با روپوش چرم زین اسب است. جزیره‌های ساختاری از قطعات تراشیده سنگ طبیعی راپولانو توسکانی ساخته شده‌اند تا وزنی ملموس به کل فضا ببخشند.",
      provenance:
        "طراحی در آتلیه زااد میلان؛ ساخت و قلم‌زنی سنگ در راپولانو تسبیا، منطقه رویایی توسکانی ایتالیا. امضا شده توسط استاد کابینت‌ساز و حجار ارشد.",
      leadTime: "۱۶ تا ۲۰ هفته کار تمام دستی (تحویل در موقعیت شما)",
      finish:
        "سنگ جلاداده‌شده با واکس طبیعی بدون اسید، روکش طبیعی اوکالیپتوس هماهنگ با دستگیره‌های چرمی دست دوز",
      origin: "آتلیه سنگ توسکانی و کارگاه چوب میلان، ایتالیا",
      islandSpecs: {
        overview:
          "جزیره گوو به عنوان قلب تپنده فضا عمل می‌کند. این بخش به دو بلوک سنگی مستقل تقسیم شده تا بیشترین شفافیت بصری و جریان فکری حاکم شود.",
        partA: {
          title: "بخش الف — مونوکل عملیاتی و شستشو (۳.۰ متر)",
          bullets: [
            "قطب اصلی آماده‌سازی، خدمات گاز و فعالیت‌های روزمره آشپزخانه.",
            "ادغام بی‌نقص صفحه شعله‌های القایی ظریف، سینک دست‌ساز و ماشین ظرف‌شویی کارآمد.",
            "مهندسی داخلی به منظور کاهش جابه‌جایی فیزیکی میان بخش‌های پرکاربرد شستشو و پخت.",
            "کشوها و اکسسوری‌های تلسکوپی ریلی با چوب اوکالیپتوس ۲۲ میلی‌متری.",
          ],
        },
        partB: {
          title: "بخش ب — مونوکل اجتماعی و پذیرایی (۲.۰ متر)",
          bullets: [
            "بخش پیشخوان و سرو نوشیدنی و صبحانه‌های خانوادگی.",
            "صفحه معلق جانبی با ضخامت ۸ میلی‌متر از جنس آلومینیوم آنودایز شده مشکی مات.",
            "فضایی دوست‌داشتنی جهت گفت‌وگوی گرم صمیمانه با مهمانان در طی رویدادهای شبانه.",
            "پوشش متقارن سنگ راپولانو در کناره‌ها و بالا برای حس مجسمه گونه.",
          ],
        },
        listSpecs: [
          "سینک زیرکار استنلس استیل پنهان: ابعاد ۶۰ در ۹۰ سانتی‌متر",
          "گاز القایی هم‌سطح توکار: ابعاد ۶۰ در ۹۰ سانتی‌متر",
          "درب‌های کابینت: ام‌دی‌اف ۲۲ میلی‌متری با روکش چوب طبیعی اوکالیپتوس رگه‌دار",
          "پیشخوان و بدنه جزیره: سنگ طبیعی راپولانو کلاسیکو صیقلی با ضخامت ۲۰ میلی‌متر",
        ],
      },
      tallUnits: {
        overview:
          "ست اصلی دیواری شامل ۵ برج فرعی مدولار به ارتفاع ۲.۹۸ متر با درب‌های تاشو جیبی و قفسه‌های چرمی ظریف است.",
        parts: [
          {
            key: "ستون یک",
            name: "کابینت یخچال توکار یکپارچه",
          },
          {
            key: "ستون دو",
            name: "بخش آماده‌سازی قهوه با درب‌های ریلی پنهان‌شونده",
          },
          {
            key: "ستون سه",
            name: "محفظه مایکروویو و گاز فر توکار پیشرفته",
          },
          {
            key: "ستون چهار",
            name: "پیشخوان میزبانی مجهز به قفسه‌بندی چرمی و نورافکن‌های ظریف",
          },
          {
            key: "ستون پنج",
            name: "قفسه جادار انبار مواد مجهز به ریل تمام فلزی تمام بازشو",
          },
        ],
        adjacentA: {
          reason:
            "ستون‌های یخچال، قهوه و فر بلافاصله در پشت جزیره بخش الف طراحی شده‌اند:",
          bullets: [
            "دسترسی فوق‌العاده سریع به محتویات یخچال در حین فرآیند پخت و پز.",
            "کاهش چشمگیر رفت‌آمد فیزیکی روزانه معمار خانه در حین آماده‌سازی غذا.",
            "تقارن سه‌گانه و ایجاد کانون تمرکز فکری بی‌نظیر برای پخت آسان.",
          ],
        },
        adjacentB: {
          reason:
            "برج‌های پذیرایی و انبار در پشت جزیره بخش ب (اجتماعی) قرار دارند:",
          bullets: [
            "دسترسی سریع مهمانان به نوشیدنی‌ها و ظروف بدون تداخل با بخش پرکاربرد پخت.",
            "ایجاد حریم حرفه‌ای و آرامش در تفکیک خدمات میزبانی لوکس از عملکرد پرحرارات آماده سازی غذا.",
          ],
        },
        listSpecs: [
          "بدنه و استراکچر درونی: ام‌دی‌اف ضد رطوبت لوکس ضخیم ۱۶ میلی‌متری",
          "کشوهای دست‌ساز چوبی: ضخامت ۲۲ میلی‌متر با روکش چوب اوکالیپتوس و دستگیره‌های چرمی دست‌دوز",
          "بخش قفسه‌بندی‌های بازشو: روکش چرم طبیعی گاو با نور پردازی یکپارچه LED میلیمتری",
        ],
      },
    },
    zivv: {
      name: "زیوو (ZIVV)",
      dimensions:
        "جزیره منحنی: ۱.۹ متر طول در ۱.۲ متر عرض. دیواره کابینت‌ها: ۴.۸ متر عرض در ۲.۴ متر ارتفاع",
      materials: [
        "سنگ مرمر تراورتن کلاسیکو طبیعی",
        "روکش چوب رادیال نچرال CNC شده",
        "لاکی پلی‌اورتان مات RAL 1013 عاجی",
        "صفحه جانبی آنودایز شده ۸ میلی‌متری",
        "پایه‌های زیرین مشکی مات ضدآب",
      ],
      description:
        "تلفیقی با شکوه از نرمی خطوط ارگانیک و درخشش درونی فضا. مجموعه زیوو دارای جزیره‌ای خیره‌کننده با کناره‌های منحنی بیضی و بدنه‌ی شیاردار دایره‌ای است که توسط ست کابینت‌های عاجی رنگ مات و تجهیزات برتر لاین ۴۰۰ گاگنا پشتیبانی می‌شود.",
      story:
        "زیوو (برگرفته از واژه‌های باستانی برای آراستگی و درخشش) نشانگر نوری است که فضا را دگرگون می‌سازد. طراحی انحناهای این اثر با دقت مهندسی شده تا مسیر حرکت فیزیکی در خانه روان باشد؛ سنگ تراورتن طبیعی در دو سر جزیره انحنا دارد تا تضادی گرم را با درب‌های لاک کرم‌رنگ و نورپردازی افقی خطی ایجاد کند.",
      provenance:
        "طراحی اولیه و نمونه‌سازی در آتلیه میلان؛ سنگ تراورتن استخراج‌شده از معادن غنی راپولانو کلاسیکو، توسکانی ایتالیا. مهندسی چوب در لمباردی.",
      leadTime: "۱۴ تا ۱۶ هفته",
      finish:
        "تраورتن کلاسیکو طبیعی مات بدون اسید، بدنه چوبی شیاردار دست‌ساز و پوشش لاکی RAL 1013",
      origin: "آتلیه سنگ توسکانی و کارگاه چوب لمباردی، ایتالیا",
      islandSpecs: {
        overview:
          "جزیره زیوو به صورت یک بلوک معمارانه روان و فاقد زوایای خشن طراحی شده تا با مبلمان منزل تعاملی دلپذیر و گرم برقرار کند.",
        partA: {
          title: "پیشخوان منحنی دو طرفه پذیرایی و صبحانه",
          bullets: [
            "هم سر چپ و هم راست به صورت نیم‌دایره فرزکاری شده‌اند تا جریان ارگانیک بی نقصی حاصل شود.",
            "ظرفیت عالی برای نشستن ۴ مهمان روی صندلی‌های چوبی پایه بلند.",
            "دارای لاین پنهان نوری ظریف در پایه برای تداعی درخشش معلق سازه.",
            "رویه باریک پیشخوان مجهز به ورق ۸ میلی‌متری آلومینیوم مات دکوراتیو.",
          ],
        },
        listSpecs: [
          "اسکلت پایه: ام‌دی‌اف کارامل ممتاز ۱۶ میلی‌متری",
          "پنل‌های جلویی انحنادار: ام‌دی‌اف ۲۲ میلی‌متری متراکم با شیارهای عمیق CNC شده چوب طبیعی گردو",
          "سنگ رویه: تراورتن طبیعی کلاسیکو توسکانی با ضخامت ۲۰ میلی‌متر جلا خورده با دست",
          "قرنیز پایینی: قرنیز مشکی ضد آب عالی ۱۴ سانتی‌متری",
        ],
      },
      tallUnits: {
        overview:
          "تقسیم متقارن کابینت‌های دیواری به بخش جلویی لوازم اصلی (بخش الف) و بخش پشتی جهت نگهداری وسایل پذیرایی ظریف (بخش ب).",
        adjacentA: {
          reason: "ردیف جلویی تجهیزات خانگی:",
          bullets: [
            "تطبیق بی‌نقص با فرهای بخارپز و کشوهای گرم‌کننده حرفه‌ای سری ۴۰۰ گاگنا.",
            "پنهان‌سازی یخچال‌های حجیم توکار در پس پنل‌های لاکی ظریف عاجی مات.",
            "ترازبندی مستقیم با جزیره آماده‌سازی جهت هماهنگی حرکتی.",
          ],
        },
        adjacentB: {
          reason: "ردیف کابینت‌های کم‌عمق پشتی:",
          bullets: [
            "عمق بهینه‌سازی شده ۳۵ سانتی‌متر برای جلوگیری از شلوغی و تداخل در فضا.",
            "دارای سبدهای چرخشی برای دسترسی عالی به تمام مواد غذایی و انبارداری طولانی مدت.",
          ],
        },
        listSpecs: [
          "شاسی ساختاری: هیکلی فولادی همراه ام‌دی‌اف ۱۸ میلی‌متری ملانینه",
          "درب‌های بیرونی: روکش لاکی عاجی رنگ اطلسی براق ممتاز",
          "دستگیره‌ها: به صورت توکار فرزکاری شده با شیارهای مدرن افقی",
        ],
      },
    },
    rakh: {
      name: "رخ (RÁKH)",
      dimensions:
        "جزیره قلم‌زنی شده: ۲.۲ متر طول در ۱.۱ متر عرض. ست انبار درختی: ۳.۶ متر عرض در ۲.۸ متر ارتفاع",
      materials: [
        "چوب طبیعی اوکالیپتوس فرآوری شده",
        "سنگ طبیعی چرمی عقیق رگه‌طلا",
        "پنل‌های چرمی گوساله دست دوز",
        "پایه آلومینیومی مات معلق",
        "دستگیره‌های برنزی دست‌ساز ریخته‌گری شده",
      ],
      description:
        "گفت‌وگوی گرم معمارانه میان خویشتن‌داری شاعرانه ژاپنی و وزن ملموس اصالت سنگ ایتالیایی. مجموعه رخ بر روی پایه‌ای تراشیده از سنگ خارق العاده عقیق رسی استوار شده و به واسطه شیدهای چوبی کشویی نوری ملایم مانند فانوس‌های شرقی ساطع می‌کند.",
      story:
        "رخ (برگرفته از ظرافت و آرامش چهره پنهان هستی) نمادی از ساعت‌ها دقت و صبوری استادکاران است. با الهام از آموزه‌های شرقی سادگی و متانت، آشپزخانه را به مکانی دور از تنش‌های روزمره بدل می‌کند. بدنه سنگی عقیق طلایی تیره صیقلی، نمایی صخره‌ای و تماشایی پدید می‌آورد که رویه مرمری معلق روی آن را به پلی میان طبیعت و تمدن مدرن بدل نموده است.",
      provenance:
        "طراحی اصلی آتلیه زااد میلان؛ فرآیند کار چوبی لوکس در فلورانس و نقش‌برجسته مجسمه سنگ عقیق در کارارا ایتالیا. ممهور به نشان مهر موم زااد.",
      leadTime: "۱۶ تا ۱۸ هفته",
      finish:
        "سنگ عقیق طبیعی پردازش شده با دست، چوب اوکالیپتوس و دستگیره‌های برنزی پتینه‌کاری شده",
      origin: "معادن سنگ قیمتی کارارا و کارگاه لوکس فلورانس، ایتالیا",
      islandSpecs: {
        overview:
          "جزیره رخ به عنوان نقطه‌ای تماشایی در کل فضا عمل می‌کند؛ لنگری سنگی و باشکوه که با جادوی طبیعت صعودی روان یافته است.",
        partA: {
          title: "پایه ستونی عقیق برجسته و پیشخوان شناور مرمری",
          bullets: [
            "پایه تکیه‌گاهی اصلی از یک بلوک صلب سنگ عقیق رگه‌دار قهوه‌ای طلایی کار شده است.",
            "تولید افکت نوری عمیق و طبیعی با بازتاب نور خورشید عصرگاهی خانه بر سنگ.",
            "پیشخوان معلق فراتر از پایه امتداد دارد تا ظرفیت خوبی برای نشستن حاصل شود.",
            "کشوهای اوکالیپتوس ریلی مجهز به شیارهای زاویه‌دار پنهان جهت گشودن آسان.",
          ],
        },
        listSpecs: [
          "استراکچر داخلی: ام‌دی‌اف مرطوب لوکس ۱۸ میلی‌متری با رنگ سفارشی درونی",
          "درب‌ها: ام‌دی‌اف ۲۲ میلی‌متری با چوب گران‌بهای اوکالیپتوس جنگلی",
          "پایه سنگی و رویه اصلی: سنگ قیمتی عقیق کارارا پولیش شده با دست",
          "پایه هیدرولیکی مخفی: پایه ضدآب چوبی بادوام ۱۴ سانتی‌متری",
        ],
      },
      tallUnits: {
        overview:
          "طراحی ست دیواری رخ به واسطه درب‌های کشویی با قفسه‌های چوبی مشبک شناخته می‌شود که به زیبایی نور را عبور می‌دهند.",
        adjacentA: {
          reason: "درب‌های مشبک عبوردهنده نور:",
          bullets: [
            "پوشاندن لوازم فرعی و ظروف در پس خطوط رقصان چوبین جهت برقراری هندسه پاکیزه فضا.",
            "عبور دادن درخشش ملایم ال‌ای‌دی برای تداعی فانوس‌های گرم کاغذی در ساعات پایانی شب.",
            "الهام از اتصال کام و زبانه درودگری باستانی ژاپن با وزن حرکتی فوق العاده روان و سبک.",
          ],
        },
        listSpecs: [
          "ساختار هسته: ام‌دی‌اف کاراملی هسته متراکم ۱۸ میلی‌متری مقاوم",
          "دیواره‌های داخلی ست کابینت: روکش چرم طبیعی گوساله برنزه با نور پس‌زمینه Domus",
        ],
      },
    },
    varr: {
      name: "وار (VARR)",
      dimensions:
        "جزیره معلق: ۲.۸ متر طول در ۱.۲ متر عرض. ست اصلی کابینت‌ها: ۴.۸ متر عرض در ۲.۸۵ متر ارتفاع",
      materials: [
        "سنگ تراورتن تیره ایتالیایی مات",
        "سنگ بازالت آتشفشانی سیسیل",
        "فولاد کربنی پتینه‌خورده مشکی صنعتی",
        "روکش طبیعی چوب اوکالیپتوس رگه‌دار",
        "چرم گاو دست‌ساز زین اسب",
      ],
      description:
        "بیانیه‌ای مقتدرانه از خطوط مطلق افقی و تعادل جادویی وزن‌ها. این مجموعه بی‌نظیر (تحت نام تجاری وار در کاتالوگ زااد) از جزیره‌ای با پیشخوان سنگ آتشفشانی تیره معلق و پایه‌های مستحکم فولادی مشکی مات با ادغام کشوهای چرمی بهره می‌برد.",
      story:
        "وار در کاتالوگ تاریخی زااد، فراتر از یک فضای پخت‌وپز، نظم و هندسه‌ای ابدی را در فضای خانه پایه‌ریزی می‌کند. ساخته شده در سال ۲۰۲۶، جلوه‌ای عمیق و ابدی دارد: با ادغام ورق‌های سنگ بازالت مذاب سیسیل و تراورتن طوسی تیره روی شاسی فلزی فولادی، وقار و سنگینی را تداعی می‌کند.",
      provenance:
        "طراحی در آتلیه میلان؛ برش و حجاری سنگ بازالت در دامنه‌های کوه آتشفشان اتنا در سیسیل. قطعات فولادی گداخته و فورج‌شده در تورین ایتالیا.",
      leadTime: "۱۸ تا ۲۲ هفته",
      finish:
        "بازالت آتشفشانی مات شنی چرمی همراه با اسکلت مستحکم فولادی دست‌ساز مشکی مات",
      origin: "کوه آتشفشان اتنا در سیسیل و صنایع فولاد تورین، ایتالیا",
      islandSpecs: {
        overview:
          "جزیره وار شاهکاری مهندسی است که ورق عظیم سنگ بازالت مذاب را بر روی پایه‌های فولادی معلق نشانده است.",
        listSpecs: [
          "بدنه و استراکچر: ام‌دی‌اف ممتاز ۱۸ میلی‌متری با پوشش مشینی تیره",
          "کناره‌ها و بدنه جزیره: صفحات سنگ صلب آتشفشانی بازالت",
          "سنگ رویه: سنگ بازالت ذوب‌شده اتنا با ضخامت ۳۰ میلی‌متر با پوشش آنتی‌اسید و لکه‌بر",
          "صفحه کاربری مجهز به سینک سه‌قلو دست‌ساز، گاز القایی توکار و هود هم‌سطح برقی",
        ],
      },
      tallUnits: {
        overview:
          "کابینت‌های قدبلند متقارن جهت انسداد و تعریف فضا برای قرارگیری انبار ظروف با گنجایش فوق العاده زیاد.",
        listSpecs: [
          "شاسی درونی: ام‌دی‌اف متراکم ۱۸ میلی‌متری مشکی عمودی",
          "درب‌ها و پنل‌ها: روکش اوکالیپتوس ۲۲ میلی‌متری عمودی",
          "دستگیره‌ها: سیلندرهای استوانه‌ای فلزی روکش‌شده با چرم ضخیم طبیعی",
          "تجهیزات توکار پشتیبانی‌شده: دو عدد یخچال ساید با یخچال‌های ویترینی نوشیدنی گاگنا",
        ],
      },
    },
  },
};
const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  getItemTranslations: () => null,
  dir: "ltr",
  isFarsi: false,
});
export function LanguageProvider({ children }) {
  // Read initial preference, fallback to English
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("zaad_preferred_language");
      return stored === "fa" || stored === "en" ? stored : "en";
    } catch {
      return "en";
    }
  });
  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("zaad_preferred_language", lang);
    } catch (e) {
      console.warn("Could not save language selection into localStorage", e);
    }
  };

  // Adjust document text direction and language attributes on change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "fa" ? "rtl" : "ltr");

    // Add class for customized styling transitions (e.g. font adjustments)
    if (language === "fa") {
      root.classList.add("farsi-mode");
    } else {
      root.classList.remove("farsi-mode");
    }
  }, [language]);
  const dir = language === "fa" ? "rtl" : "ltr";
  const isFarsi = language === "fa";

  // Translate general site text keys
  const t = (key) => {
    const dict = INTERFACE_TRANSLATIONS[language];
    return dict[key] || INTERFACE_TRANSLATIONS["en"][key] || key;
  };

  // Get item translations dynamically based on language
  const getItemTranslations = (id) => {
    const cleanId = id.toLowerCase();
    const itemsDict = COLLECTION_ITEMS_TRANSLATED[language];
    const fallbackDict = COLLECTION_ITEMS_TRANSLATED["en"];
    return itemsDict[cleanId] || fallbackDict[cleanId] || null;
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getItemTranslations,
        dir,
        isFarsi,
      }}
    >
      <div
        style={{
          direction: dir,
        }}
        className={isFarsi ? "font-sans rtl" : "font-sans ltr"}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
