// fond du /admin : pas les particules du site (deja vues sur l'accueil),
// juste une lumiere douce qui derive lentement et une trame de points a
// peine visible, comme du papier millimetre. tout en css, zero canvas.
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="blob blob--1" />
      <span className="blob blob--2" />
      <span className="blob blob--3" />
    </div>
  );
}
