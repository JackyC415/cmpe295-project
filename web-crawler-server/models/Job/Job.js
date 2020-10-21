const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  company: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  zipcode: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
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