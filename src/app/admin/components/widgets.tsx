"use client";

import { useMemo, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import DecryptText from "../../components/DecryptText";
import type { Overview, Platform } from "@/app/api/admin/overview/route";
import type { ConfigDoc, Countdown, HabitsDoc, NotesDoc, QuickLink, Todo } from "./types";
import { daysBetween, fmtDayLong, fmtDayShort, fmtNum, fmtStamp, fmtTime, shiftDay, uid, weekdayInitial } from "./helpers";

// chaque carte recoit ses donnees et une fonction pour ecrire le doc entier :
// les docs sont petits, on ne s'embete pas avec des patchs

type CardProps = { title: string; aside?: ReactNode; span: number; i: number; className?: string; children: ReactNode };
export function Card({ title, aside, span, i, className, children }: CardProps) {
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

// ── comptes a rebours ──

export function Countdowns({ config, today, onChange, i }: { config: ConfigDoc; today: string; onChange: (c: ConfigDoc) => void; i: number }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const items = [...(config.countdowns || [])].sort((a, b) => (a.date < b.date ? -1 : 1));

  const add = () => {
    if (!label.trim() || !date) return;
    const next: Countdown = { id: uid(), label: label.trim(), date };
    onChange({ ...config, countdowns: [...(config.countdowns || []), next] });
    setLabel("");
    setDate("");
    setAdding(false);
  };
  const remove = (id: string) => onChange({ ...config, countdowns: (config.countdowns || []).filter((c) => c.id !== id) });

  return (
    <Card title="compte à rebours" span={4} i={i}>
      {items.length ? (
        <ul className="cd-list">
          {items.map((c) => {
            const n = daysBetween(today, c.date);
            return (
              <li key={c.id} className={`cd row ${n < 0 ? "is-past" : n === 0 ? "is-today" : ""}`}>
                <span className="big">{n === 0 ? "J" : n > 0 ? `J-${n}` : `J+${-n}`}</span>
                <span className="cd-copy">
                  <span>{c.label}</span>
                  <span className="cd-date">{fmtDayShort(c.date)}</span>
                </span>
                <button className="x" onClick={() => remove(c.id)} aria-label={`supprimer ${c.label}`}>×</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty">rien à attendre pour l&apos;instant.</p>
      )}
      {adding ? (
        <div className="add-row">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="quoi ?" autoFocus onKeyDown={(e) => e.key === "Enter" && add()} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="primary" onClick={add} disabled={!label.trim() || !date}>ok</button>
        </div>
      ) : (
        <button className="plus" onClick={() => setAdding(true)}>+ ajouter une date</button>
      )}
    </Card>
  );
}

// ── agenda ──

export function Agenda({ agenda, today, now, i }: { agenda: Overview["agenda"] | undefined; today: string; now: Date | null; i: number }) {
  const groups = useMemo(() => {
    const m = new Map<string, Overview["agenda"]["events"]>();
    for (const e of agenda?.events || []) (m.get(e.day) || m.set(e.day, []).get(e.day)!).push(e);
    return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  }, [agenda]);
  const dayLabel = (d: string) => {
    const n = daysBetween(today, d);
    return n === 0 ? "aujourd'hui" : n === 1 ? "demain" : fmtDayLong(d);
  };

  let body: ReactNode;
  if (!agenda) body = <p className="loading">…</p>;
  else if (!agenda.configured)
    body = (
      <p className="hint">
        agenda pas branché. dans google calendar → paramètres du calendrier → « adresse secrète au format ical », puis colle-la dans la variable{" "}
        <code>ADMIN_ICS_URL</code> sur vercel (plusieurs adresses séparées par des virgules).
      </p>
    );
  else if (!groups.length) body = <p className="empty">rien de prévu sur les 8 prochains jours.</p>;
  else
    body = (
      <ol className="agenda">
        {groups.map(([day, evs]) => (
          <li key={day} className={`agenda-day ${day === today ? "is-today" : ""}`}>
            <b>{dayLabel(day)}</b>
            <ul>
              {evs.map((e) => {
                const over = !e.allDay && now ? new Date(e.end).getTime() < now.getTime() : false;
                return (
                  <li key={e.id} className={`ev ${over ? "is-over" : ""}`}>
                    {e.allDay ? <span className="allday">journée</span> : <time>{fmtTime(e.start)}–{fmtTime(e.end)}</time>}
                    <span>
                      {e.title}
                      {e.location ? <span className="ev-loc">{e.location}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    );

  return (
    <Card title="agenda" aside={agenda?.errors?.length ? <span className="down">un calendrier ne répond pas</span> : "8 jours"} span={8} i={i}>
      {body}
    </Card>
  );
}

// ── a faire ──

type TodosProps = {
  items: Todo[];
  onChange: (items: Todo[]) => void;
  i: number;
  span?: number;
  title?: string;
  placeholder?: string;
  empty?: string;
};
export function Todos({ items, onChange, i, span = 4, title = "à faire", placeholder = "ajouter, puis entrée", empty = "rien en attente, profite." }: TodosProps) {
  const [text, setText] = useState("");
  const add = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !text.trim()) return;
    onChange([{ id: uid(), text: text.trim(), done: false, created: new Date().toISOString() }, ...items]);
    setText("");
  };
  const toggle = (id: string) => onChange(items.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => onChange(items.filter((t) => t.id !== id));
  const left = items.filter((t) => !t.done).length;
  const done = items.length - left;

  return (
    <Card title={title} aside={items.length ? `${left} restante${left > 1 ? "s" : ""}` : undefined} span={span} i={i}>
      <input className="todo-input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={add} placeholder={placeholder} />
      {items.length ? (
        <ul className="todos">
          {items.map((t) => (
            <li key={t.id} className={`todo row ${t.done ? "is-done" : ""}`}>
              <button className="check" onClick={() => toggle(t.id)} aria-pressed={t.done} aria-label={t.done ? "à refaire" : "fait"} />
              <button className="todo-text" onClick={() => toggle(t.id)}>{t.text}</button>
              <button className="x" onClick={() => remove(t.id)} aria-label="supprimer">×</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{empty}</p>
      )}
      {done ? (
        <div className="todo-foot">
          <span>{done} faite{done > 1 ? "s" : ""}</span>
          <button onClick={() => onChange(items.filter((t) => !t.done))}>effacer les faites</button>
        </div>
      ) : null}
    </Card>
  );
}

// ── habitudes ──

export function Habits({ doc, today, onChange, i }: { doc: HabitsDoc; today: string; onChange: (d: HabitsDoc) => void; i: number }) {
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const days = useMemo(() => Array.from({ length: 7 }, (_, k) => shiftDay(today, k - 6)), [today]);
  const log = doc.log || {};
  const habits = doc.habits || [];
  const has = (day: string, id: string) => (log[day] || []).includes(id);

  const toggle = (day: string, id: string) => {
    const cur = log[day] || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    const nextLog = { ...log, [day]: next };
    if (!next.length) delete nextLog[day];
    onChange({ ...doc, log: nextLog });
  };
  const streak = (id: string) => {
    // on part d'aujourd'hui, ou d'hier si aujourd'hui n'est pas encore coche
    let d = has(today, id) ? today : shiftDay(today, -1);
    let n = 0;
    while (has(d, id) && n < 3650) { n++; d = shiftDay(d, -1); }
    return n;
  };
  const add = () => {
    const n = name.trim();
    if (!n) return;
    onChange({ ...doc, habits: [...habits, { id: uid(), name: n }] });
    setName("");
    setAdding(false);
  };
  const remove = (id: string) => onChange({ ...doc, habits: habits.filter((h) => h.id !== id) });

  return (
    <Card title="habitudes" aside="7 derniers jours" span={8} i={i}>
      {habits.length ? (
        <table className="habits">
          <thead>
            <tr>
              <th />
              {days.map((d) => (
                <th key={d} className={d === today ? "is-today" : ""} title={fmtDayShort(d)}>{weekdayInitial(d)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => {
              const s = streak(h.id);
              return (
                <tr key={h.id} className="row">
                  <td className="h-name">
                    {h.name}
                    {s ? <span className="h-streak">{s} j</span> : null}
                    <button className="x" onClick={() => remove(h.id)} aria-label={`retirer ${h.name}`}>×</button>
                  </td>
                  {days.map((d) => (
                    <td key={d}>
                      <button
                        className={`hcell ${has(d, h.id) ? "is-on" : ""} ${d === today ? "is-today" : ""}`}
                        onClick={() => toggle(d, h.id)}
                        aria-pressed={has(d, h.id)}
                        aria-label={`${h.name} ${fmtDayShort(d)}`}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="empty">aucune habitude suivie.</p>
      )}
      {adding ? (
        <div className="add-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="nouvelle habitude" autoFocus onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="primary" onClick={add} disabled={!name.trim()}>ok</button>
        </div>
      ) : (
        <button className="plus" onClick={() => setAdding(true)}>+ une habitude</button>
      )}
    </Card>
  );
}

// ── audience ──

function Sparkline({ values }: { values: number[] }) {
  const w = 100, h = 26, pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, k) => [pad + (k / (values.length - 1)) * (w - pad * 2), h - pad - ((v - min) / span) * (h - pad * 2)]);
  const d = pts.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={d} />
      <circle cx={lx} cy={ly} r={2} />
    </svg>
  );
}

function Delta({ n, label }: { n: number | null; label: string }) {
  if (n === null) return <span>— · {label}</span>;
  const cls = n > 0 ? "up" : n < 0 ? "down" : "";
  return (
    <span className={cls}>
      {n > 0 ? "+" : n < 0 ? "−" : "±"}{fmtNum(Math.abs(n))} · {label}
    </span>
  );
}

export function Audience({ audience, i }: { audience: Overview["audience"] | undefined; i: number }) {
  const stale = (p: Platform) => Date.now() / 1000 - p.ts > 3 * 86_400;
  return (
    <Card title="audience" aside={audience ? `relevé ${fmtStamp(audience.generated)}` : undefined} span={8} i={i}>
      {!audience ? (
        <p className="loading">…</p>
      ) : (
        <>
          <div className="aud-total">
            <span className="big">{fmtNum(audience.total)}</span>
            <span>abonnés en tout</span>
          </div>
          <ul className="aud">
            {audience.platforms.map((p) => (
              <li key={p.key}>
                <span className="aud-name">
                  {p.name}
                  {stale(p) ? <small>relevé du {fmtStamp(p.ts)}</small> : null}
                </span>
                <Sparkline values={p.spark} />
                <span className="aud-n">{fmtNum(p.followers)}</span>
                <span className="aud-d">
                  <Delta n={p.delta1} label="24 h" />
                  <Delta n={p.delta7} label="7 j" />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

// ── portfolio ──

export function Portfolio({ guests, links, i }: { guests: Overview["guests"] | undefined; links: QuickLink[]; i: number }) {
  const analytics = links.find((l) => /vercel/i.test(l.label));
  return (
    <Card title="portfolio" aside="mathieuastruc.com" span={4} i={i}>
      <div className="pf">
        {!guests ? (
          <p className="loading">…</p>
        ) : (
          <>
            <span className="big">{fmtNum(guests.visitors)}</span>
            <span className="pf-sub">visiteurs uniques · <b>{guests.today}</b> aujourd&apos;hui</span>
          </>
        )}
        {analytics ? (
          <a className="chip" href={analytics.href} target="_blank" rel="noreferrer">vercel analytics ↗</a>
        ) : null}
      </div>
    </Card>
  );
}

// ── contenus ──

export function Contents({ contents, i }: { contents: Overview["contents"] | undefined; i: number }) {
  const moving = contents?.some((c) => c.moving);
  return (
    <Card title={moving ? "contenus qui bougent" : "contenus les plus vus"} span={6} i={i}>
      {!contents ? (
        <p className="loading">…</p>
      ) : !contents.length ? (
        <p className="empty">pas encore de relevé.</p>
      ) : (
        <ul className="contents">
          {contents.map((c) => (
            <li key={c.url}>
              <a href={c.url} target="_blank" rel="noreferrer">
                <span className="c-plat">{c.platform}</span>
                <span className="c-title" title={c.title}>{c.title}</span>
                <span className={`c-views ${c.moving ? "up" : ""}`}>{fmtNum(c.views)} vues</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ── veille ──

export function Veille({ veille, i }: { veille: Overview["veille"] | undefined; i: number }) {
  return (
    <Card title="veille" aside={veille ? `${veille.hours} h · ${veille.items.length ? "comptes suivis" : "rien"}` : undefined} span={6} i={i}>
      {!veille ? (
        <p className="loading">…</p>
      ) : !veille.items.length ? (
        <p className="empty">rien de neuf chez les comptes suivis.</p>
      ) : (
        <ul className="contents">
          {veille.items.map((c) => (
            <li key={c.url}>
              <a href={c.url} target="_blank" rel="noreferrer">
                <span className="c-plat" title={`${c.handle} · ${c.platform}`}>
                  {c.platform}
                  <b>{c.handle}</b>
                </span>
                <span className="c-title" title={c.title}>{c.title}</span>
                <span className="c-views">{fmtNum(c.views)} vues</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ── notes ──

export function Notes({ notes, today, onChange, i }: { notes: NotesDoc; today: string; onChange: (n: NotesDoc) => void; i: number }) {
  const previous = Object.keys(notes)
    .filter((k) => k !== today && notes[k]?.trim())
    .sort()
    .reverse()
    .slice(0, 4);
  return (
    <Card title="notes du jour" aside={fmtDayShort(today)} span={8} i={i} className="notes">
      <textarea value={notes[today] || ""} onChange={(e) => onChange({ ...notes, [today]: e.target.value })} placeholder="ce qui te passe par la tête…" />
      {previous.length ? (
        <details>
          <summary>jours précédents</summary>
          {previous.map((k) => (
            <p key={k} className="old">
              <b>{fmtDayLong(k)}</b>
              {notes[k]}
            </p>
          ))}
        </details>
      ) : null}
    </Card>
  );
}

// ── raccourcis ──

export function Links({ links, onChange, i }: { links: QuickLink[]; onChange: (links: QuickLink[]) => void; i: number }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const add = () => {
    if (!label.trim() || !/^https?:\/\//.test(href)) return;
    onChange([...links, { label: label.trim(), href }]);
    setLabel("");
    setHref("");
  };
  const remove = (h: string) => onChange(links.filter((l) => l.href !== h));

  return (
    <Card
      title="raccourcis"
      aside={<button onClick={() => setEditing((v) => !v)}>{editing ? "terminé" : "modifier"}</button>}
      span={12}
      i={i}
      className={editing ? "is-editing" : ""}
    >
      <div className="chips">
        {links.map((l) => (
          <a key={l.href} className="chip" href={l.href} target="_blank" rel="noreferrer">
            {l.label}
            {editing ? (
              <button
                className="x"
                onClick={(e) => { e.preventDefault(); remove(l.href); }}
                aria-label={`retirer ${l.label}`}
              >
                ×
              </button>
            ) : null}
          </a>
        ))}
        {!links.length ? <p className="empty">aucun lien.</p> : null}
      </div>
      {editing ? (
        <div className="add-row">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="nom" onKeyDown={(e) => e.key === "Enter" && add()} />
          <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://…" onKeyDown={(e) => e.key === "Enter" && add()} />
          <button className="primary" onClick={add} disabled={!label.trim() || !/^https?:\/\//.test(href)}>ok</button>
        </div>
      ) : null}
    </Card>
  );
}
