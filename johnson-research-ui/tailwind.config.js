/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Scholarly/archival palette
        parchment: '#f5f0e6',
        ink: '#2c2416',
        sepia: '#704214',
        'faded-ink': '#5c5346',
        'aged-paper': '#e8e0d0',
        'confidence-confirmed': '#166534',   // green-800
        'confidence-likely': '#854d0e',      // yellow-800
        'confidence-possible': '#6b7280',    // gray-500
      },
      fontFamily: {
        'display': ['Crimson Pro', 'Georgia', 'serif'],
        'body': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
