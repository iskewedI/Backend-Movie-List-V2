const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const validateBody = require('../middleware/validateBody');

router.post('/', validateBody(validate), async ({ body }, res) => {
  const user = await User.findOne({ email: body.email });
  if (!user) {
    const message =
      body.language === 'en'
        ? 'No user registered with this email.'
        : 'Ningún usuario ha sido registrado con este email';
    return res.status(400).send(message);
  }

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) {
    const message =
      body.language === 'en'
        ? 'Wrong email & password combination.'
        : 'La combinación de email y contraseña es errónea.';
    return res.status(400).send(message);
  }

  const token = user.generateAuthToken();

  res.send({ token });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  }).options({ allowUnknown: true });
  return schema.validate(req);
}

module.exports = router;
