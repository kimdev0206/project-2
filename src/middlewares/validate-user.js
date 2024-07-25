const validator = require("express-validator");
const {
  EMPTY_VALUE,
  INVALID_FORMAT,
} = require("../constants/validate-message");

module.exports = async function validateUser(req, _, next) {
  const validations = [
    validator
      .body("email")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isEmail()
      .withMessage(INVALID_FORMAT),

    validator.body("password").notEmpty().withMessage(EMPTY_VALUE),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
