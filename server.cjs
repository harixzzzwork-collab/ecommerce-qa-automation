const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const pagePath = path.join(__dirname, 'app', 'index.html');

const server = http.createServer((request, response) => {
  if (request.url !== '/' && request.url !== '/index.html') {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  fs.readFile(pagePath, (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end('Unable to load the store');
      return;
    }

    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    response.end(content);
  });
});

server.listen(3000, '127.0.0.1', () => {
  console.log('QA Demo Shop: http://127.0.0.1:3000');
});