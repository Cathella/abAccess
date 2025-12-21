import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // Brand Colors - Primary (Green)
        primary: {
          900: "#32C28A",
          800: "#3ACD93",
          700: "#56D8A8",
          100: "#DFF7EE",
          DEFAULT: "#32C28A",
        },
        // Brand Colors - Secondary (Blue)
        secondary: {
          900: "#3A8DFF",
          100: "#E8F2FF",
          DEFAULT: "#3A8DFF",
        },
        // Neutral (Grays)
        neutral: {
          900: "#1A1A1A",
          800: "#2E2E2E",
          700: "#4A4F55",
          600: "#8F9AA1",
          500: "#C9D0DB",
          400: "#E5E8EC",
          200: "#F7F9FC",
          100: "#FFFFFF",
          DEFAULT: "#1A1A1A",
        },
        // Semantic Colors - Success
        success: {
          900: "#38C172",
          100: "#E9F8F0",
          DEFAULT: "#38C172",
        },
        // Semantic Colors - Warning
        warning: {
          900: "#FFB649",
          100: "#FFF3DC",
          DEFAULT: "#FFB649",
        },
        // Semantic Colors - Error
        error: {
          900: "#E44F4F",
          100: "#FDECEC",
          DEFAULT: "#E44F4F",
        },
      },
      fontSize: {
        // H1 - Main Heading
        "h1": ["48px", { lineHeight: "auto", fontWeight: "700" }],
        // H2 - Section Heading
        "h2": ["24px", { lineHeight: "160%", fontWeight: "700" }],
        // H3 - Subsection Heading
        "h3": ["20px", { lineHeight: "auto", fontWeight: "700" }],
        // Bold text
        "bold": ["16px", { lineHeight: "160%", fontWeight: "700" }],
        // Body text
        "body": ["16px", { lineHeight: "160%", fontWeight: "400" }],
        // Small bold
        "sm-bold": ["14px", { lineHeight: "140%", fontWeight: "700" }],
        // Small body
        "sm-body": ["14px", { lineHeight: "140%", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
