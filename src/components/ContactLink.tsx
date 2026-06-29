"use client";

import type { ReactNode } from "react";

/** Contact link whose label rises out and is replaced by its logo/icon on hover. */
export default function ContactLink({
  href,
  label,
  icon,
  external = true,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="company-link contact-swap"
      aria-label={label}
    >
      <span className="co-name">{label}</span>
      <span className="co-handle" aria-hidden="true">{icon}</span>
    </a>
  );
}
