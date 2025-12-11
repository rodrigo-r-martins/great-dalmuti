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
        // Primary Colors - Royal Purple
        "royal-purple": "#6b46c1",
        "royal-purple-light": "#805ad5",
        "royal-purple-dark": "#553c9a",
        
        // Medieval Gold
        "medieval-gold": "#d69e2e",
        "gold-light": "#ecc94b",
        "gold-dark": "#b7791f",
        
        // Parchment
        "parchment": "#f7fafc",
        "parchment-dark": "#edf2f7",
        "aged-parchment": "#e2e8f0",
        
        // Burgundy
        "burgundy": "#9b2c2c",
        "burgundy-light": "#c53030",
        
        // Forest Green
        "forest-green": "#276749",
        "forest-green-light": "#38a169",
        
        // Card Rank Colors
        "card-royal": "#9f7aea",      // 1-2: Royal cards
        "card-noble": "#4299e1",      // 3-4: Noble cards
        "card-merchant": "#48bb78",   // 5-8: Merchant cards
        "card-peasant": "#ed8936",    // 9-12: Peasant cards
        "card-jester": "#d53f8c",     // 13: Jesters (wild)
        
        // UI States (text colors)
        "ui-primary": "#2d3748",
        "ui-secondary": "#4a5568",
        "ui-muted": "#718096",
        "ui-inverse": "#ffffff",
        
        // Legacy colors (for backward compatibility)
        "dalmuti-gold": "#d69e2e",
        "dalmuti-green": "#38a169",
        "card-parchment": "#f7fafc",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'card': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.25)',
        'card-selected': '0 12px 24px rgba(214, 158, 46, 0.4)',
        'button': '0 4px 12px rgba(214, 158, 46, 0.3)',
        'button-hover': '0 6px 16px rgba(214, 158, 46, 0.4)',
      },
    },
  },
  plugins: [],
};
