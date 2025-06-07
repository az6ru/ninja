import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptimizePageRouter } from "@/pages/OptimizePageRouter";
import { useEffect } from "react";
import { YM_COUNTER_ID } from "@/lib/yandex-metrika";
import FaqPage from "@/pages/FaqPage";
import DonateSuccessPage from './pages/donate-success'
import pages from "./config/pages.json";
import pkg from "react-helmet-async/lib/index.js";
const { Helmet } = pkg;

// Добавляем типы для Яндекс Метрики
declare global {
  interface Window {
    ym: (counterId: number, method: string, ...args: any[]) => void;
  }
}

const seoPaths = [
  "/",
  "/compress-jpeg-online",
  "/compress-png-online",
  "/compress-webp-online",
  "/compress-avif-online",
  "/bulk-image-compression",
  "/compress-without-quality-loss",
  "/compress-with-exif",
  "/compare-image-quality",
  "/convert-to-webp",
  "/convert-avif-to-jpeg",
  "/convert-webp-to-png",
  "/convert-png-to-webp",
  "/convert-jpeg-to-webp"
];

// Компонент для отслеживания изменений URL для Яндекс Метрики
function YandexMetrikaObserver() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Отправляем данные в Яндекс Метрику при изменении URL
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(YM_COUNTER_ID, 'hit', window.location.pathname + window.location.search);
    }
  }, [location]);
  
  return null;
}

function SeoHead() {
  const [location] = useLocation();
  const currentPath = location === "/" ? "" : location.replace(/^\//, "");

  const page = (pages as any[]).find((p) => p.slug === currentPath);

  if (!page) {
    return null;
  }

  const baseUrl = "https://imageninja.ru";
  const pageUrl = `${baseUrl}${page.slug ? `/${page.slug}` : "/"}`;

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="ImageNinja" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${baseUrl}/assets/images/seo-cover.webp`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={`${baseUrl}/assets/images/seo-cover.webp`} />
    </Helmet>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/faq" component={FaqPage} />
      <Route path="/donate-success" component={DonateSuccessPage} />
      {seoPaths.map(path => (
        <Route key={path} path={path} component={OptimizePageRouter} />
      ))}
      <Route component={OptimizePageRouter} /> {/* fallback 404 */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <YandexMetrikaObserver />
        <SeoHead />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
