"use client";

import { useEffect, useState } from "react";

// le compteur vit sur mon vps (service "guests") : un visiteur = un navigateur
// par jour, sans cookie ni ip stockée. si le service ne répond pas, le bloc
// n'apparaît tout simplement pas.
const ENDPOINT = "https://lavalley.xyz/api/guests/mathieuastruc";

export default function VisitorCount() {
  const [target, setTarget] = useState<number | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { visitors: number }) => {
        if (!cancelled && Number.isFinite(d.visitors)) setTarget(d.visitors);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // le chiffre monte de 0 à la valeur en ~1 s, sauf si l'utilisateur
  // préfère moins d'animations
  useEffect(() => {
    if (target === null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || target === 0) {
      setShown(target);
      return;
    }
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  if (target === null) return null;

  return (
    <aside className="visitors" aria-label={`${target} visiteurs · visitors`}>
      <span className="visitors-count">{shown.toLocaleString("fr-FR")}</span>
      <span className="visitors-label">visiteurs · visitors</span>
    </aside>
  );
}
