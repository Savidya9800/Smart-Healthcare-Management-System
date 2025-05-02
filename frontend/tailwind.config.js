/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["Hanken Grotesk", "sans-serif"], // ✅ Hanken font
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".swal2-rounded": {
          "border-radius": "10px",
          "box-shadow": "0 2px 12px rgba(0, 0, 0, 0.08)",
          "font-weight": "500",
        },
      });
    },
  ],
};
