module.exports = class ValidMiddleware {
  emptyMessage = "값이 존재하지 않습니다.";
  invalidTypeMessage = "타입이 유효하지 않습니다.";

  constructor({ StatusCodes, validator }) {
    this.StatusCodes = StatusCodes;
    this.validator = validator;
  }

  validateAuth = async (req, _, next) => {
    const validations = [
      this.validator
        .body("email")
        .notEmpty()
        .withMessage(this.emptyMessage)
        .isEmail()
        .withMessage("유효하지 않은 이메일 형식 입니다."),

      this.validator.body("password").notEmpty().withMessage(this.emptyMessage),
    ];

    for (let validation of validations) {
      await validation.run(req);
    }

    next();
  };

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

    await Promise.all(validations.map((validation) => validation.run(req)));

    next();
  };

  validatePostCartBook = async (req, _, next) => {
    const validation = this.validator
      .body("count")
      .notEmpty()
      .withMessage(this.emptyMessage)
      .isNumeric()
      .withMessage(this.invalidTypeMessage);

    await validation.run(req);

    next();
  };

  validateGetSelectedCartBooks = async (req, _, next) => {
    const validation = this.validator
      .body("bookIDs")
      .isArray({ min: 1 })
      .withMessage(this.emptyMessage)
      .isNumeric()
      .withMessage(this.invalidTypeMessage);

    await validation.run(req);

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
