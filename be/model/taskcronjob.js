var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
  loggerID: {
    type: String,
    required: true,
  },
  type_task: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  start_time: {
    type: Number,
    required: false,
  },
  end_time: {
    type: Number,
    required: false,
  },
  created_at: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Taskcronjob", taskSchema);
