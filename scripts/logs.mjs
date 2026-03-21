import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, '../.env.local'), 'utf-8');
const token = env.match(/GITHUB_TOKEN=(.+)/)?.[1]?.trim();
const repo = env.match(/GITHUB_LOG_REPO=(.+)/)?.[1]?.trim();
const file = env.match(/GITHUB_LOG_FILE=(.+)/)?.[1]?.trim() ?? 'questions.md';

const res = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
});

if (!res.ok) { console.log('Aucune question pour le moment.'); process.exit(0); }

const data = await res.json();
const content = Buffer.from(data.content, 'base64').toString('utf-8');

writeFileSync(join(__dirname, '../questions.md'), content);
console.log('questions.md mis a jour dans le projet\n');
console.log(content);
