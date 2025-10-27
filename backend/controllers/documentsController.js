const Documents = require("../models/Documents");
const File = require("../models/File");
const { deleteFile } = require("../utils/functions");
const { documentsValidation } = require("../utils/validation");

module.exports = {
  async index(req, res) {
    const documents = await Documents.find().populate("files");
    return res.json({ documents });
  },

  async show(req, res) {
    const document = await Documents.findOne({ _id: req.params.id }).populate(
      "files"
    );
    return res.json({ document });
  },

  async store(req, res) {
    const { error } = documentsValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const document = new Documents({
      title: req.body.title,
    });

    try {
      const savedDocument = await document.save();
      return res.send({ document: savedDocument._id });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async addFile(req, res) {
    if (!req.file) return res.status(400).send('"file" is required');

    const { originalname: name, size, filename: key } = req.file;
    const file = new File({
      name,
      size,
      key,
    });

    try {
      const savedFile = await file.save();

      try {
        const updatedDocument = await Documents.updateOne(
          { _id: req.params.id },
          { $push: { files: savedFile } }
        ).populate("files");

        return res.json({ updatedDocument });
      } catch (err) {
        deleteFile(file, "documents");
        await File.deleteOne({ _id: savedFile._id });
        return res.status(400).send(err);
      }
    } catch (err) {
      deleteFile(file, "documents");
      return res.status(400).send(err);
    }
  },

  async removeFile(req, res) {
    const file = await File.findOne({ _id: req.body.idFile });

    if (file) {
      deleteFile(file, "documents");

      try {
        await File.deleteOne({ _id: req.body.idFile });

        try {
          const updatedDocument = await Documents.updateOne(
            { _id: req.params.id },
            { $pull: { files: req.body.idFile } }
          ).populate("files");

          return res.json({ updatedDocument });
        } catch (err) {
          return res.status(400).send(err);
        }
      } catch (err) {
        return res.status(400).send(err);
      }
    } else {
      return res.status(404).send("file not found in db.");
    }
  },

  async update(req, res) {
    const { error } = documentsValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const updatedDocument = await Documents.updateOne(
        { _id: req.params.id },
        { title: req.body.title }
      );

      return res.json({ updatedDocument });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async destroy(req, res) {
    //delete file from server
    const document = await Documents.findOne({ _id: req.params.id }).populate(
      "files"
    );
    if (document) {
      document.files.forEach(async (file) => {
        deleteFile(file, "documents");

        //delete file from db
        try {
          await File.deleteOne({ _id: file._id });
        } catch (err) {
          console.log(err);
        }
      });

      //delete document from db
      try {
        const removedDocument = await Documents.deleteOne({
          _id: req.params.id,
        });
        return res.json({ document: removedDocument });
      } catch (err) {
        return res.json({ message: err });
      }
    } else {
      return res.status(404).send("documentId not found in db.");
    }
  },
};
