/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app/tailwindcss/templates/*.{html,js}", "./src/trmrk-solidjs/tailwindcss/templates/*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      "folder": "#FD0",
      "note-item": "#FA0",
      "note-section": "#A60"
    },
  },
  plugins: [],
}
