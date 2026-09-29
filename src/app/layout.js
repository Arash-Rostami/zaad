import localFont from "next/font/local";
import { getServerLanguage } from "@/lib/i18n/server";
import { en } from "@/lib/i18n/en";
import { fa } from "@/lib/i18n/fa";
import "../styles/globals.css";
import { LanguageProvider } from "@/services/LanguageProvider";
import InitialLoader from "@/components/InitialLoader";
import CustomCursor from "@/components/shared/CustomCursor";
import MotionRoot from "@/components/shared/MotionRoot";
import { MetadataService } from "@/services/MetadataService";
import JsonLd from "@/components/shared/JsonLd";

const fractulAlt = localFont({
  src: [
    { path: "../fonts/FractulAlt-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/FractulAlt-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/FractulAlt-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/FractulAlt-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/FractulAlt-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-fractulalt",
  display: "block",
  preload: false,
});

export const metadata = {
  metadataBase: new URL("https://zaaddesign.com"),
  authors: [{ name: "Arash Rostami", url: "https://persolbs.com" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1ED",
};

export default async function RootLayout({ children }) {
  const initialLanguage = await getServerLanguage();
  const dictionary = initialLanguage === "fa" ? fa : en;

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === "fa" ? "rtl" : "ltr"}
      className={`${fractulAlt.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-surface text-ink selection:bg-selection selection:text-ink overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-md focus:bg-panel focus:px-4 focus:py-2 focus:text-ink focus:shadow-canvas-lift outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {dictionary.skipToContent}
        </a>
        {initialLanguage === "fa" && (
          <>
            <link
              rel="preload"
              href="/fonts/Dorsa-Regular.otf"
              as="font"
              type="font/otf"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/Dorsa-Light.otf"
              as="font"
              type="font/otf"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/Dorsa-Bold.otf"
              as="font"
              type="font/otf"
              crossOrigin="anonymous"
            />
          </>
        )}
        <JsonLd schemas={[MetadataService.orgSchema]} />
        <InitialLoader isFarsi={initialLanguage === "fa"} />
        <CustomCursor />
        <LanguageProvider initialLanguage={initialLanguage}>
          <MotionRoot>{children}</MotionRoot>
        </LanguageProvider>
      </body>
    </html>
  );
}
