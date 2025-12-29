const { nextui } = require("@nextui-org/react");
const sharedPreset = require("@super-simple-apps/shared-assets/tailwind.preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedPreset],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "../../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../../node_modules/@super-simple-apps/shared-assets/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#1a365d",
            primary: {
              50: "#e3f2fd",
              100: "#bbdefb",
              200: "#90caf9",
              300: "#64b5f6",
              400: "#42a5f5",
              500: "#2196f3",
              600: "#1e88e5",
              700: "#1976d2",
              800: "#1565c0",
              900: "#0d47a1",
              DEFAULT: "#1e88e5",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#e8f5e9",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4caf50",
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#4caf50",
              foreground: "#FFFFFF",
            },
            warning: {
              50: "#fff3e0",
              100: "#ffe0b2",
              200: "#ffcc80",
              300: "#ffb74d",
              400: "#ffa726",
              500: "#ff9800",
              600: "#fb8c00",
              700: "#f57c00",
              800: "#ef6c00",
              900: "#e65100",
              DEFAULT: "#ff9800",
              foreground: "#FFFFFF",
            },
            focus: "#1e88e5",
          },
        },
      },
    }),
  ],
};
