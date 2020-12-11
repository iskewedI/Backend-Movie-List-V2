const mongoose = require('mongoose');
const Joi = require('joi');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 25 },
  content: {
    type: [String],
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  owner: new mongoose.Schema({
    username: {
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

listSchema.statics.lookup = function (userId) {
  return this.find().where('owner._id').equals(userId);
};

const List = mongoose.model('List', listSchema);

function validate(myList) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    content: Joi.array().required(),
    //Owner: se lo pego con el authToken
  });
  return schema.validate(myList);
}

exports.List = List;
exports.validate = validate;
