const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  positionName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
      type: String,
      required: true,
      unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Jobs = mongoose.model("Job", JobSchema);
