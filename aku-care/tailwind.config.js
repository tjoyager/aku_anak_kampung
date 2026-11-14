/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        blue: { DEFAULT: '#0066cc', dark: '#073b72' },
        navy: '#082d58',
        pale: '#eaf4ff',
        canvas: '#f5f8fc',
        text: '#18324c',
        danger: '#d93645'
      }
    },
  },
  plugins: [],
}