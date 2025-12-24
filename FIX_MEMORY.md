# Решение проблемы нехватки памяти при установке зависимостей

## Проблема
Процесс `npm install` был убит (Killed) из-за нехватки памяти на сервере.

## Решения

### Вариант 1: Увеличить swap (рекомендуется)

```bash
# 1. Проверить текущий swap
free -h

# 2. Создать swap файл (4GB)
sudo fallocate -l 4G /swapfile
# или если fallocate не работает:
# sudo dd if=/dev/zero of=/swapfile bs=1M count=4096

# 3. Установить права
sudo chmod 600 /swapfile

# 4. Создать swap
sudo mkswap /swapfile

# 5. Активировать swap
sudo swapon /swapfile

# 6. Сделать постоянным (добавить в /etc/fstab)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 7. Проверить
free -h
```

### Вариант 2: Установить только production зависимости (если не нужны dev)

```bash
# Установить только production зависимости
sudo npm install --legacy-peer-deps --production=false --no-optional

# Или установить по частям
sudo npm install --legacy-peer-deps --ignore-scripts
sudo npm install --legacy-peer-deps
```

### Вариант 3: Установить с ограничением памяти для Node.js

```bash
# Установить с ограничением памяти
NODE_OPTIONS="--max-old-space-size=2048" sudo npm install --legacy-peer-deps
```

### Вариант 4: Установить зависимости по частям

```bash
# 1. Сначала основные зависимости
sudo npm install --legacy-peer-deps react react-dom next

# 2. Затем остальные
sudo npm install --legacy-peer-deps
```

## После решения проблемы памяти

```bash
# 1. Проверить, что зависимости установлены
ls node_modules/.bin/next

# 2. Если next не найден, переустановить
sudo npm install --legacy-peer-deps

# 3. Собрать проект
sudo npm run build
```

