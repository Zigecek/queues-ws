const { Server } = require("socket.io");
require("dotenv").config();
const Queue = require("./Models/Queue");
const mongoose = require("mongoose");

const io = new Server(6332);

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);

  socket.emit("message", "Hello there from the server");

  socket.on("create_queue", (data) => {
    console.log(data);
    const json = JSON.parse(data);
    const { device_id, name } = json;
    const code = Math.floor(Date.now() * Math.random()).toString();

    socket.emit("queue_created", code);

    const queue = new Queue({
      _id: mongoose.Types.ObjectId(),
      code,
      name,
      device_id,
      members: [],
    });
  });

  socket.on("recognize", async (data) => {
    console.log(data);
    const json = JSON.parse(data);
    const { device_id } = json;

    const owned = await Queue.findOne({ device_id: device_id, state: "RUNNING" });
    const memberOf = await Queue.findOne({ "members.device_id": device_id, state: "RUNNING" });

    if (owned) {
      socket.emit("direction", "host");
    } else if (memberOf) {
      socket.emit("direction", "member");
    }
  });

  socket.on("join", async (data) => {
    const json = JSON.parse(data);
    const { device_id, code } = json;

    const queue = await Queue.findOne({ code: code, state: "RUNNING" });
    if (queue.members.includes(device_id)) {
      socket.emit("direction", "member");
    } else {
      queue.members.push({ device_id, created_at: Date.now() });
      queue.save();
      socket.emit("direction", "member");
    }
    io.emit("queue_updated", queue);
  });

  socket.on("getMemberOf", async (device_id) => {
    const memberOf = await Queue.findOne({ "members.device_id": device_id, state: "RUNNING" });
    socket.emit("memberOf", memberOf);
  });
});
