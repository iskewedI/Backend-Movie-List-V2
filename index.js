const express = require('express');
const app = express();

require('./startup/db')(); //Database initialization
require('./startup/routes')(app); //Routes settings
require('./startup/config')(); //Environment configuration
require('./startup/validation')(); //Api Validation initialization

const port = process.env.PORT || 80;
const server = app.listen(port, () => console.log(`Initializing on port ${port}...`));

module.exports = server;
