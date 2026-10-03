/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy / Ocean Bluish Palette
        navy: {
          50: '#F0F5FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#8098F8',
          500: '#4F66EE',
          600: '#3544E1',
          700: '#1E3A8A', // Primary deep navy blue
          800: '#1E293B',
          900: '#0F172A', // Dark background navy
          950: '#070B19',
        },
        forest: { // Alias for backward compatibility mapping to navy blue
          50: '#F0F5FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#2563EB',
          700: '#1E3A8A', // Primary ocean navy
          800: '#1E293B',
          900: '#0F172A',
          950: '#070B19',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        warm: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 58, 138, 0.08)',
        'card': '0 2px 10px rgba(15, 23, 42, 0.04), 0 10px 25px -5px rgba(30, 58, 138, 0.08)',
        'elevated': '0 20px 30px -10px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
