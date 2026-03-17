import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Mathieu Astruc",
  description: "Future AI Engineer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="blob blob-1" aria-hidden="true" />
          <div className="blob blob-2" aria-hidden="true" />
          <div className="blob blob-3" aria-hidden="true" />
          <div className="blob blob-4" aria-hidden="true" />
          <div className="grain" aria-hidden="true" />
          <Navigation />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
