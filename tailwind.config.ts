import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#23262f',
        'light-black': '#3f3f46',
        'dark-gray': '#878787',
        gray: '#b4b4b4',
        'light-gray': '#e0e0e0',
        'white-gray': '#efefef',
        white: 'ffffff',

        'dark-green': '#27622',
        green: '#46923c',
        'light-green': '#5bb450',
        'white-green': 'cce7c9',
        'white-brown': '#fafafa',
        'light-brown': '#f7f3f0',
        brown: '#c3936d',
        bronze: '#cd7f32',
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
export default config;
