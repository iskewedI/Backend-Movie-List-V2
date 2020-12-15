const express = require('express');
const router = express.Router();
const { List, validate } = require('../models/list');
const { User } = require('../models/user');
const _ = require('lodash');
const validateBody = require('../middleware/validateBody');
const auth = require('../middleware/auth');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const lists = await List.find().sort('name');

  res.send(lists);
});

router.get('/myList', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send('User not found.');

  const userList = await List.lookup(user.id);

  res.send(userList);
});

router.post('/', auth, validateBody(validate), async ({ user: reqUser, body }, res) => {
  const user = await User.findById(reqUser._id);
  if (!user) return res.status(404).send('User not found.');

  const registeredList = await List.findOne({ name: body.name, owner: user });
  if (registeredList) return res.status(400).send(messages.alreadyExisting);

  //Generating list
  const list = new List({
    name: body.name,
    content: body.content || [],
    owner: _.pick(user, ['username', '_id']),
  });

  await list.save();

  res.send(list);
});

router.put('/', auth, async ({ user: reqUser, body }, res) => {
  const user = await User.findById(reqUser._id);
  if (!user) return res.status(404).send('User not found.');

  const list = await List.findOne({ name: body.name, owner: user });
  if (!list) return res.status(404).send("The list couldn't be found.");

  if (body.newName) {
    const toValidate = { name: body.newName, content: [] };

    const { error } = validate(toValidate);

    if (error) return res.status(400).send(error.message);

    list.name = body.newName;
  }

  let content = [...list.content];

  if (body.removed) {
    content = content.filter(e => !body.removed.includes(e));
  }
  if (body.added) {
    content.push(...body.added);
  }

  list.content = content;

  await list.save();

  res.send(_.pick(list, ['content', 'name']));
});

module.exports = router;
