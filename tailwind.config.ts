import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)'
        },
        highlight: {
          DEFAULT: 'rgb(var(--highlight) / <alpha-value>)',
          ink: 'rgb(var(--highlight-ink) / <alpha-value>)',
          strong: 'rgb(var(--highlight-strong) / <alpha-value>)'
        },
        sand: 'rgb(var(--sand) / <alpha-value>)',
        rubric: 'rgb(var(--rubric) / <alpha-value>)',

        /* Legacy aliases — remove after old components are deleted */
        navy: 'rgb(var(--accent) / <alpha-value>)',
        gold: 'rgb(var(--highlight) / <alpha-value>)',
        paper: 'rgb(var(--surface) / <alpha-value>)',
        cream: 'rgb(var(--surface) / <alpha-value>)',
        terracotta: 'rgb(var(--accent) / <alpha-value>)'
      },
      borderColor: {
        DEFAULT: 'rgb(var(--line) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        glow: '0 18px 60px -28px rgb(var(--accent) / 0.35)',
        soft: '0 8px 30px -12px rgb(var(--ink) / 0.12)',
        card: '0 4px 20px -6px rgb(var(--ink) / 0.08)',
        drawer: '-24px 0 80px -40px rgb(var(--ink) / 0.35)'
      },
      dropShadow: {
        logo: '0 30px 60px rgb(var(--accent) / 0.18)'
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(circle at 18% 12%, rgb(var(--highlight) / 0.18), transparent 42%), radial-gradient(circle at 86% 8%, rgb(var(--accent) / 0.1), transparent 38%)',
        'hero-gradient':
          'radial-gradient(circle at 18% 12%, rgb(var(--highlight) / 0.18), transparent 42%), radial-gradient(circle at 86% 8%, rgb(var(--accent) / 0.1), transparent 38%)'
      }
    }
  },
  plugins: [forms, typography]
};

export default config;
