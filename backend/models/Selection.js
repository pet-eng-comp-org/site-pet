const mongoose = require("mongoose");
const selectionSchema = new mongoose.Schema({
  phases: [
    {
      date: {
        type: Date,
        required: true,
      },
      hour: {
        type: String,
        required: true,
      },
      local: {
        type: String,
        required: true,
      },
    },
  ],
  inscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inscriptions",
    },
  ],
  dateBegin: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Selection", selectionSchema);
