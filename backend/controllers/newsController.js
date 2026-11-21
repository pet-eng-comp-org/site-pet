const News = require("../models/News");
const File = require("../models/File");
const { newsValidation, recusa } = require("../utils/validation");
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
      if (req.file) deleteFile({ key: req.file.filename }, "news");
      return recusa(res, error);
    }

    if (!req.file)return res.status(400).send('"file" is required');

    const { originalname: name, size, filename: key } = req.file;
    const file = new File({ name, size, key });

    try {
      await file.save();
      const savedNew = await new News({
        title: req.body.title,
        file,
        text: req.body.text,
      }).save();
      return res.send({ new: savedNew._id });
    } catch (err) {
      deleteFile(file, "news");
      await File.deleteOne({ _id: file._id });
      throw err;
    }
  },

  async updateTexts(req, res) {
    const { error } = newsValidation(req.body);
    if (error) return recusa(res, error);

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
      throw err;
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
      throw err;
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
      throw err;
    }
  },
};
