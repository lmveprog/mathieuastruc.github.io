import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
        {/* Aurora blobs — shared across all pages */}
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        <div className="blob blob-3" aria-hidden="true" />
        <div className="blob blob-4" aria-hidden="true" />
        {/* Film grain */}
        <div className="grain" aria-hidden="true" />

        <Navigation />
        {children}
      </body>
    </html>
  );
}
