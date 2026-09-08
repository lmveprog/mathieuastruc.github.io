"use client";

import { useEffect, useState } from "react";
import Card from "../Card";
import type { MailSummary } from "@/app/api/admin/mail/route";
import { fmtRelative } from "../helpers";

// les mails non lus, avec ceux que gmail juge importants en tete

type Props = { now: Date; i: number; span?: number };

export default function Mail({ now, i, span = 5 }: Props) {
  const [mail, setMail] = useState<MailSummary | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/admin/mail", { cache: "no-store" })
        .then(async (r) => {
          const d = (await r.json()) as MailSummary;
          if (cancelled) return;
          setMail(d);
          setFailed(d.error || null);
        })
        .catch((e) => !cancelled && setFailed(String(e.message || e)));
    load();
    const t = setInterval(load, 3 * 60_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const items = mail?.items ? [...mail.items].sort((a, b) => Number(b.important) - Number(a.important)) : [];

  return (
    <Card
      title="mails"
      aside={
        <a href="https://mail.google.com" target="_blank" rel="noreferrer">
          {mail?.configured && !failed ? `${mail.unread} non lu${mail.unread > 1 ? "s" : ""} · ` : ""}ouvrir gmail ↗
        </a>
      }
      span={span}
      i={i}
    >
      {!mail ? (
        <p className="loading">…</p>
      ) : !mail.configured ? (
        <p className="hint">
          boîte pas branchée. crée un <b>mot de passe d&apos;application</b> google (compte → sécurité → validation en deux étapes → mots de
          passe des applications), puis pose <code>ADMIN_GMAIL_USER</code> et <code>ADMIN_GMAIL_APP_PW</code> sur vercel.
        </p>
      ) : failed ? (
        <p className="hint down">gmail ne répond pas : {failed}</p>
      ) : !items.length ? (
        <p className="empty">rien de nouveau, boîte à jour.</p>
      ) : (
        <>
          <p className={`mail-flag ${mail.important ? "is-hot" : ""}`}>
            {mail.important
              ? `${mail.important} important${mail.important > 1 ? "s" : ""} à regarder`
              : "rien d'important, que du courant"}
          </p>
          <ul className="mails">
            {items.map((m) => (
              <li key={m.id} className={`mail ${m.important ? "is-important" : ""}`}>
                <span className="mail-from" title={m.address}>{m.from}</span>
                <span className="mail-subject" title={m.subject}>{m.subject}</span>
                <span className="mail-when">{m.date ? fmtRelative(m.date, now) : ""}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
