module.exports = validator => {
  return (req, res, next) => {
    req.body.language = req.body.lang || 'en';

    const { error } = validator(req.body);

    if (error) return res.status(400).send(error.message);
    next();
  };
};
