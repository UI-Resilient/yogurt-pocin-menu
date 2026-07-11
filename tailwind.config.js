/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: "#faf8fd",
          100: "#f2ecfa",
          200: "#e6d9f5",
          300: "#d3bcec",
          400: "#bb96de",
          500: "#9f6fcd",
          600: "#8452b3",
          700: "#6c4192",
          800: "#583677",
          900: "#3f2657",
        },
        cream: {
          50: "#fffdf6",
          100: "#fffae0",
          200: "#fef3ba",
          300: "#fde889",
          400: "#fbd94f",
          500: "#f0c526",
          600: "#cfa116",
          700: "#a67a13",
          800: "#805e16",
          900: "#5c4315",
        },
        ink: "#372a4d",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(111, 65, 146, 0.25)",
      },
    },
  },
  plugins: [],
};
