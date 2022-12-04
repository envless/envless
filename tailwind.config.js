/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },

      colors: {
        dark: "#1a1a1a",
        darker: "#121212",
        darkest: "#111111",

        light: "#a1a1a1",
        lighter: "#e4e4e4",
        lightest: "#fafafa",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
