"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ProfileCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
      card.style.setProperty("--light-x", "72%");
      card.style.setProperty("--light-y", "18%");
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || !pointer.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - box.left) / box.width));
        const y = Math.max(0, Math.min(1, (clientY - box.top) / box.height));
        card.style.setProperty("--card-rx", `${(0.5 - y) * 2}deg`);
        card.style.setProperty("--card-ry", `${(x - 0.5) * 2}deg`);
        card.style.setProperty("--light-x", `${x * 100}%`);
        card.style.setProperty("--light-y", `${y * 100}%`);
      });
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
    motion.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", reset);
    };
  }, []);

  return <header ref={ref} className="hero profile-card">{children}</header>;
}
