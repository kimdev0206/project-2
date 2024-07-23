const HttpError = require("../HttpError");
const { isProduction } = require("../utils");

module.exports = function httpError(error, req, res, next) {
  if (!(error instanceof HttpError)) return next(error);

  isProduction() ? console.warn(error.message) : console.info(error.message);

  res.status(error.status).json({
    message: error.message,
  });
};
