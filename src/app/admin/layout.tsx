import type { Metadata } from "next";
import "./admin.css";

// coin prive : jamais indexe, le middleware bloque tout sans cookie valide
export const metadata: Metadata = {
  title: "admin · Mathieu Astruc",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="admin">{children}</main>;
}
