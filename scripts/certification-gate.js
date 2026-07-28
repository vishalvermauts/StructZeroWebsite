import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateSitemap } from './generate-sitemap.js';

console.log('🔒 Executing StructZero Automated Pre-Release Certification & Quality Gate...');

function check(label, fn) {
  try {
    fn();
    console.log(`  ✓ PASSED: ${label}`);
  } catch (err) {
    console.error(`  ❌ FAILED: ${label}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. Astro Component & TypeScript Check
check('Astro Component & Type Check', () => {
  execSync('npx astro check', { stdio: 'pipe' });
});

// 2. Production Static Build & Dynamic Multi-Page Sitemap Generation
check('Production Build & Dynamic Multi-Page Sitemap Generation', () => {
  execSync('npx astro build', { stdio: 'pipe' });
  const outDir = fs.existsSync('./.vercel/output/static')
    ? path.resolve('./.vercel/output/static')
    : path.resolve('./dist');
  generateSitemap(outDir);
});

// 3. Automated Dead Link Crawler Gate
check('Automated Link Crawler & Route Verification', () => {
  const outDir = fs.existsSync('./.vercel/output/static')
    ? path.resolve('./.vercel/output/static')
    : path.resolve('./dist');

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

  const hrefRegex = /href=["'](\/[^"']*)["']/g;
  const brokenLinks = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const targetPath = match[1].split('#')[0].split('?')[0];
      if (targetPath === '' || targetPath === '/' || targetPath.startsWith('//')) continue;
      if (targetPath.endsWith('.svg') || targetPath.endsWith('.png') || targetPath.endsWith('.jpg') || targetPath.endsWith('.mp4') || targetPath.endsWith('.xml') || targetPath.endsWith('.css') || targetPath.endsWith('.js')) continue;

      const cleanPath = targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath;
      const expectedHtmlFile = path.join(outDir, `${cleanPath}.html`);
      const expectedIndexFile = path.join(outDir, cleanPath, 'index.html');

      if (!fs.existsSync(expectedHtmlFile) && !fs.existsSync(expectedIndexFile)) {
        brokenLinks.push({ source: path.relative(outDir, file), target: targetPath });
      }
    }
  }

  if (brokenLinks.length > 0) {
    console.error('Found Broken Links:', brokenLinks.slice(0, 10));
    throw new Error(`Link Crawler Failure: Found ${brokenLinks.length} dead internal links.`);
  }
});

// 4. Content Depth & SEO Quality Check
check('Content Depth & SEO Quality Check', () => {
  const outDir = fs.existsSync('./.vercel/output/static')
    ? path.resolve('./.vercel/output/static')
    : path.resolve('./dist');

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

  const thinPages = [];
  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, 'utf-8').replace(/<[^>]*>/g, ' ');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 120) {
      thinPages.push({ file: path.relative(outDir, file), wordCount });
    }
  }

  if (thinPages.length > 0) {
    console.error('Thin Pages Detected:', thinPages);
    throw new Error(`Content Depth Failure: ${thinPages.length} pages have under 120 words.`);
  }
});

console.log('\n✅ CERTIFICATION GATE VERIFIED: All checks (Types, Build, Sitemap, Link Crawler, Content Depth) passed cleanly.');
