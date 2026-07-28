import fs from 'fs';
import path from 'path';

const outDir = fs.existsSync('./.vercel/output/static') ? './.vercel/output/static' : './dist';
const htmlFiles = [];
function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) scan(full);
    else if (e.name.endsWith('.html')) htmlFiles.push(full);
  }
}
scan(outDir);

console.log('Total HTML pages built:', htmlFiles.length);

const seoReport = [];
const allHrefs = new Set();
const internalHrefs = new Set();
const externalHrefs = new Set();

for (const file of htmlFiles) {
  const relPath = path.relative(outDir, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf-8');
  
  // Title check
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;

  // Meta description check
  let desc = null;
  const metaTags = html.match(/<meta[^>]*>/gi) || [];
  for (const tag of metaTags) {
    if (tag.includes('name="description"') || tag.includes("name='description'")) {
      const m = tag.match(/content=["']([^"']*)["']/i);
      if (m) { desc = m[1]; break; }
    }
  }

  // Canonical URL check
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : null;

  // OpenGraph checks
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);

  // Heading H1 count check
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];

  // Image alt check
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const missingAltImgs = imgMatches.filter(img => !img.includes('alt='));

  // Href extraction
  const hrefMatches = html.match(/href=["']([^"']*)["']/gi) || [];
  hrefMatches.forEach(h => {
    const val = h.replace(/^href=["']/, '').replace(/["']$/, '');
    allHrefs.add(val);
    if (val.startsWith('/')) internalHrefs.add(val);
    else if (val.startsWith('http')) externalHrefs.add(val);
  });

  const issues = [];
  if (!title) issues.push('Missing <title>');
  else if (title.length < 10) issues.push(`Title too short (${title.length} chars)`);
  else if (title.length > 70) issues.push(`Title too long (${title.length} chars)`);

  if (!desc) issues.push('Missing meta description');
  else if (desc.length < 50) issues.push(`Description too short (${desc.length} chars)`);
  else if (desc.length > 160) issues.push(`Description too long (${desc.length} chars)`);

  if (!canonical) issues.push('Missing canonical link');

  if (h1Matches.length === 0) issues.push('Missing H1 heading');
  if (h1Matches.length > 1) issues.push(`Multiple H1 headings (${h1Matches.length})`);
  if (missingAltImgs.length > 0) issues.push(`${missingAltImgs.length} image(s) missing alt attribute`);
  if (!ogTitle || !ogDesc || !ogUrl) issues.push('Incomplete OpenGraph tags');

  seoReport.push({ page: relPath, title, descLength: desc ? desc.length : 0, issues });
}

fs.writeFileSync('scripts/seo-audit-results.json', JSON.stringify({
  totalHtmlPages: htmlFiles.length,
  totalUniqueHrefs: allHrefs.size,
  internalHrefsCount: internalHrefs.size,
  externalHrefsCount: externalHrefs.size,
  internalHrefsList: Array.from(internalHrefs),
  externalHrefsList: Array.from(externalHrefs),
  pagesReport: seoReport
}, null, 2));

console.log('✅ Audit saved to scripts/seo-audit-results.json');
