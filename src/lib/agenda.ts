// l'agenda du /admin : google (apps script) en priorite, frais et
// modifiable ; sinon l'adresse ics, en lecture seule.
import { fetchAgenda, type CalEvent } from "./ics";
import { gasAgenda, gasConfigured } from "./gcal";

export type AgendaPayload = {
  configured: boolean;
  source: "google" | "ics" | "none";
  writable: boolean;
  defaultCalendar?: string;
  events: CalEvent[];
  errors: string[];
};

export async function loadAgenda(): Promise<AgendaPayload> {
  if (gasConfigured()) {
    try {
      const { events, defaultCalendar } = await gasAgenda();
      return { configured: true, source: "google", writable: true, defaultCalendar, events, errors: [] };
    } catch (e) {
      return { configured: true, source: "google", writable: true, events: [], errors: [String((e as Error).message || e)] };
    }
  }
  const icsUrls = (process.env.ADMIN_ICS_URL || "").split(/[\s,]+/).filter((u) => /^https?:\/\//.test(u));
  if (!icsUrls.length) return { configured: false, source: "none", writable: false, events: [], errors: [] };
  const a = await fetchAgenda(icsUrls);
  return { configured: true, source: "ics", writable: false, events: a.events, errors: a.errors };
}
