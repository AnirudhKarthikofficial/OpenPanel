const net = require('net');
const fs = require('fs');

const socketPath = './mock.sock';
if (fs.existsSync(socketPath)) fs.unlinkSync(socketPath);

const server = net.createServer((c) => {
  c.on('data', (d) => {
    console.log("Mock received:", d.toString());
    c.write("HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK");
  });
});
server.listen(socketPath, () => console.log("Mock socket listening"));
