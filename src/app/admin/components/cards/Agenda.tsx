"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Card from "../Card";
import type { AgendaPayload } from "@/app/api/admin/overview/route";
import { daysBetween, fmtDayLong, fmtTime, TZ } from "../helpers";
import { zonedToUtc } from "@/lib/ics";

// l'agenda google : aujourd'hui puis les sept jours suivants. en lecture
// via l'ics, ou en lecture / ecriture via l'apps script (ajout, suppression
// dans l'agenda principal).

type Props = { agenda: AgendaPayload | undefined; today: string; now: Date; i: number; span?: number };

const roundHour = (now: Date) => {
  const f = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" });
  const h = Math.min(23, Number(f.format(now)) + 1);
  return `${String(h).padStart(2, "0")}:00`;
};
const plusHour = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${String(Math.min(23, h + 1)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
// "2026-09-10" + "18:30" a paris → iso utc
const toIso = (date: string, time: string) => {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(zonedToUtc(y, mo, d, h, mi, 0)).toISOString();
};

export default function Agenda({ agenda: initial, today, now, i, span = 7 }: Props) {
  const [agenda, setAgenda] = useState<AgendaPayload | undefined>(initial);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [allDay, setAllDay] = useState(false);
  const [start, setStart] = useState(() => roundHour(now));
  const [end, setEnd] = useState(() => plusHour(roundHour(now)));
  const [location, setLocation] = useState("");

  useEffect(() => setAgenda(initial), [initial]);

  const groups = useMemo(() => {
    const m = new Map<string, AgendaPayload["events"]>();
    for (const e of agenda?.events || []) (m.get(e.day) || m.set(e.day, []).get(e.day)!).push(e);
    return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  }, [agenda]);
  const several = useMemo(() => new Set((agenda?.events || []).map((e) => e.calendar).filter(Boolean)).size > 1, [agenda]);
  const dayLabel = (d: string) => {
    const n = daysBetween(today, d);
    return n === 0 ? "aujourd'hui" : n === 1 ? "demain" : fmtDayLong(d);
  };

  const submit = async () => {
    if (!title.trim() || busy) return;
    setBusy(true);
    setErr(null);
    const body = allDay
      ? { title, allDay: true, date, location }
      : { title, allDay: false, start: toIso(date, start), end: toIso(date, end), location };
    try {
      const r = await fetch("/api/admin/agenda", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `http ${r.status}`);
      setAgenda(d.agenda);
      setTitle("");
      setLocation("");
      setAdding(false);
    } catch (e) {
      setErr(String((e as Error).message));
    }
    setBusy(false);
  };
  const remove = async (gid: string) => {
    if (busy) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/agenda?id=${encodeURIComponent(gid)}`, { method: "DELETE" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `http ${r.status}`);
      setAgenda(d.agenda);
    } catch (e) {
      setErr(String((e as Error).message));
    }
    setBusy(false);
  };

  let body: ReactNode;
  if (!agenda) body = <p className="loading">…</p>;
  else if (!agenda.configured)
    body = (
      <p className="hint">
        agenda pas branché. le plus simple : le script <code>docs/agenda.gs</code> déployé sur script.google.com, puis <code>ADMIN_GAS_URL</code> et{" "}
        <code>ADMIN_GAS_SECRET</code> sur vercel (lecture + ajout). à défaut, l&apos;adresse ics secrète dans <code>ADMIN_ICS_URL</code> (lecture seule).
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
                const over = !e.allDay && new Date(e.end).getTime() < now.getTime();
                return (
                  <li key={e.id} className={`ev row ${over ? "is-over" : ""}`}>
                    {e.allDay ? <span className="allday">journée</span> : <time>{fmtTime(e.start)}–{fmtTime(e.end)}</time>}
                    <span>
                      {e.title}
                      {e.location ? <span className="ev-loc">{e.location}</span> : null}
                      {e.calendar && several ? <span className="ev-cal">{e.calendar}</span> : null}
                    </span>
                    {agenda.writable && e.deletable && e.gid ? (
                      <button className="x" onClick={() => remove(e.gid!)} aria-label={`supprimer ${e.title}`} disabled={busy}>×</button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    );

  return (
    <Card
      title="agenda"
      aside={
        <a href="https://calendar.google.com" target="_blank" rel="noreferrer">
          {agenda?.errors?.length ? <span className="down">agenda en erreur · </span> : null}
          {agenda?.source === "ics" ? "ics, lecture seule · " : ""}ouvrir google calendar ↗
        </a>
      }
      span={span}
      i={i}
      className="agendacard"
    >
      {body}
      {agenda?.errors?.length ? <p className="hint down">{agenda.errors[0]}</p> : null}
      {agenda?.writable ? (
        adding ? (
          <div className="ev-form">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="quoi ?" autoFocus onKeyDown={(e) => e.key === "Enter" && submit()} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="date" />
            <label className="ev-allday">
              <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> journée
            </label>
            {!allDay ? (
              <>
                <input type="time" value={start} onChange={(e) => { setStart(e.target.value); if (e.target.value >= end) setEnd(plusHour(e.target.value)); }} aria-label="début" />
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="fin" />
              </>
            ) : null}
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="lieu (option)" onKeyDown={(e) => e.key === "Enter" && submit()} />
            <span className="ev-actions">
              <button className="primary" onClick={submit} disabled={busy || !title.trim()}>{busy ? "…" : "ajouter"}</button>
              <button className="plus" onClick={() => { setAdding(false); setErr(null); }}>annuler</button>
            </span>
            {err ? <p className="hint down">{err}</p> : null}
          </div>
        ) : (
          <button className="plus" onClick={() => setAdding(true)}>+ ajouter à l&apos;agenda</button>
        )
      ) : null}
    </Card>
  );
}
