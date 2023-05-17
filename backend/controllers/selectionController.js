const Selection = require("../models/Selection");
const Inscription = require("../models/Inscriptions");
const File = require("../models/File");
const { deleteFile } = require("../utils/functions");
const { selectionValidation } = require("../utils/validation");

module.exports = {
  async index(req, res) {
    const selections = await Selection.find().populate("inscriptions");
    return res.json({ selections });
  },

  async show(req, res) {
    const selection = await Selection.findOne({ _id: req.params.id }).populate(
      "inscriptions"
    );
    return res.json({ selection });
  },

  async openSelection(req, res) {
    const selection = await Selection.findOne({ open: true });
    return res.json({ selection });
  },

  async store(req, res) {
    const openSelection = await Selection.find({ open: true });

    const { error } = selectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!openSelection.length) {
      const selection = new Selection({
        phases: req.body.phases,
        inscriptions: [],
        title: req.body.title,
        dateBegin: req.body.dateBegin,
        dateEnd: req.body.dateEnd,
      });

      try {
        const savedSelection = await selection.save();

        return res.send({ selection: savedSelection._id });
      } catch (err) {
        return res.status(400).send(err);
      }
    }
    res
      .status(400)
      .send(
        "existe alguma seleção aberta, feche-a antes de cadastrar uma nova."
      );
  },

  async update(req, res) {
    const { error } = selectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const updatedSelection = await Selection.updateOne(
        { _id: req.params.id },
        {
          title: req.body.title,
          phases: req.body.phases,
          dateBegin: req.body.dateBegin,
          dateEnd: req.body.dateEnd,
        }
      );

      return res.json({ updatedSelection });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async removeInscription(req, res) {
    try {
      const selection = await Selection.findOne({
        _id: req.params.id,
      }).populate({
        path: "inscriptions",
        populate: { path: "file", model: "File" },
      });

      if (selection) {
        const inscription = selection.inscriptions.filter(
          (elem) => elem._id == req.body.idInscription
        )[0];
        if (inscription) {
          deleteFile(inscription.file, "inscriptions");

          await File.deleteOne({ _id: inscription.file._id });
          await Inscription.deleteOne({ _id: inscription._id });

          try {
            const updatedSelection = await Selection.updateOne(
              { _id: req.params.id },
              { $pull: { inscriptions: inscription._id } }
            );

            return res.send({ updatedSelection });
          } catch (err) {
            return res.status(400).send(err);
          }
        }
        return res.status(400).send("inscriptionId not found.");
      }
      return res.status(400).send("selectionId not found.");
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async finalize(req, res) {
    try {
      const selection = await Selection.findOne({
        _id: req.params.id,
      }).populate({
        path: "inscriptions",
        populate: { path: "file", model: "File" },
      });

      if (selection) {
        if (selection.inscriptions.length) {
          selection.inscriptions.forEach(async (inscription) => {
            //delete file from server
            deleteFile(inscription.file, "inscriptions");

            //delete file from db
            try {
              await File.deleteOne({ _id: inscription.file._id });
            } catch (err) {
              console.log(err);
            }
          });
        }
        const updatedSelection = await Selection.updateOne(
          { _id: selection._id },
          { open: false }
        );
        return res.send(updatedSelection);
      }
      return res.status(400).send("selection not found");
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async destroy(req, res) {
    const selection = await Selection.findOne({ _id: req.params.id });

    if (selection) {
      if (!selection.open) {
        if (selection.inscriptions.length) {
          selection.inscriptions.forEach(async (inscription) => {
            try {
              await Inscription.deleteOne({ _id: inscription._id });
            } catch (err) {
              console.log(err);
            }
          });
        }
        try {
          const removedSelection = await Selection.deleteOne({
            _id: req.params.id,
          });
          return res.json({ selection: removedSelection });
        } catch (err) {
          return res.json({ message: err });
        }
      }
      return res.status(400).send("selection must be finalized before.");
    }
    return res.status(400).send("selecionId not found in db.");
  },
};
