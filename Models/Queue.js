const mongoose = require("mongoose");

const queueSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  code: String,
  name: String,
  device_id: String,
  state: {
    type: String,
    default: "RUNNING",
  },
  members: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Queue", queueSchema, "queues");
