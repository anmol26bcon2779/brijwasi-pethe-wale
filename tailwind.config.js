/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          magenta: '#C21870',
          'magenta-dark': '#9c1056',
          'magenta-light': '#db368b',
          gold: '#D6A64A',
          'gold-light': '#e5be6b',
          'gold-dark': '#b5842c',
          brown: '#321A16',
          'brown-light': '#4c2923',
          navy: '#071B32',
          'navy-light': '#0e2b4d',
          cream: '#FFF5E6',
          ivory: '#FFFDF7',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Lato', 'system-ui', 'sans-serif'],
        heritage: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'royal': '0 10px 30px -10px rgba(194, 24, 112, 0.25)',
        'gold-glow': '0 0 25px rgba(214, 166, 74, 0.35)',
        'card': '0 4px 20px -2px rgba(50, 26, 22, 0.08)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3D081 0%, #D6A64A 50%, #B37D22 100%)',
        'royal-gradient': 'linear-gradient(135deg, #C21870 0%, #8E0E50 100%)',
        'navy-gradient': 'linear-gradient(135deg, #071B32 0%, #153860 100%)',
        'subtle-pattern': "radial-gradient(#D6A64A 0.75px, transparent 0.75px)",
      }
    },
  },
  plugins: [],
}
