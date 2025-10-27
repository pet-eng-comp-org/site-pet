const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    select: false,
  },
  password: {
    type: String,
    min: 6,
    select: false,
    default: "defaultPassword",
  },
  phone: {
    type: String,
    required: true,
    select: false,
  },
  startPet: {
    type: Date,
    required: true,
  },
  endPet: Date,
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  tutor: {
    type: Boolean,
    required: true,
    default: false,
  },
  socialMidia: [
    {
      name: String,
      link: String,
    },
  ],
  profilePhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  tags: [
    {
      title: String,
      color: String,
      backgroundColor: String,
      link: String,
    },
  ],
});

module.exports = mongoose.model("Member", MemberSchema);
