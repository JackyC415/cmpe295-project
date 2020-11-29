const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParserSchema = new Schema({
  filename: {
    type: String,
  },
  links: {
    type: String,
  },
  contents: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Parser = mongoose.model("Parser", ParserSchema);
