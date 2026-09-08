"use client";

import { useState, type FormEvent } from "react";
import Backdrop from "../components/Backdrop";
import LiquidText from "../../components/LiquidText";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        window.location.href = "/admin";
        return;
      }
      const d = await r.json().catch(() => ({}));
      setErr(d.error || `erreur ${r.status}`);
    } catch {
      setErr("pas de réseau ?");
    }
    setBusy(false);
  }

  return (
    <div className="login">
      <Backdrop />
      <form onSubmit={submit} className="card">
        <h1>
          <LiquidText text="admin" />
          <span aria-hidden="true">.</span>
        </h1>
        <p>coin privé, mot de passe demandé.</p>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="mot de passe"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="primary" type="submit" disabled={busy || !pw}>
          {busy ? "…" : "entrer"}
        </button>
        {err ? <p className="err">{err}</p> : null}
      </form>
    </div>
  );
}
