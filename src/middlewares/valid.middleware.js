module.exports = class ValidMiddleware {
  emptyMessage = "값이 존재하지 않습니다.";
  invalidTypeMessage = "타입이 유효하지 않습니다.";

  constructor({ StatusCodes, validator }) {
    this.StatusCodes = StatusCodes;
    this.validator = validator;
  }

  validateGetBooks = async (req, _, next) => {
    const validations = [
      this.validator
        .query("isNew")
        .notEmpty()
        .withMessage(this.emptyMessage)
        .isBoolean()
        .withMessage(this.invalidTypeMessage),
      this.validator
        .query("limit")
        .notEmpty()
        .withMessage(this.emptyMessage)
        .isNumeric()
        .withMessage(this.invalidTypeMessage),
      this.validator
        .query("page")
        .notEmpty()
        .withMessage(this.emptyMessage)
        .isNumeric()
        .withMessage(this.invalidTypeMessage),
    ];

    for (let validation of validations) {
      await validation.run(req);
    }

    next();
  };

  errHandler = (req, res, next) => {
    const errors = this.validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(this.StatusCodes.BAD_REQUEST).json({
        errors: errors.array(),
      });
    }

    next();
  };
};
