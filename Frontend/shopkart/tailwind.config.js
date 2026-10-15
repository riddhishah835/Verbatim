/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academia: {
          espresso: '#1A1816',
          panel: '#24211E',
          parchment: '#EAE6DF',
          muted: '#AAA094',
          brass: '#D4AF67',
          terracotta: '#C86D51',
          'terracotta-hover': '#B05C42',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'library-card': 'inset 0 1px 0 rgba(255, 248, 239, 0.025), 0 5px 16px rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [],
}