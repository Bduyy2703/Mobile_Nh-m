/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#A8715A",
        secondary: "#DD8560",
      },
      fontFamily: {
        ["TenorSans-Regular"]: ["TenorSans-Regular"],
        ["Poppins-Thin"]: ["Poppins-Thin"],
        ["Poppins-ExtraLight"]: ["Poppins-ExtraLight"],
        ["Poppins-Light"]: ["Poppins-Light"],
        ["Poppins-Regular"]: ["Poppins-Regular"],
        ["Poppins-Medium"]: ["Poppins-Medium"],
        ["Poppins-SemiBold"]: ["Poppins-SemiBold"],
        ["Poppins-Bold"]: ["Poppins-Bold"],
        ["Poppins-ExtraBold"]: ["Poppins-ExtraBold"],
        ["Poppins-Black"]: ["Poppins-Black"],
      },
    },
  },
  plugins: [],
};
