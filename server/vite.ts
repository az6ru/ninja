import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import pages from "../client/src/config/pages.json" assert { type: "json" };

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

function injectMeta(html: string, pathname: string): string {
  const normalized = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  const slug = normalized === "" ? "" : normalized;
  let page: any = (pages as any[]).find((p) => p.slug === slug);

  if (slug === "faq") {
    page = {
      slug: "faq",
      title: "Часто задаваемые вопросы об оптимизации изображений — ImageNinja",
      description:
        "Ответы на часто задаваемые вопросы о сервисе оптимизации изображений ImageNinja. Узнайте как сжимать изображения без потери качества, конвертировать форматы и многое другое.",
    };
  }

  if (!page) return html.replace("<!--ssr-head-->", "");

  const baseUrl = "https://imageninja.ru";
  const pageUrl = `${baseUrl}${page.slug ? `/${page.slug}` : "/"}`;

  const meta = `\n      <title>${page.title}</title>\n      <meta name="description" content="${page.description}" />\n      <link rel="canonical" href="${pageUrl}" />\n      <meta property="og:type" content="website" />\n      <meta property="og:locale" content="ru_RU" />\n      <meta property="og:site_name" content="ImageNinja" />\n      <meta property="og:title" content="${page.title}" />\n      <meta property="og:description" content="${page.description}" />\n      <meta property="og:url" content="${pageUrl}" />\n      <meta property="og:image" content="${baseUrl}/assets/images/seo-cover.webp" />\n      <meta name="twitter:card" content="summary_large_image" />\n      <meta name="twitter:title" content="${page.title}" />\n      <meta name="twitter:description" content="${page.description}" />\n      <meta name="twitter:image" content="${baseUrl}/assets/images/seo-cover.webp" />`;

  return html.replace("<!--ssr-head-->", meta);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: viteLogger,
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.get(/^(?!\/api\/).*$/, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      if (/\.\w+$/.test(url)) return next();

      let template = await fs.promises.readFile(
        path.resolve(import.meta.dirname, "..", "client", "index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);

      try {
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const { html: appHtml, helmet } = render({ path: url });

        template = template
          .replace("<!--ssr-head-->", helmet.title.toString() + helmet.meta.toString() + helmet.link.toString())
          .replace("<!--ssr-outlet-->", appHtml);
      } catch (e) {
        template = injectMeta(template, req.path);
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  const ssrDistPath = path.resolve(import.meta.dirname, "server");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the client build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      const { render } = await import(path.resolve(ssrDistPath, 'entry-server.js'));

      const { html: appHtml, helmet } = render({ path: url });

      const finalHtml = template
        .replace("<!--ssr-head-->", helmet.title.toString() + helmet.meta.toString() + helmet.link.toString())
        .replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);

    } catch (e) {
      log(`SSR Error: ${e instanceof Error ? e.message : String(e)}`);
      const fallback = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
      const html = injectMeta(fallback, req.path);
      res.status(500).set({ 'Content-Type': 'text/html' }).end(html);
    }
  });
}
