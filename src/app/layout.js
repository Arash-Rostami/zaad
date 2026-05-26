import "../styles/globals.css";
import { LanguageProvider } from "@/services/TranslationService";

export const metadata = {
  title: "ZAAD | Powered by Dorsa",
  description:
    "An elite digital showroom for ZAAD curated collection of sculptural objects and bespoke architectural interiors.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface text-ink selection:bg-surface-alt selection:text-ink overflow-x-hidden antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
