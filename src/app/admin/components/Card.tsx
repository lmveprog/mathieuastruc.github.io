import type { CSSProperties, ReactNode } from "react";

// une carte de la grille : titre lisible immediatement, un petit
// texte a droite, et une largeur en colonnes (sur 12)
type Props = { title: string; aside?: ReactNode; span: number; i: number; className?: string; children: ReactNode };

export default function Card({ title, aside, span, i, className, children }: Props) {
  return (
    <article className={`card ${className || ""}`} style={{ "--span": span, "--i": i } as CSSProperties}>
      <div className="card-title">
        <h2>{title}</h2>
        {aside ? <div className="card-aside">{aside}</div> : null}
      </div>
      {children}
    </article>
  );
}
