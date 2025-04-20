import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'sparkle': 'sparkle 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'anemo': '0 0 15px 5px rgba(116, 226, 204, 0.7)',
        'geo': '0 0 15px 5px rgba(255, 188, 43, 0.7)',
        'pyro': '0 0 15px 5px rgba(255, 108, 77, 0.7)',
        'hydro': '0 0 15px 5px rgba(59, 166, 255, 0.7)',
        'electro': '0 0 15px 5px rgba(178, 93, 255, 0.7)',
        'cryo': '0 0 15px 5px rgba(119, 221, 255, 0.7)',
        'dendro': '0 0 15px 5px rgba(106, 212, 106, 0.7)',
      }
    },
  },
  plugins: [],
} satisfies Config;

module.exports = {
  important:true,
}
