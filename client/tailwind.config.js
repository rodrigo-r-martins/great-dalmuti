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
        plum: "#3A2C40",
        "panel-charcoal": "#1F2433",
        "dalmuti-gold": "#FBBF24",
        "dalmuti-green": "#10B981",
        "card-parchment": "#F7F4EB",
      },
    },
  },
  plugins: [],
};
