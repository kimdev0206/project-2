const HttpError = require("../HttpError");

module.exports = function httpError(error, req, res, next) {
  if (!(error instanceof HttpError)) return next(error);

  console.info(error.message);

  res.status(error.status).json({
    message: error.message,
  });
};
