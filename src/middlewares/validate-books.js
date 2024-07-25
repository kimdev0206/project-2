const validator = require("express-validator");
const { EMPTY_VALUE, INVALID_TYPE } = require("../constants/validate-message");

module.exports = async function validateBooks(req, _, next) {
  const validations = [
    validator
      .query("categoryID")
      .optional()
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .query("isNew")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isBest")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isTitle")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isSummary")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isContents")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("isDetail")
      .optional()
      .isBoolean()
      .withMessage(INVALID_TYPE)
      .customSanitizer((value) => value === "true"),
    validator
      .query("limit")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .query("page")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
