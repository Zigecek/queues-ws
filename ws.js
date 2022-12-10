import { Server } from "socket.io";

const io = new Server(6332);

io.on("connection", (socket) => {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});
