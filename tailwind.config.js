/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'nexo-violet': '#5B4BFF',
        'electric-indigo': '#4938E8',
        'soft-lavender': '#DCD7FF',
        'ice-blue': '#DDF4FF',
        'electric-cyan': '#63D8FF',
        'off-white': '#F8F8F5',
        surface: '#F1F1F4',
        ink: '#121214',
        'muted-text': '#66666D',
        'acid-lime': '#D9FF43',
        'dark-bg': '#0C0B12',
        'dark-surface': '#16141F',
        'dark-surface-high': '#201D2D',
        'dark-text': '#F7F7F4',
        'dark-muted': '#A7A5AF',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        pill: '999px',
        input: '14px',
        'card-sm': '16px',
        'card-lg': '24px',
        'card-xl': '32px',
        panel: '28px',
        'panel-lg': '40px',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(91, 75, 255, 0.06)',
        'soft-md': '0 4px 16px rgba(91, 75, 255, 0.08)',
        'soft-lg': '0 8px 32px rgba(91, 75, 255, 0.10)',
        'dark-soft': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
