const Joi = require("@hapi/joi");

const inscriptionsValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).email().required(),
    phone: Joi.string().min(11).max(15).required(),
  });
  return schema.validate(data);
};

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
    phases: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string(),
          date: Joi.date().greater("now").required(),
          hour: Joi.string()
            .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
          local: Joi.string().min(5).required(),
        })
      )
      .min(1)
      .required(),
    dateBegin: Joi.date().required(),
    dateEnd: Joi.date().greater(Joi.ref("dateBegin")).required(),
  });
  return schema.validate(data);
};

const contactValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    message: Joi.string().min(3).max(200).required(),
    email: Joi.string().min(6).email().required(),
    subject: Joi.string().min(5).max(40).required(),
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
    description: Joi.string().min(6).required(),
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

module.exports.inscriptionsValidation = inscriptionsValidation;
module.exports.newsValidation = newsValidation;
module.exports.documentsValidation = documentsValidation;
module.exports.selectionValidation = selectionValidation;
module.exports.contactValidation = contactValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.projectsValidation = projectsValidation;
module.exports.membersValidation = membersValidation;
module.exports.comissionsValidation = comissionsValidation;
