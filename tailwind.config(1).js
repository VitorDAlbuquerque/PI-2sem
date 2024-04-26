/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  plugins: [
    require("@tailwindcss/line-clamp"),
    // ...
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      playfair: "Playfair Display, sans-serif",
      montserrat: "Montserrat, sans-serif",
      montserrat2: "Montserrat Alternates, sans-serif",
    },

    screens: {
      mobile: { min: "0", max: "469px" },

      tablet: { min: "470px", max: "550px" },

      xs: { min: "551px", max: "745px" },

      sm: { min: "744px", max: "884px" },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      md: { min: "885px", max: "1010px" },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lg: { min: "1011px", max: "1115px" },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xl: { min: "1116px", max: "1337px" },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      "2xl": { min: "1338px", max: "1536px" },
      // => @media (min-width: 1536px) { ... }

      max: { min: "1537px" },
    },

    extend: {
      transitionProperty: {
        height: "height",
      },

      flexBasis: {
        "1/7": "14.2857143%",
        "2/7": "28.5714286%",
        "3/7": "42.8571429%",
        "4/7": "57.1428571%",
        "5/7": "71.4285714%",
        "6/7": "85.7142857%",
      },

      height: {
        "90vh": "90vh",
        "10vh": "10vh",
      },

      width: {
        "94vw": "94vw",
        "6vw": "6vw",
      },

      spacing: {
        "420px": "420px",
        "377px": "377px",
        "700px": "700px",
      },

      lineClamp: {
        12: "12",
      },

      backgroundImage: {
        "kiwi-bg":
          "url('../assets/882219_stack of kiwi fruits _xl-1024-v1-0.png')",
      },

      colors: {
        //mainBg: "#2C2B3C",
        mainBg: "#200D2F",
        mainBgOpacity75: "#200D2FD9",
        blackDefaultColor: "#252525",

        bgAside: "#150926",
        darkGreen: "#2F4115",
        lightGreen: "#8CC33F",
        mainFontColor: "#F2EFEB",
        constrastColor: "#8BC13E",
        bgWathcList: "#FFEAD8",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [require("tailwindcss-animate")],
};
