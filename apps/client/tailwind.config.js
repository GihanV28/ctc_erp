/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#8B5CF6', // violet-500
          orange: '#F97316', // orange-500
        },
        background: '#F9FAFB', // gray-50
        foreground: '#111827', // gray-900
        border: '#E5E7EB', // gray-200
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      },
    },
  },
  plugins: [],
};
