const express = require('express');
const router = express.Router();
const { MyList, validate } = require('../models/myList');
const { User } = require('../models/user');
const _ = require('lodash');
const validateBody = require('../middleware/validateBody');
const { messages } = require('../config.json');

router.get('/', async (req, res) => {
  const lists = await MyList.find().sort('name');
  res.send(lists);
});

router.post('/', validateBody(validate), async ({ body }, res) => {
  console.info(body);

  const user = await User.findById(body.userId);
  if (!user) return res.status(404).send('User not found.');

  const registeredList = await MyList.findOne({ name: body.name, owner: user });
  if (registeredList) return res.status(400).send(messages.alreadyExisting);

  //Generating list
  const myList = new MyList({
    name: body.name,
    content: body.list,
    owner: _.pick(user, ['name', 'email']),
  });

  await myList.save();

  res.send(myList);
});

module.exports = router;
