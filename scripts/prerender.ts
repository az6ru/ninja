import fs from 'fs';
import path from 'path';
import pages from '../client/src/config/pages.json' with { type: 'json' };

const __dirname = path.dirname(new URL(import.meta.url).pathname);

interface Page { slug: string; title: string; description: string; }

const extraPages: Page[] = [
  {
    slug: 'faq',
    title: 'Часто задаваемые вопросы об оптимизации изображений — ImageNinja',
    description:
      'Ответы на часто задаваемые вопросы о сервисе оптимизации изображений ImageNinja. Узнайте как сжимать изображения без потери качества, конвертировать форматы и многое другое.',
  },
];

function injectMeta(html: string, page: Page): string {
  const baseUrl = 'https://imageninja.ru';
  const pageUrl = `${baseUrl}${page.slug ? `/${page.slug}` : '/'}`;
  const meta = `\n      <title>${page.title}</title>\n      <meta name="description" content="${page.description}" />\n      <link rel="canonical" href="${pageUrl}" />\n      <meta property="og:type" content="website" />\n      <meta property="og:locale" content="ru_RU" />\n      <meta property="og:site_name" content="ImageNinja" />\n      <meta property="og:title" content="${page.title}" />\n      <meta property="og:description" content="${page.description}" />\n      <meta property="og:url" content="${pageUrl}" />\n      <meta property="og:image" content="${baseUrl}/assets/images/seo-cover.webp" />\n      <meta name="twitter:card" content="summary_large_image" />\n      <meta name="twitter:title" content="${page.title}" />\n      <meta name="twitter:description" content="${page.description}" />\n      <meta name="twitter:image" content="${baseUrl}/assets/images/seo-cover.webp" />`;
  return html.replace('<!--ssr-head-->', meta);
}

const distDir = path.resolve(__dirname, '../dist/public');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const allPages: Page[] = [...(pages as Page[]), ...extraPages];
for (const page of allPages) {
  const html = injectMeta(template, page);
  const filePath = page.slug ? path.join(distDir, page.slug, 'index.html') : path.join(distDir, 'index.html');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
}
