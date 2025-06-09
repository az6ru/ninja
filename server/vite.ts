import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { HelmetServerState } from "react-helmet-async";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function injectMeta(html: string, helmet: HelmetServerState): string {
  const meta = `
      ${helmet.title.toString()}

      ${helmet.meta.toString()}

      ${helmet.link.toString()}
  `;

  return html.replace("<!--ssr-head-->", meta);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "client/vite.config.ts"),
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
    root: path.resolve(process.cwd(), "client"),
    base: '/',
  });

  app.use(vite.middlewares);

  app.get(/^(?!\/api\/).*$/, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      if (/\.\w+$/.test(url)) {
        return next();
      }

      let template = await fs.promises.readFile(
        path.resolve(process.cwd(), "client", "index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);

      const entryPath = path.resolve(process.cwd(), "client/src/entry-server.tsx");
      const { render } = await vite.ssrLoadModule(entryPath);
      const { html: appHtml, helmet } = render({ path: url });

      template = injectMeta(template, helmet)
        .replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  const ssrDistPath = path.resolve(process.cwd(), "dist/server");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      const { render } = await import(path.resolve(ssrDistPath, 'entry-server.js'));

      const { html: appHtml, helmet } = render({ path: url });

      const finalHtml = injectMeta(template, helmet)
        .replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);

    } catch (e) {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      res.status(500).set({ 'Content-Type': 'text/html' }).end(template);
    }
  });
}
