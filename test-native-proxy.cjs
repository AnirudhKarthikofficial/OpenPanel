const express = require('express');
const http = require('http');
const app = express();
app.use((req, res) => {
  const options = {
    socketPath: '/var/run/docker.sock',
    path: req.originalUrl,
    method: req.method,
    headers: req.headers
  };
  const clientReq = http.request(options, (clientRes) => {
    res.writeHead(clientRes.statusCode, clientRes.headers);
    clientRes.pipe(res);
  });
  clientReq.on('error', (err) => {
    console.error(err);
    res.status(500).send(err.message);
  });
  req.pipe(clientReq);
});
const server = app.listen(8094, () => console.log('Listening 8094'));
