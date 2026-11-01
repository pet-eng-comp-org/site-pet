const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  // Medidas da imagem, para o site reservar o espaço certo antes de ela chegar.
  width: Number,
  height: Number,
  // O que a foto mostra, para quem não a vê (leitor de tela).
  alt: { type: String, maxlength: 300 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
