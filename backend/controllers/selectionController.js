const Selection = require("../models/Selection");
const { selectionValidation } = require("../utils/validation");

module.exports = {
  async index(req, res) {
    const selections = await Selection.find();
    return res.json({ selections });
  },

  async show(req, res) {
    const selection = await Selection.findOne({ _id: req.params.id });
    return res.json({ selection });
  },

  async openSelection(req, res) {
    const selection = await Selection.findOne(
      { open: true },
      "title dateBegin dateEnd formLink"
    );
    return res.json({ selection });
  },

  async store(req, res) {
    const { error } = selectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const openSelection = await Selection.findOne({ open: true });
    if (openSelection)
      return res
        .status(400)
        .send("Já existe uma seleção aberta. Finalize-a antes de criar outra.");

    try {
      const selection = await new Selection({
        title: req.body.title,
        dateBegin: req.body.dateBegin,
        dateEnd: req.body.dateEnd,
        formLink: req.body.formLink,
      }).save();
      return res.send({ selection: selection._id });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async update(req, res) {
    const { error } = selectionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const updatedSelection = await Selection.updateOne(
        { _id: req.params.id },
        {
          title: req.body.title,
          dateBegin: req.body.dateBegin,
          dateEnd: req.body.dateEnd,
          formLink: req.body.formLink,
        }
      );
      return res.json({ updatedSelection });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async finalize(req, res) {
    try {
      const updatedSelection = await Selection.updateOne(
        { _id: req.params.id },
        { open: false }
      );
      if (!updatedSelection.matchedCount)
        return res.status(400).send("selection not found");
      return res.send(updatedSelection);
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async destroy(req, res) {
    const selection = await Selection.findOne({ _id: req.params.id });
    if (!selection) return res.status(400).send("selecionId not found in db.");
    if (selection.open)
      return res.status(400).send("selection must be finalized before.");

    try {
      const removedSelection = await Selection.deleteOne({
        _id: req.params.id,
      });
      return res.json({ selection: removedSelection });
    } catch (err) {
      return res.json({ message: err });
    }
  },
};
