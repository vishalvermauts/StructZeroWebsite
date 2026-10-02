import fs from 'fs';
import path from 'path';

// Approved 25 canonical destinations per Section 4 of 01_WEBSITE_REPOSITIONING_AND_CONTENT_PLAN.md
const CANONICAL_ROUTES = [
  '',
  'platform/',
  'modules/',
  'android/',
  'integrations/',
  'demo/',
  'security/',
  'roadmap/',
  'updates/',
  'about/',
  'contact/',
  'docs/',
  'docs/getting-started/',
  'docs/workflows/',
  'docs/integrations/',
  'docs/architecture/',
  'legal/privacy/',
  'legal/terms/',
  'legal/security-policy/',
  'legal/responsible-ai/',
  'legal/accessibility/',
  'legal/acceptable-use/',
  'legal/cookies/',
  'legal/data-processing/',
  'legal/licenses/',
];

export function generateSitemap(outDir) {
  console.log('🗺️ Generating canonical XML sitemap for the 25 approved destinations...');
  const siteUrl = 'https://www.structzero.app';
  const today = new Date().toISOString().split('T')[0];

  const urls = CANONICAL_ROUTES.map((route) => {
    const loc = `${siteUrl}/${route}`;
    const priority = route === '' ? '1.0' : route.startsWith('docs/') || route === 'platform/' ? '0.8' : '0.6';

    if (route === '') {
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <video:video>
      <video:thumbnail_loc>https://www.structzero.app/Multi-Agent_Engineering_Pipeline.png</video:thumbnail_loc>
      <video:title>StructZero — AI Software Engineering Platform Explainer</video:title>
      <video:description>Learn how StructZero coordinates research, multi-model debate, verification, and governed deployments.</video:description>
      <video:content_loc>https://www.structzero.app/Structzero_AI_software_engineering_platform.mp4</video:content_loc>
      <video:publication_date>2026-09-28T00:00:00+00:00</video:publication_date>
    </video:video>
  </url>`;
    }

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>`;

  if (outDir && fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xmlContent);
    fs.writeFileSync(path.join(outDir, 'sitemap-index.xml'), xmlContent);
  }
  fs.writeFileSync(path.resolve('./public/sitemap.xml'), xmlContent);
  fs.writeFileSync(path.resolve('./public/sitemap-index.xml'), xmlContent);
  console.log(`  ✓ Canonical sitemaps (sitemap.xml & sitemap-index.xml) generated with ${urls.length} verified routes.`);
}

if (process.argv[1] === import.meta.url || process.argv[1].endsWith('generate-sitemap.js')) {
  const targetDir = fs.existsSync('./.vercel/output/static')
    ? './.vercel/output/static'
    : './dist';
  generateSitemap(fs.existsSync(targetDir) ? path.resolve(targetDir) : null);
}
