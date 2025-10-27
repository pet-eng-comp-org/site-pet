const Inscriptions = require("../models/Inscriptions");
const File = require("../models/File");
const Selection = require("../models/Selection");
const { inscriptionsValidation } = require("../utils/validation");
const { deleteFile } = require("../utils/functions");

module.exports = {
  async index(req, res) {
    const inscriptions = await Inscriptions.find().populate("file");
    res.json({ inscriptions });
  },

  async show(req, res) {
    const inscription = await Inscriptions.findOne({ _id: req.params.id });
    res.json({ inscription });
  },

  async store(req, res) {
    const selection = await Selection.findOne({ open: true }).populate(
      "inscriptions"
    );

    if (selection) {
      if (
        Date.now() < Date.parse(selection.dateBegin) ||
        Date.now() > Date.parse(selection.dateEnd)
      )
        return res.status(400).send("inscription is not open yet");

      const { error } = inscriptionsValidation(req.body);
      if (error) {
        const f = { key: req.file.filename };
        deleteFile(f, "inscriptions");
        return res.status(400).send(error.details[0].message);
      }

      const emailExist = selection.inscriptions.filter(
        (elem) => elem.email === req.body.email
      );
      if (emailExist.length) {
        const f = { key: req.file.filename };
        deleteFile(f, "inscriptions");
        return res.status(400).send("email already exists");
      }

      if (!req.file) return res.status(400).send('"file" is required');
      const { originalname: name, size, filename: key } = req.file;
      const file = new File({
        name,
        size,
        key,
      });

      try {
        const savedFile = await file.save();
        const inscription = new Inscriptions({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          file: savedFile,
        });
        try {
          const savedInscription = await inscription.save();

          await Selection.updateOne(
            { _id: selection._id },
            { $push: { inscriptions: savedInscription } }
          );

          return res.send({ inscription: savedInscription._id });
        } catch (err) {
          const f = { key: req.file.filename };
          deleteFile(f, "inscriptions");
          return res.status(400).send(err);
        }
      } catch (err) {
        const f = { key: req.file.filename };
        deleteFile(f, "inscriptions");
        return res.status(400).send(err);
      }
    }

    return res.status(400).send("Nao existe processo seletivo aberto.");
  },

  async destroy(req, res) {
    //delete file from server
    const inscription = await Inscriptions.findOne({
      _id: req.params.id,
    }).populate("file");
    deleteFile(inscription.file, "inscriptions");

    //delete file from db
    try {
      await File.deleteOne({ _id: inscription.file._id });
    } catch (err) {
      console.log(err);
    }

    //delete inscription from db
    try {
      const removedInscription = await Inscriptions.deleteOne({
        _id: req.params.id,
      });
      res.json({ inscription: removedInscription });
    } catch (err) {
      res.json({ message: err });
    }
  },

  async acceptInscription(req, res) {
    try {
      await Inscriptions.updateOne(
        { _id: req.params.id },
        {
          accepted: req.body.accepted,
        }
      );
      res.status(200).send("Success");
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
