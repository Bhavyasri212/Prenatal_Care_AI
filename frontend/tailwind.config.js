/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Primary Action Teal/Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0f172a', // Deep Slate for bold text
        },
        success: {
          light: '#ecfdf5',
          DEFAULT: '#10b981', // Clinical Emerald
        },
        warning: {
          light: '#fffbeb',
          DEFAULT: '#f59e0b',
        },
        danger: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 40px -10px rgba(2, 132, 199, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.025)',
      }
    }
  }
};
