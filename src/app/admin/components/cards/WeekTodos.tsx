"use client";

import { useState, type KeyboardEvent } from "react";
import Card from "../Card";
import type { Todo } from "../types";
import { dayNumber, fmtDayShort, mondayOf, shiftDay, uid, weekdayLong } from "../helpers";

// la semaine en sept colonnes, une tache par ligne, cochable. ce qui n'a
// pas ete fait la semaine d'avant remonte dans "en retard", d'ou on peut
// le pousser a aujourd'hui.

type Props = { items: Todo[]; today: string; onChange: (items: Todo[]) => void; i: number };

const dayOf = (t: Todo) => t.day || t.created.slice(0, 10);

export default function WeekTodos({ items, today, onChange, i }: Props) {
  const [adding, setAdding] = useState<string | null>(null);
  const [text, setText] = useState("");
  const monday = mondayOf(today);
  const days = Array.from({ length: 7 }, (_, k) => shiftDay(monday, k));

  // les taches faites il y a plus de deux semaines ne servent plus a rien
  const prune = (list: Todo[]) => list.filter((t) => !t.done || dayOf(t) >= shiftDay(monday, -14));

  const add = (day: string) => {
    const v = text.trim();
    if (!v) return;
    onChange(prune([...items, { id: uid(), text: v, done: false, created: new Date().toISOString(), day }]));
    setText("");
  };
  const onKey = (day: string) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") add(day);
    if (e.key === "Escape") { setAdding(null); setText(""); }
  };
  const toggle = (id: string) => onChange(prune(items.map((t) => (t.id === id ? { ...t, done: !t.done } : t))));
  const remove = (id: string) => onChange(items.filter((t) => t.id !== id));
  const toToday = (id: string) => onChange(items.map((t) => (t.id === id ? { ...t, day: today } : t)));

  const late = items.filter((t) => !t.done && dayOf(t) < monday);
  const inWeek = items.filter((t) => dayOf(t) >= monday && dayOf(t) <= days[6]);
  const left = inWeek.filter((t) => !t.done).length + late.length;
  const byDay = (d: string) =>
    inWeek.filter((t) => dayOf(t) === d).sort((a, b) => Number(a.done) - Number(b.done) || (a.created < b.created ? -1 : 1));

  const row = (t: Todo, extra?: React.ReactNode) => (
    <li key={t.id} className={`todo row ${t.done ? "is-done" : ""}`}>
      <button className="check" onClick={() => toggle(t.id)} aria-pressed={t.done} aria-label={t.done ? "à refaire" : "fait"} />
      <button className="todo-text" onClick={() => toggle(t.id)}>{t.text}</button>
      <span className="todo-tools">
        {extra}
        <button className="x" onClick={() => remove(t.id)} aria-label="supprimer">×</button>
      </span>
    </li>
  );

  return (
    <Card
      title="todo de la semaine"
      aside={`${left ? `${left} à faire` : "tout est fait"} · semaine du ${fmtDayShort(monday)}`}
      span={12}
      i={i}
      className="weekcard"
    >
      {late.length ? (
        <div className="late">
          <b>en retard</b>
          <ul className="todos">
            {late.map((t) =>
              row(
                t,
                <button className="todo-move" onClick={() => toToday(t.id)} title="déplacer à aujourd'hui">
                  → auj.
                </button>,
              ),
            )}
          </ul>
        </div>
      ) : null}
      <div className="week">
        {days.map((d) => {
          const list = byDay(d);
          const past = d < today;
          return (
            <div key={d} className={`wday ${d === today ? "is-today" : ""} ${past ? "is-past" : ""} ${!list.length && past ? "is-empty" : ""}`}>
              <header>
                <b>{weekdayLong(d)}</b>
                <span>{dayNumber(d)}</span>
              </header>
              {list.length ? <ul className="todos">{list.map((t) => row(t))}</ul> : null}
              {adding === d ? (
                <input
                  className="wadd-input"
                  value={text}
                  autoFocus
                  placeholder="quoi ?"
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKey(d)}
                  onBlur={() => { if (!text.trim()) setAdding(null); }}
                />
              ) : (
                <button className="wadd" onClick={() => { setAdding(d); setText(""); }} aria-label={`ajouter ${weekdayLong(d)}`}>
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
