/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mainFont: ["var(--mainFont)"],
      },
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
      },
      backgroundImage: {
        hero: "url('/images/hero.jpg')",
        register: "url('/images/register.svg')",
        login: "url('/images/login.svg')",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out forwards",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
