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

        // To edit these color pallets, visit:
        // https://uicolors.app
        black: {
          '50': '#e6e6e6',
          '100': '#cccccc',
          '200': '#b3b3b3',
          '300': '#999999',
          '400': '#808080',
          '500': '#666666',
          '600': '#4d4d4d',
          '700': '#333333',
          '800': '#1a1a1a',
          '900': '#000000',
        },

        white: {
          '50': '#ffffff',
          '100': '#efefef',
          '200': '#dcdcdc',
          '300': '#bdbdbd',
          '400': '#989898',
          '500': '#7c7c7c',
          '600': '#656565',
          '700': '#525252',
          '800': '#464646',
          '900': '#3d3d3d',
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
