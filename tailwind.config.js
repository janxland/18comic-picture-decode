/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            width: {
                "230px": "230px"
            },
            margin: {
                "230px": "230px",
            },
            inset: {
                "230px": "230px",
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('tailwind-scrollbar'),
        require('@tailwindcss/typography'),
    ],
}