import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// Static-first: sub-100ms FCP target per the real StructZero architecture
// debate (council/architecture tier, proj-0f8f2a45-7d81-4eea-aca2-0902aafa7219).
// No server runtime needed for a marketing page -- @astrojs/vercel/static
// deploys as a pure static build to Vercel's edge CDN.
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  site: 'https://www.structzero.app',
});