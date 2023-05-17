const mongoose = require("mongoose");
const newsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);
