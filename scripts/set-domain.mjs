// Usage: node scripts/set-domain.mjs https://www.your-domain.com
// Replaces the __SITE_URL__ placeholder in canonical/OG tags, JSON-LD, sitemap.xml and robots.txt.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const arg = process.argv[2];
if (!arg || !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(arg)) {
  console.error('Give the full https origin, no trailing slash. Example: node scripts/set-domain.mjs https://www.example.com'); process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let n = 0;
for (const f of readdirSync(root).filter(f => /\.(html|xml|txt)$/.test(f))) {
  const p = join(root, f), s = readFileSync(p, 'utf8');
  if (s.includes('__SITE_URL__')) { writeFileSync(p, s.replaceAll('__SITE_URL__', arg)); n++; console.log('updated', f); }
}
console.log(n ? `Done. Remember to set productionDomain in assets/config/site-config.js.` : 'No placeholders found (already set?).');
