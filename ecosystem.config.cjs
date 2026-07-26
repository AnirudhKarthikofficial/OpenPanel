module.exports = {
  apps: [
    {
      name: "jtg-panel",
      script: "./dist/server.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 6767
      }
    }
  ]
};
