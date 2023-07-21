/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#2c2c2c',
        'white-brown': '#fafafa',
        'light-brown': '#f8f4f2',
        brown: '#be9473',
        'light-gray': '#cccccc',
        bronze: '#cd7f32',
        gray: '#b4b4b4',
        'dark-gray': '#878787',
      },
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
