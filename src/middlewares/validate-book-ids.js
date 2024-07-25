const validator = require("express-validator");
const { EMPTY_VALUE, INVALID_TYPE } = require("../constants/validate-message");

module.exports = async function validateBookIDs(req, _, next) {
  // NOTE: 배열 안에 기본형 요소를 형변환 할 수 없습니다.
  const validation = validator
    .body("bookIDs")
    .isArray({ min: 1 })
    .withMessage(EMPTY_VALUE)
    .isInt({ gt: 0, allow_leading_zeroes: false })
    .withMessage(INVALID_TYPE);

  await validation.run(req);

  next();
};
