const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateBookIDs(req, _, next) {
  const validation = validator
    .body("bookIDs")
    .isArray({ min: 1 })
    .withMessage(emptyMessage)
    .isInt({ gt: 0, allow_leading_zeroes: false })
    .withMessage(invalidateMessage);
  // NOTE: 배열 안에 기본형 요소를 형변환 할 수 없습니다.

  await validation.run(req);

  next();
};
