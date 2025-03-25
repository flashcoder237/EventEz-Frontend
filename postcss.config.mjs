const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6d28d9', 
          dark: '#5b21b6',
          light: '#8b5cf6',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          DEFAULT: '#ec4899', // Rose - Couleur secondaire
          dark: '#db2777',
          light: '#f472b6',
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Couleur d'accent pour les éléments qui nécessitent une couleur tertiaire
          dark: '#7c3aed',
          light: '#a78bfa',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'primary-start': '#6d28d9',
        'primary-end': '#ec4899',
      }),
      boxShadow: {
        'primary-sm': '0 2px 4px 0 rgba(109, 40, 217, 0.1)',
        'primary-md': '0 4px 6px -1px rgba(109, 40, 217, 0.1), 0 2px 4px -1px rgba(109, 40, 217, 0.06)',
        'primary-lg': '0 10px 15px -3px rgba(109, 40, 217, 0.1), 0 4px 6px -2px rgba(109, 40, 217, 0.05)',
      }
    },
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
