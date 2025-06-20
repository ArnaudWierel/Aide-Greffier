module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(-20px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "float-in": "floatIn 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
