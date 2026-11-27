const Member = require("../models/Member");
const File = require("../models/File");
const bcrypt = require("bcryptjs");
const { membersValidation, recusa } = require("../utils/validation");
const { deleteFile } = require("../utils/functions");

module.exports = {
  async store(request, response) {
    const { error } = membersValidation(request.body, false);
    if (error) {
      return recusa(response, error);
    }

    const emailExist = await Member.findOne({ email: request.body.email });
    if (emailExist) {
      return response.status(400).send("email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    const member = new Member({
      memberName: request.body.memberName,
      description: request.body.description,
      email: request.body.email,
      password: hashedPassword,
      phone: request.body.phone,
      startPet: request.body.startPet,
      active: request.body.active,
      tutor: request.body.tutor,
      socialMidia: request.body.socialMidia,
      tags: request.body.tags,
    });
    try {
      const savedMember = await member.save();
      return response.send(savedMember._id);
    } catch (err) {
      throw err;
    }
  },

  async index(request, response) {
    try {
      const members = await Member.find().populate("profilePhoto");

      return response.send({ members });
    } catch (err) {
      return response.status(400).send("Error loading members");
    }
  },

  async indexAll(request, response) {
    try {
      const members = await Member.find()
        .populate("profilePhoto")
        .select("+phone +email");

      return response.send({ members });
    } catch (err) {
      return response.status(400).send("Error loading members");
    }
  },

  async show(req, res) {
    try {
      const member = await Member.findOne({
        _id: req.params.memberId,
      })
        .populate("profilePhoto")
        .select("+phone +email");

      return res.send({ member });
    } catch (err) {
      return res.status(400).send("Error loading members");
    }
  },

  async update(request, response) {
    const { error } = membersValidation(request.body, true);
    if (error) return recusa(response, error);

    try {
      await Member.findOneAndUpdate(
        { _id: request.params.memberId },
        {
          memberName: request.body.memberName,
          description: request.body.description,
          email: request.body.email,
          phone: request.body.phone,
          startPet: request.body.startPet,
          tutor: request.body.tutor,
          socialMidia: request.body.socialMidia,
          tags: request.body.tags,
        }
      );

      return response.send("Success!");
    } catch (err) {
      console.log(err);
      return response.status(400).send("Error updating member");
    }
  },

  async delete(request, response) {
    try {
      const removedMember = await Member.findOneAndDelete(
        {
          _id: request.params.memberId,
        }
      ).populate("profilePhoto");

      if (!removedMember.profilePhoto) return response.json(removedMember);

      try {
        await File.deleteOne({ _id: removedMember.profilePhoto._id });
        deleteFile(removedMember.profilePhoto, "members");

        return response.json(removedMember);
      } catch (err) {
        console.log(err);
        return response.status(400).send("Error deleting profilePhoto");
      }
    } catch (err) {
      console.log(err);
      return response.status(400).send("Error deleting member");
    }
  },

  async showEgress(request, response) {
    try {
      const members = await Member.find({ active: false });

      return response.send({ members });
    } catch (err) {
      return response.status(400).send("Error loading members");
    }
  },

  async showEgressAll(request, response) {
    try {
      const members = await Member.find({ active: false }).select(
        "+phone +email"
      );

      return response.send({ members });
    } catch (err) {
      return response.status(400).send("Error loading members");
    }
  },

  async sairDoPet(request, response) {
    const endPet =
      typeof request.body.endPet === "string" ? new Date(request.body.endPet) : null;
    if (!endPet || Number.isNaN(endPet.getTime())) {
      return response
        .status(400)
        .set("Content-Type", "text/plain; charset=utf-8")
        .send("Invalid endPet");
    }

    const member = await Member.findByIdAndUpdate(request.params.memberId, {
      active: false,
      endPet,
    });
    if (!member) return response.status(404).send("Member not found");

    return response.status(200).send("Success");
  },

  async voltarAoPet(request, response) {
    const member = await Member.findByIdAndUpdate(request.params.memberId, {
      active: true,
      endPet: null,
    });
    if (!member) return response.status(404).send("Member not found");

    return response.status(200).send("Success");
  },

  async firstProfilePhoto(request, response) {
    if (!request.file) return response.status(400).send('"file" is required');

    const { originalname: name, size, filename: key } = request.file;
    const file = new File({
      name,
      size,
      key,
    });

    try {
      await file.save();
      const updatedMember = await Member.updateOne(
        { _id: request.params.memberId },
        { $push: { profilePhoto: file } }
      );
      return response.json({ updatedMember });
    } catch (err) {
      deleteFile(file, "members");
      await File.deleteOne({ _id: file._id });
      throw err;
    }
  },

  async updateProfilePhoto(request, response) {
    const { originalname: name, size, filename: key } = request.file;
    const oldPhoto = await Member.findOne({
      _id: request.params.memberId,
    }).populate("profilePhoto");

    try {
      const updatedMember = await File.updateOne(
        { _id: oldPhoto.profilePhoto._id },
        { name, size, key }
      );

      deleteFile(oldPhoto.profilePhoto, "members");
      response.status(200).send({ new: updatedMember });
    } catch (err) {
      const f = { key };
      deleteFile(f, "members");
      throw err;
    }
  },
};
