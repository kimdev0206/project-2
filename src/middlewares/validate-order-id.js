const validator = require("express-validator");
const { EMPTY_VALUE, INVALID_TYPE } = require("../constants/validate-message");

module.exports = async function validateOrderID(req, _, next) {
  const validation = validator
    .param("orderID")
    .notEmpty()
    .withMessage(EMPTY_VALUE)
    .isString()
    .withMessage(INVALID_TYPE);

  await validation.run(req);

  next();
};
