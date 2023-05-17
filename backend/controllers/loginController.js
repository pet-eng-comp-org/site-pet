const Member = require("../models/Member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { passwordValidation } = require("../utils/validation");

module.exports = {
  async login(req, res) {
    //Fazer as buscas em petianos para confirmar credenciais
    //https://www.youtube.com/watch?v=T_PGIyEh0dg
    //usar basic autentication para que as infos venham no header

    const [, hash] = req.headers.authorization.split(" ");
    const [email, password] = Buffer.from(hash, "base64").toString().split(":");

    try {
      const user = await Member.findOne({ email }).select("+password");
      if (!user) return res.status(401).send("Email not found");

      if (!user.active) return res.status(401).send("Access Denied");

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(401).send("Invalid password");

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 86400,
      });

      res.send({ token });
    } catch (err) {
      res.send(err);
    }
  },

  async forgotPassword(req, res) {
    const member = await Member.findOne({ email: req.body.email });
    if (!member) {
      return res.status(400).send("Email is not found");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const newPassword = randomString();
    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    Member.updateOne({ email: req.body.email }, { password: hashedPassword })
      .then(updatedPassword)
      .catch((err) => {
        console.log(err);
      });

    const message = await transporter.sendMail({
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Pedido de alteração de senha - SitePET EngComp",
      html: `Olá recebemos um pedido de alteração de senha, sua nova senha é ${newPassword}.<br>
                  Caso deseje alterá-la, visite basta fazer isso no site do PET.`,
    });

    res.json({ message });
  },

  async newPassword(req, res) {
    const data = { password: req.body.newPassword };
    const { error } = passwordValidation(data);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const member = await Member.findOne({ _id: req.params.idPetiano }).select(
      "password"
    );
    if (!member) {
      return res.status(400).send("Petiano is not found");
    }

    //password is correct
    const validOldPass = await bcrypt.compare(
      req.body.oldPassword,
      member.password
    );
    if (!validOldPass) {
      return res.status(400).send("invalid old password");
    }

    console.log(req.body.oldPassword, req.body.newPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    Member.updateOne(
      { _id: req.params.idPetiano },
      { password: hashedPassword }
    ).catch((err) => {
      console.log(err);
    });

    // create and assign a token
    const token = jwt.sign({ _id: member._id }, process.env.TOKEN_SECRET, {
      expiresIn: 86400,
    });
    res.header("Authorization", "Bearer ".concat(token)).send({ token });
  },
};
