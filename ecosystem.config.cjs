module.exports = {
  apps: [
    {
      name: "infimum-consulting",
      cwd: __dirname,

      script: "./node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 6003",
      interpreter: "node",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,

      max_memory_restart: "512M",
      min_uptime: "10s",
      max_restarts: 10,

      time: true,

      env: {
        NODE_ENV: "production",
        PORT: "6003",
      },
    },
  ],
};
