const { Server } = require("socket.io");
require("dotenv").config();
const Queue = require("./Models/Queue");

const io = new Server(6332);

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);

  socket.emit("message", "Hello there from the server");

  socket.on("create_queue", (data) => {
    console.log(data);
    const json = JSON.parse(data);
    const { device_id, name } = json;
    const code = (Date.now() + Math.random()).toString();

    socket.emit("queue_created", code);

    const queue = new Queue({
      _id: mongoose.Types.ObjectId(),
      code,
      name,
      device_id,
      members: [],
    });
  });
});
