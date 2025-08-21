import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from design system
        primary: {
          blue: '#0066CC',
          'blue-hover': '#0052A3',
          'blue-light': '#E6F0FF',
        },
        verified: {
          green: '#00A651',
          'green-light': '#E8F5E9',
        },
        // Category colors
        category: {
          hotel: '#7C3AED',
          tour: '#FB923C',
          transport: '#0EA5E9',
        },
        // Grays
        gray: {
          900: '#1A1A1A',
          700: '#4A4A4A',
          500: '#737373',
          300: '#D4D4D4',
          100: '#F5F5F5',
        },
        // Status colors
        error: '#DC2626',
        warning: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'elevation-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'elevation-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'elevation-xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;