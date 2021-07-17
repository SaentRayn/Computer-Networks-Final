/************************************************************
* This example code was used from https://javascript.info/websocket
* and is not my sole work. A greater portion of this was used 
* to show WebSocket and attempt at a server/client js education before 
* Socket.io was used.
*************************************************************/

const http = require('http');
const fs = require('fs');
const ws = new require('ws');

const wss = new ws.Server({noServer: true});

const clients = new Set();

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else if (req.url == '/') { // index.html
    fs.createReadStream('./ws_chat/index.html').pipe(res);
  } else { // page not found
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  log(`new connection`);

  ws.on('message', function(message) {
    log(`message received: ${message}`);

    message = message.slice(0, 50); // max message length will be 50

    for(let client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function() {
    log(`connection closed`);
    clients.delete(ws);
  });
}

let log;
if (!module.parent) {
  log = console.log;
  http.createServer(accept).listen(8080);
} else {
  // to embed into javascript.info
  log = function() {};
  // log = console.log;
  exports.accept = accept;
}