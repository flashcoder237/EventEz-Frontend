/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#6d28d9', // violet principal
            light: '#8b5cf6',
            dark: '#5b21b6',
          },
          secondary: {
            DEFAULT: '#ec4899', // rose principal
            light: '#f472b6',
            dark: '#db2777',
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }