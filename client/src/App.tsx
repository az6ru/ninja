import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptimizePageRouter } from "@/pages/OptimizePageRouter";

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
  "/convert-jpeg-to-webp",
  "/api",
  "/faq",
  "/blog/kak-szhat-foto",
  "/blog/umenshit-foto-dlya-sayta"
];

function Router() {
  return (
    <Switch>
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
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
