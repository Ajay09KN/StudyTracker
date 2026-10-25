const { validationResult } = require('express-validator');

// Runs after express-validator check chains; turns the first validation
// error into a 400 response with a readable message.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }
  return next();
};

module.exports = validate;
