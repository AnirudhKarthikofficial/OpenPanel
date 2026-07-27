const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: { socketPath: '/var/run/docker.sock' }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.listen(8092, () => console.log('Listening 8092'));
