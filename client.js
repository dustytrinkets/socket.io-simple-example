const socket = require("socket.io-client").connect("http://localhost:8080");
const stdin = process.openStdin();

socket.on('connect_error', function(){
    try {
        socket.connect("http://localhost:8080");
    } catch (e) {
        console.log('Failed to establish a connection to the servers, or lost connection' + e);
        return process.exit();     
    }
});

socket.on("space", (msg) => console.info(msg));

stdin.addListener("data", function(d) {
    let msg = d.toString().trim();
    socket.emit('space', msg);
  });
