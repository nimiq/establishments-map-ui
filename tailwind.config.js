/* eslint-env node */
const tailwindTheme = require('tailwindcss-nimiq-theme').theme

export const DESKTOP_LAYOUT = 'md'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  preflight: false,
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
  ],
  theme: {
    ...tailwindTheme,
    extend: {
      screens: {
        desktop: tailwindTheme.screens[DESKTOP_LAYOUT],
      },
      spacing: {
        2.5: '10px',
        4.5: '18px',
        6.5: '26px',
      },
      overflow: {
        initial: 'initial',
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
      boxShadow: {
        header: '0px 0.3370107412338257px 2px 0px rgba(0, 0, 0, 0.03), 0px 1.5px 3px 0px rgba(0, 0, 0, 0.05), 0px 4px 16px 0px rgba(0, 0, 0, 0.07);',
        lg: '0px 18px 38px rgba(31, 35, 72, 0.07), 0px 7px 8.5px rgba(31, 35, 72, 0.04), 0px 2px 2.5px rgba(31, 35, 72, 0.02)',
        select: '0px 9.09524px 18.1905px rgba(0, 0, 0, 0.111158);',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scale: {
          from: { opacity: 0, transform: 'scale(0.6)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        cryptocity: {
          '0%': { opacity: 0, transform: 'translateX(0) rotate(-100deg)' },
          '40%': { opacity: 1, transform: 'translateX(24px) rotate(0)' },
          '80%': { opacity: 1, transform: 'translateX(24px) rotate(0)' },
          '100%': { opacity: 1, transform: 'translateX(12px) rotate(-90deg)' },
        },
      },
      animation: {
        'slideDownAndFade': 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideLeftAndFade': 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideUpAndFade': 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slideRightAndFade': 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade': `fade 300ms ${tailwindTheme.transitionTimingFunction.DEFAULT}`,
        'fade-out': `fade 300ms ${tailwindTheme.transitionTimingFunction.DEFAULT} reverse`,
        'scale': `scale 300ms ${tailwindTheme.transitionTimingFunction.DEFAULT}`,
        'cryptocity': `cryptocity 2000ms ${tailwindTheme.transitionTimingFunction.DEFAULT}`,
        'modal-content': `modal-content 300ms ${tailwindTheme.transitionTimingFunction.DEFAULT}`,
      },
    },
  },
  plugins: [
    function ({ addVariant, addComponents }) {
      addVariant('children', '& > *')
      addVariant('hocus', '&:hover, &:focus')
      addComponents({
        '.hide-scrollbar': {
          'scrollbarWidth': 'none' /* Firefox */,
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          } /* WebKit */,
        },
      })
      addComponents({
        '.clickable': {
          'position': 'relative',
          '&::after': {
            position: 'absolute',
            width: '100%',
            content: '\'\'',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '42px',
            minHeight: '42px',
          },
        },
        '.clickable-sm': {
          'position': 'relative',
          '&::after': {
            position: 'absolute',
            width: '100%',
            content: '\'\'',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '16px',
            minHeight: '16px',
          },
        },
      })
    },
  ],
}
