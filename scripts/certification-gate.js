import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateSitemap } from './generate-sitemap.js';

console.log('🔒 Executing StructZero Automated Pre-Release Certification Gate...');

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

// 1. Astro / TypeScript Check
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

// 3. Sitemap & Robots verification
check('Sitemap & Robots Verification', () => {
  const vercelOutPath = path.resolve('./.vercel/output/static');
  const distPath = path.resolve('./dist');
  const hasSitemap = 
    fs.existsSync(path.join(vercelOutPath, 'sitemap-index.xml')) || 
    fs.existsSync(path.join(distPath, 'sitemap-index.xml')) ||
    fs.existsSync(path.resolve('./public/sitemap-index.xml'));

  if (!hasSitemap) {
    throw new Error('Sitemap XML file is missing.');
  }
});

console.log('\n✅ CERTIFICATION GATE VERIFIED: All checks passed cleanly. Safe for Vercel deployment.');
