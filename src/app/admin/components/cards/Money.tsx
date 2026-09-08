"use client";

import { useMemo, useState } from "react";
import Card from "../Card";
import type { MoneyDoc, MoneyEntry, Recurring } from "../types";
import { fmtDayShort, fmtEuro, fmtMonth, monthOf, shiftMonth, uid } from "../helpers";

// les sous, un mois a la fois : gagne / depense / reste en haut, les fixes
// (loyer, abonnements, salaire) a gauche avec leur jour, les mouvements du
// mois a droite. les fixes sont comptes tout seuls chaque mois.

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
const dateOf = (r: Recurring, month: string) => `${month}-${String(Math.min(r.day || 1, daysInMonth(month))).padStart(2, "0")}`;
const parseAmount = (v: string) => Number(v.replace(",", ".").replace(/\s/g, ""));

type Props = { doc: MoneyDoc; today: string; onChange: (d: MoneyDoc) => void; i: number };

export default function Money({ doc, today, onChange, i }: Props) {
  const [month, setMonth] = useState(monthOf(today));
  // mouvement ponctuel
  const [kind, setKind] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("courses");
  const [date, setDate] = useState(today);
  const [monthly, setMonthly] = useState(false);
  // fixe
  const [subOpen, setSubOpen] = useState(false);
  const [subLabel, setSubLabel] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subDay, setSubDay] = useState("1");
  const [subKind, setSubKind] = useState<"in" | "out">("out");
  const [subCat, setSubCat] = useState("abonnements");
  const [subEvery, setSubEvery] = useState<"month" | "year">("month");
  const [subMonth, setSubMonth] = useState(Number(today.slice(5, 7)));
  const [subUrl, setSubUrl] = useState("");

  const entries = doc.entries || [];
  const recurring = doc.recurring || [];

  const fixes = useMemo(
    () => recurring.filter((r) => occursIn(r, month)).map((r) => ({ r, date: dateOf(r, month) })).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : b.r.amount - a.r.amount)),
    [recurring, month],
  );
  const moves = useMemo(
    () => entries.filter((e) => e.date.startsWith(month)).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [entries, month],
  );
  const sum = (list: { kind: "in" | "out"; amount: number }[], k: "in" | "out") => list.filter((x) => x.kind === k).reduce((s, x) => s + x.amount, 0);
  const earned = sum(fixes.map((f) => f.r), "in") + sum(moves, "in");
  const spent = sum(fixes.map((f) => f.r), "out") + sum(moves, "out");
  const fixedOut = sum(fixes.map((f) => f.r), "out");
  const rest = earned - spent;
  const isCurrent = month === monthOf(today);
  const daysLeft = isCurrent ? daysInMonth(month) - Number(today.slice(8, 10)) + 1 : 0;

  const parsed = parseAmount(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && label.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const add = () => {
    if (!valid) return;
    const amt = Math.round(parsed * 100) / 100;
    if (monthly) {
      const r: Recurring = { id: uid(), label: label.trim(), amount: amt, kind, category, day: Number(date.slice(8, 10)), every: "month", since: monthOf(date) };
      onChange({ ...doc, recurring: [...recurring, r] });
    } else {
      onChange({ ...doc, entries: [...entries, { id: uid(), date, label: label.trim(), amount: amt, kind, category }] });
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
      cancelUrl: /^https?:\/\//.test(subUrl.trim()) ? subUrl.trim() : undefined,
    };
    onChange({ ...doc, recurring: [...recurring, r] });
    setSubLabel("");
    setSubAmount("");
    setSubUrl("");
    setSubOpen(false);
  };
  // un fixe arrete garde son historique : on le clot au mois d'avant
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
          <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="mois suivant">›</button>
        </span>
      }
      span={12}
      i={i}
      className="moneycard"
    >
      <div className="money-sum money-sum--wide">
        <div>
          <span className="money-k">gagné</span>
          <span className="money-v up">{fmtEuro(earned)}</span>
        </div>
        <div>
          <span className="money-k">dépensé</span>
          <span className="money-v down">{fmtEuro(spent)}</span>
          <span className="money-sub">dont {fmtEuro(fixedOut)} de fixes</span>
        </div>
        <div>
          <span className="money-k">reste</span>
          <span className={`money-v ${rest < 0 ? "down" : ""}`}>{fmtEuro(rest)}</span>
          {daysLeft > 0 ? <span className="money-sub">{fmtEuro(Math.max(0, rest) / daysLeft)} / jour sur {daysLeft} j</span> : null}
        </div>
      </div>

      <div className="money money--simple">
        <div className="money-left">
          <div className="subs-head">
            <span className="money-k">fixes du mois</span>
            <b>{fmtEuro(fixedOut)}</b>
          </div>
          {fixes.length ? (
            <ul className="fixes">
              {fixes.map(({ r, date: d }) => {
                const passed = isCurrent ? d < today : month < monthOf(today);
                const isToday = isCurrent && d === today;
                return (
                  <li key={r.id} className={`row ${passed ? "is-passed" : ""} ${isToday ? "is-today" : ""}`}>
                    <span className="fx-day">{isToday ? "auj." : `le ${Number(d.slice(8, 10))}`}</span>
                    <span className="fx-label">
                      {r.label}
                      {r.every === "year" ? <small>{MONTHS[(r.month || 1) - 1]}, annuel</small> : null}
                      {r.cancelUrl ? <a href={r.cancelUrl} target="_blank" rel="noreferrer">résilier ↗</a> : null}
                      {!r.cancelUrl && r.source === "paypal" ? <a href="https://www.paypal.com/myaccount/autopay/" target="_blank" rel="noreferrer">paypal ↗</a> : null}
                    </span>
                    <span className={`l-amt ${r.kind === "in" ? "up" : ""}`}>{r.kind === "in" ? "+" : "−"}{fmtEuro(r.amount, true)}</span>
                    <button className="x" onClick={() => stopSub(r.id)} aria-label={`arrêter ${r.label}`} title="arrêter (l'historique reste)">×</button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="empty">aucun fixe ce mois-ci.</p>
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
              <input className="sub-url" value={subUrl} onChange={(e) => setSubUrl(e.target.value)} placeholder="lien pour résilier (option)" onKeyDown={(e) => e.key === "Enter" && addSub()} />
              <span className="ev-actions">
                <button className="primary" onClick={addSub} disabled={!subValid}>ok</button>
                <button className="plus" onClick={() => setSubOpen(false)}>annuler</button>
              </span>
            </div>
          ) : (
            <button className="plus" onClick={() => setSubOpen(true)}>+ un fixe</button>
          )}
        </div>

        <div className="money-right">
          <div className="subs-head">
            <span className="money-k">mouvements</span>
            <b>{moves.length ? `${fmtEuro(sum(moves, "out"))} dépensés` : ""}</b>
          </div>
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
          {moves.length ? (
            <ul className="ledger">
              {moves.map((e) => (
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
            <p className="empty">rien de saisi pour {fmtMonth(month)}, à part les fixes.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
