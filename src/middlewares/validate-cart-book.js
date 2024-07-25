const validator = require("express-validator");
const { EMPTY_VALUE, INVALID_TYPE } = require("../constants/validate-message");

module.exports = async function validateCartBook(req, _, next) {
  const validations = [
    validator
      .param("bookID")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .body("count")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
