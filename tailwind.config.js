/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './user-portal/src/**/*.{html,ts}',
    './admin-portal/src/**/*.{html,ts}',
    './apps/dcms/src/**/*.{html,ts}',
    './apps/admin-portal/src/**/*.{html,ts}',
    './libs/shared-ui/src/**/*.{html,ts}',
    './libs/src/**/*.{html,ts}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        modal: 'var(--shadow-modal)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
};
