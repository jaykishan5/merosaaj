/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1a1a1a", // Charcoal
                    foreground: "#fcfaf2", // Cream
                },
                secondary: {
                    DEFAULT: "#fcfaf2", // Cream
                    foreground: "#1a1a1a",
                },
                accent: {
                    DEFAULT: "#8B0000", // Deep Red
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#f4f4f4",
                    foreground: "#666666",
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                outfit: ["var(--font-outfit)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
