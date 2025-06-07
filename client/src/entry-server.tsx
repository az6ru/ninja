/**
 * @file: entry-server.tsx
 * @description: Точка входа для серверного рендеринга (SSR) React-приложения.
 * @dependencies: react, react-dom/server, wouter/static-location, react-helmet-async, App.tsx
 * @created: 2025-06-07
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Router } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';

import App from './App'; // Ваш главный компонент-роутер теперь импортируется как App

export function render({ path }: { path: string }) {
  console.log(`[entry-server] Rendering for path: ${path}`);
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <Router ssrPath={path}>
        <App />
      </Router>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  console.log(`[entry-server] Helmet title: ${helmet?.title.toString()}`);
  console.log(`[entry-server] Helmet meta: ${helmet?.meta.toString()}`);
  console.log(`[entry-server] Helmet link: ${helmet?.link.toString()}`);
  return { html, helmet };
} 