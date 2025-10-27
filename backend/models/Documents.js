const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

module.exports = mongoose.model("Documents", documentsSchema);
