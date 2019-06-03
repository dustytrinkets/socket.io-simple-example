const socket = require("socket.io-client").connect("http://localhost:8080");
const stdin = process.openStdin();

socket.on('connect', function() {
    socket.emit('space', 'Hello space!');
    }); 


socket.on('disconnect', function() {
    console.log('Socket server disconnect');
    return process.exit();   
}); 
    

socket.on("space", (msg) => console.log(msg));

stdin.addListener("data", function(d) {
    let msg = d.toString().trim();
    socket.emit('space', msg);
  });
