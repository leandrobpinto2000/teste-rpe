import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF1F7',
          100: '#D2DAE7',
          200: '#A6B5CF',
          300: '#7990B7',
          400: '#4D6C9F',
          500: '#1B3B6F',
          600: '#142C56',
          700: '#0E1F3D',
          800: '#0A1730',
          900: '#060E1F',
        },
        brand: {
          50: '#FFF3EB',
          100: '#FFE0CC',
          200: '#FFC299',
          300: '#FFA366',
          400: '#FF8347',
          500: '#F26522',
          600: '#D9521A',
          700: '#B33E10',
          800: '#8C2D08',
          900: '#5C1C03',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(10, 23, 48, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
