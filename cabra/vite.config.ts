import checker from "vite-plugin-checker";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_URL = process.env.CABRA_API_URL || "http://localhost:4000/";

export default defineConfig((_configEnv) => ({
  envPrefix: "CABRA_",
  esbuild: {
    jsxInject: `import React from 'react';`,
  },
  plugins: [
    react({
      babel: {
        plugins: [
          "babel-plugin-macros",
          [
            "@emotion/babel-plugin-jsx-pragmatic",
            {
              export: "jsx",
              import: "__cssprop",
              module: "@emotion/react",
            },
          ],
          [
            "@babel/plugin-transform-react-jsx",
            { pragma: "__cssprop" },
            "twin.macro",
          ],
        ],
      },
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  server: {
    proxy: { "/api/v1": API_URL },
    watch: {
      usePolling: true,
    },
  },
}));
