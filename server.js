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
  socket.broadcast.emit('space', 'New user connected')
  
  users.push(socket.id);
  console.log(`Clients ids: ${users}`)
  
  io.of('/').clients((error, clients) => {
    if (error) throw error;
    if (clients) {console.log(`There are ${clients.length} clients connected`)}
  });

  socket.on('disconnect', function(){
    var idx = users.indexOf(socket.id);
    users.splice(idx, 1);
    io.emit('space', 'A client has disconnected');
    
  });     
  
  socket.on("space", (msg) => {
    socket.broadcast.emit('space', msg) //emits to everyone but the client who sends the msg
    // io.emit('space', msg) //emits to everyone
  });

});

app.get('/clients', (req, res)=>{
    io.of('/').clients((error, clients) => {
        if (error) throw error;
        res.send(`there are ${clients.length} clients connected`)
      });
})

server.listen(8080);