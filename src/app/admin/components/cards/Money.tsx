"use client";

import { useMemo, useState } from "react";
import Card from "../Card";
import type { MoneyDoc, MoneyEntry } from "../types";
import { fmtDayShort, fmtEuro, fmtMonth, fmtMonthShort, monthOf, shiftMonth, uid } from "../helpers";

// les sous : ce qui rentre, ce qui sort, saisi a la main. un mois a la fois,
// avec la repartition par categorie et les six derniers mois en barres.

const OUT_CATS = ["loyer", "courses", "resto", "transport", "abonnements", "sport", "shopping", "santé", "autre"];
const IN_CATS = ["salaire", "freelance", "content", "autre"];

type Props = { doc: MoneyDoc; today: string; onChange: (d: MoneyDoc) => void; i: number };

export default function Money({ doc, today, onChange, i }: Props) {
  const [month, setMonth] = useState(monthOf(today));
  const [kind, setKind] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("courses");
  const [date, setDate] = useState(today);
  const entries = doc.entries || [];

  const ofMonth = useMemo(
    () => entries.filter((e) => e.date.startsWith(month)).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [entries, month],
  );
  const earned = ofMonth.filter((e) => e.kind === "in").reduce((s, e) => s + e.amount, 0);
  const spent = ofMonth.filter((e) => e.kind === "out").reduce((s, e) => s + e.amount, 0);

  const cats = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of ofMonth) if (e.kind === "out") m.set(e.category, (m.get(e.category) || 0) + e.amount);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [ofMonth]);
  const catMax = cats[0]?.[1] || 1;

  const months = useMemo(() => {
    const out: { key: string; in: number; out: number }[] = [];
    for (let k = 5; k >= 0; k--) {
      const key = shiftMonth(month, -k);
      let i2 = 0, o = 0;
      for (const e of entries) if (e.date.startsWith(key)) e.kind === "in" ? (i2 += e.amount) : (o += e.amount);
      out.push({ key, in: i2, out: o });
    }
    return out;
  }, [entries, month]);
  const monthMax = Math.max(1, ...months.map((m) => Math.max(m.in, m.out)));

  const parsed = Number(amount.replace(",", ".").replace(/\s/g, ""));
  const valid = Number.isFinite(parsed) && parsed > 0 && label.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const add = () => {
    if (!valid) return;
    const e: MoneyEntry = { id: uid(), date, label: label.trim(), amount: Math.round(parsed * 100) / 100, kind, category };
    onChange({ ...doc, entries: [...entries, e] });
    setAmount("");
    setLabel("");
    if (!date.startsWith(month)) setMonth(monthOf(date));
  };
  const remove = (id: string) => onChange({ ...doc, entries: entries.filter((e) => e.id !== id) });
  const switchKind = (k: "in" | "out") => {
    setKind(k);
    setCategory(k === "in" ? IN_CATS[0] : OUT_CATS[1]);
  };

  return (
    <Card
      title="dépenses"
      aside={
        <span className="month-nav">
          <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="mois précédent">‹</button>
          <b>{fmtMonth(month)}</b>
          <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="mois suivant" disabled={month >= monthOf(today)}>›</button>
        </span>
      }
      span={12}
      i={i}
      className="moneycard"
    >
      <div className="money">
        <div className="money-left">
          <div className="money-sum">
            <div>
              <span className="money-k">gagné</span>
              <span className="money-v up">{fmtEuro(earned)}</span>
            </div>
            <div>
              <span className="money-k">dépensé</span>
              <span className="money-v down">{fmtEuro(spent)}</span>
            </div>
            <div>
              <span className="money-k">reste</span>
              <span className={`money-v ${earned - spent < 0 ? "down" : ""}`}>{fmtEuro(earned - spent)}</span>
            </div>
          </div>

          {cats.length ? (
            <ul className="cats">
              {cats.map(([c, v]) => (
                <li key={c}>
                  <span className="cat-name">{c}</span>
                  <span className="cat-bar"><i style={{ width: `${(v / catMax) * 100}%` }} /></span>
                  <span className="cat-v">{fmtEuro(v)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">aucune dépense ce mois-ci.</p>
          )}

          <div className="months" aria-label="six derniers mois">
            {months.map((m) => (
              <div key={m.key} className={`mbar ${m.key === month ? "is-current" : ""}`} title={`${fmtMonth(m.key)} : +${fmtEuro(m.in)} / −${fmtEuro(m.out)}`}>
                <span className="mbar-cols">
                  <i className="in" style={{ height: `${(m.in / monthMax) * 100}%` }} />
                  <i className="out" style={{ height: `${(m.out / monthMax) * 100}%` }} />
                </span>
                <button onClick={() => setMonth(m.key)}>{fmtMonthShort(m.key)}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="money-right">
          <div className="money-form">
            <div className="kind" role="radiogroup" aria-label="sens">
              <button role="radio" aria-checked={kind === "out"} onClick={() => switchKind("out")}>dépense</button>
              <button role="radio" aria-checked={kind === "in"} onClick={() => switchKind("in")}>revenu</button>
            </div>
            <input className="amt" inputMode="decimal" placeholder="0,00 €" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <input placeholder="libellé" value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="catégorie">
              {(kind === "in" ? IN_CATS : OUT_CATS).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="date" />
            <button className="primary" onClick={add} disabled={!valid}>ok</button>
          </div>

          {ofMonth.length ? (
            <ul className="ledger">
              {ofMonth.map((e) => (
                <li key={e.id} className="row">
                  <span className="l-date">{fmtDayShort(e.date)}</span>
                  <span className="l-label">
                    {e.label}
                    <small>{e.category}</small>
                  </span>
                  <span className={`l-amt ${e.kind === "in" ? "up" : ""}`}>{e.kind === "in" ? "+" : "−"}{fmtEuro(e.amount, true)}</span>
                  <button className="x" onClick={() => remove(e.id)} aria-label="supprimer">×</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">rien de saisi pour {fmtMonth(month)}.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
