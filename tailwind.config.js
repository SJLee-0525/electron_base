/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    center: true,
    fontFamily: {
      preLight: ["Pretendard-Light"],
      preRegular: ["Pretendard-Regular"],
      preMedium: ["Pretendard-Medium"],
      preSemiBold: ["Pretendard-SemiBold"],
      preBold: ["Pretendard-Bold"],
      preExtraBold: ["Pretendard-ExtraBold"],
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        offWhite: "#FAF9F6",
        title: "#202020",
        longContent: "#3C3C3C",
        content: "#828282",
        content2: "#9D9D9D",
        subContent: "#DDDDDD",
        primaryLight: "#3E91FF",
        primary: "#0381FE",
        primaryDark: "#0072DE",
        error: "#D44848",
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at center, #0a0a1f 0%, #000000 100%)',
      },
    },
  },
  plugins: [scrollbarHide],
};
