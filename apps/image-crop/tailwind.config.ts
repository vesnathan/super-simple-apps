import type { Config } from "tailwindcss";
import sharedPreset from "@super-simple-apps/shared-assets/tailwind.preset";

const config: Config = {
  presets: [sharedPreset],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../shared-assets/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
};

export default config;
