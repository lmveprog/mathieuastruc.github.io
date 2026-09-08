"use client";

import { useMemo, useState } from "react";
import Card from "../Card";
import type { MoneyDoc, MoneyEntry, Recurring } from "../types";
import { fmtDayShort, fmtEuro, fmtMonth, fmtMonthShort, monthOf, shiftMonth, uid } from "../helpers";

// les sous : ce qui rentre, ce qui sort, saisi a la main. un mois a la fois,
// avec la repartition par categorie et les six derniers mois en barres.
// les abonnements sont comptes tout seuls chaque mois (lignes "abo").

const OUT_CATS = ["loyer", "courses", "resto", "transport", "abonnements", "outils", "sport", "shopping", "santé", "autre"];
const IN_CATS = ["salaire", "freelance", "content", "autre"];
const MONTHS = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];

const daysInMonth = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};
const occursIn = (r: Recurring, month: string) => {
  if (r.since && month < r.since) return false;
  if (r.until && month > r.until) return false;
  if (r.every === "year") return Number(month.slice(5, 7)) === (r.month || 1);
  return true;
};
// les abonnements du mois, sous forme de lignes comme les autres
const virtualEntries = (recurring: Recurring[], month: string): MoneyEntry[] =>
  recurring
    .filter((r) => occursIn(r, month))
    .map((r) => ({
      id: `rec-${r.id}-${month}`,
      date: `${month}-${String(Math.min(r.day || 1, daysInMonth(month))).padStart(2, "0")}`,
      label: r.label,
      amount: r.amount,
      kind: r.kind,
      category: r.category,
      virtual: true,
    }));

type Props = { doc: MoneyDoc; today: string; onChange: (d: MoneyDoc) => void; i: number };

export default function Money({ doc, today, onChange, i }: Props) {
  const [month, setMonth] = useState(monthOf(today));
  const [kind, setKind] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("courses");
  const [date, setDate] = useState(today);
  const [monthly, setMonthly] = useState(false);
  // formulaire d'abonnement
  const [subOpen, setSubOpen] = useState(false);
  const [subLabel, setSubLabel] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subDay, setSubDay] = useState(String(Number(today.slice(8, 10))));
  const [subCat, setSubCat] = useState("abonnements");
  const [subKind, setSubKind] = useState<"in" | "out">("out");
  const [subEvery, setSubEvery] = useState<"month" | "year">("month");
  const [subMonth, setSubMonth] = useState(Number(today.slice(5, 7)));

  const entries = doc.entries || [];
  const recurring = doc.recurring || [];

  const ofMonth = useMemo(
    () =>
      [...entries.filter((e) => e.date.startsWith(month)), ...virtualEntries(recurring, month)].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    [entries, recurring, month],
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
      for (const e of [...entries.filter((e) => e.date.startsWith(key)), ...virtualEntries(recurring, key)]) e.kind === "in" ? (i2 += e.amount) : (o += e.amount);
      out.push({ key, in: i2, out: o });
    }
    return out;
  }, [entries, recurring, month]);
  const monthMax = Math.max(1, ...months.map((m) => Math.max(m.in, m.out)));

  const subsMonthly = recurring.filter((r) => r.kind === "out" && r.every === "month" && occursIn(r, month)).reduce((s, r) => s + r.amount, 0);
  const subsYearly = recurring.filter((r) => r.kind === "out" && r.every === "year" && !(r.until && month > r.until)).reduce((s, r) => s + r.amount, 0);

  const parseAmount = (v: string) => Number(v.replace(",", ".").replace(/\s/g, ""));
  const parsed = parseAmount(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && label.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const add = () => {
    if (!valid) return;
    const amt = Math.round(parsed * 100) / 100;
    if (monthly) {
      // "chaque mois" : un prelevement qui part de ce mois-ci, le meme jour
      const r: Recurring = { id: uid(), label: label.trim(), amount: amt, kind, category, day: Number(date.slice(8, 10)), every: "month", since: monthOf(date) };
      onChange({ ...doc, recurring: [...recurring, r] });
    } else {
      const e: MoneyEntry = { id: uid(), date, label: label.trim(), amount: amt, kind, category };
      onChange({ ...doc, entries: [...entries, e] });
    }
    setAmount("");
    setLabel("");
    setMonthly(false);
    if (!date.startsWith(month)) setMonth(monthOf(date));
  };
  const remove = (id: string) => onChange({ ...doc, entries: entries.filter((e) => e.id !== id) });
  const switchKind = (k: "in" | "out") => {
    setKind(k);
    setCategory(k === "in" ? IN_CATS[0] : OUT_CATS[1]);
  };

  const subParsed = parseAmount(subAmount);
  const subValid = Number.isFinite(subParsed) && subParsed > 0 && subLabel.trim().length > 0 && Number(subDay) >= 1 && Number(subDay) <= 31;
  const addSub = () => {
    if (!subValid) return;
    const r: Recurring = {
      id: uid(),
      label: subLabel.trim(),
      amount: Math.round(subParsed * 100) / 100,
      kind: subKind,
      category: subCat,
      day: Number(subDay),
      every: subEvery,
      month: subEvery === "year" ? subMonth : undefined,
      since: month,
    };
    onChange({ ...doc, recurring: [...recurring, r] });
    setSubLabel("");
    setSubAmount("");
    setSubOpen(false);
  };
  // un abonnement arrete garde son historique : on le clot au mois affiche
  const stopSub = (id: string) => {
    const prev = shiftMonth(month, -1);
    const next = recurring
      .map((r) => (r.id === id ? { ...r, until: r.since && prev < r.since ? undefined : prev } : r))
      .filter((r) => !(r.id === id && r.until === undefined));
    onChange({ ...doc, recurring: next });
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

          <div className="subs">
            <div className="subs-head">
              <span className="money-k">dépenses mensuelles</span>
              <b>
                {fmtEuro(subsMonthly)} / mois{subsYearly ? ` · ${fmtEuro(subsYearly)} / an` : ""}
              </b>
            </div>
            {recurring.filter((r) => !(r.until && month > r.until)).length ? (
              <ul className="subs-list">
                {recurring
                  .filter((r) => !(r.until && month > r.until))
                  .sort((a, b) => b.amount - a.amount)
                  .map((r) => (
                    <li key={r.id} className="row">
                      <span className="sub-label">
                        {r.label}
                        <small>
                          {r.category} · le {r.day}
                          {r.every === "year" ? ` ${MONTHS[(r.month || 1) - 1]}, chaque année` : ""}
                          {r.source ? ` · ${r.source}` : ""}
                        </small>
                      </span>
                      <span className={`l-amt ${r.kind === "in" ? "up" : ""}`}>{r.kind === "in" ? "+" : ""}{fmtEuro(r.amount, true)}</span>
                      <button className="x" onClick={() => stopSub(r.id)} aria-label={`arrêter ${r.label}`} title="arrêter (l'historique reste)">×</button>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="empty">aucune dépense fixe.</p>
            )}
            {subOpen ? (
              <div className="sub-form">
                <input value={subLabel} onChange={(e) => setSubLabel(e.target.value)} placeholder="quoi ?" autoFocus onKeyDown={(e) => e.key === "Enter" && addSub()} />
                <input className="amt" inputMode="decimal" value={subAmount} onChange={(e) => setSubAmount(e.target.value)} placeholder="0,00 €" onKeyDown={(e) => e.key === "Enter" && addSub()} />
                <label className="sub-day">
                  le <input inputMode="numeric" value={subDay} onChange={(e) => setSubDay(e.target.value.replace(/\D/g, "").slice(0, 2))} aria-label="jour" />
                </label>
                <select value={subKind} onChange={(e) => { const k = e.target.value as "in" | "out"; setSubKind(k); setSubCat(k === "in" ? IN_CATS[0] : "abonnements"); }} aria-label="sens">
                  <option value="out">dépense</option>
                  <option value="in">revenu</option>
                </select>
                <select value={subCat} onChange={(e) => setSubCat(e.target.value)} aria-label="catégorie">
                  {(subKind === "in" ? IN_CATS : OUT_CATS).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={subEvery} onChange={(e) => setSubEvery(e.target.value as "month" | "year")} aria-label="fréquence">
                  <option value="month">chaque mois</option>
                  <option value="year">chaque année</option>
                </select>
                {subEvery === "year" ? (
                  <select value={subMonth} onChange={(e) => setSubMonth(Number(e.target.value))} aria-label="mois">
                    {MONTHS.map((m, k) => <option key={m} value={k + 1}>{m}</option>)}
                  </select>
                ) : null}
                <span className="ev-actions">
                  <button className="primary" onClick={addSub} disabled={!subValid}>ok</button>
                  <button className="plus" onClick={() => setSubOpen(false)}>annuler</button>
                </span>
              </div>
            ) : (
              <button className="plus" onClick={() => setSubOpen(true)}>+ une dépense mensuelle</button>
            )}
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
            <label className="ev-allday" title="se répète tous les mois à cette date">
              <input type="checkbox" checked={monthly} onChange={(e) => setMonthly(e.target.checked)} /> chaque mois
            </label>
            <button className="primary" onClick={add} disabled={!valid}>ok</button>
          </div>

          {ofMonth.length ? (
            <ul className="ledger">
              {ofMonth.map((e) => (
                <li key={e.id} className={`row ${e.virtual ? "is-virtual" : ""} ${e.date > today ? "is-future" : ""}`}>
                  <span className="l-date">{fmtDayShort(e.date)}</span>
                  <span className="l-label">
                    {e.label}
                    <small>{e.virtual ? "abo" : e.category}</small>
                  </span>
                  <span className={`l-amt ${e.kind === "in" ? "up" : ""}`}>{e.kind === "in" ? "+" : "−"}{fmtEuro(e.amount, true)}</span>
                  {e.virtual ? <span className="x-space" /> : <button className="x" onClick={() => remove(e.id)} aria-label="supprimer">×</button>}
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
