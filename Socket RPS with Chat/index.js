const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

/**************************************************************
 * Code Implemented and altered from https://socket.io/docs/v4
 * This site served as a tutorial and walkthrough for the chat 
 * side implementation. Nicknames were added with altered output.
 * The RPS game was begun with the player against the comput for now. 
 * This is a js RPS but with little client/server interaction.
 **************************************************************/

var sockets = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    if (sockets[socket.id]) {
      userMsg = sockets[socket.id] + ": " + msg;
      io.emit('chat message', userMsg);
    }
    else {
      userMsg = "From client: " + socket.id + ": " + msg;
      io.emit('chat message', userMsg);
    }
  });

  socket.on('nickname', (nname) => {
    sockets[socket.id] = nname;
    io.emit('chat message', "Nickname changed to: "+ nname);
  });
});

var moves = 0;

function MoveMade(move) {
  cmove = Math.floor(Math.random() * 3);
  
  if (cmove == 0) {
    if (move == 'Rock') {
      result = "It's A Tie"
      tie += 1
    }
    else if (move == 'Paper') {
      result = "You Win!"
      won += 1
    }
    else {
      result = "You Lose :("
      lost += 1
    }
  }
  else if (cmove == 1) {
    if (move == 'Rock') {
      result = "You Lose :("
      lost += 1
    }
    else if (move == 'Paper') {
      result = "It's a Tie"
      tie += 1
    }
    else {
      result = "You Win!"
      won += 1
    }
  }
  else if (cmove == 2) {
    if (move == 'Rock') {
      result = "You Win!"
      won += 1
    }
    else if (move == 'Paper') {
      result = "You Lose :("
      lost += 1
    }
    else {
      result = "It's a Tie!"
      tie += 1
    }
  }
  else {
    result = "Try Again"
  }
  alert(result)
}


http.listen(port, () => {
  console.log(`Server is at http://localhost:${port}/`);
});
