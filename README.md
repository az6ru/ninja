# Sharp Optimizer

🖼️ **Sharp Optimizer** — сервис для онлайн оптимизации и конвертации изображений

Быстро оптимизируйте изображения (JPEG, PNG, WebP, AVIF) с помощью современных алгоритмов.  
Просто перетащите файл, выберите параметры и скачайте результат!

## Возможности

- ✅ Поддержка форматов: JPEG, PNG, WebP, AVIF
- ✅ Настройка качества сжатия
- ✅ Конвертация между форматами
- ✅ Пакетная обработка изображений
- ✅ Скачивание результатов в архиве
- ✅ Сохранение EXIF данных (опционально)
- ✅ Визуальное сравнение до/после

## Технологический стек

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, Sharp (для обработки изображений)
- **Сборка**: Vite, TypeScript

## Установка и запуск

### Требования

- Node.js 18+ 
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Сервер будет доступен по адресу http://localhost:5000

### Сборка для production

```bash
npm run build
```

### Запуск production-версии

```bash
npm run start
```

### Next.js приложение

Для запуска экспериментальной версии на Next.js используйте:

```bash
npm run next:dev
```

Сборка и запуск в production:

```bash
npm run next:build
npm run next:start
```

## Структура проекта

- `client/` - Frontend часть приложения (React)
- `server/` - Backend API (Express)
- `shared/` - Общие типы и утилиты
- `docs/` - Документация проекта

## Разработка

Проект использует TypeScript для статической типизации. Запустите проверку типов с помощью:

```bash
npm run check
```

## Лицензия

MIT 