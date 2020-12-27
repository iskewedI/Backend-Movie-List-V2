const mongoose = require('mongoose');
const Joi = require('joi');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 25 },
  content: {
    type: String,
    maxlength: 1000,
  },
  owner: new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  }),
});

listSchema.statics.lookup = function (userId) {
  return this.find().where('owner._id').equals(userId);
};

const List = mongoose.model('List', listSchema);

function validate(myList) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    content: Joi.array().max(500), //The content comes as an array
  });
  return schema.validate(myList);
}

exports.List = List;
exports.validate = validate;
