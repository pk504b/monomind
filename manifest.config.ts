import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: "Monomind: Your Second Brain in New Tab",
  description:
    "Transform your New Tab into a minimal, deep focus workspace designed to capture intent and archive your journey.",
  version: pkg.version,
  icons: {
    16: "public/icon16.png",
    48: "public/icon48.png",
    128: "public/icon128.png",
  },
  permissions: ["newTab"],
  chrome_url_overrides: {
    newtab: "src/newtab/index.html",
  },
});
