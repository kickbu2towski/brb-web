/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        fg: 'hsl(var(--fg))',
        bg: {
          DEFAULT: 'hsl(var(--bg))',
          '2': 'hsl(var(--bg-2))',
          '3': 'hsl(var(--bg-3))',
        },
        muted: 'hsl(var(--muted))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          fg: 'hsl(var(--primary-fg))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          fg: 'hsl(var(--secondary-fg))',
        },

        ring: 'hsl(var(--ring))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',

        brand: {
          DEFAULT: 'hsl(var(--brand))',
          fg: 'hsl(var(--brand-fg))',
        },
      },
      boxShadow: {
        'depth-1': ' 0px 6px 6px -4px rgba(0, 0, 0, 0.10)',
        'depth-2': ' 0px 16px 16px -4px rgba(0, 0, 0, 0.10)',
        'depth-4': ' 0px 24px 32px -16px rgba(0, 0, 0, 0.50)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
