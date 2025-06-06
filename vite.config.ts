import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import history from 'connect-history-api-fallback'

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "ssr") {
    return {
      plugins: [
        react(),
      ],
      build: {
        ssr: true,
        outDir: path.resolve(import.meta.dirname, "dist/server"),
        emptyOutDir: false,
        rollupOptions: {
          input: path.resolve(import.meta.dirname, "client", "src", "entry-server.tsx"),
          output: {
            format: 'esm',
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets"),
        },
      },
    };
  }

  return {
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
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        // Разрешаем доступ к файлам вне корневой директории
        allow: [
          path.resolve(import.meta.dirname, "client"),
          path.resolve(import.meta.dirname, "shared"),
        ],
      },
      watch: {
        usePolling: true,
      },
    },
  };
});
