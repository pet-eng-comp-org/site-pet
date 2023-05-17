const mongoose = require("mongoose");

const ComissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  tags: [
    {
      title: String,
      color: String,
      link: String,
      backgroundColor: String,
    },
  ],
});

module.exports = mongoose.model("Comission", ComissionSchema);
