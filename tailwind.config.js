/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E1B2C',
          soft: '#16273E',
        },
        route: {
          50: '#EFF6FF',
          100: '#DCE9FF',
          400: '#5FB6FF',
          500: '#2E6FF2',
          600: '#1E52C9',
          700: '#173F9C',
        },
        canvas: '#EEF2F7',
        signal: '#F5A524',
        good: '#16A34A',
        bad: '#DC4C4C',
        ash: {
          400: '#8593A6',
          500: '#64748B',
          600: '#475569',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(14,27,44,0.06), 0 8px 24px rgba(14,27,44,0.06)',
      },
      backgroundImage: {
        'route-gradient': 'linear-gradient(135deg, #173F9C 0%, #2E6FF2 55%, #5FB6FF 100%)',
      },
    },
  },
  plugins: [],
}
