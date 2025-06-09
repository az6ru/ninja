#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[DEV]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Проверяем, что мы в корневой директории проекта
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    error "Скрипт должен запускаться из корневой директории проекта!"
    error "Убедитесь, что вы видите папки client/ и server/"
    exit 1
fi

# Проверяем наличие необходимых файлов
if [ ! -f "client/src/main.tsx" ] || [ ! -f "client/src/entry-server.tsx" ]; then
    error "Не найдены необходимые entry-файлы в client/src/"
    error "Убедитесь, что существуют файлы:"
    error "- client/src/main.tsx"
    error "- client/src/entry-server.tsx"
    exit 1
fi

# Функция очистки кэша
clean() {
    log "Очистка кэша и временных файлов..."
    rm -rf node_modules/.vite
    rm -rf client/.vite
    rm -rf dist
}

# Парсим аргументы
CLEAN=false
CONFIG="client/vite.config.ts"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --clean) CLEAN=true ;;
        --config) CONFIG="$2"; shift ;;
        *) error "Неизвестный параметр: $1"; exit 1 ;;
    esac
    shift
done

# Если указан флаг --clean, очищаем кэш
if [ "$CLEAN" = true ]; then
    clean
fi

# Устанавливаем переменные окружения
export NODE_ENV=development
export VITE_ROOT_DIR="$(pwd)"

# Запускаем сервер
log "Запуск сервера разработки..."
log "Корневая директория: $VITE_ROOT_DIR"
log "Режим: $NODE_ENV"
log "Конфиг: $CONFIG"

# Запуск сервера
tsx server/index.ts --config "$CONFIG" 