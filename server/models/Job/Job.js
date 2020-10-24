const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  id: {
    type: Number,
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
  city: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: false
  },
  requirements: {
      type: String,
      required: false
  },
  qualifications: {
    type: String,
    required: false
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
