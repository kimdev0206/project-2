const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateBookIDs(req, _, next) {
  const validation = validator
    .body("bookIDs")
    .isArray({ min: 1 })
    .withMessage(emptyMessage)
    .isNumeric()
    .withMessage(invalidateMessage);

  await validation.run(req);

  next();
};
