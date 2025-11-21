/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                theme: '#ed6c21',
                header: '#18191a',
                background: '#1c1e21',
                text: '#f5f5f5',
                snow: '#ffffff',
                'border-accent': '#757575',
                border: '#5c5c5c',
                marker: '#b3b3b3',
                accent: '#e05d2d',
                section: 'rgba(34, 36, 39, 0.8)',
                'aside-action': 'rgba(43, 45, 48, 0.8)',
                'cell-header': 'rgba(47, 49, 53, 0.4)',
                'cell-even': 'rgba(45, 47, 51, 0.8)',
            },
        },
    },
    plugins: [],
};
