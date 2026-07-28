import fs from 'fs';
import path from 'path';

function getHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getHtmlFiles(filePath, arrayOfFiles);
    } else if (file === 'index.html' || file.endsWith('.html')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

export function generateSitemap(outDir) {
  console.log('🗺️ Generating comprehensive XML sitemap for all pages...');
  const siteUrl = 'https://structzero.app';
  const htmlFiles = getHtmlFiles(outDir);

  const urls = htmlFiles.map((file) => {
    let relativePath = path.relative(outDir, file).replace(/\\/g, '/');
    if (relativePath === 'index.html') {
      relativePath = '';
    } else if (relativePath.endsWith('/index.html')) {
      relativePath = relativePath.replace('/index.html', '/');
    }

    const loc = `${siteUrl}/${relativePath}`;
    
    // Add video metadata to homepage
    if (relativePath === '') {
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <video:video>
      <video:thumbnail_loc>https://structzero.app/favicon.svg</video:thumbnail_loc>
      <video:title>StructZero — AI Software Engineering Platform Explainer</video:title>
      <video:description>Learn how StructZero runs a real multi-model architecture debate, certifies every file, and deploys real infrastructure.</video:description>
      <video:content_loc>https://structzero.app/Structzero_AI_software_engineering_platform.mp4</video:content_loc>
      <video:publication_date>2026-07-25T00:00:00+00:00</video:publication_date>
    </video:video>
  </url>`;
    }

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(outDir, 'sitemap-index.xml'), xmlContent);
  fs.writeFileSync(path.resolve('./public/sitemap-index.xml'), xmlContent);
  console.log(`  ✓ Sitemap generated with ${urls.length} total URLs.`);
}

if (process.argv[1] === import.meta.url || process.argv[1].endsWith('generate-sitemap.js')) {
  const targetDir = fs.existsSync('./.vercel/output/static') 
    ? './.vercel/output/static' 
    : './dist';
  if (fs.existsSync(targetDir)) {
    generateSitemap(path.resolve(targetDir));
  }
}
