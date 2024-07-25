const validator = require("express-validator");
const { EMPTY_VALUE, INVALID_TYPE } = require("../constants/validate-message");

module.exports = async function validateBookID(req, _, next) {
  const validation = validator
    .param("bookID")
    .notEmpty()
    .withMessage(EMPTY_VALUE)
    .isInt({ gt: 0, allow_leading_zeroes: false })
    .withMessage(INVALID_TYPE)
    .customSanitizer(Number);

  await validation.run(req);

  next();
};
