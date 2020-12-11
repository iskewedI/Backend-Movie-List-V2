require('express-async-errors'); //Envolves router async functions in try/catch blocks

module.exports = function () {
  //Trick to handle Promise Rejections too with winston
  process.on('unhandledRejection', ex => {
    console.error('Error => ', ex);
  });
};
