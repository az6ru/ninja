/**
 * @file: pages.config.ts
 * @description: Конфиг для генерации страниц оптимизации изображений
 * @dependencies: используется в динамических страницах оптимизации
 * @created: 2024-06-05
 */

// Импортируем JSON с помощью fetch для поддержки горячей перезагрузки
import pagesDataStatic from './pages.json';
import { refreshJsonCache } from '@/lib/utils';

export interface OptimizePageConfig {
  slug: string
  title: string
  description: string
  h1: string
  subtitle: string
  bullets: string[]
}

// Функция для получения актуальных данных страниц
export async function getPages(): Promise<OptimizePageConfig[]> {
  try {
    // В режиме разработки загружаем JSON через fetch для обновления без перезагрузки
    if (import.meta.env.DEV) {
      // Сначала обновляем кеш
      await refreshJsonCache('/src/config/pages.json');
      
      // Затем загружаем актуальные данные
      const response = await fetch('/src/config/pages.json', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn('Не удалось динамически загрузить pages.json:', error);
  }
  
  // В случае ошибки или в production используем статический импорт
  return pagesDataStatic;
}

// Для обратной совместимости оставляем статический экспорт
export const pages: OptimizePageConfig[] = pagesDataStatic; 