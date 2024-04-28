const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";
const invalidateMessage = "타입이 유효하지 않습니다.";

module.exports = async function validateOrder(req, _, next) {
  const validations = [
    validator
      .body("mainBookTitle")
      .notEmpty()
      .withMessage(emptyMessage)
      .isString()
      .withMessage(invalidateMessage),

    validator.body("books").isArray({ min: 1 }).withMessage(emptyMessage),
    validator
      .body("books.*.bookID")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .body("books.*.count")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .body("books.*.price")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: -1, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
    validator
      .body("books.*.title")
      .notEmpty()
      .withMessage(emptyMessage)
      .isString()
      .withMessage(invalidateMessage),
    validator
      .body("books.*.author")
      .notEmpty()
      .withMessage(emptyMessage)
      .isString()
      .withMessage(invalidateMessage),

    validator.body("delivery").isObject().withMessage(emptyMessage),
    validator
      .body("delivery.address")
      .notEmpty()
      .withMessage(emptyMessage)
      .isString()
      .withMessage(invalidateMessage),
    validator
      .body("delivery.receiver")
      .notEmpty()
      .withMessage(emptyMessage)
      .isString()
      .withMessage(invalidateMessage),
    validator
      .body("delivery.contact")
      .notEmpty()
      .withMessage(emptyMessage)
      .isMobilePhone()
      .withMessage(invalidateMessage),

    validator
      .body("totalCount")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),

    validator
      .body("totalPrice")
      .notEmpty()
      .withMessage(emptyMessage)
      .isInt({ gt: -1, allow_leading_zeroes: false })
      .withMessage(invalidateMessage)
      .customSanitizer((value) => Number(value)),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
