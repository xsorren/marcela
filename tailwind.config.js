/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
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
        // New minimalist color palette
        "brand-brown": {
          50: "#F5F0E8",
          100: "#E6D7C3",
          200: "#D2B48C",
          300: "#BC9A6A",
          400: "#A0824D",
          500: "#8A2F4C",
          600: "#7A3F12",
          700: "#693611",
          800: "#582D0F",
          900: "#47240C",
        },
        "brand-green": {
          50: "#F0F9F0",
          100: "#DCF2DC",
          200: "#B8E6B8",
          300: "#94D994",
          400: "#70CC70",
          500: "#606648",
          600: "#1E7D1E",
          700: "#1A6F1A",
          800: "#166116",
          900: "#125312",
        },
        "neutral": {
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#181C20",
        },
        /* ========================================
           🎄 COLORES FESTIVOS TEMPORALES
           Para remover: comentar este bloque
           ======================================== */
        "holiday": {
          gold: "#D4AF37",
          champagne: "#F7E7CE",
          silver: "#C0C0C0",
          emerald: "#2F5233",
          cream: "#FFF8E7",
        },
        /* ======================================== */
        // Legacy color for compatibility
        "homever-gold": "#8A2F4C",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'minimalist': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'minimalist-hover': '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 20px rgba(138, 47, 76, 0.08), 0 2px 8px rgba(138, 47, 76, 0.04)',
        'card-hover': '0 8px 40px rgba(138, 47, 76, 0.12), 0 4px 16px rgba(138, 47, 76, 0.08)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(138, 47, 76, 0.15)',
        'glow-green': '0 0 20px rgba(96, 102, 72, 0.15)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.25)',
        md: '0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)',
        lg: '0 4px 6px rgba(0, 0, 0, 0.6)',
        xl: '0 8px 16px rgba(0, 0, 0, 0.7)',
        strong: '0 1px 3px rgba(0, 0, 0, 0.7), 0 2px 6px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities, theme }) {
      const textShadowUtilities = Object.entries(theme('textShadow')).reduce(
        (utilities, [key, value]) => ({
          ...utilities,
          [`.text-shadow-${key}`]: {
            textShadow: value,
          },
        }),
        {}
      );
      
      addUtilities(textShadowUtilities);
    }
  ],
}

