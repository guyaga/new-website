/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#E8E4DD',
        'signal-red': '#E63B2E',
        'off-white': '#F5F3EE',
        black: '#111111',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Rubik"', 'sans-serif'],
        serif: ['"DM Serif Display"', '"Frank Ruhl Libre"', 'serif'],
        mono: ['"Space Mono"', '"Rubik"', 'monospace'],
      },
      borderRadius: {
        '2rem': '2rem',
        '3rem': '3rem',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
