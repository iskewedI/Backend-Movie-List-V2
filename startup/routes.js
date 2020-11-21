const express = require('express');
const usersRoute = require('../routes/users');
const authRoute = require('../routes/auth');
const myListRoute = require('../routes/myList');
const { endpoints } = require('../config.json');

module.exports = function (app) {
  app.use(express.json());
  app.use(endpoints.Users, usersRoute);
  app.use(endpoints.Auth, authRoute);
  app.use(endpoints.MyList, myListRoute);

  // app.use(() => console.error('Error'));
};
