const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateCartBook(req, _, next) {
  const validations = [
    validator
      .param("bookID")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .body("count")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
