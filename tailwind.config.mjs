/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#235327',
          dark: '#173e23',
          hover: '#1b4520',
          soft: '#dce8df',
          deep: '#0D2D1C',
        },
        glaze: {
          amber: '#c28328',
          'amber-dark': '#a9701d',
          'amber-light': '#e09935',
          'amber-soft': '#fcf4ea',
        },
        cream: {
          bg: '#faf4ee',
          card: '#ffffff',
          ivory: '#FAF7F2',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
