var mongoose = require("mongoose");
var guideSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  dateRelease: Date
});

module.exports = mongoose.model("guide", guideSchema);
