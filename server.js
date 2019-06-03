const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const stdin = process.openStdin();

//listener for the console inputs

//on clients connection
io.on('connection', function (socket) {
        console.log('A client is connected!');
        io.of('/').clients((error, clients) => {
          if (error) throw error;
          console.log(`there are ${clients.length} clients connected`)
        });

        socket.on('disconnect', function(test){
          console.log('A client disconnected');
        });      
        socket.on("space", (msg) => console.info(msg));
        stdin.addListener("data", function(d) {
          let msg = d.toString().trim();
          socket.emit('space', msg);
        });

});

app.get('/clients', (req, res)=>{
    io.of('/').clients((error, clients) => {
        if (error) throw error;
        res.send(`there are ${clients.length} clients connected`)
      });
})







server.listen(8080);