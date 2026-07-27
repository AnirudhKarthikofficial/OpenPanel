const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/', createProxyMiddleware({
  target: { socketPath: './mock.sock' },
}));
app.listen(8095, () => console.log('Proxy listening 8095'));
