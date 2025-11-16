import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

const config: Config & PluginOptions = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/assets/index.css",
};

export default config;
