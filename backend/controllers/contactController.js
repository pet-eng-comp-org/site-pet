const nodemailer = require("nodemailer");
const { contactValidation } = require("../utils/validation");

// O formulário é público e manda e-mail: até 5 mensagens por IP a cada 10 min.
const JANELA_MS = 10 * 60 * 1000;
const MAXIMO_POR_JANELA = 5;
const envios = new Map();

function excedeuLimite(ip) {
  const agora = Date.now();
  const recentes = (envios.get(ip) || []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= MAXIMO_POR_JANELA) return true;
  if (envios.size > 10000) envios.clear();
  recentes.push(agora);
  envios.set(ip, recentes);
  return false;
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

module.exports = {
  async sendEmail(req, res) {
    const { error, value } = contactValidation(req.body);
    if (error) {
      const { campo, mensagem } = error.details[0].context.erro || {};
      return res.status(400).json({ campo, erro: mensagem || "Confira os campos." });
    }

    if (excedeuLimite(req.ip))
      return res.status(429).json({
        erro: "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.",
      });

    try {
      // Texto puro: o que a pessoa escreve não vira HTML no e-mail do PET.
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        replyTo: { name: value.name, address: value.email },
        subject: `[Site] ${value.subject}`,
        text: `${value.name} <${value.email}> escreveu pelo site:\n\n${value.message}`,
      });
      res.json({ enviado: true });
    } catch (err) {
      console.error("contato: falha ao enviar e-mail:", err.message);
      res.status(502).json({
        erro: "Não conseguimos enviar agora. Tente de novo mais tarde ou escreva para petengcomp.ufes@gmail.com.",
      });
    }
  },
};
