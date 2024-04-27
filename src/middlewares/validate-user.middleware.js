const validator = require("express-validator");

const emptyMessage = "값이 존재하지 않습니다.";

module.exports = async function validateUser(req, _, next) {
  const validations = [
    validator
      .body("email")
      .notEmpty()
      .withMessage(emptyMessage)
      .isEmail()
      .withMessage("유효하지 않은 email 형식 입니다."),

    validator.body("password").notEmpty().withMessage(emptyMessage),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  next();
};
