const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

module.exports = async function (req, res, next) {
  //o token deve ser passado como um bearer token

  if (!req.headers.authorization) {
    return res.status(401).send("Access Denied");
  }
  const [, token] = req.headers.authorization.split(" ");
  let payload;
  try {
    payload = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
  if (!payload?._id || !(await Member.exists({ _id: payload._id, active: true }))) {
    return res.status(401).send("Access Denied");
  }
  next();
};
