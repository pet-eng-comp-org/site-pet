const nodemailer = require("nodemailer");
const { contactValidation } = require("../utils/validation");

module.exports = {
  async sendEmail(req, res) {
    const { error } = contactValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "465",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      const message = await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: req.body.subject,
        html: `<b>E-mail enviado por ${req.body.name}.</b><br/><br/> ${req.body.message}<br/><br/>Retorne para ${req.body.email}`,
      });
      res.json({ message });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
