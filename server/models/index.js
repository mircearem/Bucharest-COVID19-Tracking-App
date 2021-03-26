const Joi = require('joi');

const insertSchema = Joi.object({
  timestamp:  Joi.date().timestamp('unix'),
  infections: Joi.number().integer()
});

const findSchema = Joi.object({
  fromDate: Joi.date().timestamp('unix'),
  toDate: Joi.date().timestamp('unix')
});

module.exports = { insertSchema, findSchema }




