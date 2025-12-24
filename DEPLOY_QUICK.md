# Быстрый деплой на Linux сервер

## Минимальные шаги

```bash
# 1. На сервере: установить Node.js (если нет)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Загрузить проект на сервер (через git/scp/rsync)
# scp -r ./react user@server:/var/www/react-dev

# 3. На сервере: установить зависимости и собрать
cd /var/www/react-dev
npm install --legacy-peer-deps
npm run build

# 4. Запустить (выберите один вариант)

# Вариант A: PM2 (рекомендуется)
sudo npm install -g pm2
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Вариант B: systemd
sudo cp react-dev.service /etc/systemd/system/
sudo nano /etc/systemd/system/react-dev.service  # отредактировать пути
sudo systemctl daemon-reload
sudo systemctl enable react-dev
sudo systemctl start react-dev

# Вариант C: Простой запуск
npm start
```

## Проверка

```bash
curl http://localhost:8000
```

## Обновление

```bash
# PM2
pm2 stop react-dev
git pull  # или загрузить новые файлы
npm install --legacy-peer-deps
npm run build
pm2 restart react-dev

# systemd
sudo systemctl stop react-dev
# ... обновить код ...
npm install --legacy-peer-deps
npm run build
sudo systemctl start react-dev
```

Подробная инструкция: см. [DEPLOY.md](./DEPLOY.md)

