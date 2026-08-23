"use client";

import { useEffect } from "react";

// pilule qui glisse d'une ligne à l'autre au survol (expérience, projets, éducation)
const ROW_SELECTOR = ".row-list > li, .project-list > li";

export default function HoverIndicator() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".page");
    if (!page || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const indicator = document.createElement("span");
    indicator.className = "row-hover-indicator";
    indicator.setAttribute("aria-hidden", "true");
    page.append(indicator);

    let hideTimer: number | undefined;

    const move = (row: Element) => {
      window.clearTimeout(hideTimer);
      const pageRect = page.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const padding = 7;
      const wasVisible = indicator.classList.contains("is-visible");

      // invisible -> apparaît directement sous la ligne visée, sans glisser
      // depuis son ancienne position à travers la page
      if (!wasVisible) indicator.style.transition = "opacity 100ms ease-out";

      indicator.style.setProperty("--row-x", `${rowRect.left - pageRect.left - padding}px`);
      indicator.style.setProperty("--row-y", `${rowRect.top - pageRect.top - padding}px`);
      indicator.style.setProperty("--row-w", `${rowRect.width + padding * 2}px`);
      indicator.style.setProperty("--row-h", `${rowRect.height + padding * 2}px`);

      if (!wasVisible) {
        indicator.getBoundingClientRect(); // pose la position avant de réactiver
        indicator.style.transition = "";
      }
      indicator.classList.add("is-visible");
    };

    const scheduleHide = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => indicator.classList.remove("is-visible"), 90);
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const row = (event.target as Element).closest(ROW_SELECTOR);
      if (row) move(row);
    };

    const onOut = (event: PointerEvent) => {
      const from = (event.target as Element).closest(ROW_SELECTOR);
      const to = (event.relatedTarget as Element | null)?.closest?.(ROW_SELECTOR);
      if (from && !to) scheduleHide();
    };

    page.addEventListener("pointerover", onOver);
    page.addEventListener("pointerout", onOut);

    return () => {
      page.removeEventListener("pointerover", onOver);
      page.removeEventListener("pointerout", onOut);
      indicator.remove();
    };
  }, []);

  return null;
}
