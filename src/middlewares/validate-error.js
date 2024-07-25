const validator = require("express-validator");

module.exports = async function validateError(req, res, next) {
  const errors = validator.validationResult(req);

  if (!errors.isEmpty()) {
    console.info(errors.array());

    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};
