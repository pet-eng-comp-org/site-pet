const mongoose = require("mongoose");

// As inscrições são feitas no Google Forms; a seleção só diz ao site quando
// mostrar o botão de inscrição e para onde ele leva.
const selectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateBegin: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  formLink: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Selection", selectionSchema);
