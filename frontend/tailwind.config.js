/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["Hanken Grotesk", "sans-serif"], // ✅ Added Hanken Grotesk
      },
    },
  },
  plugins: [],
};
