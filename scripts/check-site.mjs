// Usage: node scripts/check-site.mjs  — checks internal links, asset paths and leftover placeholders.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let bad = 0, placeholder = 0;
for (const f of readdirSync(root).filter(f => f.endsWith('.html'))) {
  const s = readFileSync(join(root, f), 'utf8');
  if (s.includes('__SITE_URL__')) placeholder++;
  const ids = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const m of s.matchAll(/(?:href|src|srcset|data-full)="([^"]+)"/g)) {
    let u = m[1]; if (/^(https?:|mailto:|tel:|#$|data:)/.test(u) || u.includes('__SITE_URL__')) continue;
    const [path, hash] = u.split('#'); const file = path.split('?')[0].replace(/^\//, '');
    if (file && !existsSync(join(root, file))) { console.log(`MISSING in ${f}: ${u}`); bad++; }
    if (hash && (!file || file === f) && !ids.has(hash)) { console.log(`BAD ANCHOR in ${f}: #${hash}`); bad++; }
  }
}
console.log(bad ? `${bad} problem(s) found.` : 'All internal links and asset paths OK.');
if (placeholder) console.log(`NOTE: ${placeholder} HTML file(s) still contain __SITE_URL__ — run scripts/set-domain.mjs before launch.`);
process.exit(bad ? 1 : 0);
