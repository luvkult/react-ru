# Подробная инструкция: Деплой через Git

## Часть 1: Подготовка и загрузка на Git

### Шаг 1: Проверка текущего состояния

```bash
# Проверить статус Git репозитория
git status

# Если репозиторий не инициализирован, выполните:
git init
```

### Шаг 2: Добавление файлов в Git

```bash
# Добавить все файлы (кроме тех, что в .gitignore)
git add .

# Проверить, что будет закоммичено
git status
```

### Шаг 3: Создание первого коммита (если нужно)

```bash
# Создать коммит с описанием
git commit -m "Подготовка проекта к деплою на Linux сервер"

# Если это первый коммит, может потребоваться настройка:
git config user.name "Ваше Имя"
git config user.email "your.email@example.com"
```

### Шаг 4: Создание репозитория на GitHub/GitLab/Bitbucket

1. **GitHub:**
   - Зайдите на https://github.com
   - Нажмите "New repository"
   - Назовите репозиторий (например: `react-dev`)
   - НЕ добавляйте README, .gitignore или лицензию (они уже есть)
   - Нажмите "Create repository"

2. **GitLab:**
   - Зайдите на https://gitlab.com
   - Создайте новый проект
   - Выберите "Create blank project"

3. **Bitbucket:**
   - Зайдите на https://bitbucket.org
   - Создайте новый репозиторий

### Шаг 5: Подключение к удаленному репозиторию

```bash
# Добавить remote (замените URL на ваш)
# Для GitHub:
git remote add origin https://github.com/ваш-username/react-dev.git

# Или через SSH (если настроен ключ):
# git remote add origin git@github.com:ваш-username/react-dev.git

# Проверить, что remote добавлен
git remote -v
```

### Шаг 6: Загрузка кода на Git

```bash
# Загрузить код в репозиторий
git push -u origin main

# Если ваша ветка называется master:
# git push -u origin master

# Если возникнет ошибка, возможно нужно переименовать ветку:
# git branch -M main
# git push -u origin main
```

### Шаг 7: Проверка на GitHub

- Откройте ваш репозиторий в браузере
- Убедитесь, что все файлы загружены
- Проверьте, что файлы `.env`, `node_modules`, `out/` НЕ загружены (они в .gitignore)

---

## Часть 2: Настройка удаленного сервера

### Шаг 1: Подключение к серверу

```bash
# Подключиться к серверу по SSH
ssh user@your-server-ip

# Например:
# ssh root@192.168.1.100
# или
# ssh deploy@example.com
```

### Шаг 2: Установка необходимого ПО

```bash
# Обновить систему (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установить Git (если не установлен)
sudo apt install git -y

# Установить Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверить версии
node -v  # Должно быть >= 16.8.0
npm -v
git --version
```

### Шаг 3: Установка PM2 (рекомендуется)

```bash
# Установить PM2 глобально
sudo npm install -g pm2

# Проверить установку
pm2 --version
```

### Шаг 4: Создание директории для проекта

```bash
# Создать директорию (выберите подходящую)
sudo mkdir -p /var/www/react-dev

# Или в домашней директории пользователя:
mkdir -p ~/projects/react-dev

# Установить права (замените user на ваше имя пользователя)
sudo chown -R $USER:$USER /var/www/react-dev
# или
sudo chown -R $USER:$USER ~/projects/react-dev
```

---

## Часть 3: Клонирование и настройка проекта

### Шаг 1: Клонирование репозитория

```bash
# Перейти в директорию проектов
cd /var/www  # или cd ~/projects

# Клонировать репозиторий
git clone https://github.com/ваш-username/react-dev.git react-dev

# Или через SSH (если настроен):
# git clone git@github.com:ваш-username/react-dev.git react-dev

# Перейти в директорию проекта
cd react-dev
```

### Шаг 2: Настройка переменных окружения

```bash
# Создать файл .env (если нужен)
nano .env

# Добавить переменные (например):
# PORT=8000
# NODE_ENV=production

# Сохранить: Ctrl+O, Enter, Ctrl+X
```

### Шаг 3: Установка зависимостей

```bash
# Установить все зависимости
npm install --legacy-peer-deps

# Это может занять несколько минут
```

### Шаг 4: Сборка проекта

```bash
# Собрать проект
npm run build

# Дождаться завершения сборки
# Проверить, что создалась директория out/
ls -la out/
```

---

## Часть 4: Запуск приложения

### Вариант A: Запуск через PM2 (рекомендуется)

```bash
# Создать директорию для логов
mkdir -p logs

# Запустить приложение
pm2 start ecosystem.config.js

# Проверить статус
pm2 status

# Посмотреть логи
pm2 logs react-dev

# Сохранить конфигурацию для автозапуска
pm2 save

# Настроить автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую выведет pm2 startup (обычно с sudo)
```

### Вариант B: Запуск через systemd

```bash
# Отредактировать файл сервиса (изменить пути)
nano react-dev.service

# Изменить пути в файле:
# WorkingDirectory=/var/www/react-dev
# ExecStart=/usr/bin/node /var/www/react-dev/server.js

# Скопировать файл сервиса
sudo cp react-dev.service /etc/systemd/system/

# Обновить конфигурацию systemd
sudo systemctl daemon-reload

# Включить автозапуск
sudo systemctl enable react-dev

# Запустить сервис
sudo systemctl start react-dev

# Проверить статус
sudo systemctl status react-dev

# Посмотреть логи
sudo journalctl -u react-dev -f
```

### Вариант C: Простой запуск (для тестирования)

```bash
# Запустить напрямую
npm start

# Или с указанием порта
PORT=8000 node server.js

# Для запуска в фоне:
nohup npm start > server.log 2>&1 &
```

---

## Часть 5: Проверка работы

### Шаг 1: Проверка на сервере

```bash
# Проверить, что сервер отвечает
curl http://localhost:8000

# Или проверить конкретную страницу
curl http://localhost:8000/learn/
```

### Шаг 2: Проверка извне

```bash
# Если порт открыт в firewall, проверить с другого компьютера:
curl http://your-server-ip:8000

# Или откройте в браузере:
# http://your-server-ip:8000
```

### Шаг 3: Настройка firewall (если нужно)

```bash
# Разрешить порт 8000
sudo ufw allow 8000/tcp

# Или для конкретного IP:
# sudo ufw allow from 192.168.1.0/24 to any port 8000

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

---

## Часть 6: Обновление приложения (когда нужно)

### Шаг 1: На локальной машине (ваш компьютер)

```bash
# Внести изменения в код
# ...

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Загрузить на Git
git push origin main
```

### Шаг 2: На удаленном сервере

```bash
# Подключиться к серверу
ssh user@your-server-ip

# Перейти в директорию проекта
cd /var/www/react-dev

# Остановить приложение
pm2 stop react-dev
# или
# sudo systemctl stop react-dev

# Получить последние изменения
git pull origin main

# Переустановить зависимости (если изменились)
npm install --legacy-peer-deps

# Пересобрать проект
npm run build

# Запустить снова
pm2 restart react-dev
# или
# sudo systemctl start react-dev

# Проверить логи
pm2 logs react-dev
# или
# sudo journalctl -u react-dev -f
```

---

## Полезные команды для работы

### Git команды

```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log --oneline

# Отменить изменения (если что-то пошло не так)
git reset --hard HEAD

# Посмотреть различия
git diff
```

### PM2 команды

```bash
# Список процессов
pm2 list

# Перезапуск
pm2 restart react-dev

# Остановка
pm2 stop react-dev

# Удаление
pm2 delete react-dev

# Мониторинг
pm2 monit

# Очистка логов
pm2 flush
```

### Systemd команды

```bash
# Статус
sudo systemctl status react-dev

# Перезапуск
sudo systemctl restart react-dev

# Остановка
sudo systemctl stop react-dev

# Логи
sudo journalctl -u react-dev -n 50 -f
```

---

## Устранение проблем

### Проблема: "Permission denied" при git push

```bash
# Настроить SSH ключ или использовать HTTPS с токеном
# Для GitHub: Settings -> Developer settings -> Personal access tokens
```

### Проблема: Порт занят

```bash
# Найти процесс
sudo lsof -i :8000

# Убить процесс
sudo kill -9 <PID>
```

### Проблема: Ошибки при сборке

```bash
# Очистить и пересобрать
rm -rf .next out node_modules
npm install --legacy-peer-deps
npm run build
```

### Проблема: PM2 не запускается после перезагрузки

```bash
# Повторно настроить автозапуск
pm2 save
pm2 startup
# Выполнить команду, которую выведет pm2
```

---

## Безопасность

1. **Не коммитьте секреты:**
   - `.env` файлы уже в .gitignore
   - Не добавляйте пароли, API ключи в код

2. **Настройте SSH ключи:**
   ```bash
   # На локальной машине
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Скопировать публичный ключ на сервер
   ssh-copy-id user@your-server-ip
   ```

3. **Используйте firewall:**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 8000/tcp
   sudo ufw enable
   ```

---

Готово! Теперь у вас есть полная инструкция для деплоя через Git.

