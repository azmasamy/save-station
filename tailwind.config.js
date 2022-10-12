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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          50: '#fbf8eb',
          100: '#f6edcb',
          200: '#eeda9a',
          300: '#e5bf5f',
          400: '#dba634',
          500: '#cc8f26',
          600: '#b87520',
          700: '#8c511c',
          800: '#75421e',
          900: '#64381f',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
