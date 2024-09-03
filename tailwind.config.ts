import type { Config } from "tailwindcss";

const config: Config = {

    content: [

        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    ],

    theme: {

        extend: {

            colors: {

                background: '#0a0a0a',
                "text-primary": '#ffffff',
                primary: '#ffffff',
                "primary-hover": '#d4d4d4',
                border: '#27272a',
                "text-secondary": '#737373',
                foreground: '#262626',
                "foreground-hover": '#404040'

            },

            backgroundImage: {

                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

            },

        },

    },

    plugins: []

}

export default config
