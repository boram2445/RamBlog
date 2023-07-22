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
        black: '#23262f',
        'white-brown': '#fafafa',
        'light-brown': '#f7f3f0',
        brown: '#c3936d',
        bronze: '#cd7f32',
        'white-gray': '#efefef',
        'light-gray': '#e0e0e0',
        gray: '#b4b4b4',
        'dark-gray': '#878787',
        'black-gray': '#3f3f46',
      },
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
