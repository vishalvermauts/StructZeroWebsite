import rss from '@astrojs/rss';

export async function GET(context: any) {
  const updates = [
    {
      title: 'V11.4 Technical Preview — Command Center Architecture',
      pubDate: new Date('2026-10-01T00:00:00Z'),
      description: 'Consolidated engineering pipeline across research, debate, and verification. Dual-control remote specifications.',
      link: '/updates/',
    },
    {
      title: 'V11.2 Core Integration — Multi-Model Adversarial Debate',
      pubDate: new Date('2026-09-20T00:00:00Z'),
      description: 'Independent role assignments for Claude 3.5, Gemini 3.6, and DeepSeek R1 models to eliminate hallucinations before code write.',
      link: '/updates/',
    },
    {
      title: 'Website Refresh & 25-Route Information Architecture',
      pubDate: new Date('2026-09-28T00:00:00Z'),
      description: 'Refreshed public documentation and architecture specs reflecting the AI Software Command Center positioning.',
      link: '/updates/',
    },
  ];

  return rss({
    title: 'StructZero Platform Updates',
    description: 'Release notes, architectural milestones, and platform updates for StructZero.',
    site: context.site || 'https://www.structzero.app',
    items: updates.map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      description: item.description,
      link: item.link,
    })),
  });
}
