// PM2 конфигурация для управления процессом
// Использование: pm2 start ecosystem.config.js

module.exports = {
  apps: [{
    name: 'react-dev',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Автоматический перезапуск при изменении файлов (только для разработки)
    // watch: ['out'],
    // ignore_watch: ['node_modules', 'logs']
  }]
};

