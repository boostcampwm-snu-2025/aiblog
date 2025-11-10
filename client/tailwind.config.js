/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GitHub color palette
        'gh-canvas-default': '#0d1117',
        'gh-canvas-subtle': '#161b22',
        'gh-border-default': '#30363d',
        'gh-border-muted': '#21262d',
        'gh-fg-default': '#c9d1d9',
        'gh-fg-muted': '#8b949e',
        'gh-fg-subtle': '#6e7681',
        'gh-accent-fg': '#58a6ff',
        'gh-accent-emphasis': '#1f6feb',
        'gh-success-fg': '#3fb950',
        'gh-danger-fg': '#f85149',
        'gh-btn-bg': '#21262d',
        'gh-btn-hover-bg': '#30363d',
        'gh-btn-active-bg': '#292e33',
      }
    },
  },
  plugins: [],
}
