const Documents = require("../models/Documents");
const File = require("../models/File");
const { deleteFile } = require("../utils/functions");
const { documentsValidation, recusa } = require("../utils/validation");

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
    if (error) return recusa(res, error);

    const document = new Documents({
      title: req.body.title,
    });

    try {
      const savedDocument = await document.save();
      return res.send({ document: savedDocument._id });
    } catch (err) {
      throw err;
    }
  },

  async addFile(req, res) {
    if (!req.file) return res.status(400).send('"file" is required');

    const { originalname, size, filename: key } = req.file;
    // Nome que aparece no site, escolhido no painel (ex.: "Edital nº 018/2026").
    const name = String(req.body.name || "").trim().slice(0, 120) || originalname;
    const file = new File({
      name,
      size,
      key,
    });

    try {
      await file.save();
      // O mais recente aparece primeiro na lista.
      const updatedDocument = await Documents.updateOne(
        { _id: req.params.id },
        { $push: { files: { $each: [file._id], $position: 0 } } }
      ).populate("files");
      return res.json({ updatedDocument });
    } catch (err) {
      deleteFile(file, "documents");
      await File.deleteOne({ _id: file._id });
      throw err;
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
          throw err;
        }
      } catch (err) {
        throw err;
      }
    } else {
      return res.status(404).send("file not found in db.");
    }
  },

  async update(req, res) {
    const { error } = documentsValidation(req.body);
    if (error) return recusa(res, error);

    try {
      const updatedDocument = await Documents.updateOne(
        { _id: req.params.id },
        { title: req.body.title }
      );

      return res.json({ updatedDocument });
    } catch (err) {
      throw err;
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
        throw err;
      }
    } else {
      return res.status(404).send("documentId not found in db.");
    }
  },
};
