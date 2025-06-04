/**
 * @file: yandex-metrika.ts
 * @description: Утилиты для работы с Яндекс Метрикой
 * @dependencies: -
 * @created: 2024-06-07
 */

// ID счетчика Яндекс Метрики
export const YM_COUNTER_ID = 102422498;

// Типы целей для Яндекс Метрики
export enum YandexMetrikaGoal {
  OPTIMIZE_IMAGE = 'optimize_image',
  DOWNLOAD_IMAGE = 'download_image',
  CHANGE_FORMAT = 'change_format',
  BULK_UPLOAD = 'bulk_upload',
  VIEW_COMPARISON = 'view_comparison',
  DOWNLOAD_ZIP = 'download_zip'
}

// Интерфейс для параметров цели
export interface YandexMetrikaParams {
  [key: string]: string | number | boolean;
}

/**
 * Отправляет достижение цели в Яндекс Метрику
 * @param goalName Название цели
 * @param params Дополнительные параметры
 */
export function sendYandexMetrikaGoal(goalName: YandexMetrikaGoal, params?: YandexMetrikaParams): void {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      // Отправляем цель в Яндекс Метрику
      window.ym(YM_COUNTER_ID, 'reachGoal', goalName, params);
      console.log(`Яндекс Метрика: цель ${goalName} отправлена`, params);
    } catch (error) {
      console.error('Ошибка отправки цели в Яндекс Метрику:', error);
    }
  }
}

/**
 * Отправляет произвольное событие в Яндекс Метрику
 * @param eventName Название события
 * @param params Дополнительные параметры
 */
export function sendYandexMetrikaEvent(eventName: string, params?: YandexMetrikaParams): void {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      // Отправляем параметры в Яндекс Метрику
      const eventParams = { [eventName]: params || true };
      window.ym(YM_COUNTER_ID, 'params', eventParams);
      console.log(`Яндекс Метрика: событие ${eventName} отправлено`, params);
    } catch (error) {
      console.error('Ошибка отправки события в Яндекс Метрику:', error);
    }
  }
} 