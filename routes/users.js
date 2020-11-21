const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const messages = require('../config.json');
const { User, validate } = require('../models/user');
const validateBody = require('../middleware/validateBody');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.send(user);
});

router.post('/', validateBody(validate), async ({ body }, res) => {
  const registeredUser = await User.findOne({ email: body.email });
  if (registeredUser) return res.status(400).send(messages.alreadyExisting);

  //Generating user and hashing password
  const user = new User(_.pick(body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken(); //Tokens must not be saved on any database!

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
