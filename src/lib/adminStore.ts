// le /admin garde ses donnees sur mon vps (service "adminstore") : le site
// sur vercel n'a pas de disque, et je ne veux pas de base a payer pour
// quatre fichiers json. seul le serveur next connait le jeton.

const BASE = process.env.ADMIN_STORE_URL || "https://lavalley.xyz/api/admin-store";
const TOKEN = process.env.ADMIN_STORE_TOKEN || "";

export const DOC_KEYS = ["todos", "habits", "notes", "config", "content"] as const;
export type DocKey = (typeof DOC_KEYS)[number];
export const isDocKey = (k: string): k is DocKey => (DOC_KEYS as readonly string[]).includes(k);

async function call<T>(path: string, init?: RequestInit, attempt = 0): Promise<T> {
  if (!TOKEN) throw new Error("ADMIN_STORE_TOKEN manquant");
  try {
    const r = await fetch(`${BASE}/${path}`, {
      ...init,
      headers: { ...(init?.headers || {}), Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`store ${path} → ${r.status}`);
    return (await r.json()) as T;
  } catch (e) {
    // le vps repond en general en 100 ms ; un rate de tls ou de dns arrive
    // de temps en temps, un second essai suffit
    if (attempt < 1) return call<T>(path, init, attempt + 1);
    throw e;
  }
}

export const getDocs = (keys: readonly string[]) =>
  call<Record<string, unknown>>(`docs?keys=${keys.join(",")}`);

export const putDoc = (key: DocKey, data: unknown) =>
  call<{ ok: boolean }>(`doc/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export type LabPoint = { ts: number; abonnes: number | null; posts: number | null; extra?: Record<string, unknown> };
export type LabContent = {
  id: string;
  plateforme: string;
  handle: string;
  url: string;
  type: string;
  titre: string | null;
  texte?: string | null;
  publie_le: number | null;
  vues: number | null;
  likes: number | null;
  commentaires: number | null;
  mesure_ts: number;
  vitesse: number | null;
};
export type Lab = {
  genere_le: number;
  fenetre_veille_h?: number;
  abonnes: Record<string, LabPoint[]>;
  mes_contenus: LabContent[];
  veille?: LabContent[];
  base: Record<string, number>;
};

export const getLab = () => call<Lab>("lab");
export const getGuests = () => call<{ visitors: number; today: number }>("guests");
