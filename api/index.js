// Vercel serverless function для запуска Express приложения
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Функция для динамического импорта собранного серверного приложения
async function startServer() {
  try {
    // Импортируем сервер из собранного файла
    const { default: app } = await import('../dist/index.js');
    
    return app;
  } catch (error) {
    console.error('Failed to import server:', error);
    return (req, res) => {
      res.statusCode = 500;
      res.end('Internal Server Error: ' + error.message);
    };
  }
}

// Serverless функция для Vercel
export default async function handler(req, res) {
  const server = await startServer();
  
  // Если server — функция, то это обработчик ошибки
  if (typeof server === 'function') {
    return server(req, res);
  }
  
  // Иначе передаем запрос в Express
  return server(req, res);
} 