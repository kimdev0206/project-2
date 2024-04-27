const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateBooks(req, _, next) {
  const validations = [
    validator
      .query("categoryID")
      .optional()
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .query("isNew")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isBest")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isTitle")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isSummary")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isContents")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isDetail")
      .optional()
      .isBoolean()
      .withMessage(invalidateMessage)
      .customSanitizer((value) => value === "true"),
    validator
      .query("limit")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .query("page")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
