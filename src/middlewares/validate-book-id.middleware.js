const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateBookID(req, _, next) {
  const validation = validator
    .param("bookID")
    .notEmpty()
    .withMessage(emptyMessage)
    .isInt({ gt: 0, allow_leading_zeroes: false })
    .withMessage(invalidateMessage)
    .customSanitizer((value) => Number(value));

  await validation.run(req);

  next();
};
