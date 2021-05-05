const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  source: {
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

module.exports = Jobs = mongoose.model("jobs", JobSchema);
