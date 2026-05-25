import "../styles/globals.css";
import { LanguageProvider } from "../lib/TranslationService";

export const metadata = {
  title: "Atelier Éther | Curated Sculptural Objects & Bespoke Interiors",
  description:
    "An elite digital showroom for Atelier Éther's curated collection of sculptural objects and bespoke architectural interiors.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F4F1ED] text-[#1C1C1C] selection:bg-[#E8E4DF] selection:text-[#1C1C1C] overflow-x-hidden antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
