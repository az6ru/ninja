FROM node:20-alpine AS base

# Устанавливаем зависимости для sharp
RUN apk add --no-cache python3 make g++ vips-dev

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Запуск приложения
CMD ["npm", "start"]

# Порт, который будет прослушивать приложение
EXPOSE 3000 