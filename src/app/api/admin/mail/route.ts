import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";

// la boite gmail, lue en imap avec un mot de passe d'application : les
// non-lus de la boite de reception, et ceux que gmail marque "important".
// le resultat est garde trois minutes par instance pour ne pas ouvrir une
// connexion imap a chaque chargement.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 25;

export type MailItem = { id: number; from: string; address: string; subject: string; date: string | null; important: boolean };
export type MailSummary = {
  configured: boolean;
  unread: number;
  important: number;
  items: MailItem[];
  checkedAt: string;
  error?: string;
};

let cache: { at: number; data: MailSummary } | null = null;
const TTL = 3 * 60_000;

async function readInbox(user: string, pass: string): Promise<MailSummary> {
  const client = new ImapFlow({ host: "imap.gmail.com", port: 993, secure: true, auth: { user, pass }, logger: false });
  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const uids = ((await client.search({ seen: false }, { uid: true })) || []) as number[];
      const recent = uids.slice(-40);
      const items: MailItem[] = [];
      if (recent.length) {
        for await (const m of client.fetch(recent, { uid: true, envelope: true, labels: true }, { uid: true })) {
          const from = m.envelope?.from?.[0];
          items.push({
            id: m.uid,
            from: from?.name || from?.address || "?",
            address: from?.address || "",
            subject: m.envelope?.subject || "(sans objet)",
            date: m.envelope?.date ? new Date(m.envelope.date).toISOString() : null,
            important: Boolean(m.labels && (m.labels.has("\\Important") || m.labels.has("\\Starred"))),
          });
        }
      }
      items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      return {
        configured: true,
        unread: uids.length,
        important: items.filter((x) => x.important).length,
        items: items.slice(0, 12),
        checkedAt: new Date().toISOString(),
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function GET() {
  const user = process.env.ADMIN_GMAIL_USER;
  const pass = process.env.ADMIN_GMAIL_APP_PW;
  const headers = { "Cache-Control": "no-store" };
  if (!user || !pass) {
    return NextResponse.json({ configured: false, unread: 0, important: 0, items: [], checkedAt: new Date().toISOString() } satisfies MailSummary, { headers });
  }
  if (cache && Date.now() - cache.at < TTL) return NextResponse.json(cache.data, { headers });
  try {
    const data = await readInbox(user, pass);
    cache = { at: Date.now(), data };
    return NextResponse.json(data, { headers });
  } catch (e) {
    const msg = String((e as Error).message || e);
    return NextResponse.json(
      { configured: true, unread: 0, important: 0, items: [], checkedAt: new Date().toISOString(), error: msg } satisfies MailSummary,
      { status: 502, headers },
    );
  }
}
