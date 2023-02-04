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
        ddd1: "#222222", // dark
        ddd2: "#121212", // darker
        ddd3: "#000000", // darkest

        // To edit these color pallets, visit:
        // https://uicolors.app
        dark: {
          '50':  '#808080',
          '100': '#737373',
          '200': '#666666',
          '300': '#595959',
          '400': '#4d4d4d',
          '500': '#404040',
          '600': '#333333',
          '700': '#262626',
          '800': '#1a1a1a',
          '900': '#000000',
        },

        light: {
          '50':  '#c7c7c7',
          '100': '#cccccc',
          '200': '#d1d1d1',
          '300': '#d6d6d6',
          '400': '#e0e0e0',
          '500': '#e6e6e6',
          '600': '#ebebeb',
          '700': '#f0f0f0',
          '800': '#fafafa',
          '900': '#ffffff',
        },

        accent: {
          '50': '#f0fdfc',
          '100': '#ccfbf8',
          '200': '#99f6f0',
          '300': '#5eeae1',
          '400': '#2dd4c9',
          '500': '#14b8ad',
          '600': '#0d948b',
          '700': '#0f766f',
          '800': '#115e59',
          '900': '#134e4a',
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
