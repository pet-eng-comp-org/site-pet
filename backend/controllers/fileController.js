const File = require("../models/File");
const path = require("path");
const fs = require("fs/promises");
const sharp = require("sharp");

// Larguras menores que o site pede para as fotos de projeto (srcset): no
// celular, a foto de 1600 px aparece com 343 px. Cada versão é feita na
// primeira vez que alguém pede e fica guardada ao lado do original; como a
// chave do arquivo muda quando a foto muda, a versão guardada nunca fica velha.
const larguras = [400, 800];

const versaoMenor = async (pasta, key, largura) => {
  const destino = path.resolve(`uploads/${pasta}/tamanhos/${largura}-${key}`);
  try {
    await fs.access(destino);
  } catch (err) {
    await fs.mkdir(path.dirname(destino), { recursive: true });
    const temporario = `${destino}.${process.pid}.tmp`;
    await sharp(path.resolve(`uploads/${pasta}/${key}`))
      .resize(largura, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(temporario);
    await fs.rename(temporario, destino);
  }
  return destino;
};

module.exports = {
  async index(req, res) {
    const files = await File.find();
    res.json({ files });
  },

  async show(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });
    res.json({ file });
  },

  async downloadDocument(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });

    const pathFile = path.resolve(`uploads/documents/${file.key}`);

    res.sendFile(pathFile);
  },

  async getImageNews(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });

    const pathFile = path.resolve(`uploads/news/${file.key}`);

    res.sendFile(pathFile);
  },

  async getProfilePhoto(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });

    const pathFile = path.resolve(`uploads/members/${file.key}`);

    res.sendFile(pathFile);
  },

  async getComissionPhoto(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });

    const largura = Number(req.query.largura);
    if (larguras.includes(largura) && file.width > largura) {
      try {
        return res.sendFile(await versaoMenor("comissions", file.key, largura));
      } catch (err) {
        console.log(`sem versão de ${largura} px para ${file.key}: ${err.message}`);
      }
    }

    const pathFile = path.resolve(`uploads/comissions/${file.key}`);

    res.sendFile(pathFile);
  },

  async destroy(req, res) {
    try {
      const removedFile = await File.deleteOne({
        _id: req.params.fileId,
      });
      res.json({ file: removedFile });
    } catch (err) {
      res.json({ message: err });
    }
  },
};
