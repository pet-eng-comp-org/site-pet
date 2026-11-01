const Joi = require("@hapi/joi");

const newsValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    text: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

const documentsValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(30).required(),
  });
  return schema.validate(data);
};

const selectionValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(30).required(),
    dateBegin: Joi.date().required(),
    dateEnd: Joi.date().greater(Joi.ref("dateBegin")).required(),
    formLink: Joi.string()
      .uri({ scheme: ["https"] })
      .required(),
  });
  return schema.validate(data);
};

// Cada campo diz, em português, o que está errado; o site mostra ao lado dele.
const campoContato = (campo, regra, mensagem) =>
  regra.error((erros) => {
    erros[0].local.erro = { campo, mensagem };
    return erros[0];
  });

const contactValidation = (data) => {
  const schema = Joi.object({
    name: campoContato("name", Joi.string().trim().min(2).max(100).required(), "Escreva o seu nome, com 2 a 100 caracteres."),
    email: campoContato("email", Joi.string().trim().max(254).email().required(), "Escreva um e-mail válido, para podermos responder."),
    subject: campoContato("subject", Joi.string().trim().min(3).max(120).required(), "Escreva o assunto, com 3 a 120 caracteres."),
    message: campoContato("message", Joi.string().trim().min(3).max(5000).required(), "Escreva a mensagem, com 3 a 5000 caracteres."),
  });
  return schema.validate(data);
};

const passwordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const projectsValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(6).required(),
    link: Joi.string().min(5),
  });
  return schema.validate(data);
};

const membersValidation = (data, edit) => {
  const schema = Joi.object({
    memberName: Joi.string().min(2).required(),
    // Vazia só para egresso, que não aparece no site; o painel exige 6 a 160
    // caracteres para quem está no PET.
    description: Joi.string().allow("").max(160).required(),
    password: edit ? Joi.string() : Joi.string().min(6).required(),
    email: Joi.string().min(6).email().required(),
    phone: Joi.string().min(11).max(15).required(),
    startPet: Joi.date().required(),
    endPet: Joi.date(),
    active: Joi.boolean(),
    tutor: Joi.boolean(),
    socialMidia: Joi.array().items(
      Joi.object({
        _id: Joi.string(),
        name: Joi.string().min(2),
        link: Joi.string().min(5),
      })
    ),
    tags: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string(),
          title: Joi.string().min(2),
          color: Joi.string().min(2),
          backgroundColor: Joi.string().min(2),
          link: Joi.string().min(2),
        })
      )
      .required(),
  });
  return schema.validate(data);
};

const comissionsValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(6).required(),
    tags: Joi.array().items(
      Joi.object({
        _id: Joi.string(),
        title: Joi.string().min(2),
        link: Joi.string().allow(''),
        color: Joi.string().min(2),
        backgroundColor: Joi.string().min(2),
      })
    ),
  });
  return schema.validate(data);
};

module.exports.newsValidation = newsValidation;
module.exports.documentsValidation = documentsValidation;
module.exports.selectionValidation = selectionValidation;
module.exports.contactValidation = contactValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.projectsValidation = projectsValidation;
module.exports.membersValidation = membersValidation;
module.exports.comissionsValidation = comissionsValidation;
