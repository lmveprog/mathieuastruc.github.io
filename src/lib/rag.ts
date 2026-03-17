import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

interface Chunk {
  title: string;
  content: string;
}

function loadChunks(): Chunk[] {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) return [];

  const files = readdirSync(dataDir).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const raw = readFileSync(join(dataDir, file), "utf-8");
    // Split on markdown headings (h1–h3)
    const sections = raw.split(/\n(?=#{1,3} )/);

    for (const section of sections) {
      const lines = section.trim().split("\n");
      const title = lines[0].replace(/^#+\s+/, "").trim();
      const body = lines.slice(1).join("\n").trim();
      if (body.length > 15) {
        chunks.push({ title, content: section.trim() });
      }
    }
  }

  return chunks;
}

// Simple TF-IDF-like scoring
function score(chunk: Chunk, query: string): number {
  const words = query
    .toLowerCase()
    .split(/[\s,?!.]+/)
    .filter((w) => w.length > 2);

  const text = `${chunk.title} ${chunk.content}`.toLowerCase();
  let s = 0;

  for (const word of words) {
    const re = new RegExp(word, "g");
    const matches = (text.match(re) ?? []).length;
    s += matches;
    if (chunk.title.toLowerCase().includes(word)) s += 4; // title bonus
  }

  return s;
}

export function getRelevantContext(query: string, topK = 4): string {
  const chunks = loadChunks();
  if (chunks.length === 0) return "(Aucune donnée disponible)";

  const ranked = chunks
    .map((chunk) => ({ chunk, s: score(chunk, query) }))
    .sort((a, b) => b.s - a.s);

  // If nothing scores, return everything (short portfolio = small context)
  const selected =
    ranked[0].s > 0
      ? ranked.slice(0, topK).map((r) => r.chunk.content)
      : chunks.map((c) => c.content);

  return selected.join("\n\n---\n\n");
}
