"use client";

import { useMemo, type ReactNode } from "react";
import Card from "../Card";
import type { Overview } from "@/app/api/admin/overview/route";
import { daysBetween, fmtDayLong, fmtTime } from "../helpers";

// l'agenda google, lu via son adresse ics secrete : aujourd'hui puis les
// sept jours suivants, groupes par jour

type Props = { agenda: Overview["agenda"] | undefined; today: string; now: Date; i: number; span?: number };

export default function Agenda({ agenda, today, now, i, span = 7 }: Props) {
  const groups = useMemo(() => {
    const m = new Map<string, Overview["agenda"]["events"]>();
    for (const e of agenda?.events || []) (m.get(e.day) || m.set(e.day, []).get(e.day)!).push(e);
    return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  }, [agenda]);
  // le nom de l'agenda n'apporte rien s'il n'y en a qu'un
  const several = useMemo(() => new Set((agenda?.events || []).map((e) => e.calendar).filter(Boolean)).size > 1, [agenda]);
  const dayLabel = (d: string) => {
    const n = daysBetween(today, d);
    return n === 0 ? "aujourd'hui" : n === 1 ? "demain" : fmtDayLong(d);
  };

  let body: ReactNode;
  if (!agenda) body = <p className="loading">…</p>;
  else if (!agenda.configured)
    body = (
      <p className="hint">
        agenda pas branché. dans google calendar → paramètres de l&apos;agenda → « adresse secrète au format ical », puis colle-la dans la
        variable <code>ADMIN_ICS_URL</code> sur vercel (plusieurs agendas séparés par des virgules).
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
                  <li key={e.id} className={`ev ${over ? "is-over" : ""}`}>
                    {e.allDay ? <span className="allday">journée</span> : <time>{fmtTime(e.start)}–{fmtTime(e.end)}</time>}
                    <span>
                      {e.title}
                      {e.location ? <span className="ev-loc">{e.location}</span> : null}
                      {e.calendar && several ? <span className="ev-cal">{e.calendar}</span> : null}
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
    <Card
      title="agenda"
      aside={
        <a href="https://calendar.google.com" target="_blank" rel="noreferrer">
          {agenda?.errors?.length ? <span className="down">un agenda ne répond pas · </span> : null}ouvrir google calendar ↗
        </a>
      }
      span={span}
      i={i}
    >
      {body}
    </Card>
  );
}
