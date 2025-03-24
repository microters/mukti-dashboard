/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ["Jost", "serif"],
        poppins: ["Poppins", "serif"],
      },
      colors: {
        "M-primary-color": "#009650",
        "M-heading-color": "#323290",
        "M-secondary-color": "#EA2A2E",
        "M-section-bg": "#EBF7F6",
        "M-text-color": "#6A7C92",
      },
      backgroundImage: {
        heroBG: "@/public/assets/heroBG.png",
      },
      animation: {
        spin: "spin 6s linear infinite",
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        spin: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        pulse: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-4px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
