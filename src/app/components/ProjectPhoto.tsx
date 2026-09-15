"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

type Props = {
  thumb: string;
  full: string;
  size: [number, number];
  alt: string;
  caption: string;
  tilt?: number;
};

// petit polaroid penché au bout d'une ligne de projet, la photo s'ouvre en grand au clic.
// le dialog vit dans le body : sinon survoler la photo ouverte réveille la ligne en dessous
export default function ProjectPhoto({ thumb, full, size, alt, caption, tilt = -3 }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <button
        type="button"
        className="project-thumb"
        style={{ "--tilt": `${tilt}deg` } as CSSProperties}
        onClick={() => dialog.current?.showModal()}
        aria-label={`open photo: ${caption}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt="" width={432} height={288} loading="lazy" decoding="async" />
      </button>

      {mounted
        ? createPortal(
            <dialog ref={dialog} className="photo-dialog" aria-label={caption} onClick={() => dialog.current?.close()}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={full} alt={alt} width={size[0]} height={size[1]} loading="lazy" decoding="async" />
                <figcaption>{caption}</figcaption>
              </figure>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
