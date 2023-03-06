const Joi = require("@hapi/joi");

const validateCandidate = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
  address: Joi.string().min(6),
  number: Joi.number().min(11),
  gender: Joi.string().min(4).max(6),
});

const validateEmployer = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
  address: Joi.string().min(6),
  number: Joi.number().min(11),
  gender: Joi.string().min(4).max(6),
});

const validateJob = Joi.object({
  title: Joi.string().min(4).required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  jobType: Joi.string().required(),
  amount: Joi.string().required(),
  email: Joi.string().required().email(),
});

module.exports = {
  validateCandidate,
  validateEmployer,
  validateJob,
};
