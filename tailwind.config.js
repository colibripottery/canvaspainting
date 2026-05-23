/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d9ff',
          dark: '#00b8d9',
        },
        accent: '#ad631a',
        'section-bg': '#f7f8fa',
        ink: {
          DEFAULT: '#1a1a1a',
          body: '#374151',
          muted: '#6b7280',
          light: '#9ca3af',
        },
        edge: {
          DEFAULT: '#e5e7eb',
          hover: '#d1d5db',
        },
        navy: '#0b1d3b',
      },
      fontFamily: {
        heading: ['Comfortaa', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
