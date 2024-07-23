const { StatusCodes } = require("http-status-codes");

module.exports = function error(error, req, res, _) {
  let log = [
    error.message,
    req.decodedToken && `with userID (${req.decodedToken.userID})`,
  ];

  console.error(log.join(" "));

  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    message: error.message || "서버 내부에서 에러가 발생하였습니다.",
  });
};
