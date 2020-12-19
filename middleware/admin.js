const { messages } = require('../config.json');
module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send(messages.accessDenied);

  next();
};
