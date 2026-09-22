const Member = require("../models/Member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { passwordValidation } = require("../utils/validation");

module.exports = {
  async login(req, res) {
    //Fazer as buscas em petianos para confirmar credenciais
    //https://www.youtube.com/watch?v=T_PGIyEh0dg
    //usar basic autentication para que as infos venham no header

    // Sem cabecalho, ou fora do formato Basic, e credencial invalida — nao erro.
    const [tipo, hash] = (req.headers.authorization || "").split(" ");
    if (tipo !== "Basic" || !hash) return res.status(401).send("Access Denied");
    // Separa so no PRIMEIRO ":" — a senha pode conter ":". Sem ":", ou com um dos
    // lados vazio, e credencial invalida: antes a senha chegava undefined, o
    // bcrypt lancava e o catch respondia 200 com {}, que o painel lia como login.
    const credencial = Buffer.from(hash, "base64").toString();
    const separador = credencial.indexOf(":");
    const email = credencial.slice(0, separador);
    const password = credencial.slice(separador + 1);
    if (separador < 1 || !password) return res.status(401).send("Access Denied");

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
      // Vai para o handler de erro (500). Responder res.send(err) dava 200.
      throw err;
    }
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
