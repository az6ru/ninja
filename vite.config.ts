import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import history from 'connect-history-api-fallback'

const isProduction = process.env.NODE_ENV === "production";

// Общие настройки для всех режимов
const commonConfig = {
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(process.cwd(), 'client/src')
      },
      {
        find: '@shared',
        replacement: path.resolve(process.cwd(), 'shared')
      },
      {
        find: '@assets',
        replacement: path.resolve(process.cwd(), 'attached_assets')
      }
    ]
  }
};

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "ssr") {
    return {
      ...commonConfig,
      plugins: [
        react(),
      ],
      build: {
        ssr: true,
        outDir: path.resolve(process.cwd(), "dist/server"),
        emptyOutDir: false,
        rollupOptions: {
          input: path.resolve(process.cwd(), "client/src/entry-server.tsx"),
          output: {
            format: 'esm',
          },
        },
      },
    };
  }

  return {
    ...commonConfig,
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(!isProduction && process.env.REPL_ID !== undefined
        ? [
            import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    root: path.resolve(process.cwd(), "client"),
    build: {
      outDir: path.resolve(process.cwd(), "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        allow: [
          path.resolve(process.cwd(), "client"),
          path.resolve(process.cwd(), "shared"),
          path.resolve(process.cwd(), "attached_assets"),
        ],
      },
      watch: {
        usePolling: true,
      },
    },
  };
});
