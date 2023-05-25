const withMT = require("@material-tailwind/react/utils/withMT")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
})
