function isProduction() {
  return process.env.NODE_ENV?.trim() === "production";
}

module.exports = {
  isProduction,
};
