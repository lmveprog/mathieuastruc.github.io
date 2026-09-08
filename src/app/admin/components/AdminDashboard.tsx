"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AsciiBackground from "../../components/AsciiBackground";
import LiquidText from "../../components/LiquidText";
import ProfileCard from "../../components/ProfileCard";
import ThemeToggle from "../../components/ThemeToggle";
import type { Overview } from "@/app/api/admin/overview/route";
import { EMPTY_DOCS, type Docs } from "./types";
import { TZ, todayKey } from "./helpers";
import { Agenda, Audience, Contents, Countdowns, Habits, Links, Notes, Portfolio, Todos, Veille } from "./widgets";

// le tableau de bord a deux faces : "mathieu" (vie perso / pro) et
// "matheus" (le compte content). meme accroche en haut (bonjour, date,
// heure, meteo), des cartes differentes en dessous. les docs modifiables
// passent par /api/admin/store, le reste vient d'un seul /api/admin/overview.

type Side = "mathieu" | "matheus";
type Status = { kind: "idle" | "saving" | "saved" | "error"; text?: string };

const dateFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const clockFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" });

function greeting(now: Date) {
  const h = Number(hourFmt.format(now));
  if (h < 5) return "bonne nuit";
  if (h < 12) return "bonjour";
  if (h < 18) return "bon après-midi";
  return "bonsoir";
}

// les docs manquants sur le vps arrivent en null : on remet les valeurs vides
function withDefaults(raw: Record<string, unknown>): Docs {
  const out = { ...EMPTY_DOCS } as Docs;
  for (const k of Object.keys(EMPTY_DOCS) as (keyof Docs)[]) if (raw[k] && typeof raw[k] === "object") (out as Record<string, unknown>)[k] = raw[k];
  return out;
}

const readSide = (): Side => {
  const h = window.location.hash.replace("#", "");
  if (h === "matheus" || h === "mathieu") return h;
  try {
    if (localStorage.getItem("admin-side") === "matheus") return "matheus";
  } catch {}
  return "mathieu";
};

export default function AdminDashboard() {
  const [side, setSide] = useState<Side>("mathieu");
  const [docs, setDocs] = useState<Docs | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [problems, setProblems] = useState<string[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setSide(readSide());
    const tick = () => setNow(new Date());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fail = (label: string) => (e: Error) => setProblems((p) => [...p, `${label} : ${e.message}`]);
    fetch("/api/admin/store", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`http ${r.status}`))))
      .then((d) => setDocs(withDefaults(d)))
      .catch((e) => { setDocs(EMPTY_DOCS); fail("stockage")(e); });
    fetch("/api/admin/overview", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`http ${r.status}`))))
      .then((o: Overview) => { setOverview(o); if (o.errors?.length) setProblems((p) => [...p, ...o.errors]); })
      .catch(fail("données"));
  }, []);

  const switchSide = (s: Side) => {
    setSide(s);
    try { localStorage.setItem("admin-side", s); } catch {}
    history.replaceState(null, "", `#${s}`);
  };

  const save = useCallback(<K extends keyof Docs>(key: K, next: Docs[K], delay = 0) => {
    setDocs((d) => ({ ...(d || EMPTY_DOCS), [key]: next }));
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      setStatus({ kind: "saving", text: "enregistrement…" });
      try {
        const r = await fetch(`/api/admin/store/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!r.ok) throw new Error(String(r.status));
        setStatus({ kind: "saved", text: `enregistré ${clockFmt.format(new Date()).slice(0, 5)}` });
      } catch {
        setStatus({ kind: "error", text: "pas enregistré, le vps ne répond pas" });
      }
    }, delay);
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const today = now ? todayKey() : "";
  const w = overview?.weather;
  const hello = `${now ? greeting(now) : "bonjour"}, ${side === "matheus" ? "Matheus" : "Mathieu"}`;

  return (
    <>
      <AsciiBackground />
      <div className="admin-top">
        <div className="sides" role="tablist" aria-label="face du tableau de bord">
          <button role="tab" aria-selected={side === "mathieu"} onClick={() => switchSide("mathieu")}>
            mathieu astruc<small>perso · pro</small>
          </button>
          <button role="tab" aria-selected={side === "matheus"} onClick={() => switchSide("matheus")}>
            matheus<small>content</small>
          </button>
        </div>
        <nav>
          <span className={`admin-status ${status.kind === "error" ? "is-error" : ""}`} aria-live="polite">{status.text || ""}</span>
          <a href="/">le site</a>
          <button onClick={logout}>sortir</button>
          <ThemeToggle />
        </nav>
      </div>

      {/* meme carte que le hero du site : reflet qui suit la souris, legere inclinaison */}
      <ProfileCard>
        <div className="admin-hero">
          <div>
            <h1 className="admin-greet">
              {/* la cle force un nouveau ripple quand on change de face */}
              <LiquidText key={hello} text={hello} />
              <span aria-hidden="true">.</span>
            </h1>
            <p className="admin-date">{now ? dateFmt.format(now) : " "}</p>
          </div>
          <div>
            <p className="admin-clock" aria-label="heure à Paris">
              {now ? clockFmt.format(now).slice(0, 5) : "--:--"}
              <small>{now ? clockFmt.format(now).slice(6) : ""}</small>
            </p>
            <p className="admin-weather">
              {w ? (
                <>
                  {w.city} · <b>{w.temp}°</b> {w.label} · {w.tmin}° / {w.tmax}°{w.rain >= 30 ? ` · pluie ${w.rain} %` : ""}
                </>
              ) : overview ? "météo indisponible" : " "}
            </p>
          </div>
        </div>
      </ProfileCard>

      {problems.length ? (
        <ul className="problems">
          {problems.map((p, k) => <li key={k}>⚠ {p}</li>)}
        </ul>
      ) : null}

      {!docs || !now ? (
        <p className="loading">chargement…</p>
      ) : side === "mathieu" ? (
        <div className="grid" key="mathieu">
          <Countdowns config={docs.config} today={today} onChange={(c) => save("config", c)} i={0} />
          <Agenda agenda={overview?.agenda} today={today} now={now} i={1} />
          <Todos items={docs.todos.items || []} onChange={(items) => save("todos", { items })} i={2} />
          <Habits doc={docs.habits} today={today} onChange={(d) => save("habits", d)} i={3} />
          <Notes notes={docs.notes} today={today} onChange={(n) => save("notes", n, 800)} i={4} />
          <Portfolio guests={overview?.guests} links={docs.config.links || []} i={5} />
          <Links links={docs.config.links || []} onChange={(links) => save("config", { ...docs.config, links })} i={6} />
        </div>
      ) : (
        <div className="grid" key="matheus">
          <Audience audience={overview?.audience} i={0} />
          <Todos
            items={docs.content.ideas || []}
            onChange={(ideas) => save("content", { ...docs.content, ideas })}
            i={1}
            title="à publier"
            placeholder="une idée, puis entrée"
            empty="pas d'idée en stock, va scroller."
          />
          <Contents contents={overview?.contents} i={2} />
          <Veille veille={overview?.veille} i={3} />
          <Links links={docs.config.contentLinks || []} onChange={(contentLinks) => save("config", { ...docs.config, contentLinks })} i={4} />
        </div>
      )}
    </>
  );
}
