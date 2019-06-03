const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const stdin = process.openStdin();

const users = [];

stdin.addListener("data", (d) => {
  let msg = d.toString().trim();
  io.emit('space', msg);
});

//on clients connection
io.on('connection', function (socket) {

  //sends to everyone but the new client
  socket.broadcast.emit('space', 'client ' + socket.id  + ' connected')

  //sends to the new client connected
  io.to(socket.id).emit('space', 'Welcome to the chat')
  
  users.push(socket.id);
  
  // io.of('/').clients((error, clients) => {
  //   if (error) throw error;
  //   if (clients) {console.log(`There are ${clients.length} clients connected`)}
  // });

  socket.on("space", (msg) => {
    console.log(socket.id + ': ' +msg)
    socket.broadcast.emit('space', socket.id + ': ' + msg) //emits to everyone but the client who sends the msg
    // io.emit('space', msg) //emits to everyone
  });

  socket.on('disconnect', function(){
    var idx = users.indexOf(socket.id);
    users.splice(idx, 1);
    socket.broadcast.emit('space', `${socket.id} client has disconnected`);
  });     
  
  
});

app.get('/clients', (req, res)=>{
    io.of('/').clients((error, clients) => {
        if (error) throw error;
        res.send(`there are ${clients.length} clients connected`)
      });
})

server.listen(8080);