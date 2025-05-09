import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFDF6",

        white: "#FFFDF6",
        blue: "#3A86FF",
        pink: "#FF005C",

        gold: "#FFB800",
        darkGold: "#615536",
        silver: "#CBCCCF",
        darkSilver: "#595959",
        bronze: "#B88A4A",
        darkBronze: "#C7C9C8",

        black: "1C1C1C"
      },

      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // or Poppins, Sora, etc.
      },

      animation: {
        "fade-out": "1s fadeOut 3s ease-out forwards",
      },

      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
