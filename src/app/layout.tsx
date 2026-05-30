import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Mathieu Astruc — AI & Data Science Engineer",
  description: "AI & Data Science engineer building RAG, LLM, computer vision, OCR, multimodal AI and human-robot interaction systems. Seeking a full-time Data Science / AI role from Oct. 2026.",
  metadataBase: new URL("https://mathieuastruc.com"),
  alternates: { canonical: "/" },
  keywords: ["Mathieu Astruc", "AI Engineer", "Data Science", "Machine Learning", "Computer Vision", "RAG", "LLM", "Airbus", "NTNU", "portfolio"],
  authors: [{ name: "Mathieu Astruc", url: "https://mathieuastruc.com" }],
  creator: "Mathieu Astruc",
  openGraph: {
    type: "website",
    url: "https://mathieuastruc.com",
    title: "Mathieu Astruc — AI & Data Science Engineer",
    description: "Applied AI engineer building RAG, LLM, computer vision and human-robot interaction systems. Seeking a full-time Data Science / AI role from Oct. 2026.",
    siteName: "Mathieu Astruc",
    images: [{ url: "/mathieu.png", width: 1200, height: 630, alt: "Mathieu Astruc — AI & Data" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathieu Astruc — AI & Data Science Engineer",
    description: "Applied AI engineer building RAG, LLM, computer vision and human-robot interaction systems.",
    images: ["/mathieu.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mathieu Astruc",
  url: "https://mathieuastruc.com",
  image: "https://mathieuastruc.com/mathieu.png",
  jobTitle: "AI & Data Science Engineer",
  description: "AI & Data Science engineer specializing in RAG, LLM engineering, computer vision, OCR, multimodal AI and human-robot interaction.",
  sameAs: ["https://www.linkedin.com/in/mathieu-astruc/"],
  nationality: "French",
  knowsAbout: ["Machine Learning", "Computer Vision", "LLMs", "RAG", "Human-Robot Interaction", "Data Engineering"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.add('light');}catch(e){}` }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <Navigation />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
