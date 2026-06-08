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
        navy: '#1E3054',
        gold: '#F5B60F',
        paper: '#FFFDF8',
        ink: '#1D2230',
        sand: '#F4EDE4',
        terracotta: '#C4694A',
        cream: '#FAF7F2'
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif']
      },
      boxShadow: {
        glow: '0 18px 60px -28px rgba(30, 48, 84, 0.35)',
        soft: '0 8px 30px -12px rgba(30, 48, 84, 0.12)',
        card: '0 4px 20px -6px rgba(30, 48, 84, 0.08)'
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(245, 182, 15, 0.1), transparent 40%), radial-gradient(circle at 80% 10%, rgba(196, 105, 74, 0.08), transparent 35%), linear-gradient(180deg, #FAF7F2 0%, #FFFDF8 100%)'
      }
    }
  },
  plugins: [forms, typography]
};

export default config;
