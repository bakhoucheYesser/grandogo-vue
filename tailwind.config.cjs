/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          '&:hover': {
            backgroundColor: '#4338ca',
          },
          '&:focus': {
            outline: 'none',
            ringWidth: '2px',
            ringColor: '#6366f1',
            ringOffset: '2px',
          },
        },
        // Add other utility classes as needed
      })
    }
  ],
}
