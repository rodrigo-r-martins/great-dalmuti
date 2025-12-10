/************
 * Tailwind CSS config for the Great Dalmuti client
 ************/

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "table-green": "#14532d",
      },
    },
  },
  plugins: [],
};
