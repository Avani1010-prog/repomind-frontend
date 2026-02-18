/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lime: '#aaff00',
                'lime-bright': '#ccff33',
                'app-black': '#0a0a0a',
                'app-dark': '#111111',
                'app-card': '#1a1a1a',
                'app-border': '#2a2a2a',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
                mono: ['Space Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
