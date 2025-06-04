/**
 * @file: ComparisonView.tsx
 * @description: Сравнение оригинального и оптимизированного изображения
 * @dependencies: React
 * @created: 2024-06-06
 */

interface ComparisonViewProps {
  original: string
  optimized: string
}

export function ComparisonView({ original, optimized }: ComparisonViewProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div>
        <h4>Оригинал</h4>
        <img src={original} className="max-w-xs" />
      </div>
      <div>
        <h4>Оптимизировано</h4>
        <img src={optimized} className="max-w-xs" />
      </div>
    </div>
  );
} 