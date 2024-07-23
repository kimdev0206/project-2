const HttpError = require("../HttpError");

module.exports = function pathError(req, res, next) {
  const message = `요청하신 path (${req.path}) 가 존재하지 않습니다.`;
  next(new HttpError(404, message));
};
