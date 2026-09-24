/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      colors: {
        // هوية One tech — كحلي داكن + سيان تقني (UI-UX.md)
        brand: {
          DEFAULT: '#0B1F3A',
          dark: '#071528',
          accent: '#22D3EE',
        },
        neutral: {
          50: '#F7F7F7',
          900: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
