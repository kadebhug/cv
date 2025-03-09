/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary-blue': '#2563eb',
        'secondary-blue': '#93c5fd',
        'primary-green': '#059669',
        'secondary-green': '#a7f3d0',
        'primary-purple': '#7c3aed',
        'secondary-purple': '#c4b5fd',
        'primary-red': '#dc2626',
        'secondary-red': '#fca5a5',
        'primary-amber': '#d97706',
        'secondary-amber': '#fcd34d',
        'primary-gray': '#4b5563',
        'secondary-gray': '#d1d5db',
        
        // New colors
        'primary-teal': '#0d9488',
        'secondary-teal': '#99f6e4',
        'primary-indigo': '#4338ca',
        'secondary-indigo': '#a5b4fc',
        'primary-rose': '#e11d48',
        'secondary-rose': '#fda4af',
        'primary-cyan': '#0891b2',
        'secondary-cyan': '#a5f3fc',
        'primary-emerald': '#059669',
        'secondary-emerald': '#6ee7b7',
        'primary-slate': '#334155',
        'secondary-slate': '#cbd5e1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} 