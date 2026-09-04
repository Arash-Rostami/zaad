import localFont from "next/font/local";
import { getServerLanguage } from "@/lib/i18n/server";
import "../styles/globals.css";
import { LanguageProvider } from "@/services/TranslationService";
import InitialLoader from "@/components/InitialLoader";
import CustomCursor from "@/components/shared/CustomCursor";
import MotionRoot from "@/components/shared/MotionRoot";
import { MetadataService } from "@/services/MetaDataService";
import JsonLd from "@/components/JsonLd";

const playfair = localFont({
  src: "../fonts/PlayfairDisplay-Variable.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
});

const playfairItalic = localFont({
  src: "../fonts/PlayfairDisplay-Italic-Variable.woff2",
  weight: "400 900",
  style: "italic",
  variable: "--font-playfair-italic",
  display: "swap",
  preload: false,
});

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata = {
  metadataBase: new URL("https://zaad.com"),
  authors: [{ name: "Arash Rostami", url: "https://time-gr.com/cv/" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1ED",
};

export default async function RootLayout({ children }) {
  const initialLanguage = await getServerLanguage();

  return (
    <html
      lang={initialLanguage}
      dir={initialLanguage === "fa" ? "rtl" : "ltr"}
      className={`${playfair.variable} ${playfairItalic.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-surface text-ink selection:bg-selection selection:text-ink overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
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
              href="/fonts/Dorsa-Black.otf"
              as="font"
              type="font/otf"
              crossOrigin="anonymous"
            />
          </>
        )}
        <JsonLd schemas={[MetadataService.orgSchema]} />
        <InitialLoader />
        <CustomCursor />
        <LanguageProvider initialLanguage={initialLanguage}>
          <MotionRoot>{children}</MotionRoot>
        </LanguageProvider>
      </body>
    </html>
  );
}
