/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'sm': '13px',
      },
      fontFamily: {
        inter: ["Inter", "serif"],
      },
      colors: {
        "M-primary-color": "#3F54E7",
        "M-secondary-color": "#E7633D", 
        "M-Green-color": "#60B452", 
        "M-heading-color": "#232E51",
        "M-section-bg": "#EBF7F6",
        "M-text-color": "#4C4D5D",
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
