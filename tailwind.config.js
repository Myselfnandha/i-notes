/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FBFBFA',
        recessed: '#F4F3EF',
        card: '#FFFFFF',
        hairline: '#EBE8E1',
        'surface-dim': '#ddd9d7',
        'surface-bright': '#fdf8f6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f7f3f0',
        'surface-container': '#f2edeb',
        'surface-container-high': '#ece7e5',
        'surface-container-highest': '#e6e2df',
        'ink-primary': '#1C1B1A',
        'ink-secondary': '#57534E',
        'ink-tertiary': '#A8A29E',
        'ink-variant': '#554336',
        primary: {
          DEFAULT: '#8d4b00',
          container: '#b15f00',
          fixed: '#ffdcc3',
          'fixed-dim': '#ffb77d',
        },
        ochre: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
          dark: '#B45309',
        },
        chamois: {
          DEFAULT: '#E0A96D',
          wash: '#FAF3EB',
        },
        sage: {
          DEFAULT: '#8A9A86',
          wash: '#F2F5F1',
        },
        peach: {
          DEFAULT: '#F4B8A5',
          wash: '#FDF4F1',
        },
        lavender: {
          DEFAULT: '#B8B4D4',
          wash: '#F4F3F9',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'resting': '0px 2px 6px -1px rgba(28, 27, 26, 0.04), 0px 1px 3px 0px rgba(217, 119, 6, 0.03)',
        'lifted': '0px 8px 24px -4px rgba(28, 27, 26, 0.08), 0px 2px 6px -1px rgba(28, 27, 26, 0.04)',
        'dock': '0px 12px 32px -4px rgba(28, 27, 26, 0.12), 0px 2px 8px -1px rgba(217, 119, 6, 0.06)',
        'sheet': '0px 20px 32px -8px rgba(28, 27, 26, 0.12)',
      },
      borderRadius: {
        'card': '18px',
        'pill': '9999px',
        'sheet': '24px',
      }
    },
  },
  plugins: [],
}
