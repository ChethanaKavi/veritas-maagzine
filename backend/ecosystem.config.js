module.exports = {
  apps: [
    {
      name: 'veritas-backend',
      script: 'dist/index.js',
      cwd: '/var/www/veritas/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      // Restart if crashes
      restart_delay: 3000,
      max_restarts: 10,
      // Keep logs
      out_file: '/var/log/veritas/backend-out.log',
      error_file: '/var/log/veritas/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
