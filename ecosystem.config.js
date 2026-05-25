// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "bpsdm-kaltim",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/bpsdm",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      error_file: "/var/log/pm2/bpsdm-error.log",
      out_file: "/var/log/pm2/bpsdm-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
