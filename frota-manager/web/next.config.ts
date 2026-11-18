import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Necessário com "export": desliga a otimização de imagens que exigiria servidor.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;