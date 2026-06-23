/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ee',
          100: '#fdf0d0',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        brand: {
          ac: '#3b82f6',
          nonac: '#10b981',
          booked: '#ef4444',
          selected: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
