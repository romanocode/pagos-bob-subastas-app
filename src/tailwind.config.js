/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bob: {
          primary: '#309191',
          'primary-dark': '#1E3A8A',
          secondary: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}