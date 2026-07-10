import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode
        navy: {
          950: '#0a0e1a',
          900: '#0d1220',
          800: '#111827',
          700: '#1a2035',
          600: '#1e2540',
        },
        // Light mode
        cream: {
          50: '#faf8f5',
          100: '#f0ecf5',
          200: '#e8e2f0',
        },
        // Accents
        lavender: {
          DEFAULT: '#b8a9e8',
          light: '#d4c8f5',
          dark: '#7c5cff',
        },
        pink: {
          accent: '#e8a9c8',
          deep: '#d4629e',
        },
        electric: {
          DEFAULT: '#7c5cff',
          light: '#9b82ff',
          glow: 'rgba(124, 92, 255, 0.15)',
        },
        mint: {
          DEFAULT: '#a9e8d0',
          dark: '#6bc4a6',
        },
        plum: {
          DEFAULT: '#1a1025',
          light: '#5a4d6b',
        },
        sparkle: '#e8d5a9',
        muted: '#6b6580',
        subtle: '#a8a3b8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Satoshi"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['48px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['32px', { lineHeight: '1.2' }],
      },
      spacing: {
        'section': '96px',
        'section-lg': '120px',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(124, 92, 255, 0.15)',
        'glow-lg': '0 0 60px rgba(124, 92, 255, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'sticker': '2px 3px 8px rgba(0, 0, 0, 0.25)',
        'float': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      backgroundImage: {
        'gradient-oracle': 'linear-gradient(135deg, #7c5cff, #e8a9c8, #a9e8d0)',
        'gradient-card': 'linear-gradient(145deg, #1a2035, #111827)',
        'gradient-holographic': 'linear-gradient(135deg, #b8a9e8, #7c5cff, #e8a9c8, #a9e8d0)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 92, 255, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 92, 255, 0.25)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
