/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#367FFF',
          50: '#EEF4FF',
          100: '#D9E7FF',
          200: '#B0CDFF',
          300: '#88B3FF',
          400: '#5F99FF',
          500: '#367FFF',
          600: '#005CFD',
          700: '#0047C5',
          800: '#00338D',
          900: '#001F55',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
