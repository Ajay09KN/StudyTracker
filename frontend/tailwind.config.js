/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F6F1',
          100: '#FFFFFF',
          200: '#ECEEE7',
          300: '#DEE1D8',
        },
        ink: {
          DEFAULT: '#1B2430',
          700: '#242F3D',
          800: '#182028',
          900: '#131A21',
          950: '#0F151B',
        },
        pine: {
          50: '#EAF3F0',
          100: '#CFE5DD',
          300: '#7FB3A1',
          500: '#2F6F5E',
          600: '#275D4F',
          700: '#204C40',
        },
        amber: {
          50: '#FDF3E4',
          100: '#FAE3BC',
          300: '#F0BC6C',
          500: '#E8A33D',
          600: '#C98527',
        },
        coral: {
          50: '#FCEAE7',
          300: '#F1998A',
          500: '#E8604C',
          600: '#CB4B39',
        },
        slate: {
          50: '#F4F5F4',
          200: '#DADEDA',
          400: '#9AA3A0',
          500: '#6B7280',
          600: '#525B57',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 21, 27, 0.04), 0 1px 12px rgba(15, 21, 27, 0.05)',
        'card-dark': '0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 12px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
