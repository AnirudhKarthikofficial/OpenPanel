module.exports = {
  apps: [
    {
      name: "jtg-dev-panel",
      script: "npm",
      args: "run dev",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        VITE_ENABLE_DEVELOPER_PANEL: "true"
      }
    }
  ]
};
