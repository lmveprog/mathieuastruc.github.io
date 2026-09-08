import type { CSSProperties, ReactNode } from "react";
import DecryptText from "../../components/DecryptText";

// une carte de la grille : titre decrypte comme les h2 du site, un petit
// texte a droite, et une largeur en colonnes (sur 12)
type Props = { title: string; aside?: ReactNode; span: number; i: number; className?: string; children: ReactNode };

export default function Card({ title, aside, span, i, className, children }: Props) {
  return (
    <article className={`card ${className || ""}`} style={{ "--span": span, "--i": i } as CSSProperties}>
      <h2 className="card-title">
        <span><DecryptText text={title} trigger="visible" /></span>
        {aside ? <small>{aside}</small> : null}
      </h2>
      {children}
    </article>
  );
}
