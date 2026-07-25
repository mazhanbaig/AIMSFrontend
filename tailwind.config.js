/** @type {import('tailwindcss').Config} */
module.exports = {
  // ⚠️ No dark mode - Light theme only
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E8ECEF",
        input: "#E8ECEF",
        ring: "#006B54",
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        primary: {
          DEFAULT: "#006B54",
          foreground: "#FFFFFF",
          light: "#00876A",
          dark: "#004D3C",
        },
        secondary: {
          DEFAULT: "#0A0A0A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#00A889",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A1A",
          primary: "#006B54",
          "primary-foreground": "#FFFFFF",
          accent: "#F8F9FA",
          "accent-foreground": "#1A1A1A",
          border: "#E8ECEF",
          ring: "#006B54",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        pill: "9999px",
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'header': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
