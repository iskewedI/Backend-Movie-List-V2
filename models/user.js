const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 5, maxlength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 }, //Hashed password!,
  isAdmin: { type: Boolean },
});

userSchema.plugin(require('mongoose-beautiful-unique-validation'));

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  );
};

const User = mongoose.model('User', userSchema);

const localisedMessages = () => {
  const map = new Map();

  const translatedFields = lang => ({
    username: lang === 'en' ? 'Username' : 'Nombre de usuario',
    email: 'email',
    password: lang === 'en' ? 'Password' : 'Contraseña',
  });

  const getMessages = ({ stringBase, stringEmpty, stringMin, stringMax, required }) => ({
    'string.base': stringBase,
    'string.empty': stringEmpty,
    'string.min': stringMin,
    'string.max': stringMax,
    'any.required': required,
  });

  map.set('en', (name, required) => {
    const localisedName = translatedFields('en')[name];

    return getMessages({
      stringBase: `${localisedName} should be a type of string`,
      stringEmpty: `${localisedName} cannot be an empty field`,
      stringMin: `${localisedName} should have a minimum length of {#limit}`,
      stringMax: `${localisedName} should have a maximum length of {#limit}`,
      required: `${localisedName} is ${required ? 'required' : 'not required'}`,
    });
  });

  map.set('es', (name, required) => {
    const localisedName = translatedFields('es')[name];

    return getMessages({
      stringBase: `${localisedName} debería ser del tipo texto`,
      stringEmpty: `${localisedName} no puede estar vacío`,
      stringMin: `${localisedName} deberia tener un minimo de {#limit} caracteres`,
      stringMax: `${localisedName} supera el límite de caracteres`,
      required: `${localisedName} es ${required ? 'requerido' : 'no requerido'}`,
    });
  });

  return map;
};

function validate(user) {
  const { language } = user;

  const messages = localisedMessages();

  const schema = Joi.object({
    username: Joi.string()
      .min(4)
      .max(20)
      .required()
      .messages(messages.get(language)('username', true)),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required()
      .messages(messages.get(language)('email', true)),
    password: Joi.string()
      .min(5)
      .max(25)
      .required()
      .messages(messages.get(language)('password', true)),
  }).options({ allowUnknown: true });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validate;
exports.userSchema = userSchema;
