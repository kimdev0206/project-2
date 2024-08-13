const jwt = require("jsonwebtoken");

module.exports = {
  isProduction,
};

function isProduction() {
  return process.env.NODE_ENV?.trim() === "production";
}

Number.prototype.makeJWT = function (expiresIn) {
  return jwt.sign({ userID: this.valueOf() }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: expiresIn || process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    issuer: "Yongki Kim",
  });
};
