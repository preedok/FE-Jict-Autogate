/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(-3deg)' },
          '50%': { transform: 'translateY(3deg)' },
        },
      },
      animation: {
        floating: 'floating 3s infinite',
      }
    },
  },
  plugins: [],
});
