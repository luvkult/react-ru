# Обновление Node.js на Linux сервере

## Проблема
На сервере установлен Node.js 18.19.1, а некоторые пакеты требуют Node.js >= 20.

## Решение: Обновление Node.js до версии 20

### Вариант 1: Использование NodeSource (рекомендуется)

```bash
# 1. Очистить старую версию (опционально)
sudo apt remove nodejs npm -y

# 2. Добавить репозиторий NodeSource для Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 3. Установить Node.js 20
sudo apt install -y nodejs

# 4. Проверить версию
node -v  # Должно быть v20.x.x
npm -v
```

### Вариант 2: Использование NVM (Node Version Manager)

```bash
# 1. Установить NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Перезагрузить shell или выполнить:
source ~/.bashrc

# 3. Установить Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 4. Проверить версию
node -v
npm -v
```

### Вариант 3: Использование n (Node.js version manager)

```bash
# 1. Установить n
sudo npm install -g n

# 2. Установить Node.js 20
sudo n 20

# 3. Проверить версию
node -v
```

## После обновления Node.js

```bash
# 1. Перейти в директорию проекта
cd /var/www/react-ru

# 2. Очистить старые зависимости
sudo rm -rf node_modules package-lock.json .next

# 3. Переустановить зависимости
sudo npm install --legacy-peer-deps

# 4. Пересобрать проект
sudo npm run build
```

## Проверка версии Node.js

```bash
node -v
npm -v
```

## Если нужно сохранить несколько версий Node.js

Используйте NVM (Вариант 2) - он позволяет переключаться между версиями.

