const { Server } = require("socket.io");

const io = new Server(6332);

io.set('transports', ['websocket']);

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);

  socket.emit("message", "Hello there from the server");

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});
