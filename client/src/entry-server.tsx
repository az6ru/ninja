/**
 * @file: entry-server.tsx
 * @description: Точка входа для серверного рендеринга (SSR) React-приложения.
 * @dependencies: react, react-dom/server, wouter/static-location, react-helmet-async, App.tsx
 * @created: 2025-06-07
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Router } from 'wouter';
import pkg from 'react-helmet-async/lib/index.js';
const { HelmetProvider } = pkg;
import type { HelmetServerState } from 'react-helmet-async';

import App from './App'; // Ваш главный компонент-роутер теперь импортируется как App

export function render({ path }: { path: string }) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <Router ssrPath={path}>
        <App />
      </Router>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  return { html, helmet };
} 