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
          alt: 'hsl(var(--bg-alt))',
        },
        muted: 'hsl(var(--muted))',

        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
        },

        'sidebar-2': {
          DEFAULT: 'hsl(var(--sidebar-2))',
          fg: 'hsl(var(--sidebar-2-fg))',
          muted: 'hsl(var(--sidebar-2-muted))',
          hover: 'hsl(var(--sidebar-2-hover))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          fg: 'hsl(var(--card-fg))',
        },

        tooltip: {
          DEFAULT: 'hsl(var(--tooltip))',
          fg: 'hsl(var(--tooltip-fg))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          fg: 'hsl(var(--popover-fg))',
        },

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
        header: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
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
