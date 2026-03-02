import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: "Monomind: Your Second Brain in Your New Tab",
  description:
    "Transform your New Tab into a minimal, high-performance workspace designed to capture intent and archive your journey.",
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  permissions: ["newTab"],
  chrome_url_overrides: {
    newtab: "src/newtab/index.html",
  },
});
