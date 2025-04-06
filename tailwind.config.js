/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			sm: "640px",
			// => @media (min-width: 640px) { ... }
			s350: "350px",
			// => @media (min-width: 350px) { ... }
			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }
		},
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
			animation: {
				"gradient-x": "gradient-x 15s ease infinite",
				text: "text 5s ease infinite",
			},
			keyframes: {
				"gradient-x": {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "left center",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "right center",
					},
				},
				text: {
					"0%, 100%": {
						"background-size": "200% 200%",
						"background-position": "0% 50%",
					},
					"50%": {
						"background-size": "200% 200%",
						"background-position": "100% 50%",
					},
				},
			},
		},
	},
	plugins: [],
};
