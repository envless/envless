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
        dark: "#222222",
        darker: "#121212",
        darkest: "#000000",

        light: "#a1a1a1",
        lighter: "#e4e4e4",
        lightest: "#fafafa",
      },
    },
  },
  plugins: [
      require("@tailwindcss/forms"),
      require("@tailwindcss/typography"),
  ],
};
