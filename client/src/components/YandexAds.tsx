/**
 * @file: YandexAds.tsx
 * @description: Компонент для отображения рекламы Яндекс РСЯ
 * @dependencies: react, useEffect
 * @created: 2025-06-04
 */
import { useEffect, useRef } from 'react';

interface YandexAdsProps {
  blockId: string;
  className?: string;
}

export function YandexAds({ blockId, className = '' }: YandexAdsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<boolean>(false);
  const containerId = `yandex_rtb_${blockId}`;

  useEffect(() => {
    // Проверяем, что компонент монтирован и реклама еще не была отрендерена
    if (containerRef.current && !renderedRef.current && window.yaContextCb) {
      // Отмечаем, что реклама будет отрендерена
      renderedRef.current = true;
      
      // Вызываем рендер рекламного блока
      window.yaContextCb.push(() => {
        // @ts-ignore - Игнорируем ошибку типа, так как Ya.Context добавляется динамически
        if (window.Ya && window.Ya.Context && window.Ya.Context.AdvManager) {
          // @ts-ignore
          window.Ya.Context.AdvManager.render({
            blockId: blockId,
            renderTo: containerId
          });
        }
      });
    }
    
    // При размонтировании компонента сбрасываем флаг рендера
    return () => {
      renderedRef.current = false;
    };
  }, [blockId, containerId]);

  return (
    <div className={`yandex-ads-container ${className}`}>
      <div id={containerId} ref={containerRef}></div>
    </div>
  );
}

// Добавляем типы для глобального объекта window
declare global {
  interface Window {
    yaContextCb: Array<() => void>;
    Ya?: {
      Context?: {
        AdvManager?: {
          render: (params: { blockId: string; renderTo: string }) => void;
        };
      };
    };
  }
} 