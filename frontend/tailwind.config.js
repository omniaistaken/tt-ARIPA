/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // on active le dark mode par classe 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs pour le clair (tu peux ajouter si besoin)
        // Claires : on laisse les classes Tailwind par défaut

        // Couleurs personnalisées pour le mode sombre
        dark: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Tu peux aussi étendre les bleus standards si besoin :
        blue: {
          900: '#0c4a6e', // bleu très foncé, pour fond sombre
          800: '#075985',
          700: '#0369a1',
          600: '#0284c7',
          500: '#0ea5e9', // plus clair
        }
      }
    }
  },
  plugins: [],
}