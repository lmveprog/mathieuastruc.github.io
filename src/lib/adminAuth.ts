// session du /admin : un cookie signe (hmac) qui expire, pas de base de donnees.
// tourne aussi bien dans le middleware (edge) que dans les routes node,
// d'ou le web crypto plutot que le module crypto de node.

export const COOKIE = "ma_admin";
const enc = new TextEncoder();

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PW || "";
export const adminConfigured = () => Boolean(process.env.ADMIN_PW);

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return b64url(new Uint8Array(sig));
}

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function makeToken(days = 30) {
  const exp = Date.now() + days * 86_400_000;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyToken(token: string | undefined) {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return sameString(await hmac(exp), sig);
}

// on compare des empreintes, jamais les chaines brutes
export async function checkPassword(given: string) {
  const want = process.env.ADMIN_PW;
  if (!want) return false;
  return sameString(await hmac("pw:" + given), await hmac("pw:" + want));
}
