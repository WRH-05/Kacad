import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import rtl from 'tailwindcss-rtl';

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
        ink: '#1D2230'
      },
      boxShadow: {
        glow: '0 18px 60px -28px rgba(30, 48, 84, 0.35)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(245, 182, 15, 0.16), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.98))'
      }
    }
  },
  plugins: [forms, typography, rtl]
};

export default config;