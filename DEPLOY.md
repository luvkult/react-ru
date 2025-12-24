# Инструкция по деплою на Linux сервер

Это руководство поможет вам развернуть проект на удаленном Linux сервере.

## Требования

- Linux сервер (Ubuntu/Debian/CentOS)
- Node.js >= 16.8.0
- npm >= 7.0.0
- Git (для клонирования репозитория)

## Вариант 1: Быстрый деплой (ручной запуск)

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js (если не установлен)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версий
node -v
npm -v
```

### 2. Клонирование и установка

```bash
# Переход в директорию для проектов
cd /var/www  # или другую директорию

# Клонирование репозитория (или загрузка файлов)
# git clone <your-repo-url> react-dev
# cd react-dev

# Или загрузка через scp/rsync
# scp -r ./react user@server:/var/www/react-dev

# Установка зависимостей
npm install --legacy-peer-deps

# Сборка проекта
npm run build
```

### 3. Запуск сервера

```bash
# Простой запуск
npm start

# Или с указанием порта
PORT=8000 node server.js

# Запуск в фоне с nohup
nohup npm start > server.log 2>&1 &
```

## Вариант 2: Деплой с использованием скрипта

```bash
# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запустить деплой
./deploy.sh

# После успешной сборки запустить сервер
npm start
```

## Вариант 3: Использование PM2 (рекомендуется)

PM2 - это менеджер процессов для Node.js приложений.

### Установка PM2

```bash
sudo npm install -g pm2
```

### Настройка и запуск

```bash
# Создать директорию для логов
mkdir -p logs

# Запустить приложение
pm2 start ecosystem.config.js

# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs react-dev

# Сохранить конфигурацию для автозапуска
pm2 save
pm2 startup
```

### Полезные команды PM2

```bash
# Перезапуск
pm2 restart react-dev

# Остановка
pm2 stop react-dev

# Удаление из PM2
pm2 delete react-dev

# Мониторинг
pm2 monit
```

## Вариант 4: Использование systemd (для production)

### 1. Настройка systemd сервиса

```bash
# Скопировать файл сервиса
sudo cp react-dev.service /etc/systemd/system/

# Отредактировать пути в файле (если нужно)
sudo nano /etc/systemd/system/react-dev.service

# Обновить конфигурацию systemd
sudo systemctl daemon-reload
```

### 2. Управление сервисом

```bash
# Запуск
sudo systemctl start react-dev

# Включение автозапуска
sudo systemctl enable react-dev

# Проверка статуса
sudo systemctl status react-dev

# Просмотр логов
sudo journalctl -u react-dev -f

# Перезапуск
sudo systemctl restart react-dev

# Остановка
sudo systemctl stop react-dev
```

### 3. Настройка прав доступа

```bash
# Установить владельца директории
sudo chown -R www-data:www-data /var/www/react-dev

# Установить права
sudo chmod -R 755 /var/www/react-dev
```

## Настройка Nginx (опционально, для reverse proxy)

Если вы хотите использовать Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Настройка переменных окружения

```bash
# Создать файл .env из примера
cp .env.example .env

# Отредактировать переменные
nano .env
```

## Проверка работы

После запуска сервера проверьте:

1. Локально на сервере:
   ```bash
   curl http://localhost:8000
   ```

2. Извне (если порт открыт):
   ```bash
   curl http://your-server-ip:8000
   ```

## Обновление приложения

```bash
# Остановить сервер (PM2)
pm2 stop react-dev

# Или (systemd)
sudo systemctl stop react-dev

# Обновить код
git pull  # или загрузить новые файлы

# Переустановить зависимости (если нужно)
npm install --legacy-peer-deps

# Пересобрать
npm run build

# Запустить снова
pm2 restart react-dev
# или
sudo systemctl start react-dev
```

## Устранение проблем

### Проблема: Порт занят

```bash
# Найти процесс, использующий порт
sudo lsof -i :8000

# Убить процесс
sudo kill -9 <PID>
```

### Проблема: Права доступа

```bash
# Проверить права
ls -la /var/www/react-dev

# Исправить права
sudo chown -R $USER:$USER /var/www/react-dev
```

### Проблема: Ошибки сборки

```bash
# Очистить кэш
rm -rf .next out node_modules

# Переустановить зависимости
npm install --legacy-peer-deps

# Пересобрать
npm run build
```

## Безопасность

1. **Firewall**: Настройте firewall для ограничения доступа
   ```bash
   sudo ufw allow 8000/tcp
   sudo ufw enable
   ```

2. **SSL/TLS**: Используйте Let's Encrypt для HTTPS через Nginx

3. **Обновления**: Регулярно обновляйте зависимости
   ```bash
   npm audit
   npm audit fix
   ```

## Мониторинг

- **PM2**: `pm2 monit` для мониторинга ресурсов
- **Логи**: Проверяйте логи регулярно
- **Метрики**: Настройте мониторинг (например, через PM2 Plus)

## Поддержка

При возникновении проблем проверьте:
- Логи приложения
- Логи systemd: `sudo journalctl -u react-dev`
- Логи PM2: `pm2 logs react-dev`
- Статус процесса: `pm2 status` или `sudo systemctl status react-dev`

