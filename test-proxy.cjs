const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();
app.use('/', createProxyMiddleware({
  target: { socketPath: '/var/run/docker.sock' },
  changeOrigin: true
}));
app.listen(8082, () => { console.log('Listening'); process.exit(0); });
