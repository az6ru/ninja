import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Принудительно обновляет кеш JSON-файла
 * @param jsonPath путь к JSON-файлу относительно корня проекта
 */
export async function refreshJsonCache(jsonPath: string): Promise<void> {
  if (import.meta.env.DEV) {
    const timestamp = new Date().getTime();
    try {
      await fetch(`${jsonPath}?t=${timestamp}`, { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      console.log(`Кеш для ${jsonPath} обновлен`);
    } catch (error) {
      console.error(`Ошибка при обновлении кеша для ${jsonPath}:`, error);
    }
  }
}
