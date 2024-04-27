const { StatusCodes } = require("http-status-codes");
const validator = require("express-validator");

module.exports = async function validateError(req, res, next) {
  const errors = validator.validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors.array(),
    });
  }

  next();
};
