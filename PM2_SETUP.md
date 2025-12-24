# Настройка PM2 для автозапуска

## Вариант 1: Через ecosystem.config.js (рекомендуется)

```bash
# 1. Перейти в директорию проекта
cd /var/www/react-ru

# 2. Создать директорию для логов
mkdir -p logs

# 3. Запустить приложение
pm2 start ecosystem.config.js

# 4. Проверить статус
pm2 status

# 5. Сохранить текущий список процессов
pm2 save

# 6. Настроить автозапуск при перезагрузке системы
pm2 startup

# 7. Выполнить команду, которую выведет pm2 startup
# Обычно это что-то вроде:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u your_user --hp /home/your_user
```

## Вариант 2: Через прямую команду npm

```bash
# 1. Перейти в директорию проекта
cd /var/www/react-ru

# 2. Запустить приложение
pm2 start npm --name "react-dev" -- start

# 3. Или с указанием порта через переменную окружения
PORT=8000 pm2 start npm --name "react-dev" -- start

# 4. Сохранить список процессов
pm2 save

# 5. Настроить автозапуск
pm2 startup
# Выполните команду, которую выведет pm2
```

## Полезные команды PM2

```bash
# Просмотр статуса всех процессов
pm2 status

# Просмотр логов
pm2 logs react-dev

# Просмотр логов в реальном времени
pm2 logs react-dev --lines 50

# Перезапуск приложения
pm2 restart react-dev

# Остановка приложения
pm2 stop react-dev

# Удаление из PM2
pm2 delete react-dev

# Мониторинг (CPU, память)
pm2 monit

# Просмотр информации о процессе
pm2 show react-dev

# Очистка логов
pm2 flush

# Перезагрузка всех процессов
pm2 reload all

# Сохранить текущую конфигурацию
pm2 save
```

## Проверка автозапуска

```bash
# Перезагрузить сервер и проверить, что приложение запустилось автоматически
sudo reboot

# После перезагрузки проверить статус
pm2 status
```

## Обновление приложения

```bash
# 1. Остановить приложение
pm2 stop react-dev

# 2. Обновить код
git pull origin main

# 3. Переустановить зависимости (если нужно)
npm install --legacy-peer-deps

# 4. Пересобрать проект
npm run build

# 5. Запустить снова
pm2 restart react-dev

# 6. Проверить логи
pm2 logs react-dev
```

## Устранение проблем

### Если автозапуск не работает:

```bash
# Удалить старую конфигурацию автозапуска
pm2 unstartup

# Настроить заново
pm2 startup
# Выполнить команду, которую выведет pm2
```

### Если нужно изменить имя процесса:

```bash
# Удалить старый процесс
pm2 delete react-dev

# Запустить с новым именем
pm2 start ecosystem.config.js
# или
pm2 start npm --name "новое-имя" -- start

# Сохранить
pm2 save
```

