/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app/tailwindcss/templates/*.{html,js}", "./src/trmrk-solidjs/tailwindcss/templates/*.{html,js}"],
  theme: {
    extend: {
      /* gridColumn: {
        1: "grid-1",
        2: "grid-2",
        3: "grid-3",
        4: "grid-4",
      } */
    },
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
  plugins: [
    function({ addUtilities }) {
      const newGridColumnUtilities = {
        '.col-grid-1': {
          'grid-column': '1',
        },
        '.col-grid-2': {
          'grid-column': '2',
        },
        '.col-grid-3': {
          'grid-column': '3',
        },
        '.col-grid-4': {
          'grid-column': '4',
        },
      };

      addUtilities(newGridColumnUtilities);
    },
  ],
}

