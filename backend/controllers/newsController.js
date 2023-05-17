const News = require("../models/News");
const File = require("../models/File");
const { newsValidation } = require("../utils/validation");
const { deleteFile } = require("../utils/functions");

module.exports = {
  
  async index(req, res) {
    const news = await News.find().populate("file");
    return res.json({ news });
  },

  async show(req, res) {
    const news = await News.findOne({ _id: req.params.id }).populate("file");
    return res.json({ new: news });
  },

  async store(req, res) {
    console.log(req.body);
    
    const { error } = newsValidation(req.body);
    if (error) {
      const f = { key: req.file.filename};
      deleteFile(f, "news");
      return res.status(400).send(error.details[0].message);
    }

    if (!req.file)return res.status(400).send('"file" is required');

    const { originalname: name, size, filename: key } = req.file;
    const file = new File({ name, size, key });

    try {
      const savedFile = await file.save();
      const news = new News({
        title: req.body.title,
        file: savedFile,
        text: req.body.text,
      });
      try {
        const savedNew = await news.save();
        return res.send({ new: savedNew._id });
      } catch (err) {

        const f = { key: req.file.filename };
        deleteFile(f, "news");

        await File.deleteOne({ _id: savedFile._id });

        return res.status(400).send(err);
      }
    } catch (err) {
      const f = { key: req.file.filename };
      deleteFile(f, "news");
      return res.status(400).send(err);
    }
  },

  async updateTexts(req, res) {
    const { error } = newsValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const updatedNew = await News.updateOne(
        { _id: req.params.id },
        {
          title: req.body.title,
          text: req.body.text,
        }
      );
      return res.status(200).send({ new: updatedNew });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  async updateImage(req, res) {

    if (!req.file) return res.status(400).send('"file" is required');
    const { originalname: name, size, filename: key } = req.file;
    const n = await News.findOne({ _id: req.params.id }).populate("file");

    try {
      const updatedNew = await File.updateOne(
        { _id: n.file.id },
        { name, size, key }
      );
      deleteFile(n.file, "news");

      return res.status(200).send({ new: updatedNew });
    } catch (err) {
      const f = { key };
      deleteFile(f, "news");
      return res.status(500).send(err);
    }
  },

  async destroy(req, res) {
    //delete file from server
    const n = await News.findOne({
      _id: req.params.id,
    }).populate("file");
    deleteFile(n.file, "news");

    //delete file from db
    try {
      await File.deleteOne({ _id: n.file._id });
    } catch (err) {
      console.log(err);
    }

    try {
      const removedNew = await News.deleteOne({ _id: req.params.id });
      return res.json({
        new: removedNew,
      });
    } catch (err) {
      return res.json({ message: err });
    }
  },
};
