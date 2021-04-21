const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: ['components/**/*.tsx', 'pages/**/*.tsx', 'styles/**/*.css'],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      typography: theme => ({
        dark: {
          css: [
            {
              color: theme('colors.gray.200'),
              a: {
                color: theme('colors.gray.300')
              },
              em: {
                color: theme('colors.gray.300')
              },
              strong: {
                color: theme('colors.gray.300')
              },
              code: {
                color: theme('colors.gray.300')
              },
              dt: {
                color: theme('colors.gray.300')
              },
              dd: {
                color: theme('colors.gray.300')
              },
              h1: {
                color: theme('colors.gray.300')
              },
              h2: {
                color: theme('colors.gray.300')
              },
              h3: {
                color: theme('colors.gray.300')
              },
              h4: {
                color: theme('colors.gray.300')
              },
              h5: {
                color: theme('colors.gray.300')
              },
              h6: {
                color: theme('colors.gray.300')
              },
              hr: {
                borderColor: theme('colors.gray.600')
              }
            }
          ]
        }
      })
    }
  },
  variants: {
    extend: {
      typography: ['dark']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
