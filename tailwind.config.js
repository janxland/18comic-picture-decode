/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            height: {
                "20vw": "20vw",
                "30vw": "30vw",
                "60vw": "60vw",
            },
            width: {
                "230px": "230px",
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