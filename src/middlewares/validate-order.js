const validator = require("express-validator");
const {
  EMPTY_VALUE,
  INVALID_TYPE,
  INVALID_FORMAT,
} = require("../constants/validate-message");

module.exports = async function validateOrder(req, _, next) {
  const validations = [
    validator
      .body("mainBookTitle")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isString()
      .withMessage(INVALID_TYPE),

    validator.body("books").isArray({ min: 1 }).withMessage(EMPTY_VALUE),
    validator
      .body("books.*.bookID")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .body("books.*.count")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .body("books.*.price")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: -1, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
    validator
      .body("books.*.title")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isString()
      .withMessage(INVALID_TYPE),
    validator
      .body("books.*.author")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isString()
      .withMessage(INVALID_TYPE),

    validator.body("delivery").isObject().withMessage(EMPTY_VALUE),
    validator
      .body("delivery.address")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isString()
      .withMessage(INVALID_TYPE),
    validator
      .body("delivery.receiver")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isString()
      .withMessage(INVALID_TYPE),
    validator
      .body("delivery.contact")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .custom((value) => /^\d+-\d+-\d+$/.test(value))
      .withMessage(INVALID_FORMAT),

    validator
      .body("totalCount")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),

    validator
      .body("totalPrice")
      .notEmpty()
      .withMessage(EMPTY_VALUE)
      .isInt({ gt: -1, allow_leading_zeroes: false })
      .withMessage(INVALID_TYPE)
      .customSanitizer(Number),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
