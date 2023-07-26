/* eslint-env node */
const tailwindTheme = require('tailwindcss-nimiq-theme').theme

export const DESKTOP_LAYOUT = 'md'

/** @type {import('tailwindcss').Config} */
module.exports = {
  preflight: false,
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
  ],
  theme: {
    ...tailwindTheme,
    extend: {
      screens: {
        'desktop': tailwindTheme.screens[DESKTOP_LAYOUT],
      },
      spacing: {
        2.5: "10px",
        4.5: "18px",
        6.5: "26px"
      },
      overflow: {
        'initial': 'initial'
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
      boxShadow: {
        'header': '0px 0.3370107412338257px 2px 0px rgba(0, 0, 0, 0.03), 0px 1.5px 3px 0px rgba(0, 0, 0, 0.05), 0px 4px 16px 0px rgba(0, 0, 0, 0.07);',
        'lg': '0px 18px 38px rgba(31, 35, 72, 0.07), 0px 7px 8.5px rgba(31, 35, 72, 0.04), 0px 2px 2.5px rgba(31, 35, 72, 0.02)',
        'select': '0px 9.09524px 18.1905px rgba(0, 0, 0, 0.111158);'
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [
    function ({ addVariant, addComponents }) {
      addVariant('children', '& > *');
      addVariant('hocus', '&:hover, &:focus');
      addComponents({
        '.hide-scrollbar': {
          scrollbarWidth: 'none' /* Firefox */,
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          } /* WebKit */,
        },
      });
      addComponents({
        '.clickable': {
          position: 'relative',
          '&::after': {
            position: "absolute",
            width: "100%",
            content: "''",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "42px",
            minHeight: "42px"
          }
        },
        '.clickable-sm': {
          position: 'relative',
          '&::after': {
            position: "absolute",
            width: "100%",
            content: "''",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "16px",
            minHeight: "16px"
          }
        },
      })
    },
  ],
}
