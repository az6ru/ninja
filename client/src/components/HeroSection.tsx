/**
 * @file: HeroSection.tsx
 * @description: Hero-секция для страницы оптимизации изображений
 * @dependencies: lucide-react, react
 * @created: 2024-06-04
 */
import { CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Сжимайте изображения без потери качества
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Быстрое и бесплатное сжатие изображений (JPEG, PNG, WebP, AVIF) без потери качества. Просто перетащите файл, выберите параметры и скачайте результат!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>Без регистрации</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>Пакетная обработка</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span>Множество форматов</span>
          </div>
        </div>
      </div>
    </div>
  );
} 