const File = require("../models/File");
const path = require("path");

module.exports = {
  async index(req, res) {
    const files = await File.find();
    res.json({ files });
  },

  async show(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });
    res.json({ file });
  },

  async downloadInscription(req, res) {
    const file = await File.findOne({ _id: req.params.fileId });

    const pathFile = path.resolve(`uploads/inscriptions/${file.key}`);
    res.sendFile(pathFile);
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
