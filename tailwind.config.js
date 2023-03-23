/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
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
    plugins: [
        require('tailwind-scrollbar'),
        require('@tailwindcss/typography'),
    ],
}