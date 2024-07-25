module.exports = function error(error, req, res, _) {
  let log = [
    res.locals.name && `At method (${res.locals.name})`,
    req.decodedToken && `with userID (${req.decodedToken.userID})`,
    error,
  ];

  console.log(log.join(" "));

  res.status(error.status || 500);
  res.json({
    message: error.message || "서버 내부에서 에러가 발생하였습니다.",
  });
};
