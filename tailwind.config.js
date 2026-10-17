/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#F8FBFF',
          surface: '#FFFFFF',
          'surface-subtle': '#EAF6FF',
          'surface-card': '#FFFFFF',
          primary: '#3898EC',
          'primary-hover': '#2483d6',
          'primary-light': '#EBF5FF',
          accent: '#60B5FF',
          text: '#172B4D',
          'text-muted': '#5B6B82',
          'text-subtle': '#7A889B',
          border: '#DCEAF7',
          'border-hover': '#BFDDF7',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(23, 43, 77, 0.05), 0 8px 24px -4px rgba(56, 152, 236, 0.08)',
        'card-hover': '0 4px 16px -2px rgba(23, 43, 77, 0.08), 0 12px 32px -4px rgba(56, 152, 236, 0.16)',
        subtle: '0 1px 3px rgba(23, 43, 77, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
