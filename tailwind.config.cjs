/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,ts}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        panel: 'var(--panel)',
        border: 'var(--border)',
        ink: 'var(--text)',
        'ink-muted': 'var(--text-muted)',
        'ink-faint': 'var(--text-faint)',
        accent: 'var(--accent)',
        ok: 'var(--ok)',
      },
      fontFamily: {
        mono: ['var(--font-mono)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};
