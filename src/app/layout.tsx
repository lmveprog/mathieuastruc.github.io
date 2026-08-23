import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mathieu Astruc",
  description:
    "AI engineer building applied AI systems: RAG, LLM engineering, computer vision and human-robot interaction.",
  metadataBase: new URL("https://mathieuastruc.com"),
  alternates: { canonical: "/" },
  keywords: ["Mathieu Astruc", "AI Engineer", "Data Science", "Machine Learning", "Computer Vision", "RAG", "LLM", "portfolio"],
  authors: [{ name: "Mathieu Astruc", url: "https://mathieuastruc.com" }],
  creator: "Mathieu Astruc",
  openGraph: {
    type: "website",
    url: "https://mathieuastruc.com",
    title: "Mathieu Astruc",
    description: "AI engineer building applied AI systems: RAG, LLM engineering, computer vision and human-robot interaction.",
    siteName: "Mathieu Astruc",
    images: [{ url: "/mathieu.png", width: 1200, height: 630, alt: "Mathieu Astruc" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathieu Astruc",
    description: "AI engineer building applied AI systems: RAG, LLM engineering, computer vision and human-robot interaction.",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mathieu Astruc",
  url: "https://mathieuastruc.com",
  image: "https://mathieuastruc.com/mathieu.png",
  jobTitle: "AI Engineer",
  description: "AI engineer specializing in RAG, LLM engineering, computer vision and human-robot interaction.",
  sameAs: ["https://www.linkedin.com/in/mathieu-astruc/", "https://github.com/lmveprog"],
  nationality: "French",
  knowsAbout: ["Machine Learning", "Computer Vision", "LLMs", "RAG", "Human-Robot Interaction"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* avant l'hydratation : clair par défaut, sombre si choisi précédemment */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}var m=location.search.match(/[?&]theme=(dark|light)/);if(m)t=m[1];document.documentElement.dataset.theme=t==="dark"?"dark":"light"})();',
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
