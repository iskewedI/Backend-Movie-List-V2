const mongoose = require('mongoose');
const { userSchema } = require('./user');
const Joi = require('joi');

const myListSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 25 },
  content: {
    type: [String],
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  owner: new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
    },
  }),
  // isAdmin: { type: Boolean },
});

const MyList = mongoose.model('MyList', myListSchema);

function validate(myList) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    userId: Joi.objectId().required(),
    list: Joi.array().required(),
  });
  return schema.validate(myList);
}

exports.MyList = MyList;
exports.validate = validate;
