const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        aurora: "aurora 15s linear infinite",
        "text-gradient": "text-gradient 1.5s linear infinite",
        "background-shine": "background-shine 2s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        aurora: {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(-50%, 50%) scale(1.2)",
          },
          "66%": {
            transform: "translate(50%, 50%) scale(0.9)",
          },
          "100%": {
            transform: "translate(0, 0) scale(1)",
          },
        },
        "text-gradient": {
          to: {
            backgroundPosition: "200% center",
          },
        },
        "background-shine": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
